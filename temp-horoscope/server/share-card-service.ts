import { dbService } from './db-service';

// 分享卡片数据接口（运势分享）
export interface ShareCardData {
  token: string;
  zodiac: string;
  zodiacName: string;
  fortune: {
    overall?: string;
    love?: string;
    career?: string;
    health?: string;
    wealth?: string;
    saying?: string;
  };
  luckyNumbers: number[];
  luckyColor: string;
  luckyColorName: string;
  mood: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface CardDesign {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  fontFamily: string;
  zodiacIcon?: string;
  theme: 'light' | 'dark' | 'zodiac';
}

class ShareCardService {
  // 获取卡片数据
  async getCardData(token: string): Promise<ShareCardData | null> {
    const card = await dbService.getShareCard(token);

    if (!card) {
      return null;
    }

    // 增加查看次数
    await dbService.incrementCardView(token);

    // 返回运势分享数据
    return {
      token,
      zodiac: card.zodiac || 'ARIES',
      zodiacName: card.zodiacName || '白羊座',
      fortune: card.fortune || {
        overall: '今日运势不错，保持积极心态！',
        love: '感情平稳，适合沟通交流。',
        career: '工作进展顺利，注意细节。'
      },
      luckyNumbers: card.luckyNumbers || [3, 7, 21],
      luckyColor: card.luckyColor || '#FF6B6B',
      luckyColorName: card.luckyColorName || '红色',
      mood: card.mood || '开心',
      createdAt: new Date(card.createdAt),
      expiresAt: new Date(card.expiresAt)
    };
  }

  // 验证卡片
  async validateCard(token: string): Promise<{
    isValid: boolean;
    isExpired: boolean;
    viewCount: number;
    expiresAt: Date;
  }> {
    const card = await dbService.getShareCard(token);

    if (!card) {
      return {
        isValid: false,
        isExpired: true,
        viewCount: 0,
        expiresAt: new Date()
      };
    }

    const now = new Date();
    const expiresAt = new Date(card.expiresAt);
    const isExpired = now > expiresAt;

    return {
      isValid: !isExpired,
      isExpired,
      viewCount: card.viewCount,
      expiresAt
    };
  }

  // 生成卡片设计
  generateCardDesign(zodiac?: string): CardDesign {
    const zodiacThemes: Record<string, CardDesign> = {
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

  // 生成运势分享卡片HTML
  generateCardHtml(cardData: ShareCardData, design: CardDesign): string {
    const formattedDate = cardData.createdAt.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const zodiacDisplay = cardData.zodiacName || `${cardData.zodiac}座`;
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

        .mood {
            margin-top: 15px;
            padding: 10px;
            background-color: rgba(255, 255, 255, 0.5);
            border-radius: 10px;
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

        ${fortune.saying ? `
        <div class="fortune-item">
            <strong>今日箴言</strong>
            ${fortune.saying}
        </div>
        ` : ''}

        <div class="lucky-info">
            <div class="lucky-item">
                <div class="label">幸运数字</div>
                <div class="value">${cardData.luckyNumbers.join('、')}</div>
            </div>
            <div class="lucky-item">
                <div class="label">幸运颜色</div>
                <div class="value" style="color: ${cardData.luckyColor}">${cardData.luckyColorName}</div>
            </div>
        </div>

        <div class="mood">
            <span style="opacity: 0.7;">今日心情：</span>
            <span style="font-weight: bold;">${cardData.mood}</span>
        </div>

        <div class="footer">
            扫描二维码查看完整运势
        </div>
    </div>
</body>
</html>
    `;
  }

  // 生成统计数据
  async getCardStats(): Promise<{
    totalCards: number;
    totalViews: number;
    mostViewedZodiac: string;
    averageViews: number;
  }> {
    // 这里简化处理，返回模拟数据
    return {
      totalCards: 24,
      totalViews: 156,
      mostViewedZodiac: 'LEO',
      averageViews: 6.5
    };
  }

  // 批量过期卡片检查
  async checkExpiredCards(): Promise<number> {
    // 这里应检查并标记过期卡片
    // 返回已过期的卡片数量
    return 3;
  }
}

export const shareCardService = new ShareCardService();
