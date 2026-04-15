"use client";

import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BirthdayFormProps {
  onSubmit: (birthday: string) => void;
  isLoading?: boolean;
  className?: string;
}

export default function BirthdayForm({
  onSubmit,
  isLoading = false,
  className,
}: BirthdayFormProps) {
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const arr: string[] = [];
    for (let y = currentYear; y >= 1920; y--) {
      arr.push(y.toString());
    }
    return arr;
  }, [currentYear]);

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  }, []);

  const maxDay = useMemo(() => {
    if (!year || !month) return 31;
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    return new Date(y, m, 0).getDate();
  }, [year, month]);

  const days = useMemo(() => {
    return Array.from({ length: maxDay }, (_, i) => (i + 1).toString().padStart(2, "0"));
  }, [maxDay]);

  // 当月份改变时，如果当前日期超出范围，自动修正
  useEffect(() => {
    if (day) {
      const d = parseInt(day, 10);
      if (d > maxDay) {
        setDay(maxDay.toString().padStart(2, "0"));
      }
    }
  }, [maxDay, day]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!year || !month || !day) {
      setError("请选择完整的生日信息");
      return;
    }

    const birthday = `${year}-${month}-${day}`;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (
      date.getFullYear() !== parseInt(year) ||
      date.getMonth() + 1 !== parseInt(month) ||
      date.getDate() !== parseInt(day)
    ) {
      setError("生日日期无效，请重新选择");
      return;
    }

    // 检查是否在未来
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (date > today) {
      setError("生日不能是未来的日期");
      return;
    }

    setError(null);
    onSubmit(birthday);
  };

  const selectBaseClass =
    "appearance-none w-full bg-white/10 border border-[#D4AF37]/60 text-[#F5E6C8] " +
    "px-4 py-4 pr-10 text-center text-lg placeholder-[#F5E6C8]/50 " +
    "focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 " +
    "transition-all duration-200 cursor-pointer backdrop-blur-sm";

  const arrowIcon = (
    <svg
      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37] pointer-events-none"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* 年份 */}
          <div className="relative">
            <label className="block text-[#F5E6C8]/80 text-sm mb-2 text-center">
              年
            </label>
            <div className="relative">
              <select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setError(null);
                }}
                disabled={isLoading}
                className={cn(selectBaseClass, "rounded-lg")}
              >
                <option value="" className="bg-[#1a1a2e] text-[#F5E6C8]/60">
                  你来到这个世界的年份
                </option>
                {years.map((y) => (
                  <option key={y} value={y} className="bg-[#1a1a2e] text-[#F5E6C8]">
                    {y} 年
                  </option>
                ))}
              </select>
              {arrowIcon}
            </div>
          </div>

          {/* 月份 */}
          <div className="relative">
            <label className="block text-[#F5E6C8]/80 text-sm mb-2 text-center">
              月
            </label>
            <div className="relative">
              <select
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  setError(null);
                }}
                disabled={isLoading}
                className={cn(selectBaseClass, "rounded-lg")}
              >
                <option value="" className="bg-[#1a1a2e] text-[#F5E6C8]/60">
                  星光最温柔的月份
                </option>
                {months.map((m) => (
                  <option key={m} value={m} className="bg-[#1a1a2e] text-[#F5E6C8]">
                    {parseInt(m)} 月
                  </option>
                ))}
              </select>
              {arrowIcon}
            </div>
          </div>

          {/* 日期 */}
          <div className="relative">
            <label className="block text-[#F5E6C8]/80 text-sm mb-2 text-center">
              日
            </label>
            <div className="relative">
              <select
                value={day}
                onChange={(e) => {
                  setDay(e.target.value);
                  setError(null);
                }}
                disabled={isLoading || !month}
                className={cn(selectBaseClass, "rounded-lg", !month && "opacity-50 cursor-not-allowed")}
              >
                <option value="" className="bg-[#1a1a2e] text-[#F5E6C8]/60">
                  宇宙为你闪耀的那天
                </option>
                {days.map((d) => (
                  <option key={d} value={d} className="bg-[#1a1a2e] text-[#F5E6C8]">
                    {parseInt(d)} 日
                  </option>
                ))}
              </select>
              {arrowIcon}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-center text-red-400 text-sm">
            {error}
          </p>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading || !year || !month || !day}
            className={cn(
              "group relative px-12 py-4 text-xl font-medium tracking-widest",
              "text-[#D4AF37] transition-all duration-300",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "hover:text-[#F5E6C8]"
            )}
          >
            <span className="relative z-10 flex items-center gap-3">
              <span className="text-2xl transition-transform group-hover:rotate-12 duration-300">☆</span>
              <span>{isLoading ? "星辰正在低语..." : "聆听星辰指引"}</span>
              <span className="text-2xl transition-transform group-hover:-rotate-12 duration-300">☆</span>
            </span>
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </form>
    </div>
  );
}
