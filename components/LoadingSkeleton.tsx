"use client";

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  type?: "fortune" | "card" | "list";
  className?: string;
}

export default function LoadingSkeleton({
  type = "fortune",
  className,
}: LoadingSkeletonProps) {
  if (type === "fortune") {
    return <FortuneSkeleton className={className} />;
  }

  if (type === "card") {
    return <CardSkeleton className={className} />;
  }

  if (type === "list") {
    return <ListSkeleton className={className} />;
  }

  return null;
}

function FortuneSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {/* 星座图标和标题 */}
      <div className="mb-6 flex items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 animate-pulse rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gray-400 dark:bg-gray-600" />
        </div>
        <div className="ml-4 space-y-2">
          <div className="h-6 w-32 animate-pulse rounded-lg bg-gray-300 dark:bg-gray-700" />
          <div className="h-4 w-24 animate-pulse rounded-lg bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>

      {/* 运势模块 */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="fortune-card animate-pulse p-6">
            {/* 模块标题 */}
            <div className="mb-3 flex items-center">
              <div className="mr-2 h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-700" />
              <div className="h-5 w-24 rounded-lg bg-gray-300 dark:bg-gray-700" />
            </div>

            {/* 模块内容 */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded-lg bg-gray-300 dark:bg-gray-700" />
              <div className="h-4 w-11/12 rounded-lg bg-gray-300 dark:bg-gray-700" />
              <div className="h-4 w-10/12 rounded-lg bg-gray-300 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="mt-6 flex justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-pulse rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="h-3 w-40 animate-pulse rounded-lg bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full max-w-sm mx-auto fortune-card animate-pulse p-6",
        className
      )}
    >
      {/* 卡片头部 */}
      <div className="mb-4 flex items-center">
        <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
        <div className="ml-4 flex-1 space-y-2">
          <div className="h-5 w-3/4 rounded-lg bg-gray-300 dark:bg-gray-700" />
          <div className="h-3 w-1/2 rounded-lg bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>

      {/* 卡片内容 */}
      <div className="space-y-3">
        <div className="h-4 w-full rounded-lg bg-gray-300 dark:bg-gray-700" />
        <div className="h-4 w-11/12 rounded-lg bg-gray-300 dark:bg-gray-700" />
        <div className="h-4 w-10/12 rounded-lg bg-gray-300 dark:bg-gray-700" />
        <div className="h-4 w-9/12 rounded-lg bg-gray-300 dark:bg-gray-700" />
      </div>

      {/* 卡片底部 */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
        <div className="h-3 w-20 rounded-lg bg-gray-300 dark:bg-gray-700" />
        <div className="h-3 w-16 rounded-lg bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
}

function ListSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-200 p-4 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 rounded-lg bg-gray-300 dark:bg-gray-700" />
                <div className="h-3 w-24 rounded-lg bg-gray-300 dark:bg-gray-700" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-20 rounded-lg bg-gray-300 dark:bg-gray-700" />
                <div className="h-3 w-16 rounded-lg bg-gray-300 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 内联加载指示器
export function InlineLoader() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-primary-600 dark:border-gray-700 dark:border-t-primary-400" />
        <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary-600/20 dark:bg-primary-400/20" />
      </div>
    </div>
  );
}

// 小型加载指示器
export function SmallLoader() {
  return (
    <div className="flex items-center space-x-2">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 dark:border-gray-700 dark:border-t-primary-400" />
      <span className="text-sm text-gray-600 dark:text-gray-400">加载中...</span>
    </div>
  );
}

// 全屏加载
export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="text-center">
        <div className="relative mx-auto mb-6">
          <div className="h-20 w-20 animate-spin rounded-full border-4 border-gray-300 border-t-primary-600 dark:border-gray-700 dark:border-t-primary-400" />
          <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary-600/20 dark:bg-primary-400/20" />
          <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-primary-600/30 dark:bg-primary-400/30" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            正在解读今日星象...
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            请稍等，我们正在为您生成专属运势
          </p>
          <div className="mt-4 flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-2 w-2 animate-pulse rounded-full bg-primary-600 dark:bg-primary-400"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}