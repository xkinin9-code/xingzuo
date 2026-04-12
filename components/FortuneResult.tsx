"use client";

import { cn } from "@/lib/utils";
import { ZodiacInfo } from "@/lib/zodiac";

interface FortuneResultProps {
  zodiac: ZodiacInfo;
  fortune: {
    overall: string;
    love: string;
    career: string;
    health: string;
    wealth: string;
  };
  personalized: {
    dayInCycleText: string;
    birthdayTrait: string;
    timeGreeting: string;
    randomElements: {
      luckyNumber: number;
      luckyColor: string;
      colorIntensity: string;
      matchedZodiacs: string[];
      saying: string;
    };
  };
  className?: string;
}

export default function FortuneResult({
  zodiac,
  fortune,
  personalized,
  className,
}: FortuneResultProps) {
  const fortuneSections = [
    {
      id: "overall",
      title: "整体运势",
      icon: "🌟",
      content: fortune.overall,
      color: "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    {
      id: "love",
      title: "爱情运势",
      icon: "💖",
      content: fortune.love,
      color: "bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30",
      borderColor: "border-pink-200 dark:border-pink-800",
    },
    {
      id: "career",
      title: "事业学业",
      icon: "💼",
      content: fortune.career,
      color: "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      id: "health",
      title: "健康状态",
      icon: "🏥",
      content: fortune.health,
      color: "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      id: "wealth",
      title: "财运",
      icon: "💰",
      content: fortune.wealth,
      color: "bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
  ];

  const quickInfoItems = [
    {
      label: "幸运数字",
      value: personalized.randomElements.luckyNumber.toString(),
      icon: "🔢",
    },
    {
      label: "幸运颜色",
      value: personalized.randomElements.colorIntensity + zodiac.color,
      icon: "🎨",
      color: zodiac.color,
    },
    {
      label: "速配星座",
      value: personalized.randomElements.matchedZodiacs.join("、"),
      icon: "💞",
    },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Zodiac Header */}
      <div className="fortune-card overflow-hidden p-6">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          {/* Zodiac Circle */}
          <div className="relative mb-4 sm:mb-0 sm:mr-6">
            <div
              className="h-20 w-20 rounded-full"
              style={{ backgroundColor: zodiac.color }}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">
              {getZodiacSymbol(zodiac.sign)}
            </div>
            <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold shadow-lg dark:bg-gray-800">
              {zodiac.element}
            </div>
          </div>

          {/* Zodiac Info */}
          <div className="flex-1">
            <div className="mb-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {zodiac.chineseName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {zodiac.englishName}
              </p>
            </div>

            {/* Personal Info */}
            <div className="space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {personalized.timeGreeting}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {personalized.dayInCycleText}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {personalized.birthdayTrait}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fortune Sections */}
      <div className="space-y-4">
        {fortuneSections.map((section) => (
          <div
            key={section.id}
            className={cn(
              "fortune-card overflow-hidden p-5 transition-all duration-300 hover:scale-[1.01]",
              section.color,
              section.borderColor,
              "border"
            )}
          >
            <div className="mb-3 flex items-center">
              <span className="mr-3 text-2xl">{section.icon}</span>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h4>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
              {section.content.split("\n").map((paragraph, idx) => (
                <p key={idx} className="mb-2 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Info Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {quickInfoItems.map((item) => (
          <div
            key={item.label}
            className="fortune-card flex flex-col items-center justify-center p-4 text-center"
          >
            <div className="mb-2 text-2xl">{item.icon}</div>
            <div className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
              {item.label}
            </div>
            <div
              className={cn(
                "text-lg font-bold",
                item.color && "rounded-lg px-2 py-1"
              )}
              style={item.color ? { backgroundColor: item.color + "20" } : {}}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Today's Saying */}
      <div className="fortune-card relative overflow-hidden p-6">
        <div className="absolute -right-4 -top-4 text-6xl opacity-10">💫</div>
        <div className="relative">
          <div className="mb-3 flex items-center">
            <span className="mr-2 text-xl">💫</span>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              今日箴言
            </h4>
          </div>
          <blockquote className="text-center italic text-gray-700 dark:text-gray-300">
            "{personalized.randomElements.saying}"
          </blockquote>
          <div className="mt-4 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
            <div className="mr-2 h-px w-8 bg-gray-300 dark:bg-gray-700" />
            <span>星座运势每日占卜</span>
            <div className="ml-2 h-px w-8 bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="rounded-lg bg-gray-50/50 p-4 text-center dark:bg-gray-800/50">
        <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          💡 温馨提示
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          运势内容每日更新，结果仅供参考。请理性看待，保持积极心态面对生活。
        </p>
        <div className="mt-3 flex justify-center space-x-1 text-xs text-gray-500 dark:text-gray-500">
          <span>更新时间：每日 00:30</span>
          <span>•</span>
          <span>内容生成：模板规则 + AI润色</span>
          <span>•</span>
          <span>数据存储：本地浏览器</span>
        </div>
      </div>
    </div>
  );
}

// Helper function to get zodiac symbol
function getZodiacSymbol(sign: string): string {
  const symbolMap: Record<string, string> = {
    白羊座: "♈",
    金牛座: "♉",
    双子座: "♊",
    巨蟹座: "♋",
    狮子座: "♌",
    处女座: "♍",
    天秤座: "♎",
    天蝎座: "♏",
    射手座: "♐",
    摩羯座: "♑",
    水瓶座: "♒",
    双鱼座: "♓",
  };
  return symbolMap[sign] || "♈";
}