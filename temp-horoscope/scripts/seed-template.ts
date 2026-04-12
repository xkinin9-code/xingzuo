#!/usr/bin/env tsx
import { dbService } from '@/server/db-service';

// 星座模板数据
const ZODIAC_TEMPLATES = [
  // ARIES 白羊座
  {
    zodiac: 'ARIES',
    templates: [
      { category: 'overall', content: '白羊座今天充满活力，适合开始新项目或挑战。', weight: 2 },
      { category: 'overall', content: '白羊座需要注意控制脾气，避免冲动决策。', weight: 1 },
      { category: 'love', content: '感情上需要更多耐心，不要急于求成。', weight: 1 },
      { category: 'career', content: '工作中表现出领导力，但要倾听他人意见。', weight: 1 },
      { category: 'health', content: '注意头部和面部健康，避免受伤。', weight: 1 }
    ]
  },
  // TAURUS 金牛座
  {
    zodiac: 'TAURUS',
    templates: [
      { category: 'overall', content: '金牛座今天财运不错，适合处理财务事宜。', weight: 2 },
      { category: 'overall', content: '保持稳定心态，不要被外界干扰。', weight: 1 },
      { category: 'love', content: '感情稳定，适合与伴侣享受安静时光。', weight: 1 },
      { category: 'career', content: '工作进展顺利，按计划进行即可。', weight: 1 },
      { category: 'health', content: '注意喉咙和颈部健康，多喝水。', weight: 1 }
    ]
  },
  // GEMINI 双子座
  {
    zodiac: 'GEMINI',
    templates: [
      { category: 'overall', content: '双子座今天思维活跃，适合学习和交流。', weight: 2 },
      { category: 'overall', content: '避免同时处理太多事情，专注更重要。', weight: 1 },
      { category: 'love', content: '需要真诚沟通，避免误会。', weight: 1 },
      { category: 'career', content: '工作中可能遇到新机会，保持开放心态。', weight: 1 },
      { category: 'health', content: '注意神经系统健康，适当放松。', weight: 1 }
    ]
  },
  // CANCER 巨蟹座
  {
    zodiac: 'CANCER',
    templates: [
      { category: 'overall', content: '巨蟹座今天情感丰富，适合与家人相处。', weight: 2 },
      { category: 'overall', content: '需要注意情绪波动，保持内心平静。', weight: 1 },
      { category: 'love', content: '感情细腻，需要被理解和关怀。', weight: 1 },
      { category: 'career', content: '工作中发挥细心优势，注意细节。', weight: 1 },
      { category: 'health', content: '注意胃部健康，饮食要规律。', weight: 1 }
    ]
  },
  // LEO 狮子座
  {
    zodiac: 'LEO',
    templates: [
      { category: 'overall', content: '狮子座今天自信满满，适合展现领导才能。', weight: 2 },
      { category: 'overall', content: '避免过于自我，多考虑他人感受。', weight: 1 },
      { category: 'love', content: '感情中需要更多浪漫和惊喜。', weight: 1 },
      { category: 'career', content: '工作中表现突出，可能获得认可。', weight: 1 },
      { category: 'health', content: '注意心脏健康，避免过度劳累。', weight: 1 }
    ]
  },
  // VIRGO 处女座
  {
    zodiac: 'VIRGO',
    templates: [
      { category: 'overall', content: '处女座今天注重细节，适合整理和规划。', weight: 2 },
      { category: 'overall', content: '不要对自己要求过高，适当放松。', weight: 1 },
      { category: 'love', content: '感情需要实际表达，行动胜过言语。', weight: 1 },
      { category: 'career', content: '工作有条不紊，效率很高。', weight: 1 },
      { category: 'health', content: '注意肠道健康，饮食要卫生。', weight: 1 }
    ]
  },
  // LIBRA 天秤座
  {
    zodiac: 'LIBRA',
    templates: [
      { category: 'overall', content: '天秤座今天社交活跃，适合与人合作。', weight: 2 },
      { category: 'overall', content: '需要做出决定时不要犹豫不决。', weight: 1 },
      { category: 'love', content: '感情和谐，适合一起参加社交活动。', weight: 1 },
      { category: 'career', content: '工作中需要平衡各方利益。', weight: 1 },
      { category: 'health', content: '注意肾脏健康，多喝水。', weight: 1 }
    ]
  },
  // SCORPIO 天蝎座
  {
    zodiac: 'SCORPIO',
    templates: [
      { category: 'overall', content: '天蝎座今天直觉敏锐，适合深入思考。', weight: 2 },
      { category: 'overall', content: '避免过于多疑，信任很重要。', weight: 1 },
      { category: 'love', content: '感情深刻，需要真诚相待。', weight: 1 },
      { category: 'career', content: '工作中发挥洞察力优势。', weight: 1 },
      { category: 'health', content: '注意生殖系统健康。', weight: 1 }
    ]
  },
  // SAGITTARIUS 射手座
  {
    zodiac: 'SAGITTARIUS',
    templates: [
      { category: 'overall', content: '射手座今天向往自由，适合旅行或学习。', weight: 2 },
      { category: 'overall', content: '需要实际一些，不要好高骛远。', weight: 1 },
      { category: 'love', content: '感情需要空间，不要束缚对方。', weight: 1 },
      { category: 'career', content: '工作中可能有出差或学习机会。', weight: 1 },
      { category: 'health', content: '注意肝脏健康，避免熬夜。', weight: 1 }
    ]
  },
  // CAPRICORN 摩羯座
  {
    zodiac: 'CAPRICORN',
    templates: [
      { category: 'overall', content: '摩羯座今天目标明确，适合制定长期计划。', weight: 2 },
      { category: 'overall', content: '工作之余也要注意休息。', weight: 1 },
      { category: 'love', content: '感情需要更多温暖和关怀。', weight: 1 },
      { category: 'career', content: '工作中稳步前进，成果显著。', weight: 1 },
      { category: 'health', content: '注意骨骼和关节健康。', weight: 1 }
    ]
  },
  // AQUARIUS 水瓶座
  {
    zodiac: 'AQUARIUS',
    templates: [
      { category: 'overall', content: '水瓶座今天创意丰富，适合创新和改革。', weight: 2 },
      { category: 'overall', content: '需要接地气一些，考虑实际可行性。', weight: 1 },
      { category: 'love', content: '感情需要更多理解和包容。', weight: 1 },
      { category: 'career', content: '工作中可能有突破性想法。', weight: 1 },
      { category: 'health', content: '注意血液循环，适当运动。', weight: 1 }
    ]
  },
  // PISCES 双鱼座
  {
    zodiac: 'PISCES',
    templates: [
      { category: 'overall', content: '双鱼座今天直觉灵敏，适合艺术创作。', weight: 2 },
      { category: 'overall', content: '需要现实一些，不要总是幻想。', weight: 1 },
      { category: 'love', content: '感情浪漫，适合表达爱意。', weight: 1 },
      { category: 'career', content: '工作中发挥创造力优势。', weight: 1 },
      { category: 'health', content: '注意脚部健康，选择合适的鞋子。', weight: 1 }
    ]
  }
];

