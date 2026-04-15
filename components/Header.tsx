"use client";

import Link from "next/link";
import ZodiacIcon from "@/components/ZodiacIcon";
import { getCurrentZodiacSeason } from "@/lib/personalization";

export default function Header() {
  const currentSeason = getCurrentZodiacSeason();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-xl sm:text-2xl font-bold text-[#D4AF37] tracking-wider group-hover:text-[#F5E6C8] transition-colors">
              寰宇神谕
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6 sm:space-x-10">
            <Link
              href="/"
              className="text-sm sm:text-base font-medium text-[#F5E6C8]/90 hover:text-[#D4AF37] transition-colors"
            >
              首页
            </Link>
            <Link
              href="/history"
              className="text-sm sm:text-base font-medium text-[#F5E6C8]/90 hover:text-[#D4AF37] transition-colors"
            >
              查询记录
            </Link>
          </nav>

          {/* Current Season */}
          <div className="hidden sm:flex items-center space-x-2 text-[#F5E6C8]/90">
            <span className="text-sm font-medium flex items-center gap-2">
              当月星象：
              <img
                src={`/images/icons/${currentSeason.chineseName}.png`}
                alt={currentSeason.chineseName}
                className="h-7 w-7 object-cover"
              />
              {currentSeason.chineseName}季
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
