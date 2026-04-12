"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { validateBirthday } from "@/lib/birthday";
import { cn } from "@/lib/utils";

interface BirthdayFormProps {
  onSubmit: (birthday: string) => void;
  isLoading?: boolean;
  defaultValue?: string;
  className?: string;
}

export default function BirthdayForm({
  onSubmit,
  isLoading = false,
  defaultValue = "",
  className,
}: BirthdayFormProps) {
  const [birthday, setBirthday] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBirthday(value);

    // 基本格式验证
    if (!value) {
      setError(null);
      setIsValid(false);
      return;
    }

    const validation = validateBirthday(value);
    if (validation.isValid) {
      setError(null);
      setIsValid(true);
    } else {
      setError(validation.error || "生日格式无效");
      setIsValid(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;

    const validation = validateBirthday(birthday);
    if (validation.isValid) {
      onSubmit(birthday);
    } else {
      setError(validation.error || "生日格式无效");
    }
  };

  // 快速选择预设生日（示例）
  const presetBirthdays = [
    { label: "1995-03-21", desc: "白羊座示例" },
    { label: "1990-08-15", desc: "狮子座示例" },
    { label: "1988-11-30", desc: "射手座示例" },
  ];

  const handlePresetSelect = (preset: string) => {
    setBirthday(preset);
    const validation = validateBirthday(preset);
    if (validation.isValid) {
      setError(null);
      setIsValid(true);
    } else {
      setError(validation.error || "生日格式无效");
      setIsValid(false);
    }
  };

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="birthday"
            className="block text-sm font-medium text-gray-900 dark:text-white"
          >
            请输入您的生日
          </label>
          <div className="relative">
            <input
              id="birthday"
              type="text"
              value={birthday}
              onChange={handleChange}
              placeholder="YYYY-MM-DD，例如：1995-03-21"
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-base transition-all duration-200",
                "border-gray-300 bg-white text-gray-900 placeholder:text-gray-500",
                "dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400",
                "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
              disabled={isLoading}
              aria-invalid={!!error}
              aria-describedby={error ? "birthday-error" : undefined}
            />
            {birthday && (
              <button
                type="button"
                onClick={() => {
                  setBirthday("");
                  setError(null);
                  setIsValid(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                aria-label="清除输入"
              >
                ✕
              </button>
            )}
          </div>

          {/* 错误提示 */}
          {error && (
            <p
              id="birthday-error"
              className="text-sm text-red-600 dark:text-red-400"
            >
              ⚠️ {error}
            </p>
          )}

          {/* 格式提示 */}
          {!error && birthday && !isValid && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              ℹ️ 请输入有效的生日格式：YYYY-MM-DD
            </p>
          )}

          {/* 成功提示 */}
          {!error && isValid && (
            <p className="text-sm text-green-600 dark:text-green-400">
              ✓ 生日格式正确
            </p>
          )}
        </div>

        {/* 快速选择 */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            快速选择示例生日：
          </p>
          <div className="flex flex-wrap gap-2">
            {presetBirthdays.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetSelect(preset.label)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm transition-all",
                  "border border-gray-300 bg-white text-gray-700",
                  "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300",
                  "hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700",
                  "dark:hover:border-primary-500 dark:hover:bg-primary-900/30 dark:hover:text-primary-300",
                  birthday === preset.label &&
                    "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-900/50 dark:text-primary-300"
                )}
              >
                {preset.label}
                <span className="ml-1 text-xs opacity-60">({preset.desc})</span>
              </button>
            ))}
          </div>
        </div>

        {/* 提交按钮 */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!isValid || isLoading}
          isLoading={isLoading}
        >
          {isLoading ? (
            <>
              <span className="mr-2">✨</span>
              正在查询今日运势...
            </>
          ) : (
            <>
              <span className="mr-2">🔮</span>
              查看我的今日运势
            </>
          )}
        </Button>

        {/* 温馨提示 */}
        <div className="rounded-lg bg-blue-50/50 p-4 dark:bg-blue-900/20">
          <div className="flex items-start">
            <div className="mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300">
              ℹ️
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                温馨提示
              </p>
              <ul className="mt-1 space-y-1 text-xs text-blue-700 dark:text-blue-400">
                <li>• 我们不会保存您的生日信息到服务器</li>
                <li>• 查询结果仅保存在您的浏览器本地</li>
                <li>• 运势内容每日更新，同一星座内容一致</li>
                <li>• 结果仅供参考，请理性看待</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}