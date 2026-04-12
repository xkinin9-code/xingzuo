'use client';

import { useState } from 'react';
import Button from './ui/button';
import { validateBirthday } from '@/lib/birthday';
import { getZodiacSign } from '@/lib/zodiac';

interface BirthdayFormProps {
  onSubmit: (birthday: { year: number; month: number; day: number }) => void;
  isLoading?: boolean;
}

export default function BirthdayForm({ onSubmit, isLoading = false }: BirthdayFormProps) {
  const currentYear = new Date().getFullYear();

  // 默认生日：当前日期的20年前
  const defaultYear = currentYear - 20;
  const defaultMonth = 1;
  const defaultDay = 1;

  const [year, setYear] = useState<string>(defaultYear.toString());
  const [month, setMonth] = useState<string>(defaultMonth.toString());
  const [day, setDay] = useState<string>(defaultDay.toString());
  const [error, setError] = useState<string>('');

  // 生成年份选项（1900-当前年份）
  const yearOptions = Array.from(
    { length: currentYear - 1899 },
    (_, i) => currentYear - i
  );

  // 月份选项
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  // 根据年份和月份生成日期选项
  const getDayOptions = () => {
    const selectedYear = parseInt(year) || defaultYear;
    const selectedMonth = parseInt(month) || defaultMonth;

    // 计算该月的天数
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const dayOptions = getDayOptions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);

    const validation = validateBirthday(yearNum, monthNum, dayNum);

    if (!validation.isValid) {
      setError(validation.error || '生日日期无效');
      return;
    }

    // 验证通过，调用父组件回调
    onSubmit({ year: yearNum, month: monthNum, day: dayNum });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    setYear(newYear);

    // 如果当前日期超出新年份月份的天数，重置日期
    const selectedMonth = parseInt(month) || defaultMonth;
    const daysInMonth = new Date(parseInt(newYear), selectedMonth, 0).getDate();
    const currentDay = parseInt(day) || defaultDay;

    if (currentDay > daysInMonth) {
      setDay('1');
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    setMonth(newMonth);

    // 如果当前日期超出新月份的天数，重置日期
    const selectedYear = parseInt(year) || defaultYear;
    const daysInMonth = new Date(selectedYear, parseInt(newMonth), 0).getDate();
    const currentDay = parseInt(day) || defaultDay;

    if (currentDay > daysInMonth) {
      setDay('1');
    }
  };

  // 预览星座
  let zodiacPreview = null;
  if (year && month && day) {
    try {
      const zodiac = getZodiacSign(parseInt(month), parseInt(day));
      zodiacPreview = `${zodiac.nameCN} ${zodiac.symbol}`;
    } catch (err) {
      // 静默失败，不显示预览
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">输入你的生日</h2>
        <p className="text-gray-600">我们将根据你的生日判断星座并生成今日运势</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {/* 年份选择 */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              年份
            </label>
            <select
              id="year"
              value={year}
              onChange={handleYearChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              disabled={isLoading}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}年
                </option>
              ))}
            </select>
          </div>

          {/* 月份选择 */}
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
              月份
            </label>
            <select
              id="month"
              value={month}
              onChange={handleMonthChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              disabled={isLoading}
            >
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {m}月
                </option>
              ))}
            </select>
          </div>

          {/* 日期选择 */}
          <div>
            <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">
              日期
            </label>
            <select
              id="day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              disabled={isLoading}
            >
              {dayOptions.map((d) => (
                <option key={d} value={d}>
                  {d}日
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 星座预览 */}
        {zodiacPreview && (
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-purple-700 font-medium">
              你的星座可能是：<span className="font-bold">{zodiacPreview}</span>
            </p>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* 提交按钮 */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          className="mt-4"
        >
          {isLoading ? '生成中...' : '查看今日运势'}
        </Button>

        <div className="text-center text-sm text-gray-500 mt-4">
          <p>无需注册，历史记录将保存在本地浏览器中</p>
        </div>
      </form>

      {/* 快捷选择示例 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">快速选择示例：</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '1月1日', month: 1, day: 1 },
            { label: '5月20日', month: 5, day: 20 },
            { label: '8月23日', month: 8, day: 23 },
            { label: '12月25日', month: 12, day: 25 },
          ].map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => {
                setMonth(example.month.toString());
                setDay(example.day.toString());
              }}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}