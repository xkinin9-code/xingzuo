import { readFileSync, existsSync, copyFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";

function getTodayDate(): string {
  // 使用北京时间 (UTC+8) — GitHub Actions 运行在 UTC 环境
  const d = new Date();
  d.setTime(d.getTime() + 8 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

const today = getTodayDate();
const cachePath = join(process.cwd(), ".cache", "daily-fortune", `${today}.json`);
const outputPath = join(process.cwd(), "public", "api", "fortune", "today.json");

if (!existsSync(cachePath)) {
  console.error(`❌ 缓存文件不存在: ${cachePath}`);
  console.error("   请先运行: npm run generate:daily");
  process.exit(1);
}

mkdirSync(dirname(outputPath), { recursive: true });
copyFileSync(cachePath, outputPath);
console.log(`✅ 静态 API 已生成: ${outputPath}`);
