import { NextRequest, NextResponse } from 'next/server';
import { processMockPayment } from '@/server/tip-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, success = true } = body;

    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json(
        {
          error: '订单ID不能为空',
          code: 'MISSING_ORDER_ID',
        },
        { status: 400 }
      );
    }

    // 处理模拟支付
    const result = await processMockPayment({ orderId, success });

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          status: 'SUCCESS',
          token: result.token,
          redirectUrl: `/tip/success/${result.token}`,
          message: '支付成功！感谢您的支持。',
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        data: {
          status: 'FAILED',
          message: '支付失败，请重试或联系客服。',
        },
      });
    }
  } catch (error) {
    console.error('模拟支付处理失败:', error);

    if (error instanceof Error) {
      // 特定错误处理
      if (error.message.includes('订单不存在')) {
        return NextResponse.json(
          {
            error: '订单不存在或已过期',
            code: 'ORDER_NOT_FOUND',
          },
          { status: 404 }
        );
      }

      if (error.message.includes('订单已支付')) {
        return NextResponse.json(
          {
            error: '订单已支付，请勿重复支付',
            code: 'ORDER_ALREADY_PAID',
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: error.message,
          code: 'PAYMENT_PROCESSING_FAILED',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: '支付处理失败，请稍后重试',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}