// 打赏服务
import { PrismaClient, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export interface CreateTipOrderInput {
  amount: number;
  currency?: string;
  isAnonymous?: boolean;
  metadata?: Record<string, any>;
}

export interface TipOrderResponse {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  isAnonymous: boolean;
  createdAt: Date;
}

export interface MockPaymentInput {
  orderId: string;
  success?: boolean;
}

/**
 * 创建打赏订单
 */
export async function createTipOrder(input: CreateTipOrderInput): Promise<TipOrderResponse> {
  try {
    const orderId = generateOrderId();
    const amount = Math.max(0.01, input.amount); // 最小金额0.01

    const order = await prisma.tipOrder.create({
      data: {
        orderId,
        amount,
        currency: input.currency || 'CNY',
        status: 'PENDING',
        isAnonymous: input.isAnonymous ?? true,
        metadata: input.metadata ? input.metadata : Prisma.JsonNull,
      },
    });

    return {
      id: order.id,
      orderId: order.orderId,
      amount: order.amount.toNumber(),
      currency: order.currency,
      status: order.status,
      isAnonymous: order.isAnonymous,
      createdAt: order.createdAt,
    };
  } catch (error) {
    console.error('创建打赏订单失败:', error);
    throw new Error('创建订单失败，请稍后重试');
  }
}

/**
 * 处理模拟支付
 */
export async function processMockPayment(input: MockPaymentInput): Promise<{ success: boolean; token?: string }> {
  try {
    const order = await prisma.tipOrder.findUnique({
      where: { orderId: input.orderId },
    });

    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.status === 'SUCCESS') {
      throw new Error('订单已支付');
    }

    // 生成分享卡token
    const token = uuidv4().replace(/-/g, '').substring(0, 16);

    // 更新订单状态
    const success = input.success !== false;
    const updatedOrder = await prisma.tipOrder.update({
      where: { orderId: input.orderId },
      data: {
        status: success ? 'SUCCESS' : 'FAILED',
        token: success ? token : null,
      },
    });

    // 如果支付成功，创建分享卡记录
    if (success) {
      await prisma.shareCard.create({
        data: {
          token,
          orderId: order.orderId,
          imageUrl: `/api/share-card/generate?token=${token}`, // 实际使用OG图片生成
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后过期
        },
      });
    }

    return {
      success,
      token: success ? token : undefined,
    };
  } catch (error) {
    console.error('处理模拟支付失败:', error);
    throw error instanceof Error ? error : new Error('支付处理失败');
  }
}

/**
 * 获取订单状态
 */
export async function getOrderStatus(orderId: string): Promise<{ status: string; token?: string }> {
  try {
    const order = await prisma.tipOrder.findUnique({
      where: { orderId },
      select: {
        status: true,
        token: true,
      },
    });

    if (!order) {
      throw new Error('订单不存在');
    }

    return {
      status: order.status,
      token: order.token || undefined,
    };
  } catch (error) {
    console.error('获取订单状态失败:', error);
    throw error instanceof Error ? error : new Error('查询订单状态失败');
  }
}

/**
 * 生成订单ID（格式：T{年月日}{6位随机数}）
 */
function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(100000 + Math.random() * 900000);
  return `T${year}${month}${day}${random}`;
}

/**
 * 验证金额有效性
 */
export function validateAmount(amount: number): { valid: boolean; error?: string } {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return { valid: false, error: '金额格式不正确' };
  }

  if (amount < 0.01) {
    return { valid: false, error: '金额不能低于0.01元' };
  }

  if (amount > 10000) {
    return { valid: false, error: '金额不能超过10000元' };
  }

  return { valid: true };
}

/**
 * 获取预设金额选项
 */
export function getAmountOptions(): Array<{ value: number; label: string; description?: string }> {
  return [
    { value: 0.99, label: '0.99元', description: '象征好运长久' },
    { value: 2.99, label: '2.99元', description: '事业顺利长久' },
    { value: 6.66, label: '6.66元', description: '寓意六六大顺' },
    { value: 9.99, label: '9.99元', description: '象征幸福长久' },
    { value: -1, label: '自定义金额', description: '随心支持' },
  ];
}