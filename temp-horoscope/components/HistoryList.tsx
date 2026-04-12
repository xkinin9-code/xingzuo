'use client';

import { useState, useEffect } from 'react';
import Button from './ui/button';
import { historyManager } from '@/lib/local-history';
import { FortuneHistory } from '@/lib/local-history';

interface HistoryListProps {
  limit?: number;
  onClear?: () => void;
}

export default function HistoryList({ limit, onClear }: HistoryListProps) {
  const [histories, setHistories] = useState<FortuneHistory[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setHistories(historyManager.getAllHistories());
    setStats(historyManager.getStats());
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      historyManager.deleteHistory(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有历史记录吗？此操作不可恢复！')) {
      historyManager.clearAllHistories();
      loadHistory();
      if (onClear) onClear();
    }
  };

  const handleExport = () => {
    const data = historyManager.exportHistories();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `星座运势历史_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (histories.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl p-6 shadow-lg">
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-500">暂无查询历史</p>
          <p className="text-gray-400 text-sm mt-2">输入生日查看运势后，这里会显示历史记录</p>
        </div>
      </div>
    );
  }

  const displayHistories = limit ? histories.slice(0, limit) : histories;

  return (
    <div className="w-full bg-white rounded-2xl p-6 shadow-lg">
      {/* 标题和操作按钮 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">查询历史</h3>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            导出数据
          </Button>
          <Button
            onClick={handleClearAll}
            variant="outline"
            size="sm"
            className="text-red-500 border-red-200 hover:bg-red-50"
          >
            清空全部
          </Button>
        </div>
      </div>

      {/* 统计信息 */}
      <button
        onClick={() => setShowStats(!showStats)}
        className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-purple-600 py-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        {showStats ? '隐藏统计' : `查看统计 (${stats?.totalQueries || 0} 条记录)`}
      </button>

      {showStats && stats && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalQueries}
              </p>
              <p className="text-xs text-gray-500">总查询数</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {stats.mostFrequentZodiac || '无'}
              </p>
              <p className="text-xs text-gray-500">最常查询星座</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {stats.lastQueryDate || '无'}
              </p>
              <p className="text-xs text-gray-500">最后查询日期</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {stats.queryDates.length}
              </p>
              <p className="text-xs text-gray-500">查询天数</p>
            </div>
          </div>
        </div>
      )}

      {/* 历史记录列表 */}
      <div className="mt-4 space-y-3">
        {displayHistories.map((history) => {
          const date = new Date(history.timestamp);
          const formattedDate = date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={history.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                      {history.zodiac}
                    </span>
                    <span className="text-sm text-gray-500">{formattedDate}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700">
                      <span className="text-gray-500">生日:</span>{' '}
                      {history.birthday}
                    </p>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div>
                        <p className="text-gray-500 text-xs">幸运数字</p>
                        <p className="text-purple-600 font-semibold">
                          {history.personalization.luckyNumbers.join(', ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">幸运颜色</p>
                        <p
                          className="font-semibold"
                          style={{ color: history.personalization.luckyColor }}
                        >
                          {history.personalization.luckyColor}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">心情</p>
                        <p className="text-blue-600">{history.personalization.mood}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(history.id)}
                  className="text-red-400 hover:text-red-600 transition-colors p-1"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {limit && histories.length > limit && (
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" onClick={() => setHistories(histories)}>
            查看全部
          </Button>
        </div>
      )}
    </div>
  );
}