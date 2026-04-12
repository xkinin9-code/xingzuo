'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Share2, Heart, Star, Download } from 'lucide-react';

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function TipSuccessPage({ params }: PageProps) {
  const [token, setToken] = useState<string>('');
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 获取参数
    params.then(({ token }) => {
      setToken(token);
      // 模拟获取订单信息
      setTimeout(() => {
        setOrderInfo({
          orderId: `T${Date.now().toString().slice(-8)}`,
          amount: 9.99,
          date: new Date().toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
        setIsLoading(false);
      }, 800);
    });
  }, [params]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '感谢您的支持！',
        text: `感谢您对星座运势网站的支持！`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板！');
    }
  };

  const handleDownloadCard = () => {
    // 模拟下载卡片
    alert('卡片下载功能开发中...');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mb-8">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-400"></div>
            </div>
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              加载中...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              正在获取您的打赏信息
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="mx-auto max-w-3xl">
          {/* 成功动画 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <div className="mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 10,
                  delay: 0.2,
                }}
                className="mx-auto mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10"
              >
                <Heart className="h-12 w-12 text-green-500 dark:text-green-400" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl"
              >
                感谢您的支持！
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-gray-600 dark:text-gray-400"
              >
                您的打赏让我们更有动力持续优化服务
              </motion.p>
            </div>

            {/* 彩虹动画线条 */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mx-auto h-1 w-full max-w-xs rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
            />
          </motion.div>

          {/* 订单信息卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="fortune-card mb-8 overflow-hidden p-6 sm:p-8"
          >
            <div className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                订单信息
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">订单号</span>
                  <span className="font-mono font-medium text-gray-900 dark:text-white">
                    {orderInfo?.orderId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">打赏金额</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ¥{orderInfo?.amount?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">支付时间</span>
                  <span className="text-gray-900 dark:text-white">
                    {orderInfo?.date}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">状态</span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    <Star className="mr-1 h-3 w-3" />
                    支付成功
                  </span>
                </div>
              </div>
            </div>

            {/* 专属卡片预览 */}
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-primary-50/50 to-blue-50/50 p-6 dark:border-gray-700 dark:from-primary-900/20 dark:to-blue-900/20">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  专属感谢卡片
                </h3>
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                  专属
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-blue-500">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    感谢您的支持！
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    这份心意我们已收到 ❤️
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 行动按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8 grid gap-4 sm:grid-cols-2"
          >
            <Button
              onClick={handleDownloadCard}
              variant="outline"
              className="h-14"
            >
              <Download className="mr-2 h-5 w-5" />
              下载感谢卡片
            </Button>
            <Button onClick={handleShare} className="h-14">
              <Share2 className="mr-2 h-5 w-5" />
              分享感谢
            </Button>
          </motion.div>

          {/* 下一步建议 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="fortune-card mb-8 p-6"
          >
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              接下来做什么？
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <Link
                href="/"
                className="group rounded-lg border border-gray-200 p-4 text-center transition-all hover:border-primary-300 hover:bg-primary-50/50 hover:shadow-sm dark:border-gray-700 dark:hover:border-primary-600 dark:hover:bg-primary-900/20"
              >
                <div className="mb-2 text-2xl">🔮</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  查询运势
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  查看今日星座运势
                </div>
              </Link>
              <Link
                href="/history"
                className="group rounded-lg border border-gray-200 p-4 text-center transition-all hover:border-primary-300 hover:bg-primary-50/50 hover:shadow-sm dark:border-gray-700 dark:hover:border-primary-600 dark:hover:bg-primary-900/20"
              >
                <div className="mb-2 text-2xl">📝</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  查看历史
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  回顾历史查询记录
                </div>
              </Link>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group rounded-lg border border-gray-200 p-4 text-center transition-all hover:border-primary-300 hover:bg-primary-50/50 hover:shadow-sm dark:border-gray-700 dark:hover:border-primary-600 dark:hover:bg-primary-900/20"
              >
                <div className="mb-2 text-2xl">💝</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  再次支持
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  继续支持我们
                </div>
              </button>
            </div>
          </motion.div>

          {/* 感谢信息 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-center"
          >
            <div className="inline-block rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-6 py-3">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">您的每一份支持</span>
                <span className="mx-2">•</span>
                <span>都是我们前进的动力</span>
              </p>
            </div>
            <div className="mt-8">
              <Button variant="outline" size="lg" onClick={() => window.location.href = "/"}>
                返回首页
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}