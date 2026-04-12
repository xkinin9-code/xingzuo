'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TipAmountSelectorProps {
  onAmountChange?: (amount: number) => void;
  className?: string;
  compact?: boolean;
}

const DEFAULT_AMOUNTS = [
  { value: 0.99, label: '0.99元', description: '象征好运长久' },
  { value: 2.99, label: '2.99元', description: '事业顺利长久' },
  { value: 6.66, label: '6.66元', description: '寓意六六大顺' },
  { value: 9.99, label: '9.99元', description: '象征幸福长久' },
  { value: -1, label: '自定义', description: '随心支持' },
];

export default function TipAmountSelector({
  onAmountChange,
  className,
  compact = false,
}: TipAmountSelectorProps) {
  const [selectedValue, setSelectedValue] = useState<number>(0.99);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);

  const handleAmountSelect = (value: number) => {
    if (value === -1) {
      setIsCustom(true);
      setSelectedValue(0);
      onAmountChange?.(0);
    } else {
      setIsCustom(false);
      setSelectedValue(value);
      setCustomAmount('');
      onAmountChange?.(value);
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setSelectedValue(numValue);
      onAmountChange?.(numValue);
    }
  };

  if (compact) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="grid grid-cols-3 gap-2">
          {DEFAULT_AMOUNTS.slice(0, 3).map((option) => (
            <button
              key={option.value}
              onClick={() => handleAmountSelect(option.value)}
              className={cn(
                'rounded-lg border px-3 py-2 text-center text-sm transition-all',
                selectedValue === option.value && !isCustom
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-600 dark:hover:bg-primary-900/20'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {isCustom ? (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0.01"
              max="10000"
              step="0.01"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="输入金额"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">元</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {DEFAULT_AMOUNTS.slice(3).map((option) => (
              <button
                key={option.value}
                onClick={() => handleAmountSelect(option.value)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-center text-sm transition-all',
                  selectedValue === option.value && !isCustom
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-600 dark:hover:bg-primary-900/20'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {DEFAULT_AMOUNTS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAmountSelect(option.value)}
            className={cn(
              'rounded-lg border p-4 text-center transition-all hover:scale-105',
              selectedValue === option.value && !isCustom
                ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-300'
                : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-600 dark:hover:bg-primary-900/20'
            )}
          >
            <div className="font-medium">{option.label}</div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {option.description}
            </div>
          </button>
        ))}
      </div>

      {isCustom && (
        <div className="rounded-lg border border-primary-200 bg-primary-50/30 p-4 dark:border-primary-800 dark:bg-primary-900/20">
          <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            自定义金额
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-lg text-gray-700 dark:text-gray-300">¥</span>
            <input
              type="number"
              min="0.01"
              max="10000"
              step="0.01"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="0.00"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-2xl font-bold text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <span className="text-gray-600 dark:text-gray-400">元</span>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            <p>• 金额范围：0.01元 - 10000元</p>
            <p>• 支持两位小数</p>
          </div>
        </div>
      )}

      {/* 当前选择金额显示 */}
      <div className="rounded-lg bg-gradient-to-r from-primary-50 to-blue-50 p-4 dark:from-primary-900/20 dark:to-blue-900/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">当前选择</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              ¥{selectedValue.toFixed(2)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">约等于</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              ${(selectedValue * 0.14).toFixed(2)} USD
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}