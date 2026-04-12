import { NextRequest, NextResponse } from 'next/server';
import { getShareCardData, getCardStats, validateShareCard } from '@/server/share-card-service';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;

    // 验证卡片
    const validation = await validateShareCard(token);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.reason || '卡片无效',
          code: 'INVALID_CARD',
        },
        { status: 404 }
      );
    }

    // 获取卡片数据
    const cardData = await getShareCardData(token);
    if (!cardData) {
      return NextResponse.json(
        {
          error: '卡片数据获取失败',
          code: 'CARD_DATA_FETCH_FAILED',
        },
        { status: 500 }
      );
    }

    // 获取卡片统计
    const stats = await getCardStats(token);

    return NextResponse.json({
      success: true,
      data: {
        card: cardData,
        stats,
        links: {
          image: `/api/share-card/generate?token=${token}`,
          view: `/card/${token}`,
          share: `https://${request.headers.get('host')}/card/${token}`,
        },
      },
    });
  } catch (error) {
    console.error('获取分享卡片信息失败:', error);

    return NextResponse.json(
      {
        error: '获取卡片信息失败',
        code: 'FETCH_CARD_INFO_FAILED',
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