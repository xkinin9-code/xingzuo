"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

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
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={cn("w-8 h-8 lg:w-10 lg:h-10", i < rating ? "text-[#e6c866]" : "text-white/15")}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ZodiacPngIcon({ name, className }: { name: string; className?: string }) {
  if (!name) return null;
  return (
    <img
      src={`/images/icons/${name}.png`}
      alt={name}
      className={cn("object-contain", className)}
    />
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

  const cards = [
    {
      id: "love",
      title: "爱情运势",
      icon: (
        <div className="w-7 h-7 lg:w-9 lg:h-9 flex items-center justify-center">
          <img
            src="/images/icons/爱情运势.png"
            alt="爱情运势"
            className="w-full h-full object-contain"
          />
        </div>
      ),
      content: fortune.love,
    },
    {
      id: "career",
      title: "事业运势",
      icon: (
        <div className="w-7 h-7 lg:w-9 lg:h-9 flex items-center justify-center">
          <img
            src="/images/icons/事业运势.png"
            alt="事业运势"
            className="w-full h-full object-contain"
          />
        </div>
      ),
      content: fortune.career,
    },
    {
      id: "accessory",
      title: "吉祥饰品",
      icon: (
        <div className="w-[70px] h-[70px] lg:w-[85px] lg:h-[85px] flex items-center justify-center">
          <img
            src="/images/icons/吉祥饰品.png"
            alt="吉祥饰品"
            className="w-full h-full object-contain"
          />
        </div>
      ),
      content: `选择一件简约的金属饰品，如银质戒指或黄铜吊坠，它能平衡你内心的浮躁，并像今日星辉一样，在冥冥中为你吸引贵人，指点迷津。`,
    },
    {
      id: "meditation",
      title: "今日冥想语",
      icon: (
        <div className="w-[70px] h-[70px] lg:w-[85px] lg:h-[85px] flex items-center justify-center">
          <img
            src="/images/icons/今日冥想语.png"
            alt="今日冥想语"
            className="w-full h-full object-contain"
          />
        </div>
      ),
      content: extra.meditation
        ? extra.meditation.replace(/'([^']+)'/g, '“$1"').replace(/"([^"]+)"/g, '“$1"')
        : extra.meditation,
    },
  ];

  return (
    <div className={cn("relative rounded-3xl overflow-hidden", className)}>
      {/* 背景图 - 覆盖整个结果区域 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/result-text-bg.png"
          alt="结果背景"
          fill
          className="object-cover object-center"
          sizes="(max-width: 1280px) 100vw, 1200px"
        />
      </div>

      {/* 内容区 */}
      <div className="relative z-10 pt-12 pb-24 px-6 lg:pt-16 lg:pb-36 lg:px-10 space-y-10 lg:space-y-12">
        {/* 第一行：星座专属图 + 右侧基础信息，并列排布 */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-stretch justify-center max-w-6xl mx-auto">
          {/* 左侧星座图 */}
          <div className="w-64 sm:w-72 lg:w-80 xl:w-[360px] flex-shrink-0 flex flex-col items-center self-center lg:self-start animate-fade-in-up">
            <div className="relative w-full aspect-[1792/2400] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
              <Image
                src={`/images/zodiac/${zodiac.chineseName}.png`}
                alt={`${zodiac.chineseName}专属图`}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 288px, 360px"
              />
            </div>
            <p className="mt-4 text-center text-lg lg:text-xl text-white/70 tracking-wide animate-fade-in-up animate-delay-100">
              {zodiac.chineseName}
            </p>
          </div>

          {/* 右侧信息区 */}
          <div className="flex-1 flex flex-col items-center lg:items-start justify-center gap-4 lg:gap-5 max-w-2xl">
            {/* 主题词 + 星级 */}
            <div className="flex items-center justify-center lg:justify-start gap-4 lg:gap-6">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#e6c866] tracking-[0.15em] drop-shadow-[0_0_25px_rgba(233,195,73,0.4)] font-[family-name:var(--font-noto-serif-sc)] animate-fade-in-up">
                {extra.keyword}
              </h2>
              <div className="animate-fade-in-up animate-delay-100">
                <StarRating rating={randomElements.starRating} />
              </div>
            </div>

            {/* 今日总运势 */}
            <p className="text-base lg:text-lg text-white/85 leading-[1.8] tracking-wide max-w-lg text-center lg:text-left animate-fade-in-up animate-delay-200">
              {fortune.overall}
            </p>

            {/* 基础信息区 */}
            <div className="grid grid-cols-2 gap-x-[60px] gap-y-10 lg:gap-x-[100px] lg:gap-y-14 w-full max-w-lg pl-[35px] animate-fade-in-up animate-delay-300">
              {/* 幸运颜色 */}
              <div className="flex flex-col gap-2 lg:gap-3">
                <div className="text-lg lg:text-xl text-[#e6c866]/90 tracking-[0.1em]">幸运颜色</div>
                <div className="flex items-center gap-3 min-h-[40px] lg:min-h-[48px]">
                  <span
                    className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: randomElements.luckyColor }}
                  />
                  <span className="text-lg lg:text-xl text-white/80 tracking-wide">{randomElements.luckyColorName}</span>
                </div>
              </div>

              {/* 幸运数字 */}
              <div className="flex flex-col gap-2 lg:gap-3">
                <div className="text-lg lg:text-xl text-[#e6c866]/90 tracking-[0.1em]">幸运数字</div>
                <div className="flex items-center gap-2 min-h-[40px] lg:min-h-[48px]">
                  <img
                    src="/images/icons/幸运数字.png"
                    alt="幸运数字"
                    className="h-6 lg:h-8 w-auto object-contain"
                  />
                  <span className="text-xl lg:text-2xl text-white/80 font-medium">{randomElements.luckyNumber}</span>
                </div>
              </div>

              {/* 速配星座 */}
              <div className="flex flex-col gap-2 lg:gap-3">
                <div className="text-lg lg:text-xl text-[#e6c866]/90 tracking-[0.1em]">速配星座</div>
                <div className="flex items-center gap-2 min-h-[40px] lg:min-h-[48px]">
                  <ZodiacPngIcon
                    name={randomElements.matchedZodiacs[0] || ""}
                    className="h-8 lg:h-10 w-auto object-contain"
                  />
                  <span className="text-lg lg:text-xl text-white/80 tracking-wide">{randomElements.matchedZodiacs[0]}</span>
                </div>
              </div>

              {/* 幸运方位 */}
              <div className="flex flex-col gap-2 lg:gap-3">
                <div className="text-lg lg:text-xl text-[#e6c866]/90 tracking-[0.1em]">幸运方位</div>
                <div className="flex items-center gap-2 min-h-[40px] lg:min-h-[48px]">
                  <img
                    src="/images/icons/幸运方位.png"
                    alt="幸运方位"
                    className="h-6 lg:h-8 w-auto object-contain"
                  />
                  <span className="text-lg lg:text-xl text-white/80 tracking-wide">{randomElements.luckyDirection}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 第二行：四个磨砂玻璃卡片，宽度与上行一致 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={cn(
                "relative rounded-[20px] backdrop-blur-[7.5px] bg-[rgba(0,0,0,0.2)] border border-white/5 p-6 lg:p-8 animate-fade-in-up card-hover-lift",
                index === 0 && "animate-delay-400",
                index === 1 && "animate-delay-500",
                index === 2 && "animate-delay-600",
                index === 3 && "animate-delay-700"
              )}
            >
              <div className="flex items-center justify-center gap-3 mb-3 lg:mb-4">
                <div className="w-11 h-11 lg:w-14 lg:h-14 flex items-center justify-center shrink-0">
                  {card.icon}
                </div>
                <h3 className="text-xl lg:text-2xl text-[#e6c866]/80 tracking-[0.1em] font-medium">
                  {card.title}
                </h3>
              </div>
              <div className="flex justify-center">
                <p className="text-base lg:text-lg xl:text-[19px] text-white/70 leading-[1.85] lg:leading-[1.9] tracking-wide text-left">
                  {card.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 第三行：每日寄语，宽度稍小，居中 */}
        <div className="max-w-5xl mx-auto animate-fade-in-up animate-delay-700">
          <h3 className="text-center text-3xl sm:text-4xl lg:text-5xl font-black tracking-[0.25em] lg:tracking-[0.3em] mb-6 lg:mb-8 drop-shadow-[0_0_25px_rgba(233,195,73,0.4)] font-[family-name:var(--font-noto-serif-sc)] animate-shimmer-text">
            每日寄语
          </h3>
          <blockquote className="text-center text-lg sm:text-xl lg:text-2xl text-[#fff8f8] leading-[1.6] lg:leading-[1.7] px-4 italic mt-2 lg:mt-3 font-[family-name:var(--font-noto-serif-sc)] animate-fade-in-up animate-delay-800">
            &ldquo;{extra.dailyMessage}&rdquo;
          </blockquote>
        </div>
      </div>
    </div>
  );
}
