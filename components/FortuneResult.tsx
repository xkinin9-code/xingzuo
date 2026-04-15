"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import ZodiacIcon from "@/components/ZodiacIcon";

interface FortuneResultProps {
  zodiac: {
    sign: string;
    chineseName: string;
    englishName: string;
    color: string;
    element: string;
  };
  fortune: {
    overall: string;
    love: string;
    career: string;
    health: string;
    wealth: string;
  };
  personalized: {
    dayInCycle: number;
    dayInCycleText: string;
    birthdayTrait: string;
    timeGreeting: string;
    randomElements: {
      luckyNumber: number;
      luckyColor: string;
      colorIntensity: string;
      matchedZodiacs: string[];
      saying: string;
      luckyColorName: string;
      luckyDirection: string;
      luckyAccessory: string;
      starRating: number;
    };
  };
  extra: {
    keyword: string;
    meditation: string;
    dailyMessage: string;
  };
  className?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={cn(
            "w-5 h-5 sm:w-6 sm:h-6",
            i < rating ? "text-[#D4AF37]" : "text-[#F5E6C8]/20"
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function FortuneResult({
  zodiac,
  fortune,
  personalized,
  extra,
  className,
}: FortuneResultProps) {
  const { randomElements } = personalized;

  const infoItems = [
    {
      label: "幸运颜色",
      value: randomElements.luckyColorName,
      icon: (
        <span
          className="w-4 h-4 rounded-full border border-[#F5E6C8]/30"
          style={{ backgroundColor: randomElements.luckyColor }}
        />
      ),
    },
    {
      label: "幸运数字",
      value: randomElements.luckyNumber.toString(),
      icon: (
        <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
    },
    {
      label: "速配星座",
      value: randomElements.matchedZodiacs.join(" "),
      icon: (
        <div className="flex -space-x-1">
          {randomElements.matchedZodiacs.slice(0, 2).map((z, i) => (
            <ZodiacIcon key={i} zodiacName={z} className="w-4 h-4" />
          ))}
        </div>
      ),
    },
    {
      label: "幸运方位",
      value: randomElements.luckyDirection,
      icon: (
        <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
    },
  ];

  const cards = [
    {
      id: "love",
      title: "爱情运势",
      icon: "💝",
      content: fortune.love,
    },
    {
      id: "career",
      title: "事业运势",
      icon: "🏛️",
      content: fortune.career,
    },
    {
      id: "accessory",
      title: "吉祥饰品",
      icon: "💎",
      content: randomElements.luckyAccessory,
    },
    {
      id: "meditation",
      title: "今日冥想语",
      icon: "🌙",
      content: extra.meditation,
    },
  ];

  return (
    <div className={cn("space-y-6", className)}
    >
      {/* 主卡片 */}
      <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#0f1221]/80 backdrop-blur-md p-6 sm:p-8"
      >
        {/* 顶部标题 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-4"
          >
            <ZodiacIcon zodiacName={zodiac.chineseName} className="w-8 h-8 sm:w-10 sm:h-10" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#D4AF37] tracking-wider"
              >
                {extra.keyword}
              </h2>
              <p className="text-sm text-[#F5E6C8]/60 mt-1"
              >
                {zodiac.chineseName} · {zodiac.englishName}
              </p>
            </div>
          </div>
          <StarRating rating={randomElements.starRating} />
        </div>

        {/* 主体内容区 */}
        <div className="flex flex-col lg:flex-row gap-6"
        >
          {/* 左侧星座图 */}
          <div className="lg:w-64 flex-shrink-0"
          >
            <div className="relative aspect-[3/4] w-full max-w-[240px] mx-auto lg:mx-0 rounded-xl overflow-hidden border border-[#D4AF37]/20 shadow-2xl shadow-[#D4AF37]/5"
            >
              <Image
                src={`/images/zodiac/${zodiac.chineseName}.png`}
                alt={`${zodiac.chineseName}专属图`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 240px, 256px"
              />
            </div>
            <p className="text-center lg:text-left text-xs text-[#F5E6C8]/40 mt-2"
            >
              {zodiac.chineseName}专属图
            </p>
          </div>

          {/* 右侧信息区 */}
          <div className="flex-1 space-y-6"
          >
            {/* 信息网格 */}
            <div className="grid grid-cols-2 gap-4"
            >
              {infoItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#D4AF37]/10 bg-[#1a1d2e]/60 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 mb-1"
                  >
                    {item.icon}
                    <span className="text-xs text-[#F5E6C8]/50">{item.label}</span>
                  </div>
                  <div className="text-base sm:text-lg font-medium text-[#F5E6C8]"
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* 运势卡片网格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-xl border border-[#D4AF37]/10 bg-[#1a1d2e]/60 p-4 sm:p-5 backdrop-blur-sm hover:border-[#D4AF37]/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3"
                  >
                    <span className="text-xl">{card.icon}</span>
                    <h3 className="text-sm font-medium text-[#D4AF37]">{card.title}</h3>
                  </div>
                  <p className="text-sm text-[#F5E6C8]/80 leading-relaxed"
                  >
                    {card.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 每日寄语 */}
      <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#0f1221]/90 to-[#1a1d2e]/90 backdrop-blur-md p-6 sm:p-8"
      >
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl"
        />
        <div className="relative"
        >
          <div className="flex items-center justify-center gap-2 mb-4"
          >
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/50"
            />
            <h3 className="text-lg font-medium text-[#D4AF37] tracking-widest"
            >
              每日寄语
            </h3>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/50"
            />
          </div>
          <blockquote className="text-center text-base sm:text-lg text-[#F5E6C8]/90 leading-relaxed max-w-3xl mx-auto"
          >
            "{extra.dailyMessage}"
          </blockquote>
        </div>
      </div>
    </div>
  );
}
