'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

// Client-side only functions for card generation
function generateCardDesign(zodiac?: string): {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  fontFamily: string;
  zodiacIcon?: string;
  theme: 'light' | 'dark' | 'zodiac';
} {
  const zodiacThemes: Record<string, any> = {
    ARIES: {
      backgroundColor: '#FFEFEF',
      textColor: '#C41E3A',
      borderColor: '#FF6B6B',
      fontFamily: 'Arial, sans-serif',
      zodiacIcon: '♈',
      theme: 'zodiac'
    },
    TAURUS: {
      backgroundColor: '#F0F8E8',
      textColor: '#5C7A29',
      borderColor: '#94D82D',
      fontFamily: 'Georgia, serif',
      zodiacIcon: '♉',
      theme: 'zodiac'
    },
    GEMINI: {
      backgroundColor: '#E8F4F8',
      textColor: '#1E88E5',
      borderColor: '#6BCEBB',
      fontFamily: 'Courier New, monospace',
      zodiacIcon: '♊',
      theme: 'zodiac'
    },
    CANCER: {
      backgroundColor: '#F0F0FF',
      textColor: '#3949AB',
      borderColor: '#4D96FF',
      fontFamily: 'Verdana, sans-serif',
      zodiacIcon: '♋',
      theme: 'zodiac'
    },
    LEO: {
      backgroundColor: '#FFF8E1',
      textColor: '#FF8F00',
      borderColor: '#FF8C42',
      fontFamily: 'Times New Roman, serif',
      zodiacIcon: '♌',
      theme: 'zodiac'
    },
    VIRGO: {
      backgroundColor: '#F3E5F5',
      textColor: '#8E24AA',
      borderColor: '#9B5DE5',
      fontFamily: 'Cambria, serif',
      zodiacIcon: '♍',
      theme: 'zodiac'
    },
    LIBRA: {
      backgroundColor: '#E8F5E8',
      textColor: '#43A047',
      borderColor: '#00BBF9',
      fontFamily: 'Arial, sans-serif',
      zodiacIcon: '♎',
      theme: 'zodiac'
    },
    SCORPIO: {
      backgroundColor: '#FCE4EC',
      textColor: '#D81B60',
      borderColor: '#F15BB5',
      fontFamily: 'Georgia, serif',
      zodiacIcon: '♏',
      theme: 'zodiac'
    },
    SAGITTARIUS: {
      backgroundColor: '#FFF3E0',
      textColor: '#EF6C00',
      borderColor: '#FF6B6B',
      fontFamily: 'Courier New, monospace',
      zodiacIcon: '♐',
      theme: 'zodiac'
    },
    CAPRICORN: {
      backgroundColor: '#E8F5E8',
      textColor: '#388E3C',
      borderColor: '#94D82D',
      fontFamily: 'Verdana, sans-serif',
      zodiacIcon: '♑',
      theme: 'zodiac'
    },
    AQUARIUS: {
      backgroundColor: '#E3F2FD',
      textColor: '#1565C0',
      borderColor: '#5F6CAF',
      fontFamily: 'Times New Roman, serif',
      zodiacIcon: '♒',
      theme: 'zodiac'
    },
    PISCES: {
      backgroundColor: '#E0F7FA',
      textColor: '#00838F',
      borderColor: '#00C2D7',
      fontFamily: 'Cambria, serif',
      zodiacIcon: '♓',
      theme: 'zodiac'
    }
  };

  if (zodiac && zodiacThemes[zodiac]) {
    return zodiacThemes[zodiac];
  }

  return {
    backgroundColor: '#FFFFFF',
    textColor: '#333333',
    borderColor: '#E5E7EB',
    fontFamily: 'Inter, sans-serif',
    theme: 'light'
  };
}

