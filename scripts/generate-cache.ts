import { getTodayFortuneFromCacheOrAI } from "@/lib/deepseek";

const zodiacNames = [
  "白羊座", "金牛座", "双子座", "巨蟹座",
  "狮子座", "处女座", "天秤座", "天蝎座",
  "射手座", "摩羯座", "水瓶座", "双鱼座",
];

async function main() {
  console.log("开始生成今日 12 星座 AI 运势...\n");
  for (const name of zodiacNames) {
    try {
      const fortune = await getTodayFortuneFromCacheOrAI(name);
      if (fortune) {
        console.log(`✅ ${name}: ${fortune.keyword}`);
      } else {
        console.log(`❌ ${name}: 生成失败`);
      }
    } catch (err) {
      console.error(`❌ ${name}:`, err);
    }
    // 避免触发速率限制，稍微等一下
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log("\n全部生成完毕！");
}

main();
