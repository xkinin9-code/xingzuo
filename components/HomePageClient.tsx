"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import BirthdayForm from "@/components/BirthdayForm";
import FortuneResult from "@/components/FortuneResult";
import Header from "@/components/Header";
import { addHistoryRecord, getAllHistory } from "@/lib/local-history";
import { cn } from "@/lib/utils";

function PageContent() {
  const [fortuneData, setFortuneData] = useState<any>(null);
  const [zodiacInfo, setZodiacInfo] = useState<any>(null);
  const [personalized, setPersonalized] = useState<any>(null);
  const [extra, setExtra] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasResult, setHasResult] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const recordId = searchParams.get("recordId");
    const birthday = searchParams.get("birthday");

    if (recordId) {
      const records = getAllHistory();
      const record = records.find((r) => r.id === recordId);
      if (record?.fullData) {
        setZodiacInfo(record.fullData.zodiac);
        setFortuneData(record.fullData.fortune);
        setPersonalized(record.fullData.personalized);
        setExtra(record.fullData.extra);
        setHasResult(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    if (birthday) {
      handleBirthdaySubmit(birthday);
    }
  }, [searchParams]);

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

      addHistoryRecord(
        birthday,
        zodiac.chineseName,
        zodiac.englishName,
        {
          overall: fortune.overall.substring(0, 100) + "...",
          luckyNumber: apiPersonalized.randomElements.luckyNumber,
          luckyColor: apiPersonalized.randomElements.luckyColor,
        },
        {
          zodiac,
          fortune,
          personalized: apiPersonalized,
          extra: apiExtra,
        }
      );

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
    <div className={cn("relative min-h-screen w-full", hasResult && !isLoading ? "overflow-y-auto" : "overflow-hidden")}>
      {!isLoading && (
        <Header
          onHomeClick={handleReset}
          containerClassName="max-w-3xl mx-auto px-4 sm:px-6"
          rightNavLabel="查询记录"
          rightNavHref="/history"
        />
      )}
      {/* 首页背景 */}
      {!hasResult && !isLoading && (
        <div className="fixed inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/images/backgrounds/home-bg.webp"
            className="absolute inset-0 w-full h-full object-cover object-center"
          >
            <source src="/videos/home-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      {/* 加载背景 */}
      {isLoading && (
        <div className="fixed inset-0 z-30">
          <video
            autoPlay
            muted
            loop
            playsInline
            webkit-playsinline="true"
            x5-playsinline="true"
            x5-video-player-type="h5-page"
            poster="/images/backgrounds/loading-bg.jpg"
            className="absolute inset-0 w-full h-full object-cover object-center"
          >
            <source src="/videos/loading-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* 结果背景 - 深紫渐变 + 本地背景图底纹 */}
      {hasResult && !isLoading && (
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/backgrounds/result-bg-custom.webp"
            alt="结果背景"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2a1f4e]/60 via-[#1a153a]/50 to-[#0f0c28]/60" />
          <div className="result-starry-bg pointer-events-none">
            <div className="star-field" />
            <div className="star-glow" />
          </div>
        </div>
      )}

      {/* 首页内容 */}
      {!hasResult && !isLoading && (
        <div className="relative z-10 flex h-screen flex-col pt-16 sm:pt-20"
        >
          <div className="flex-1 flex flex-col items-center justify-start pt-20 sm:pt-28 px-4 sm:px-6 overflow-hidden"
          >
            {/* 标题区域 */}
            <div className="text-center space-y-4 mb-[60px]"
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

            {/* 免责声明 */}
            <div className="mt-auto pb-6 text-center w-full"
            >
              <p className="text-xs sm:text-sm text-[#F5E6C8]/40 max-w-xl mx-auto leading-relaxed"
              >
                声明：本查询结果仅供娱乐参考，不作为任何决策依据。人生由您自己掌握，愿您每一天都充满阳光与希望。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 加载内容 */}
      {isLoading && (
        <div className="relative z-40 flex min-h-screen flex-col items-center justify-center px-4"
        >
          <div className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-medium text-[#D4AF37] tracking-[0.3em] drop-shadow-lg animate-pulse"
            >
              静候星辰的回响...
            </h2>
          </div>
        </div>
      )}

      {/* 结果内容 */}
      {hasResult && fortuneData && zodiacInfo && personalized && extra && !isLoading && (
        <div className="relative z-10 min-h-screen pt-20 pb-16"
        >
          <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16"
          >
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

function LoadingFallback() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/backgrounds/home-bg.webp"
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src="/videos/home-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="relative z-10 flex h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#D4AF37] tracking-widest drop-shadow-lg">
            对着流星，写下你的生日
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#F5E6C8]/80 tracking-wide">
            每一颗划过的流星，都在等待一个值得纪念的日子
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HomePageClient() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PageContent />
    </Suspense>
  );
}
