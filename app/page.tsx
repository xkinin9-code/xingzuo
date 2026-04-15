"use client";

import { useState } from "react";
import Image from "next/image";
import BirthdayForm from "@/components/BirthdayForm";
import FortuneResult from "@/components/FortuneResult";
import { addHistoryRecord } from "@/lib/local-history";
import { cn } from "@/lib/utils";

export default function Home() {
  const [fortuneData, setFortuneData] = useState<any>(null);
  const [zodiacInfo, setZodiacInfo] = useState<any>(null);
  const [personalized, setPersonalized] = useState<any>(null);
  const [extra, setExtra] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasResult, setHasResult] = useState(false);

  const handleBirthdaySubmit = async (birthday: string) => {
    setIsLoading(true);
    setError(null);
    setHasResult(false);

    try {
      const response = await fetch(`/api/fortune/today?birthday=${encodeURIComponent(birthday)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "获取运势失败");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "获取运势失败");
      }

      const { zodiac, fortune, personalized: apiPersonalized, extra: apiExtra } = result.data;

      setZodiacInfo(zodiac);
      setFortuneData(fortune);
      setPersonalized(apiPersonalized);
      setExtra(apiExtra);

      addHistoryRecord(birthday, zodiac.chineseName, zodiac.englishName, {
        overall: fortune.overall.substring(0, 100) + "...",
        luckyNumber: apiPersonalized.randomElements.luckyNumber,
        luckyColor: apiPersonalized.randomElements.luckyColor,
      });

      setTimeout(() => {
        setIsLoading(false);
        setHasResult(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 2000);
    } catch (err) {
      console.error("获取运势失败:", err);
      setError(err instanceof Error ? err.message : "获取运势失败，请稍后重试");
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFortuneData(null);
    setZodiacInfo(null);
    setPersonalized(null);
    setExtra(null);
    setHasResult(false);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 首页背景 */}
      {!hasResult && !isLoading && (
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/backgrounds/home-bg.png"
            alt="星空背景"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      {/* 加载背景 */}
      {isLoading && (
        <div className="fixed inset-0 z-30">
          <Image
            src="/images/backgrounds/loading-bg.jpg"
            alt="加载背景"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* 结果背景 */}
      {hasResult && !isLoading && (
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/backgrounds/result-bg.png"
            alt="结果背景"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#0a0a1a]/60" />
        </div>
      )}

      {/* 首页内容 */}
      {!hasResult && !isLoading && (
        <div className="relative z-10 flex min-h-screen flex-col pt-20 pb-24"
        >
          <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6"
          >
            {/* 标题区域 */}
            <div className="text-center space-y-4 mb-10"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#D4AF37] tracking-widest drop-shadow-lg"
              >
                对着流星，写下你的生日
              </h1>
              <p className="text-base sm:text-lg text-[#F5E6C8]/80 tracking-wide max-w-2xl mx-auto"
              >
                每一颗划过的流星，都在等待一个值得纪念的日子
              </p>
            </div>

            {/* 表单区域 */}
            <BirthdayForm
              onSubmit={handleBirthdaySubmit}
              isLoading={isLoading}
              className="w-full max-w-3xl"
            />

            {/* 错误提示 */}
            {error && (
              <div className="mt-8 text-center"
              >
                <p className="text-red-400 text-sm bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm"
                >
                  {error}
                </p>
                <button
                  onClick={handleReset}
                  className="mt-4 text-[#D4AF37] hover:text-[#F5E6C8] text-sm underline underline-offset-4"
                >
                  重新尝试
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 加载内容 */}
      {isLoading && (
        <div className="relative z-40 flex min-h-screen flex-col items-center justify-center px-4"
        >
          <div className="text-center space-y-6"
          >
            <div className="animate-pulse"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-[#D4AF37] tracking-[0.3em] drop-shadow-lg"
              >
                静候星辰的回响
              </h2>
              <p className="mt-4 text-[#F5E6C8]/70 text-lg tracking-widest animate-pulse"
              >
                ...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 结果内容 */}
      {hasResult && fortuneData && zodiacInfo && personalized && extra && !isLoading && (
        <div className="relative z-10 min-h-screen pt-20 pb-12"
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
          >
            {/* 顶部操作栏 */}
            <div className="flex items-center justify-between mb-6"
            >
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-[#F5E6C8]/80 hover:text-[#D4AF37] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                重新查询
              </button>
              <span className="text-sm text-[#F5E6C8]/60"
              >
                {personalized.timeGreeting}
              </span>
            </div>

            {/* 运势结果 */}
            <FortuneResult
              zodiac={zodiacInfo}
              fortune={fortuneData}
              personalized={personalized}
              extra={extra}
            />
          </div>
        </div>
      )}
    </div>
  );
}
