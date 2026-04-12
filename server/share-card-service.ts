// 分享卡片服务
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ShareCardData {
  token: string;
  orderId: string;
  amount: number;
  currency: string;
  createdAt: Date;
  message?: string;
}

export interface GeneratedCard {
  imageUrl: string;
  token: string;
  expiresAt: Date;
  viewCount: number;
}

/**
 * 获取分享卡片数据
 */
export async function getShareCardData(token: string): Promise<ShareCardData | null> {
  try {
    const card = await prisma.shareCard.findUnique({
      where: { token },
      include: {
        order: {
          select: {
            amount: true,
            currency: true,
          },
        },
      },
    });

    if (!card || !card.order) {
      return null;
    }

    // 增加查看次数
    await prisma.shareCard.update({
      where: { token },
      data: { viewCount: { increment: 1 } },
    });

    return {
      token: card.token,
      orderId: card.orderId,
      amount: card.order.amount.toNumber(),
      currency: card.order.currency,
      createdAt: card.createdAt,
      message: '感谢您的支持！❤️',
    };
  } catch (error) {
    console.error('获取分享卡片数据失败:', error);
    return null;
  }
}

/**
 * 生成分享卡片图片（模拟）
 * 实际使用时可集成 @vercel/og 生成OG图片
 */
export async function generateShareCardImage(data: ShareCardData): Promise<string> {
  // 这里返回一个模拟的图片URL
  // 实际项目中，可以使用 @vercel/og 生成图片
  return `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#667eea" />
          <stop offset="100%" stop-color="#764ba2" />
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill="url(#gradient)" rx="20" />

      <circle cx="400" cy="150" r="60" fill="white" fill-opacity="0.2" />
      <text x="400" y="150" text-anchor="middle" dy="5" fill="white" font-family="Arial, sans-serif" font-size="48">❤️</text>

      <text x="400" y="240" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="36" font-weight="bold">感谢您的支持！</text>

      <text x="400" y="290" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24">
        打赏金额：¥${data.amount.toFixed(2)} ${data.currency}
      </text>

      <text x="400" y="330" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" opacity="0.8">
        订单号：${data.orderId}
      </text>

      <text x="400" y="370" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" opacity="0.6">
        感谢时间：${data.createdAt.toLocaleDateString('zh-CN')}
      </text>
    </svg>
  `).toString('base64')}`;
}

/**
 * 验证卡片是否过期
 */
export async function validateShareCard(token: string): Promise<{ valid: boolean; reason?: string }> {
  try {
    const card = await prisma.shareCard.findUnique({
      where: { token },
    });

    if (!card) {
      return { valid: false, reason: '卡片不存在' };
    }

    if (card.expiresAt < new Date()) {
      return { valid: false, reason: '卡片已过期' };
    }

    return { valid: true };
  } catch (error) {
    console.error('验证分享卡片失败:', error);
    return { valid: false, reason: '验证失败' };
  }
}

/**
 * 获取卡片统计信息
 */
export async function getCardStats(token: string): Promise<{
  viewCount: number;
  createdAt: Date;
  expiresAt: Date;
  daysRemaining: number;
} | null> {
  try {
    const card = await prisma.shareCard.findUnique({
      where: { token },
    });

    if (!card) {
      return null;
    }

    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((card.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      viewCount: card.viewCount,
      createdAt: card.createdAt,
      expiresAt: card.expiresAt,
      daysRemaining,
    };
  } catch (error) {
    console.error('获取卡片统计失败:', error);
    return null;
  }
}

/**
 * 生成分享卡片（创建记录）
 */
export async function createShareCard(orderId: string): Promise<GeneratedCard> {
  try {
    const order = await prisma.tipOrder.findUnique({
      where: { orderId },
    });

    if (!order) {
      throw new Error('订单不存在');
    }

    if (!order.token) {
      throw new Error('订单未生成token');
    }

    // 检查是否已存在卡片
    const existingCard = await prisma.shareCard.findUnique({
      where: { token: order.token },
    });

    if (existingCard) {
      return {
        imageUrl: existingCard.imageUrl,
        token: existingCard.token,
        expiresAt: existingCard.expiresAt,
        viewCount: existingCard.viewCount,
      };
    }

    // 创建新卡片记录
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30天后过期
    const imageUrl = `/api/share-card/generate?token=${order.token}`;

    const card = await prisma.shareCard.create({
      data: {
        token: order.token,
        orderId: order.orderId,
        imageUrl,
        expiresAt,
      },
    });

    return {
      imageUrl: card.imageUrl,
      token: card.token,
      expiresAt: card.expiresAt,
      viewCount: card.viewCount,
    };
  } catch (error) {
    console.error('创建分享卡片失败:', error);
    throw error;
  }
}