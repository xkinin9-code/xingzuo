"use client";

import { useState } from "react";
import BirthdayForm from "@/components/BirthdayForm";
import FortuneResult from "@/components/FortuneResult";
import TipPanel from "@/components/TipPanel";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { getZodiacByBirthday } from "@/lib/zodiac";
import { addHistoryRecord } from "@/lib/local-history";
import { cn } from "@/lib/utils";

export default function Home() {
  const [fortuneData, setFortuneData] = useState<any>(null);
  const [zodiacInfo, setZodiacInfo] = useState<any>(null);
  const [personalized, setPersonalized] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasResult, setHasResult] = useState(false);

  const handleBirthdaySubmit = async (birthday: string) => {
    setIsLoading(true);
    setError(null);
    setHasResult(false);

    try {
      // 调用API获取运势数据
      const response = await fetch(`/api/fortune/today?birthday=${encodeURIComponent(birthday)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "获取运势失败");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "获取运势失败");
      }

      const { zodiac, fortune, personalized: apiPersonalized } = result.data;

      // 设置状态
      setZodiacInfo(zodiac);
      setFortuneData(fortune);
      setPersonalized(apiPersonalized);

      // 保存历史记录
      addHistoryRecord(birthday, zodiac.chineseName, zodiac.englishName, {
        overall: fortune.overall.substring(0, 100) + "...",
        luckyNumber: apiPersonalized.randomElements.luckyNumber,
        luckyColor: apiPersonalized.randomElements.luckyColor,
      });

      setHasResult(true);

      // 滚动到结果区域
      setTimeout(() => {
        document.getElementById("fortune-result")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      console.error("获取运势失败:", err);
      setError(err instanceof Error ? err.message : "获取运势失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFortuneData(null);
    setZodiacInfo(null);
    setPersonalized(null);
    setHasResult(false);
    setError(null);
  };

  return (
    <div className="space-y-8 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-2 mb-2">
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
            🔮 每日更新 · 完全免费
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          发现你的
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            今日星座运势
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          输入生日，获取个性化的今日星座运势解读。
          涵盖爱情、事业、健康、财运等各个方面，每日凌晨更新。
        </p>
      </section>

      {/* Birthday Form Section */}
      <section className="fortune-card p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            开始你的运势之旅
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            只需输入生日，即可获取专属今日运势
          </p>
        </div>

        <BirthdayForm
          onSubmit={handleBirthdaySubmit}
          isLoading={isLoading}
        />

        {/* 功能特色 */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: "✨",
              title: "每日更新",
              desc: "运势内容每日凌晨更新",
            },
            {
              icon: "🔒",
              title: "隐私保护",
              desc: "生日信息仅保存在本地",
            },
            {
              icon: "🎯",
              title: "个性化",
              desc: "基于生日的专属解读",
            },
            {
              icon: "💝",
              title: "完全免费",
              desc: "无任何隐藏费用",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-gray-200/50 bg-white/50 p-4 dark:border-gray-700/50 dark:bg-gray-800/50"
            >
              <div className="mb-2 text-2xl">{feature.icon}</div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <section className="fortune-card p-6">
          <div className="mb-4 text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              正在解读今日星象...
            </h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              请稍等，我们正在为您生成专属运势
            </p>
          </div>
          <LoadingSkeleton type="fortune" />
        </section>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <section className="fortune-card p-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              ⚠️
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              获取运势失败
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={handleReset}
              className="rounded-lg bg-primary-600 px-6 py-2 font-medium text-white transition-colors hover:bg-primary-700"
            >
              重新尝试
            </button>
          </div>
        </section>
      )}

      {/* Result Section */}
      {hasResult && fortuneData && zodiacInfo && personalized && !isLoading && (
        <section id="fortune-result" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                你的今日运势
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {personalized.timeGreeting} {personalized.dayInCycleText}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              重新查询
            </button>
          </div>

          <FortuneResult
            zodiac={zodiacInfo}
            fortune={fortuneData}
            personalized={personalized}
          />

          {/* 打赏面板 */}
          <TipPanel className="mt-6" onSuccess={(token) => {
            // 打赏成功后的回调
            console.log('打赏成功，token:', token);
            // 可以在这里跳转到成功页面或显示通知
          }} />
        </section>
      )}

      {/* Info Section */}
      {!hasResult && !isLoading && (
        <section className="fortune-card p-6">
          <div className="mb-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              关于星座运势
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              了解星座运势的意义和局限性
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">
                🌟 星座运势的意义
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>提供心理暗示和积极思考的角度</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>帮助反思和规划日常生活</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>增进自我认知和个人成长</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>作为社交和娱乐的话题</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">
                ⚠️ 温馨提示
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>运势内容仅供娱乐参考</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>请勿完全依赖运势做重要决策</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>保持理性思考和生活主动性</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>实际生活比星座描述更加丰富</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}