import { NextRequest, NextResponse } from 'next/server';
import { getShareCardData } from '@/server/share-card-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: '缺少token参数', code: 'MISSING_TOKEN' },
        { status: 400 }
      );
    }

    // 获取卡片数据
    const cardData = await getShareCardData(token);
    if (!cardData) {
      return NextResponse.json(
        { error: '卡片不存在或已过期', code: 'CARD_NOT_FOUND' },
        { status: 404 }
      );
    }

    // 返回卡片数据（暂时不生成图片）
    return NextResponse.json({
      success: true,
      data: {
        card: cardData,
        image: {
          alt: '感谢卡片',
          description: `感谢您的支持！金额：¥${cardData.amount.toFixed(2)}`,
          // 实际项目中这里应该返回图片URL
          url: `data:image/svg+xml;base64,${Buffer.from(`
            <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="200" fill="#667eea" rx="10" />
              <text x="200" y="80" text-anchor="middle" fill="white" font-family="Arial" font-size="24">感谢您的支持！</text>
              <text x="200" y="120" text-anchor="middle" fill="white" font-family="Arial" font-size="18">¥${cardData.amount.toFixed(2)} ${cardData.currency}</text>
              <text x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="14" opacity="0.8">订单号：${cardData.orderId}</text>
            </svg>
          `).toString('base64')}`,
        },
      },
    });
  } catch (error) {
    console.error('生成分享卡片失败:', error);

    return NextResponse.json(
      {
        error: '生成卡片失败',
        code: 'GENERATE_CARD_FAILED',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}