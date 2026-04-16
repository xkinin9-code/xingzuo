"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface BirthdayFormProps {
  onSubmit: (birthday: string) => void;
  isLoading?: boolean;
  className?: string;
}

interface SelectOption {
  value: string;
  label: string;
}

function CustomSelect({
  value,
  options,
  placeholder,
  onChange,
  disabled,
  label,
}: {
  value: string;
  options: SelectOption[];
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleDocClick);
    }
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [open]);

  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-[#F5E6C8]/80 text-sm mb-4 text-center">{label}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          "w-full bg-white/10 border border-[#D4AF37]/60 rounded-lg",
          "px-4 py-4 pr-10 text-center text-lg backdrop-blur-sm",
          "focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50",
          "transition-all duration-200",
          disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
          value ? "text-[#F5E6C8]" : "text-[#F5E6C8]/30"
        )}
      >
        {selectedLabel || placeholder}
      </button>
      <svg
        className={cn(
          "absolute right-3 top-[calc(50%+14px)] -translate-y-1/2 w-5 h-5 text-[#D4AF37] pointer-events-none transition-transform",
          open && "rotate-180"
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e]/95 border border-[#D4AF37]/60 rounded-lg z-50 max-h-72 overflow-y-auto shadow-xl">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                "px-4 py-3 text-center text-lg cursor-pointer transition-colors",
                value === opt.value
                  ? "bg-[#D4AF37]/30 text-[#F5E6C8]"
                  : "text-[#F5E6C8] hover:bg-[#D4AF37]/20"
              )}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
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

  const days = useMemo(() => {
    let maxDay = 31;
    if (year && month) {
      maxDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    }
    return Array.from({ length: maxDay }, (_, i) => (i + 1).toString().padStart(2, "0"));
  }, [year, month]);

  useEffect(() => {
    if (day && (year || month)) {
      const maxDay = new Date(parseInt(year || "2000"), parseInt(month || "1"), 0).getDate();
      if (parseInt(day) > maxDay) {
        setDay("");
      }
    }
  }, [year, month, day]);

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

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (date > today) {
      setError("生日不能是未来的日期");
      return;
    }

    setError(null);
    onSubmit(birthday);
  };

  const yearOptions = useMemo(() => years.map((y) => ({ value: y, label: y })), [years]);
  const monthOptions = useMemo(
    () => months.map((m) => ({ value: m, label: parseInt(m).toString() })),
    [months]
  );
  const dayOptions = useMemo(
    () => days.map((d) => ({ value: d, label: parseInt(d).toString() })),
    [days]
  );

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <form onSubmit={handleSubmit} className="space-y-[60px]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <CustomSelect
            label="年"
            value={year}
            placeholder="你来到这个世界的年份"
            options={yearOptions}
            onChange={(v) => {
              setYear(v);
              setError(null);
            }}
            disabled={isLoading}
          />
          <CustomSelect
            label="月"
            value={month}
            placeholder="星光最温柔的月份"
            options={monthOptions}
            onChange={(v) => {
              setMonth(v);
              setError(null);
            }}
            disabled={isLoading}
          />
          <CustomSelect
            label="日"
            value={day}
            placeholder="宇宙为你闪耀的那天"
            options={dayOptions}
            onChange={(v) => {
              setDay(v);
              setError(null);
            }}
            disabled={isLoading}
          />
        </div>

        {error && <p className="text-center text-red-400 text-sm">{error}</p>}

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
