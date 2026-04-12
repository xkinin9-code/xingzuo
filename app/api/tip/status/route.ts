import { NextRequest, NextResponse } from 'next/server';
import { getOrderStatus } from '@/server/tip-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        {
          error: '缺少订单ID参数',
          code: 'MISSING_ORDER_ID',
        },
        { status: 400 }
      );
    }

    const status = await getOrderStatus(orderId);

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('查询订单状态失败:', error);

    if (error instanceof Error) {
      if (error.message.includes('订单不存在')) {
        return NextResponse.json(
          {
            error: '订单不存在',
            code: 'ORDER_NOT_FOUND',
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error: error.message,
          code: 'QUERY_STATUS_FAILED',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: '查询订单状态失败',
        code: 'INTERNAL_SERVER_ERROR',
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