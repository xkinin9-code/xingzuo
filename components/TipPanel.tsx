'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import TipAmountSelector from './TipAmountSelector';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TipPanelProps {
  className?: string;
  onSuccess?: (token: string) => void;
  compact?: boolean;
}

export default function TipPanel({ className, onSuccess, compact = false }: TipPanelProps) {
  const [amount, setAmount] = useState<number>(0.99);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // 预设金额选项
  const amountOptions = [
    { value: 0.99, label: '0.99元', description: '象征好运长久' },
    { value: 2.99, label: '2.99元', description: '事业顺利长久' },
    { value: 6.66, label: '6.66元', description: '寓意六六大顺' },
    { value: 9.99, label: '9.99元', description: '象征幸福长久' },
  ];

  const handleAmountSelect = (value: number) => {
    if (value === -1) {
      setIsCustom(true);
      setAmount(0);
    } else {
      setIsCustom(false);
      setAmount(value);
      setCustomAmount('');
    }
    setError(null);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0.01) {
      setAmount(numValue);
      setError(null);
    } else {
      setAmount(0);
    }
  };

  const handleSubmit = async () => {
    const finalAmount = isCustom ? parseFloat(customAmount) : amount;

    // 验证金额
    if (isCustom) {
      if (!customAmount || isNaN(parseFloat(customAmount))) {
        setError('请输入有效金额');
        return;
      }

      const numAmount = parseFloat(customAmount);
      if (numAmount < 0.01) {
        setError('金额不能低于0.01元');
        return;
      }

      if (numAmount > 10000) {
        setError('金额不能超过10000元');
        return;
      }
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 创建订单
      const response = await fetch('/api/tip/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalAmount,
          currency: 'CNY',
          isAnonymous: true,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '创建订单失败');
      }

      const { order } = result.data;
      setOrderId(order.orderId);

      // 模拟支付
      const paymentResponse = await fetch('/api/tip/mock-pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.orderId,
          success: true,
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || '支付失败');
      }

      // 支付成功
      setSuccess(true);
      const token = paymentResult.data.token;
      setTimeout(() => {
        onSuccess?.(token);
      }, 1500);

    } catch (err) {
      console.error('打赏失败:', err);
      setError(err instanceof Error ? err.message : '打赏失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setOrderId(null);
    setError(null);
    setAmount(0.99);
    setIsCustom(false);
    setCustomAmount('');
  };

  if (compact) {
    return (
      <div className={cn('fortune-card p-4', className)}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">支持我们</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">自愿打赏，感谢支持</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.hash = '#tip-full'}
            className="text-primary-600 border-primary-200 hover:bg-primary-50"
          >
            去支持
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('fortune-card p-6 sm:p-8', className)}>
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 px-4 py-2">
          <span className="text-lg">💝</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          支持我们继续运营
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          您的支持将帮助我们持续优化服务和内容
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="tip-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* 金额选择 */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-gray-900 dark:text-white">
                选择打赏金额
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {amountOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAmountSelect(option.value)}
                    className={cn(
                      'rounded-lg border p-4 text-center transition-all',
                      amount === option.value && !isCustom
                        ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-600 dark:hover:bg-primary-900/20'
                    )}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => handleAmountSelect(-1)}
                  className={cn(
                    'rounded-lg border p-4 text-center transition-all',
                    isCustom
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-600 dark:hover:bg-primary-900/20'
                  )}
                >
                  <div className="font-medium">自定义金额</div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    随心支持
                  </div>
                </button>
              </div>

              {/* 自定义金额输入 */}
              {isCustom && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0.01"
                      max="10000"
                      step="0.01"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      placeholder="输入金额 (0.01-10000)"
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <span className="text-gray-600 dark:text-gray-400">元</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    金额范围：0.01元 - 10000元
                  </p>
                </motion.div>
              )}
            </div>

            {/* 当前金额显示 */}
            <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">当前金额</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ¥{amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    ≈ {(amount * 0.14).toFixed(2)} USD
                  </div>
                </div>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* 支付说明 */}
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50/50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="flex items-start">
                <span className="mr-2 text-yellow-600 dark:text-yellow-400">💡</span>
                <div className="text-sm text-yellow-800 dark:text-yellow-300">
                  <p className="font-medium">说明：</p>
                  <ul className="mt-1 list-disc space-y-1 pl-4">
                    <li>这是模拟支付，不会产生实际扣款</li>
                    <li>打赏完全自愿，不影响任何功能使用</li>
                    <li>支付成功后生成专属感谢卡片</li>
                    <li>所有支付记录为匿名，保护隐私</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 提交按钮 */}
            <Button
              onClick={handleSubmit}
              disabled={isProcessing || amount < 0.01}
              className="w-full py-3 text-lg"
            >
              {isProcessing ? (
                <>
                  <span className="mr-2">⏳</span>
                  处理中...
                </>
              ) : (
                <>
                  <span className="mr-2">💝</span>
                  立即打赏 ¥{amount.toFixed(2)}
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center"
          >
            <div className="mb-6">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                <span className="text-4xl">🎉</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                感谢您的支持！
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                您的打赏已成功处理，感谢您对我们的支持。
              </p>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  订单号：{orderId}
                </div>
                <div className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  ¥{amount.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <Button className="w-full" onClick={() => window.open(`/card/${orderId}`, '_blank', 'noopener noreferrer')}>
                查看感谢卡片
              </Button>
              <Button variant="outline" onClick={handleReset} className="w-full">
                再次打赏
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 隐私说明 */}
      <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 所有打赏记录均为匿名处理，不会收集任何个人身份信息。
          我们承诺保护用户隐私，感谢您的信任与支持。
        </p>
      </div>
    </div>
  );
}