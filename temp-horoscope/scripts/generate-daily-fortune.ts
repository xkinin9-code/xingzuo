#!/usr/bin/env tsx
import { dbService } from '@/server/db-service';
import { format } from 'date-fns';

// 运势模板
const FORTUNE_TEMPLATES = {
  overall: [
    "今天整体运势不错，保持积极心态会有好结果。",
    "需要特别注意细节，避免粗心大意。",
    "适合开展新计划，行动力是关键。",
    "运势平稳，适合处理日常事务。",
    "可能会有意外惊喜，保持开放心态。"
  ],
  love: [
    "感情方面需要多沟通，理解对方的想法很重要。",
    "单身者有机会遇到心仪对象，勇敢表达自己。",
    "关系中需要更多浪漫和惊喜。",
    "避免因小事争吵，多体谅对方。",
    "感情稳定，适合深入发展关系。"
  ],
  career: [
    "工作中可能会有新机会，但要谨慎评估风险。",
    "与同事合作愉快，团队精神很重要。",
    "需要提升专业技能，学习新知识。",
    "项目进展顺利，保持当前节奏。",
    "可能会有工作变动，保持灵活性。"
  ],
  health: [
    "注意休息和饮食，保持规律的生活作息。",
    "适合进行体育锻炼，增强体质。",
    "注意心理健康，适当放松压力。",
    "身体状况良好，继续保持。",
    "注意季节变化，预防感冒。"
  ],
  wealth: [
    "财务方面需要谨慎管理，避免冲动消费。",
    "可能会有额外收入，合理规划使用。",
    "投资需谨慎，不要盲目跟风。",
    "财务状况稳定，适合储蓄计划。",
    "注意控制开支，避免超支。"
  ],
  saying: [
    "今日箴言：行动胜过空谈。",
    "今日箴言：耐心是成功的关键。",
    "今日箴言：细节决定成败。",
    "今日箴言：机会留给有准备的人。",
    "今日箴言：相信自己，你能行。"
  ]
};

// 星座列表
const ZODIAC_SIGNS = [
  'ARIES', 'TAURUS', 'GEMINI', 'CANCER', 'LEO', 'VIRGO',
  'LIBRA', 'SCORPIO', 'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES'
];

// 随机选择模板
function getRandomTemplate(category: keyof typeof FORTUNE_TEMPLATES): string {
  const templates = FORTUNE_TEMPLATES[category];
  return templates[Math.floor(Math.random() * templates.length)];
}

// 生成今日运势
async function generateDailyFortunes() {
  const today = format(new Date(), 'yyyy-MM-dd');
  console.log(`Generating daily fortunes for: ${today}`);

  let generatedCount = 0;
  let errorCount = 0;

  for (const zodiac of ZODIAC_SIGNS) {
    try {
      // 检查是否已存在今日运势
      const existing = await dbService.getTodayFortune(zodiac, today);
      if (existing) {
        console.log(`Fortune for ${zodiac} already exists, skipping...`);
        continue;
      }

      // 生成运势内容
      const fortuneContent = {
        overall: getRandomTemplate('overall'),
        love: getRandomTemplate('love'),
        career: getRandomTemplate('career'),
        health: getRandomTemplate('health'),
        wealth: getRandomTemplate('wealth'),
        saying: getRandomTemplate('saying')
      };

      // 保存到数据库
      await dbService.createFortuneContent({
        date: today,
        zodiac,
        content: fortuneContent,
        aiRefined: false
      });

      console.log(`✓ Generated fortune for ${zodiac}`);
      generatedCount++;
    } catch (error) {
      console.error(`✗ Error generating fortune for ${zodiac}:`, error);
      errorCount++;
    }
  }

  console.log('\n=== Generation Summary ===');
  console.log(`Total zodiac signs: ${ZODIAC_SIGNS.length}`);
  console.log(`Successfully generated: ${generatedCount}`);
  console.log(`Failed: ${errorCount}`);
  console.log(`Date: ${today}`);

  if (errorCount > 0) {
    console.log('\nNote: Some fortunes failed to generate. Check the errors above.');
  }
}

// 主函数
async function main() {
  try {
    await generateDailyFortunes();
    console.log('\nDaily fortune generation completed!');
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

// 运行脚本
main();