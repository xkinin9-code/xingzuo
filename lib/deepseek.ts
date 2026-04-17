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
const ZODIAC_LIST = [
  "白羊座", "金牛座", "双子座", "巨蟹座",
  "狮子座", "处女座", "天秤座", "天蝎座",
  "射手座", "摩羯座", "水瓶座", "双鱼座",
];

function getCachePath(date: string): string {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
  return join(CACHE_DIR, `${date}.json`);
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildSinglePrompt(zodiacName: string): string {
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

function buildBatchPrompt(): string {
  return `你是一位专业的占星师。请为以下12个星座一次性生成今日运势：

${ZODIAC_LIST.join("、")}

每个星座包含以下字段，请严格控制字数：
- keyword: 2个字的今日主题词
- overall: 今日整体运势概述（60-90字）
- love: 爱情运势（60-90字）
- career: 事业/学业运势（60-90字）
- health: 健康运势（60-90字）
- wealth: 财富运势（60-90字）
- meditation: 用"我是...，我如..."格式的今日冥想引导语（30-50字）
- dailyMessage: 一句温暖有力的每日寄语（30-50字）

风格要求：诗意、温暖、有哲理，带一点神秘感。

请严格按照以下 JSON 格式返回（不要加 markdown 代码块标记）：
{
  "白羊座": { "keyword": "...", "overall": "...", "love": "...", "career": "...", "health": "...", "wealth": "...", "meditation": "...", "dailyMessage": "..." },
  "金牛座": { ... },
  ...以此类推
}`;
}

function validateFortune(fortune: FortuneTemplate, name?: string): boolean {
  const requiredFields: (keyof FortuneTemplate)[] = [
    "keyword", "overall", "love", "career", "health", "wealth", "meditation", "dailyMessage",
  ];
  for (const field of requiredFields) {
    if (!fortune[field]) {
      console.error(`[DeepSeek] ${name ? name + " " : ""}缺少字段: ${field}`);
      return false;
    }
  }
  return true;
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
          { role: "system", content: "你是一位专业的占星师，擅长用诗意温暖的语言解读星座运势。" },
          { role: "user", content: buildSinglePrompt(zodiacName) },
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

    const cleanContent = content
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();

    const fortune = JSON.parse(cleanContent) as FortuneTemplate;
    if (!validateFortune(fortune, zodiacName)) return null;

    return fortune;
  } catch (err) {
    console.error("[DeepSeek] 生成运势失败:", err);
    return null;
  }
}

/**
 * 一次性生成12星座运势（1次 API 调用）
 */
export async function generateAllZodiacsBatch(): Promise<Record<string, FortuneTemplate> | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.warn("[DeepSeek] API Key 未配置，跳过批量生成");
    return null;
  }

  console.log("[DeepSeek] 开始批量生成12星座运势（1次 API 调用）...");

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
          { role: "system", content: "你是一位专业的占星师，擅长用诗意温暖的语言解读星座运势。请确保返回完整、格式正确的 JSON。" },
          { role: "user", content: buildBatchPrompt() },
        ],
        temperature: 0.8,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[DeepSeek] 批量 API 请求失败:", response.status, errText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error("[DeepSeek] 批量返回内容为空");
      return null;
    }

    const cleanContent = content
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();

    const fortunes = JSON.parse(cleanContent) as Record<string, FortuneTemplate>;

    // 校验所有星座
    for (const name of ZODIAC_LIST) {
      if (!fortunes[name]) {
        console.error(`[DeepSeek] 批量返回缺少星座: ${name}`);
        return null;
      }
      if (!validateFortune(fortunes[name], name)) return null;
    }

    console.log("[DeepSeek] 批量生成成功，12星座全部返回完整");
    return fortunes;
  } catch (err) {
    console.error("[DeepSeek] 批量生成失败:", err);
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

  // 3. 写入缓存（合并已有数据）——在 serverless 环境可能只读，失败则静默忽略
  try {
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
  } catch {
    // serverless 环境文件系统可能只读，忽略写入失败
  }

  return fortune;
}