function generateCardHtml(cardData: any, design: any): string {
  const formattedDate = new Date(cardData.createdAt || Date.now()).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const zodiacDisplay = cardData.zodiac ? `${cardData.zodiac}座` : '星座';
  const fortune = cardData.fortune || {};

  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>运势分享 - ${zodiacDisplay}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: ${design.fontFamily};
            background-color: ${design.backgroundColor};
            color: ${design.textColor};
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .card {
            width: 400px;
            padding: 40px;
            border: 3px solid ${design.borderColor};
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
        }

        .zodiac-icon {
            font-size: 60px;
            margin-bottom: 10px;
        }

        .zodiac-name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .date {
            font-size: 14px;
            opacity: 0.7;
            margin-bottom: 25px;
        }

        .fortune-item {
            font-size: 16px;
            line-height: 1.6;
            margin: 15px 0;
            padding: 12px;
            background-color: rgba(255, 255, 255, 0.6);
            border-radius: 10px;
            text-align: left;
        }

        .fortune-item strong {
            display: block;
            margin-bottom: 5px;
            color: ${design.textColor};
        }

        .lucky-info {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid ${design.borderColor};
        }

        .lucky-item {
            text-align: center;
        }

        .lucky-item .label {
            font-size: 12px;
            opacity: 0.7;
            margin-bottom: 5px;
        }

        .lucky-item .value {
            font-size: 16px;
            font-weight: bold;
        }

        .footer {
            margin-top: 25px;
            font-size: 12px;
            opacity: 0.5;
        }
    </style>
</head>
<body>
    <div class="card">
        ${design.zodiacIcon ? `<div class="zodiac-icon">${design.zodiacIcon}</div>` : ''}
        <div class="zodiac-name">${zodiacDisplay}今日运势</div>
        <div class="date">${formattedDate}</div>

        ${fortune.overall ? `
        <div class="fortune-item">
            <strong>综合运势</strong>
            ${fortune.overall}
        </div>
        ` : ''}

        ${fortune.love ? `
        <div class="fortune-item">
            <strong>感情运势</strong>
            ${fortune.love}
        </div>
        ` : ''}

        ${fortune.career ? `
        <div class="fortune-item">
            <strong>事业运势</strong>
            ${fortune.career}
        </div>
        ` : ''}

        <div class="lucky-info">
            ${cardData.luckyNumbers ? `
            <div class="lucky-item">
                <div class="label">幸运数字</div>
                <div class="value">${cardData.luckyNumbers.join('、')}</div>
            </div>
            ` : ''}
            ${cardData.luckyColor ? `
            <div class="lucky-item">
                <div class="label">幸运颜色</div>
                <div class="value" style="color: ${cardData.luckyColor}">${cardData.luckyColor}</div>
            </div>
            ` : ''}
        </div>

        <div class="footer">
            扫描二维码查看完整运势
        </div>
    </div>
</body>
</html>
    `;
}

interface CardPageProps {
  params: {
    token: string;
  };
}

export default function CardPage({ params }: CardPageProps) {
  const [cardData, setCardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [params.token]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      // 获取卡片数据
      const response = await fetch(`${API_URL}/api/share-card?token=${params.token}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || '卡片不存在或已过期');
        setLoading(false);
        return;
      }

      setCardData({
        ...result.card,
        design: generateCardDesign(result.card.zodiac),
        viewCount: result.card.viewCount || 0
      });
    } catch (err) {
      console.error('获取卡片失败:', err);
      setError('获取卡片失败，请检查链接是否正确');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!cardData) return;

    const html = generateCardHtml(
      {
        ...cardData,
        createdAt: cardData.createdAt || new Date()
      },
      cardData.design
    );

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `运势分享_${cardData.zodiac || '星座'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    alert('链接已复制到剪贴板！');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">卡片无效</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cardData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* 头部 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">🎴</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">运势分享</h1>
                <p className="text-sm text-gray-600">分享你的今日运势</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* 卡片预览 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div
              dangerouslySetInnerHTML={{
                __html: generateCardHtml(cardData, cardData.design)
              }}
              className="border border-gray-200 rounded-xl overflow-hidden"
            />
          </div>

          {/* 操作按钮 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">分享操作</h3>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleCopyLink} variant="outline" className="flex-1">
                📋 复制链接
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                ⬇️ 下载卡片
              </Button>
            </div>
          </div>

          {/* 提示 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-800 mb-2">💡 温馨提示</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 分享卡片可以在社交媒体上展示你的今日运势</li>
              <li>• 可以下载卡片保存到本地相册</li>
              <li>• 卡片链接可在30天内访问</li>
            </ul>
          </div>

          {/* 返回首页 */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all font-semibold"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              返回首页查看运势
            </Link>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="mt-12 py-6 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">星座运势网站 &copy; {new Date().getFullYear()}</p>
          <p className="text-sm text-gray-400">每日运势，仅供娱乐参考</p>
        </div>
      </footer>
    </div>
  );
}
