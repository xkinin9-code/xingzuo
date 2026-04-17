import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

interface FortuneTemplate {
  keyword: string;
  overall: string;
  love: string;
  career: string;
  health: string;
  wealth: string;
  meditation: string;
  dailyMessage: string;
}

const CACHE_DIR = join(process.cwd(), ".cache", "daily-fortune");

function getCachePath(date: string): string {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
  return join(CACHE_DIR, `${date}.json`);
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildPrompt(zodiacName: string): string {
  return `请为"${zodiacName}"生成今日运势，要求：

1. 风格：诗意、温暖、有哲理，带一点神秘感，像塔罗师或占星师的口吻
2. 每个字段 80-150 字左右
3. 用中文输出

请严格按照以下 JSON 格式返回（不要加 markdown 代码块标记）：

{
  "keyword": "2个字的今日主题词",
  "overall": "今日整体运势概述",
  "love": "爱情运势",
  "career": "事业/学业运势",
  "health": "健康运势",
  "wealth": "财富运势",
  "meditation": "用'我是...，我如...'格式的今日冥想引导语",
  "dailyMessage": "一句温暖有力的每日寄语，作为送给用户的话"
}`;
}

export async function generateFortuneWithDeepSeek(
  zodiacName: string
): Promise<FortuneTemplate | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.warn("[DeepSeek] API Key 未配置，跳过 AI 生成");
    return null;
  }

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "你是一位专业的占星师，擅长用诗意温暖的语言解读星座运势。",
          },
          {
            role: "user",
            content: buildPrompt(zodiacName),
          },
        ],
        temperature: 0.8,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[DeepSeek] API 请求失败:", response.status, errText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error("[DeepSeek] 返回内容为空");
      return null;
    }

    // 清理可能的 markdown 代码块
    const cleanContent = content
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();

    const fortune = JSON.parse(cleanContent) as FortuneTemplate;

    // 简单校验字段完整性
    const requiredFields: (keyof FortuneTemplate)[] = [
      "keyword",
      "overall",
      "love",
      "career",
      "health",
      "wealth",
      "meditation",
      "dailyMessage",
    ];
    for (const field of requiredFields) {
      if (!fortune[field]) {
        console.error(`[DeepSeek] 返回数据缺少字段: ${field}`);
        return null;
      }
    }

    return fortune;
  } catch (err) {
    console.error("[DeepSeek] 生成运势失败:", err);
    return null;
  }
}

interface DailyFortunes {
  date: string;
  fortunes: Record<string, FortuneTemplate>;
  generatedAt: string;
}

export async function getTodayFortuneFromCacheOrAI(
  zodiacName: string
): Promise<FortuneTemplate | null> {
  const today = getTodayDate();
  const cachePath = getCachePath(today);

  // 1. 检查缓存
  if (existsSync(cachePath)) {
    try {
      const cache: DailyFortunes = JSON.parse(readFileSync(cachePath, "utf-8"));
      if (cache.fortunes[zodiacName]) {
        console.log(`[DeepSeek] 命中缓存: ${today} ${zodiacName}`);
        return cache.fortunes[zodiacName];
      }
    } catch {
      // 缓存损坏，继续生成
    }
  }

  // 2. 调用 DeepSeek 生成
  console.log(`[DeepSeek] 开始生成: ${today} ${zodiacName}`);
  const fortune = await generateFortuneWithDeepSeek(zodiacName);
  if (!fortune) return null;

  // 3. 写入缓存（合并已有数据）
  let cache: DailyFortunes = { date: today, fortunes: {}, generatedAt: new Date().toISOString() };
  if (existsSync(cachePath)) {
    try {
      cache = JSON.parse(readFileSync(cachePath, "utf-8"));
    } catch {
      // 忽略损坏的缓存
    }
  }
  cache.fortunes[zodiacName] = fortune;
  cache.generatedAt = new Date().toISOString();
  writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf-8");

  return fortune;
}
