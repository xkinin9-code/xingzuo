import { NextRequest, NextResponse } from 'next/server';
import { shareCardService } from '@/server/share-card-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: '请提供卡片token' },
        { status: 400 }
      );
    }

    // 获取卡片数据
    const cardData = await shareCardService.getCardData(token);

    if (!cardData) {
      return NextResponse.json(
        { error: '卡片不存在或已过期' },
        { status: 404 }
      );
    }

    // 验证卡片有效性
    const validation = await shareCardService.validateCard(token);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: validation.isExpired ? '卡片已过期' : '卡片无效',
          isExpired: validation.isExpired
        },
        { status: 410 }
      );
    }

    // 生成卡片设计
    const design = shareCardService.generateCardDesign(cardData.zodiac);

    return NextResponse.json({
      success: true,
      card: {
        ...cardData,
        design,
        viewCount: validation.viewCount,
        expiresAt: validation.expiresAt,
        isValid: validation.isValid
      }
    });
  } catch (error) {
    console.error('Error fetching share card:', error);
    return NextResponse.json(
      {
        error: '获取分享卡片时发生错误',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}