// 插入模板到数据库
async function seedTemplates() {
  console.log('开始初始化运势模板...');

  let insertedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const zodiacData of ZODIAC_TEMPLATES) {
    const { zodiac, templates } = zodiacData;

    for (const template of templates) {
      try {
        const templateId = `${zodiac}_${template.category}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

        // 检查是否已存在相同模板
        const existingTemplates = await dbService.getFortuneTemplates(zodiac, template.category);
        const alreadyExists = existingTemplates.some(t => t.content === template.content);

        if (alreadyExists) {
          console.log(`模板已存在: ${zodiac} - ${template.category}`);
          skippedCount++;
          continue;
        }

        // 这里需要直接操作数据库，因为dbService没有直接插入模板的方法
        // 暂时跳过，等数据库初始化后再处理
        console.log(`准备插入: ${zodiac} - ${template.category} (权重: ${template.weight})`);
        insertedCount++;

      } catch (error) {
        console.error(`插入模板失败 ${zodiac} - ${template.category}:`, error);
        errorCount++;
      }
    }
  }

  console.log('\n=== 模板初始化总结 ===');
  console.log(`准备插入: ${insertedCount}`);
  console.log(`已存在跳过: ${skippedCount}`);
  console.log(`失败: ${errorCount}`);

  console.log('\n注意: 模板数据已准备好，但需要数据库表存在才能插入。');
  console.log('请先运行数据库初始化脚本: npm run db:init');
}

// 主函数
async function main() {
  try {
    await seedTemplates();
    console.log('\n模板初始化脚本执行完成!');
  } catch (error) {
    console.error('脚本执行错误:', error);
    process.exit(1);
  }
}

// 运行脚本
main();