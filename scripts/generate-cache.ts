import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { generateAllZodiacsBatch, generateFortuneWithDeepSeek } from "@/lib/deepseek";

// 手动加载 .env.local（tsx 默认不加载）
const envPath = join(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}

const zodiacNames = [
  "白羊座", "金牛座", "双子座", "巨蟹座",
  "狮子座", "处女座", "天秤座", "天蝎座",
  "射手座", "摩羯座", "水瓶座", "双鱼座",
];

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function getCachePath(date: string): string {
  return join(process.cwd(), ".cache", "daily-fortune", `${date}.json`);
}

function checkCachedZodiacs(): string[] {
  const today = getTodayDate();
  const cachePath = getCachePath(today);

  if (!existsSync(cachePath)) return [];

  try {
    const cache = JSON.parse(readFileSync(cachePath, "utf-8"));
    return Object.keys(cache.fortunes || {}).filter((name) =>
      zodiacNames.includes(name)
    );
  } catch {
    return [];
  }
}

async function generateOneByOne(missing: string[]) {
  console.log(`逐个生成缺失的 ${missing.length} 个星座...\n`);
  for (const name of missing) {
    try {
      const fortune = await generateFortuneWithDeepSeek(name);
      if (fortune) {
        console.log(`✅ ${name}: ${fortune.keyword}`);
      } else {
        console.log(`❌ ${name}: 生成失败`);
      }
    } catch (err) {
      console.error(`❌ ${name}:`, err);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
}

async function main() {
  const today = getTodayDate();
  const cached = checkCachedZodiacs();
  const missing = zodiacNames.filter((name) => !cached.includes(name));

  console.log(`📅 日期: ${today}`);
  console.log(`✅ 已缓存: ${cached.length}/12  (${cached.join(", ") || "无"})`);
  console.log(`⏳ 待生成: ${missing.length}/12  (${missing.join(", ") || "无"})\n`);

  if (missing.length === 0) {
    console.log("🎉 今日12星座运势已全部生成完毕，无需重复调用 API。");
    console.log("   如需重新生成，请手动删除 .cache/daily-fortune/" + today + ".json");
    return;
  }

  const cachePath = getCachePath(today);

  // 优先尝试一次性批量生成（1次 API 调用）
  console.log("🚀 尝试一次性批量生成12星座运势...\n");
  const batchResult = await generateAllZodiacsBatch();

  if (batchResult) {
    // 批量成功：合并到缓存（保留已有的）
    let cache: any = { date: today, fortunes: {}, generatedAt: new Date().toISOString() };
    if (existsSync(cachePath)) {
      try { cache = JSON.parse(readFileSync(cachePath, "utf-8")); } catch { /* ignore */ }
    }
    for (const name of zodiacNames) {
      if (batchResult[name]) {
        cache.fortunes[name] = batchResult[name];
        console.log(`✅ ${name}: ${batchResult[name].keyword}`);
      }
    }
    cache.generatedAt = new Date().toISOString();
    writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf-8");
    console.log("\n🎉 批量生成成功并写入缓存！");
  } else {
    // 批量失败：fallback 到逐个生成
    console.log("\n⚠️ 批量生成失败，切换到逐个生成模式...\n");
    await generateOneByOne(missing);
  }

  console.log("\n🎉 全部生成完毕！");
  console.log("   缓存文件: .cache/daily-fortune/" + today + ".json");
}

main();
