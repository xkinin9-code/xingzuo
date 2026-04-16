"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getZodiacByDate } from "@/lib/zodiac";

interface HeaderProps {
  onHomeClick?: () => void;
  containerClassName?: string;
  rightNavLabel?: string;
  rightNavHref?: string;
}

export default function Header({
  onHomeClick,
  containerClassName,
  rightNavLabel,
  rightNavHref,
}: HeaderProps) {
  const pathname = usePathname();
  const isHistoryPage = pathname === "/history";

  const today = new Date();
  const currentZodiac = getZodiacByDate(today.getMonth() + 1, today.getDate());

  const label = rightNavLabel || (isHistoryPage ? "查询记录" : "查询结果");
  const href = rightNavHref || (isHistoryPage ? pathname : "/history");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <div
        className={cn(
          "mx-auto flex h-16 items-center justify-between",
          containerClassName || "max-w-7xl px-4 sm:px-6 lg:px-8"
        )}
      >
        {/* 左侧 Logo */}
        <div className="flex items-center">
          <span className="text-lg lg:text-xl font-bold text-[#D4AF37] tracking-[0.15em]">
            寰宇神谕
          </span>
        </div>

        {/* 中间导航 */}
        <nav className="flex items-center justify-center gap-8 lg:gap-16">
          {onHomeClick ? (
            <button
              onClick={onHomeClick}
              className="text-sm lg:text-base text-white/80 hover:text-white transition-colors tracking-wide"
            >
              首页
            </button>
          ) : (
            <Link
              href="/"
              className="text-sm lg:text-base text-white/80 hover:text-white transition-colors tracking-wide"
            >
              首页
            </Link>
          )}
          <Link
            href={href}
            className={cn(
              "text-sm lg:text-base transition-colors tracking-wide",
              isHistoryPage || pathname === href
                ? "text-white/80"
                : "text-white/80 hover:text-white"
            )}
          >
            {label}
          </Link>
        </nav>

        {/* 右侧当月星象 */}
        <div className="flex items-center gap-2">
          <span className="text-sm lg:text-base text-white/80 tracking-wide whitespace-nowrap">
            当月星象：
            <img
              src={`/images/icons/${currentZodiac.chineseName}.png`}
              alt={currentZodiac.chineseName}
              className="inline-block w-5 h-5 lg:w-6 lg:h-6 object-contain align-text-bottom mx-1"
            />
            {currentZodiac.chineseName}季
          </span>
        </div>
      </div>
    </header>
  );
}
