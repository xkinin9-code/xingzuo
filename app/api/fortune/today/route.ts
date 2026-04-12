import { NextRequest, NextResponse } from "next/server";
import { ZodiacSign, getZodiacByBirthday } from "@/lib/zodiac";
import { validateBirthday } from "@/lib/birthday";
import { generatePersonalizedContent } from "@/lib/personalization";

// 模拟运势数据（开发阶段使用）
const mockFortuneData = {
  overall: "今天整体运势较为平稳，是适合规划和调整的好时机。你的直觉在今天会特别敏锐，可以帮助你做出正确的决策。建议保持开放的心态，接受新的想法和机会。",
  love: "单身者今天有机会遇到让你心动的对象，但需要主动一点。有伴侣者适合与另一半进行深入的交流，增进彼此的了解。",
  career: "工作上可能会有新的任务或挑战，但这也是展示你能力的好机会。学习方面，今天适合复习和整理知识。",
  health: "注意保持良好的作息习惯，避免熬夜。适当的运动可以帮助你缓解压力，提升精神状态。",
  wealth: "财务状况稳定，但需要谨慎处理投资决策。今天可能会有一些意外的开销，建议做好预算规划。",
};

// 星座运势模板（实际应用中可以存储在数据库）
const zodiacTemplates: Record<string, typeof mockFortuneData> = {
  白羊座: {
    overall: "白羊座今天充满活力，是行动的好时机。你的热情和自信会感染周围的人，适合开展新的项目或挑战。",
    love: "单身白羊可能会遇到志同道合的人，有伴侣的白羊需要多关注对方的感受。",
    career: "工作中可能会有新的机会出现，勇敢尝试会有不错的结果。",
    health: "注意控制脾气，避免因冲动导致身体不适。适当运动有助于释放能量。",
    wealth: "投资方面需要谨慎，避免冲动消费。可能会有意外的小惊喜。",
  },
  金牛座: {
    overall: "金牛座今天需要保持耐心，有些事情需要时间才能看到结果。稳定和踏实是你的优势。",
    love: "感情方面需要更多的沟通和理解，避免因小事产生误会。",
    career: "工作上按部就班就好，不要急于求成。细节决定成败。",
    health: "注意饮食健康，避免暴饮暴食。适当的休息很重要。",
    wealth: "财务状况稳定，适合进行长期规划。避免不必要的开销。",
  },
  // 其他星座的模板可以继续添加
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const birthday = searchParams.get("birthday");

    // 验证参数
    if (!birthday) {
      return NextResponse.json(
        { error: "缺少生日参数", code: "MISSING_BIRTHDAY" },
        { status: 400 }
      );
    }

    // 验证生日格式
    const validation = validateBirthday(birthday);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error, code: "INVALID_BIRTHDAY" },
        { status: 400 }
      );
    }

    // 判断星座
    const zodiac = getZodiacByBirthday(birthday);

    // 获取运势数据（优先使用模板，否则使用默认数据）
    const fortuneData = zodiacTemplates[zodiac.chineseName] || mockFortuneData;

    // 生成个性化内容
    const personalized = generatePersonalizedContent(birthday, zodiac);

    // 构建响应数据
    const responseData = {
      success: true,
      data: {
        zodiac: {
          sign: zodiac.sign,
          chineseName: zodiac.chineseName,
          englishName: zodiac.englishName,
          color: zodiac.color,
          element: zodiac.element,
        },
        fortune: fortuneData,
        personalized: {
          dayInCycle: personalized.dayInCycle,
          dayInCycleText: personalized.dayInCycleText,
          birthdayTrait: personalized.birthdayTrait,
          timeGreeting: personalized.timeGreeting,
          randomElements: personalized.randomElements,
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          source: "template", // template 或 ai-refined
          wordCount: Object.values(fortuneData).join(" ").length,
        },
      },
    };

    // 设置缓存头（1小时）
    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("获取运势失败:", error);
    return NextResponse.json(
      {
        error: "服务器内部错误",
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}