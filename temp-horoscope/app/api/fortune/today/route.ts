import { NextRequest, NextResponse } from 'next/server';
import { getZodiacSign } from '@/lib/zodiac';
import { generatePersonalization } from '@/lib/personalization';
import { dbService } from '@/server/db-service';
import { historyManager } from '@/lib/local-history';
import { format } from 'date-fns';
import { aiFortuneService, type FortuneEnhancement } from '@/lib/ai-fortune';

// 运势分类
const FORTUNE_CATEGORIES = ['overall', 'love', 'career', 'health', 'wealth', 'saying'] as const;

// 生成随机运势内容
async function generateFortuneContent(zodiac: string, birthday: Date): Promise<{
  overall: string;
  love: string;
  career: string;
  health: string;
  wealth: string;
  saying: string;
}> {
  const result: any = {};

  for (const category of FORTUNE_CATEGORIES) {
    // 尝试从数据库获取模板
    const templates = await dbService.getFortuneTemplates(zodiac, category);

    if (templates.length > 0) {
      // 加权随机选择
      const totalWeight = templates.reduce((sum, t) => sum + (t.weight || 1), 0);
      let randomWeight = Math.random() * totalWeight;

      for (const template of templates) {
        randomWeight -= (template.weight || 1);
        if (randomWeight <= 0) {
          result[category] = template.content;
          break;
        }
      }
    } else {
      // 备用默认运势
      const defaultFortunes: Record<string, string> = {
        overall: `${zodiac}的你今天整体运势不错，保持积极心态会有好结果。`,
        love: '感情方面需要多沟通，理解对方的想法很重要。',
        career: '工作中可能会有新机会，但要谨慎评估风险。',
        health: '注意休息和饮食，保持规律的生活作息。',
        wealth: '财务方面需要谨慎管理，避免冲动消费。',
        saying: '今日箴言：行动胜过空谈。'
      };
      result[category] = defaultFortunes[category];
    }
  }

  return result;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const birthdayParam = searchParams.get('birthday');

    if (!birthdayParam) {
      return NextResponse.json(
        { error: '请提供生日参数 (birthday=YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    // 解析生日
    const birthday = new Date(birthdayParam);
    if (isNaN(birthday.getTime())) {
      return NextResponse.json(
        { error: '生日格式不正确，请使用 YYYY-MM-DD 格式' },
        { status: 400 }
      );
    }

    // 获取星座
    const zodiac = getZodiacSign(birthday.getMonth() + 1, birthday.getDate());
    if (!zodiac) {
      return NextResponse.json(
        { error: '无法确定星座，请检查生日日期' },
        { status: 400 }
      );
    }

    const today = format(new Date(), 'yyyy-MM-dd');

    // 检查请求是否需要AI润色
    const enhance = searchParams.get('enhance') === 'true';

    // 检查数据库中是否有今天的运势
    let fortuneContent = await dbService.getTodayFortune(zodiac.sign, today);

    // 如果没有，生成新的运势内容
    if (!fortuneContent) {
      const generatedContent = await generateFortuneContent(zodiac.sign, birthday);

      // 存储到数据库
      await dbService.createFortuneContent({
        date: today,
        zodiac: zodiac.sign,
        content: generatedContent,
        aiRefined: false
      });

      fortuneContent = {
        date: today,
        zodiac: zodiac.sign,
        content: generatedContent,
        aiRefined: false
      };
    }

    // 如果需要AI润色，应用润色效果
    let finalFortuneContent: any;
    if (enhance) {
      const categories = ['overall', 'love', 'career', 'health', 'wealth', 'saying'];
      const enhancements = await aiFortuneService.enhanceFortune(
        zodiac.sign,
        birthdayParam,
        categories
      );

      finalFortuneContent = {
        ...fortuneContent,
        aiRefined: true,
        enhancements
      };
    } else {
      finalFortuneContent = fortuneContent;
    }

    // 生成个性化信息
    const personalization = generatePersonalization(
      birthday.getFullYear(),
      birthday.getMonth() + 1,
      birthday.getDate()
    );

    // 获取星座信息
    const zodiacInfo = await dbService.getZodiacInfo(zodiac.sign);

    // 添加到历史记录
    const historyEntry = historyManager.addHistory({
      date: today,
      birthday: birthdayParam,
      zodiac: zodiac.sign,
      fortuneContent: typeof finalFortuneContent.content === 'string'
        ? JSON.parse(finalFortuneContent.content)
        : finalFortuneContent.content,
      personalization: {
        ...personalization,
        compatibleSigns: personalization.compatibleSigns.map(z => z.sign)
      }
    });

    // 构造响应
    const response = {
      success: true,
      data: {
        date: today,
        birthday: birthdayParam,
        zodiac: {
          name: zodiac,
          chineseName: zodiacInfo?.chineseName || zodiac,
          element: zodiacInfo?.element || '未知',
          color: zodiacInfo?.color || '#6B7280'
        },
        fortune: typeof fortuneContent.content === 'string'
          ? JSON.parse(fortuneContent.content)
          : fortuneContent.content,
        personalization,
        historyId: historyEntry.id
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching fortune:', error);
    return NextResponse.json(
      {
        error: '获取运势时发生错误',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthday } = body;

    if (!birthday) {
      return NextResponse.json(
        { error: '请提供生日 (birthday)' },
        { status: 400 }
      );
    }

    // 重定向到GET请求处理
    const url = new URL(request.url);
    url.searchParams.set('birthday', birthday);

    return GET(new NextRequest(url.toString(), request));
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json(
      { error: '请求格式不正确' },
      { status: 400 }
    );
  }
}