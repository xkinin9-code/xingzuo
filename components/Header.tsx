"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "今日运势" },
    { href: "/history", label: "查询记录" },
    { href: "#features", label: "功能特色" },
    { href: "#about", label: "关于我们" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-sm dark:border-gray-800/50 dark:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <span className="text-xl font-bold text-white">♈</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  星座运势
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  每日占卜
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative h-5 w-5">
              <span
                className={cn(
                  "absolute left-0 top-0 h-0.5 w-5 transform bg-gray-900 transition-transform duration-300 dark:bg-white",
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-2 h-0.5 w-5 bg-gray-900 transition-opacity duration-300 dark:bg-white",
                  isMenuOpen ? "opacity-0" : "opacity-100"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-4 h-0.5 w-5 transform bg-gray-900 transition-transform duration-300 dark:bg-white",
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                )}
              />
            </div>
          </button>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => window.location.href = "/history"}>
              历史记录
            </Button>
            <Button size="sm" onClick={() => window.location.href = "/"}>
              立即查询
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-200/50 py-4 md:hidden dark:border-gray-800/50">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" size="sm" onClick={() => { setIsMenuOpen(false); window.location.href = "/history"; }}>
                  历史记录
                </Button>
                <Button size="sm" onClick={() => { setIsMenuOpen(false); window.location.href = "/"; }}>
                  立即查询
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 星座装饰 */}
      <div className="absolute -bottom-1 left-0 right-0 h-1 overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>
    </header>
  );
}