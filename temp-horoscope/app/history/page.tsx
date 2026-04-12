'use client';

import { useEffect, useState } from 'react';
import HistoryList from '@/components/HistoryList';
import Button from '@/components/ui/button';

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 页面加载完成后自动加载历史记录
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* 头部 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">📜</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">历史记录</h1>
                <p className="text-sm text-gray-600">查看您的查询历史</p>
              </div>
            </div>
            <a
              href="/"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              返回首页
            </a>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <HistoryList limit={50} />
        </div>
      </main>

      {/* 页脚 */}
      <footer className="mt-12 py-6 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">星座运势网站 &copy; {new Date().getFullYear()}</p>
          <p className="text-sm text-gray-400">仅供娱乐参考，历史记录仅保存在本地浏览器</p>
        </div>
      </footer>
    </div>
  );
}