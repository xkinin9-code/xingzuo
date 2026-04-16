"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import {
  getAllHistory,
  getHistoryStats,
  deleteHistoryRecord,
  clearAllHistory,
  HistoryRecord,
  HistoryStats,
} from "@/lib/local-history";
import { cn, formatChineseDate, formatChineseDateTime } from "@/lib/utils";

function getZodiacIconPath(name: string) {
  return `/images/icons/${name}.png`;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setIsLoading(true);
    try {
      const records = getAllHistory();
      const historyStats = getHistoryStats();
      setHistory(records);
      setStats(historyStats);
    } catch (error) {
      console.error("加载历史记录失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm("确定要删除这条记录吗？")) {
      deleteHistoryRecord(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (window.confirm("确定要清空所有历史记录吗？此操作无法撤销。")) {
      clearAllHistory();
      loadHistory();
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `星座查询历史_${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/backgrounds/result-bg.png"
            alt="背景"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#0a0a1a]/70" />
        </div>
        <div className="relative z-10 min-h-screen pt-24 pb-12 px-4 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#D4AF37] tracking-wider">
                查询历史记录
              </h1>
              <p className="mt-2 text-[#F5E6C8]/60">
                加载你的星座查询历史...
              </p>
            </div>
            <LoadingSkeleton type="list" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Header containerClassName="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" />
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/backgrounds/result-bg.png"
          alt="背景"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0a0a1a]/70" />
      </div>

      <div className="relative z-10 min-h-screen pt-24 pb-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* 标题 */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#D4AF37] tracking-wider">
              查询历史记录
            </h1>
            <p className="mt-2 text-[#F5E6C8]/60">
              查看你保存的星座查询记录，记录保存在本地浏览器中
            </p>
          </div>

          {/* 统计卡片 */}
          {stats && stats.totalQueries > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "总查询次数", value: stats.totalQueries.toString() },
                { label: "最常查询星座", value: stats.mostFrequentZodiac },
                {
                  label: "首次查询",
                  value: stats.firstQueryDate
                    ? formatChineseDate(new Date(stats.firstQueryDate))
                    : "暂无",
                },
                {
                  label: "最近查询",
                  value: stats.lastQueryDate
                    ? formatChineseDate(new Date(stats.lastQueryDate))
                    : "暂无",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#D4AF37]/10 bg-[#0f1221]/70 backdrop-blur-md p-4 text-center"
                >
                  <div className="text-xs text-[#F5E6C8]/50 mb-1">{item.label}</div>
                  <div className="text-lg font-bold text-[#F5E6C8]">{item.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={loadHistory}
              className="border-[#D4AF37]/30 text-[#F5E6C8] bg-transparent hover:bg-[#D4AF37]/10 hover:text-[#F5E6C8]"
            >
              刷新列表
            </Button>
            {history.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="border-[#D4AF37]/30 text-[#F5E6C8] bg-transparent hover:bg-[#D4AF37]/10 hover:text-[#F5E6C8]"
                >
                  导出历史
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleClearAll}
                  className="bg-red-900/60 hover:bg-red-900/80 text-red-100"
                >
                  清空所有
                </Button>
              </>
            )}
            <Link href="/" className="ml-auto">
              <Button className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/30">
                返回首页
              </Button>
            </Link>
          </div>

          {/* 历史列表 */}
          {history.length === 0 ? (
            <div className="rounded-2xl border border-[#D4AF37]/10 bg-[#0f1221]/70 backdrop-blur-md p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1a1d2e] text-3xl">
                ✨
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#F5E6C8]">
                暂无查询记录
              </h3>
              <p className="mb-6 text-[#F5E6C8]/60">
                你还没有查询过星座运势，快去首页试试吧！
              </p>
              <Link href="/">
                <Button className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/30"
                >
                  开始查询
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="rounded-xl border border-[#D4AF37]/10 bg-[#0f1221]/70 backdrop-blur-md p-5 transition-all hover:border-[#D4AF37]/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* 星座信息 */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a1d2e] border border-[#D4AF37]/20 overflow-hidden">
                        <img
                          src={getZodiacIconPath(record.zodiac)}
                          alt={record.zodiac}
                          className="h-10 w-10 object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-[#F5E6C8] text-lg">
                          {record.zodiac}
                        </div>
                        <div className="text-xs text-[#F5E6C8]/50">
                          {record.zodiacEnglish}
                        </div>
                      </div>
                    </div>

                    {/* 记录详情 */}
                    <div className="flex-1 sm:px-4">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="text-[#F5E6C8]/80">
                          生日：<span className="text-[#F5E6C8]">{record.birthday}</span>
                        </span>
                        <span className="text-[#F5E6C8]/40">|</span>
                        <span className="text-[#F5E6C8]/80">
                          查询时间：<span className="text-[#F5E6C8]">{formatChineseDateTime(new Date(record.queryTime))}</span>
                        </span>
                      </div>

                      {record.fortuneContent && (
                        <div className="mt-3 rounded-lg bg-[#1a1d2e]/60 p-3">
                          <p className="text-sm text-[#F5E6C8]/70 line-clamp-2">
                            {record.fortuneContent.overall}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
                            <span className="text-[#F5E6C8]/50">
                              幸运数字：
                              <span className="text-[#D4AF37]">{record.fortuneContent.luckyNumber}</span>
                            </span>
                            {record.fortuneContent.luckyColor && (
                              <span className="flex items-center gap-1 text-[#F5E6C8]/50">
                                幸运颜色：
                                <span
                                  className="inline-block h-3 w-3 rounded-full border border-[#F5E6C8]/20"
                                  style={{ backgroundColor: record.fortuneContent.luckyColor }}
                                />
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex flex-col items-stretch gap-2 sm:flex-shrink-0">
                      <Link href={`/?birthday=${encodeURIComponent(record.birthday)}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-[#D4AF37]/30 text-[#F5E6C8] bg-transparent hover:bg-[#D4AF37]/10 hover:text-[#F5E6C8]"
                        >
                          再次查询
                        </Button>
                      </Link>
                      <Link href={`/?recordId=${encodeURIComponent(record.id)}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-[#D4AF37]/30 text-[#F5E6C8] bg-transparent hover:bg-[#D4AF37]/10 hover:text-[#F5E6C8]"
                        >
                          查看详情
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRecord(record.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 存储说明 */}
          <div className="rounded-xl border border-[#D4AF37]/10 bg-[#0f1221]/50 p-4 text-sm text-[#F5E6C8]/50">
            <p>
              所有历史记录都保存在你的浏览器本地，不会上传到服务器。清除浏览器数据或使用隐私模式可能导致记录丢失。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
