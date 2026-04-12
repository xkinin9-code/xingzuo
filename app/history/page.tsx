"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import {
  getAllHistory,
  getHistoryStats,
  deleteHistoryRecord,
  clearAllHistory,
  HistoryRecord,
  HistoryStats,
} from "@/lib/local-history";
import { cn, formatChineseDate } from "@/lib/utils";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

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
    if (
      window.confirm("确定要清空所有历史记录吗？此操作无法撤销。")
    ) {
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

  const getZodiacColor = (zodiac: string): string => {
    const colorMap: Record<string, string> = {
      白羊座: "#FF6B6B",
      金牛座: "#4ECDC4",
      双子座: "#45B7D1",
      巨蟹座: "#96CEB4",
      狮子座: "#FFEAA7",
      处女座: "#DDA0DD",
      天秤座: "#98D8C8",
      天蝎座: "#6C5B7B",
      射手座: "#F8B195",
      摩羯座: "#355C7D",
      水瓶座: "#A8E6CF",
      双鱼座: "#FFAAA5",
    };
    return colorMap[zodiac] || "#9CA3AF";
  };

  if (isLoading) {
    return (
      <div className="space-y-6 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            查询历史记录
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            加载你的星座查询历史...
          </p>
        </div>
        <LoadingSkeleton type="list" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          查询历史记录
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          查看你保存的星座查询记录，记录保存在本地浏览器中
        </p>
      </div>

      {/* Stats Cards */}
      {stats && stats.totalQueries > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="fortune-card p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              总查询次数
            </div>
            <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalQueries}
            </div>
          </div>

          <div className="fortune-card p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              最常查询星座
            </div>
            <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {stats.mostFrequentZodiac}
            </div>
          </div>

          <div className="fortune-card p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              首次查询
            </div>
            <div className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
              {stats.firstQueryDate
                ? formatChineseDate(new Date(stats.firstQueryDate))
                : "暂无"}
            </div>
          </div>

          <div className="fortune-card p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              最近查询
            </div>
            <div className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
              {stats.lastQueryDate
                ? formatChineseDate(new Date(stats.lastQueryDate))
                : "暂无"}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={loadHistory}>
          刷新列表
        </Button>
        {history.length > 0 && (
          <>
            <Button variant="outline" onClick={handleExport}>
              导出历史
            </Button>
            <Button variant="destructive" onClick={handleClearAll}>
              清空所有
            </Button>
          </>
        )}
        <Button className="ml-auto" onClick={() => window.location.href = "/"}>
          返回首页
        </Button>
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="fortune-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            📝
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            暂无查询记录
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            你还没有查询过星座运势，快去首页试试吧！
          </p>
          <Button onClick={() => window.location.href = "/"}>
            开始查询
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <div
              key={record.id}
              className={cn(
                "fortune-card overflow-hidden p-5 transition-all duration-300",
                selectedRecord === record.id && "ring-2 ring-primary-500"
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center">
                {/* Zodiac Info */}
                <div className="mb-4 sm:mb-0 sm:mr-6">
                  <div className="flex items-center">
                    <div
                      className="mr-3 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                      style={{
                        backgroundColor: getZodiacColor(record.zodiac),
                      }}
                    >
                      {getZodiacSymbol(record.zodiac)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {record.zodiac}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {record.zodiacEnglish}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Record Details */}
                <div className="flex-1">
                  <div className="mb-2">
                    <div className="font-medium text-gray-900 dark:text-white">
                      生日：{record.birthday}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      查询时间：{formatChineseDate(new Date(record.queryTime))}
                    </div>
                  </div>

                  {record.fortuneContent && (
                    <div className="rounded-lg bg-gray-50/50 p-3 dark:bg-gray-800/50">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        运势摘要：
                      </div>
                      <div className="mt-1 line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
                        {record.fortuneContent.overall}
                      </div>
                      {record.fortuneContent.luckyNumber && (
                        <div className="mt-2 flex items-center space-x-4 text-xs">
                          <span className="text-gray-600 dark:text-gray-400">
                            幸运数字：{record.fortuneContent.luckyNumber}
                          </span>
                          {record.fortuneContent.luckyColor && (
                            <span className="text-gray-600 dark:text-gray-400">
                              幸运颜色：
                              <span
                                className="ml-1 inline-block h-3 w-3 rounded-full"
                                style={{
                                  backgroundColor: record.fortuneContent.luckyColor,
                                }}
                              />
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex space-x-2 sm:mt-0 sm:ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => window.location.href = `/?birthday=${encodeURIComponent(record.birthday)}`}
                  >
                    再次查询
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
                    onClick={() => handleDeleteRecord(record.id)}
                  >
                    删除
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Storage Info */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              存储说明
            </div>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              所有历史记录都保存在你的浏览器本地，不会上传到服务器。
              清除浏览器数据或使用隐私模式可能导致记录丢失。
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            记录数量：{history.length}
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center">
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          返回首页查询今日运势
        </Button>
      </div>
    </div>
  );
}

// Helper function to get zodiac symbol
function getZodiacSymbol(zodiac: string): string {
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
  return symbolMap[zodiac] || "♈";
}