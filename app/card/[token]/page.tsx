'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Share2, Download, Eye, Calendar, Heart, Star } from 'lucide-react';

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function ShareCardPage({ params }: PageProps) {
  const [token, setToken] = useState<string>('');
  const [cardData, setCardData] = useState<any>(null);
  const [cardStats, setCardStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(async ({ token }) => {
      setToken(token);
      try {
        const response = await fetch(`/api/share-card/${token}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || '加载卡片失败');
        }

        setCardData(result.data.card);
        setCardStats(result.data.stats);
      } catch (err) {
        console.error('加载卡片失败:', err);
        setError(err instanceof Error ? err.message : '加载卡片失败');
      } finally {
        setIsLoading(false);
      }
    });
  }, [params]);

  const handleShare = () => {
    const shareUrl = window.location.href;
    const shareText = `感谢您的支持！❤️`;

    if (navigator.share) {
      navigator.share({
        title: '感谢卡片 - 星座运势网站',
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('链接已复制到剪贴板！');
    }
  };

  const handleDownload = () => {
    if (!cardData) return;

    const imageUrl = `/api/share-card/generate?token=${token}`;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `感谢卡片_${cardData.orderId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              加载感谢卡片中...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              正在获取您的专属感谢卡片
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="fortune-card mx-auto max-w-md p-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <Heart className="h-10 w-10" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
              卡片加载失败
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">{error}</p>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => window.location.href = "/"}>
                返回首页
              </Button>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = "/history"}>
                查看历史记录
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          {/* 页面标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              专属感谢卡片
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              这份心意，我们永远珍惜 ❤️
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* 卡片预览 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="fortune-card overflow-hidden p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  卡片预览
                </h2>
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                  专属设计
                </span>
              </div>

              {/* 卡片展示区域 */}
              <div className="mb-6 overflow-hidden rounded-2xl border-4 border-white shadow-xl dark:border-gray-800">
                <div
                  className="flex h-64 items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  <div className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                        <Heart className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <div className="mb-2 text-2xl font-bold text-white">
                      感谢您的支持！
                    </div>
                    <div className="text-lg text-white/90">
                      ¥{cardData?.amount?.toFixed(2) || '0.00'} {cardData?.currency || 'CNY'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 卡片信息 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">订单号</span>
                  <span className="font-mono font-medium text-gray-900 dark:text-white">
                    {cardData?.orderId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">创建时间</span>
                  <span className="text-gray-900 dark:text-white">
                    {cardData?.createdAt
                      ? new Date(cardData.createdAt).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 卡片统计和操作 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* 卡片统计 */}
              <div className="fortune-card p-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  卡片统计
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <div className="flex items-center">
                      <Eye className="mr-2 h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">查看次数</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {cardStats?.viewCount || 0}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">剩余天数</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {cardStats?.daysRemaining || 0}
                    </div>
                  </div>
                </div>
                {cardStats?.expiresAt && (
                  <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50/50 p-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                    <Calendar className="mr-2 inline h-4 w-4" />
                    卡片有效期至：{new Date(cardStats.expiresAt).toLocaleDateString('zh-CN')}
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="fortune-card p-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  卡片操作
                </h2>
                <div className="space-y-3">
                  <Button onClick={handleDownload} className="w-full">
                    <Download className="mr-2 h-5 w-5" />
                    下载卡片图片
                  </Button>
                  <Button onClick={handleShare} variant="outline" className="w-full">
                    <Share2 className="mr-2 h-5 w-5" />
                    分享卡片
                  </Button>
                </div>
              </div>

              {/* 温馨提示 */}
              <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex items-start">
                  <Star className="mr-2 mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-300">
                      温馨提示
                    </h4>
                    <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-400">
                      <li>• 此卡片是您打赏的专属感谢证明</li>
                      <li>• 卡片图片可直接下载分享</li>
                      <li>• 卡片将在{cardStats?.daysRemaining || 30}天后过期</li>
                      <li>• 感谢您的每一份支持与信任</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 底部导航 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex flex-wrap justify-center gap-3">
              <Button variant="outline" onClick={() => window.location.href = "/"}>
                返回首页
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/history"}>
                查看历史记录
              </Button>
              <Button onClick={() => window.location.href = "/tip/success/demo"}>
                再次支持
              </Button>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                💝 感谢您对星座运势网站的支持与信任
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}