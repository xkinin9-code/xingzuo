import { NextRequest, NextResponse } from 'next/server';
import { createTipOrder, validateAmount } from '@/server/tip-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证请求数据
    const { amount, currency = 'CNY', isAnonymous = true, metadata } = body;

    if (typeof amount !== 'number') {
      return NextResponse.json(
        {
          error: '金额格式不正确',
          code: 'INVALID_AMOUNT',
          details: '金额必须是数字类型',
        },
        { status: 400 }
      );
    }

    // 验证金额
    const validation = validateAmount(amount);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.error,
          code: 'INVALID_AMOUNT',
        },
        { status: 400 }
      );
    }

    // 创建订单
    const order = await createTipOrder({
      amount,
      currency,
      isAnonymous,
      metadata,
    });

    // 返回订单信息
    return NextResponse.json({
      success: true,
      data: {
        order,
        payment: {
          method: 'mock', // 模拟支付
          mockPaymentUrl: `/api/tip/mock-pay`,
        },
      },
    });
  } catch (error) {
    console.error('创建打赏订单失败:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          code: 'CREATE_ORDER_FAILED',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: '创建订单失败，请稍后重试',
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