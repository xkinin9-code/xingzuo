'use client';

import { useState } from 'react';
import Button from './ui/button';

interface ShareCardPreviewProps {
  cardData?: {
    token?: string;
    zodiac?: string;
    fortune?: any;
    luckyNumbers?: number[];
    luckyColor?: string;
    createdAt?: Date;
  };
}

export default function ShareCardPreview({ cardData }: ShareCardPreviewProps) {
  const [cardToken, setCardToken] = useState(cardData?.token || '');
  const [cardDataResult, setCardDataResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 模拟运势分享卡片数据
  const mockCardData = {
    token: 'demo123',
    zodiac: 'ARIES',
    fortune: {
      overall: '今天整体运势不错，适合开展新的计划。',
      love: '感情方面可能会有小惊喜。',
      career: '工作中保持专注会有好结果。'
    },
    luckyNumbers: [3, 7, 21],
    luckyColor: '#FF6B6B',
    createdAt: new Date()
  };

  const handlePreview = async () => {
    if (!cardToken) {
      setError('请输入卡片token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 检查token是否有效（简化版）
      if (cardToken === 'error') {
        setError('卡片不存在或已过期');
        return;
      }

      // 使用模拟数据或传入的数据
      const design = {
        backgroundColor: '#FFEFEF',
        textColor: '#C41E3A',
        borderColor: '#FF6B6B',
        fontFamily: 'Arial, sans-serif',
        zodiacIcon: '♈',
        theme: 'zodiac'
      };

      setCardDataResult({
        ...mockCardData,
        design
      });
    } catch (err) {
      console.error('获取卡片失败:', err);
      setError('获取卡片失败，请检查token是否正确');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const link = window.location.href + `/card/${cardToken}`;
    navigator.clipboard.writeText(link);
    alert('链接已复制到剪贴板！');
  };

  const handleDownloadCard = () => {
    if (!cardDataResult) return;

    const design = cardDataResult.design;
    const html = generateMockCardHtml(cardDataResult, design);

    // 创建临时文件并下载
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `运势分享_${cardDataResult.zodiac}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 生成卡片HTML的辅助函数
  function generateMockCardHtml(cardData: any, design: any): string {
    const formattedDate = cardData.createdAt?.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) || '日期未知';

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
            background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
        }

        .zodiac-icon {
            font-size: 60px;
            margin-bottom: 20px;
        }

        .zodiac-name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .date {
            font-size: 14px;
            margin-bottom: 25px;
            opacity: 0.7;
        }

        .fortune-item {
            font-size: 16px;
            line-height: 1.6;
            margin: 15px 0;
            padding: 12px;
            background-color: rgba(255, 255, 255, 0.5);
            border-radius: 10px;
            text-align: left;
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

        .footer {
            margin-top: 30px;
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

        ${fortune.overall ? `<div class="fortune-item"><strong>综合运势</strong>${fortune.overall}</div>` : ''}
        ${fortune.love ? `<div class="fortune-item"><strong>感情运势</strong>${fortune.love}</div>` : ''}
        ${fortune.career ? `<div class="fortune-item"><strong>事业运势</strong>${fortune.career}</div>` : ''}

        <div class="lucky-info">
            <div class="lucky-item">
                <div style="font-size: 12px; opacity: 0.7;">幸运数字</div>
                <div style="font-weight: bold;">${cardData.luckyNumbers?.join('、') || ''}</div>
            </div>
            <div class="lucky-item">
                <div style="font-size: 12px; opacity: 0.7;">幸运颜色</div>
                <div style="font-weight: bold; color: ${cardData.luckyColor}">${cardData.luckyColor}</div>
            </div>
        </div>

        <div class="footer">
            扫描二维码或访问网站查看完整运势
        </div>
    </div>
</body>
</html>
    `;
  }

  if (cardDataResult) {
    return (
      <div className="w-full bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">运势分享卡片</h3>
          <Button onClick={() => setCardDataResult(null)} variant="outline" size="sm">
            新建卡片
          </Button>
        </div>

        {/* 预览卡片 */}
        <div
          dangerouslySetInnerHTML={{ __html: generateMockCardHtml(cardDataResult, cardDataResult.design) }}
          className="border border-gray-200 rounded-xl overflow-hidden mb-4"
        />

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <Button onClick={handleCopyLink} variant="default" className="flex-1">
            复制链接
          </Button>
          <Button onClick={handleDownloadCard} variant="outline" className="flex-1">
            下载卡片
          </Button>
        </div>

        {/* 卡片信息 */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Token</p>
              <p className="font-mono text-xs break-all">{cardDataResult.token}</p>
            </div>
            <div>
              <p className="text-gray-500">星座</p>
              <p className="font-semibold">{cardDataResult.zodiac}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">运势分享卡片</h3>
      <p className="text-gray-600 text-sm mb-6">
        输入卡片token来预览和分享运势卡片
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            卡片Token
          </label>
          <input
            type="text"
            value={cardToken}
            onChange={(e) => setCardToken(e.target.value)}
            placeholder="输入分享卡片的token"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-mono text-sm"
          />
        </div>

        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-800">
            💡 提示：输入任意token可预览示例卡片，实际功能需要后端支持。
          </p>
        </div>

        <Button
          onClick={handlePreview}
          variant="primary"
          disabled={!cardToken || loading}
          className="w-full"
        >
          {loading ? '加载中...' : '预览卡片'}
        </Button>
      </div>
    </div>
  );
}
