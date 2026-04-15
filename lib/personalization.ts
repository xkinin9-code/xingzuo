/**
 * 个性化规则引擎
 * 根据生日生成个性化内容
 */

import { getBirthdaySeed, getBirthdayTrait, getTimeGreeting } from './birthday';
import { ZodiacInfo, getDayInZodiacCycle, ZODIAC_RANGES, ZodiacSign } from './zodiac';

export interface PersonalizedContent {
  // 星座周期位置
  dayInCycle: number;
  dayInCycleText: string;

  // 生日特质
  birthdayTrait: string;

  // 访问时间问候
  timeGreeting: string;

  // 随机元素（基于种子）
  randomElements: {
    luckyNumber: number;
    luckyColor: string;
    colorIntensity: string; // 颜色强度描述
    matchedZodiacs: string[]; // 速配星座
    saying: string; // 今日箴言
    luckyColorName: string; // 幸运颜色名称
    luckyDirection: string; // 幸运方位
    luckyAccessory: string; // 吉祥饰品
    starRating: number; // 星级评分 1-5
  };

  // 当月星象
  currentZodiacSeason: {
    sign: ZodiacSign;
    chineseName: string;
    englishName: string;
    symbol: string;
  };
}

/**
 * 获取当月星象（太阳星座）
 */
export function getCurrentZodiacSeason(date: Date = new Date()): PersonalizedContent['currentZodiacSeason'] {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const zodiac = ZODIAC_RANGES.find(z => {
    if (z.sign === ZodiacSign.CAPRICORN) {
      return (month === 12 && day >= 22) || (month === 1 && day <= 19);
    }
    // 检查是否在该星座范围内
    const isStartMonth = month === z.startMonth;
    const isEndMonth = month === z.endMonth;
    return (
      (isStartMonth && day >= z.startDay) ||
      (isEndMonth && day < z.endDay) ||
      (month > z.startMonth && month < z.endMonth)
    );
  }) || ZODIAC_RANGES[0];

  const symbolMap: Record<string, string> = {
    白羊座: "♈",
    金牛座: "♉",
    双子座: "♊",
    巨蟹座: "♋",
    狮子座: "♌",
    处女座: "♍",
    天秤座: "♎",
    天蝎座: "♏",
    射手座: "♐",
    摩羯座: "♑",
    水瓶座: "♒",
    双鱼座: "♓",
  };

  return {
    sign: zodiac.sign,
    chineseName: zodiac.chineseName,
    englishName: zodiac.englishName,
    symbol: symbolMap[zodiac.chineseName] || "♈",
  };
}

/**
 * 生成个性化内容
 * @param birthday 生日字符串 (YYYY-MM-DD)
 * @param zodiac 星座信息
 * @param currentDate 当前日期（可选，默认为现在）
 */
export function generatePersonalizedContent(
  birthday: string,
  zodiac: ZodiacInfo,
  currentDate: Date = new Date()
): PersonalizedContent {
  const birthdaySeed = getBirthdaySeed(birthday);
  const dateSeed = currentDate.getDate() + currentDate.getMonth() * 31;
  const combinedSeed = birthdaySeed + dateSeed;

  // 计算星座周期天数
  const dayInCycle = getDayInZodiacCycle(zodiac, currentDate);
  const dayInCycleText = `今天是你在${zodiac.chineseName}的第${dayInCycle}天`;

  // 获取生日特质
  const [, , dayStr] = birthday.split('-');
  const day = parseInt(dayStr, 10);
  const birthdayTrait = getBirthdayTrait(day);

  // 获取时间问候
  const timeGreeting = getTimeGreeting(currentDate);

  // 生成随机元素
  const randomElements = generateRandomElements(zodiac, combinedSeed, currentDate);

  // 当月星象
  const currentZodiacSeason = getCurrentZodiacSeason(currentDate);

  return {
    dayInCycle,
    dayInCycleText,
    birthdayTrait,
    timeGreeting,
    randomElements,
    currentZodiacSeason,
  };
}

/**
 * 生成随机元素（基于种子确保一致性）
 */
function generateRandomElements(
  zodiac: ZodiacInfo,
  seed: number,
  date: Date
): PersonalizedContent['randomElements'] {
  // 使用种子生成伪随机但一致的值
  const pseudoRandom = (index: number): number => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };

  // 幸运数字（1-9）
  const luckyNumber = Math.floor(pseudoRandom(1) * 9) + 1;

  // 幸运颜色（基于星座颜色微调）
  const colorVariations = [
    { intensity: '柔和', modifier: 0.8 },
    { intensity: '明亮', modifier: 1.0 },
    { intensity: '深沉', modifier: 0.6 },
    { intensity: '淡雅', modifier: 0.9 },
  ];
  const colorIndex = Math.floor(pseudoRandom(2) * colorVariations.length);
  const colorIntensity = colorVariations[colorIndex].intensity;
  const luckyColor = zodiac.color; // 实际应用中可能需要颜色转换

  // 速配星座（1-2个，排除自己）
  const allZodiacs = [
    '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座',
    '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'
  ];
  const otherZodiacs = allZodiacs.filter(z => z !== zodiac.chineseName);
  const matchCount = Math.floor(pseudoRandom(3) * 2) + 1; // 1-2个
  const matchedZodiacs: string[] = [];

  for (let i = 0; i < matchCount; i++) {
    const index = Math.floor(pseudoRandom(4 + i) * otherZodiacs.length);
    const matched = otherZodiacs[index];
    if (!matchedZodiacs.includes(matched)) {
      matchedZodiacs.push(matched);
    }
  }

  // 今日箴言
  const sayings = [
    '行动是成功的阶梯，行动越多，登得越高。',
    '今天的选择，决定明天的生活。',
    '心怀感恩，所遇皆温柔。',
    '每一步都算数，每一天都珍贵。',
    '保持热爱，奔赴山海。',
    '简单生活，快乐自来。',
    '心有多大，舞台就有多大。',
    '今天的努力，是明天的实力。',
    '微笑面对，一切都会好起来。',
    '活在当下，珍惜眼前。',
    '梦想不会逃跑，逃跑的永远是自己。',
    '越努力，越幸运。',
  ];
  const sayingIndex = Math.floor(pseudoRandom(5) * sayings.length);
  const saying = sayings[sayingIndex];

  // 幸运颜色名称
  const colorNames = [
    '克莱因蓝', '勃艮第红', '薄荷绿', '琥珀金', '星空紫',
    '珊瑚橙', '冰川银', '蔷薇粉', '翡翠绿', '琉璃黄',
    '月白青', '朱砂红', '黛蓝', '秋香褐', '樱草紫'
  ];
  const luckyColorName = colorNames[Math.floor(pseudoRandom(6) * colorNames.length)];

  // 幸运方位
  const directions = ['东方', '南方', '西方', '北方', '东南方', '东北方', '西南方', '西北方'];
  const luckyDirection = directions[Math.floor(pseudoRandom(7) * directions.length)];

  // 吉祥饰品
  const accessories = [
    '月光石手链', '复古银质项链', '编织手绳', '水晶耳环',
    '星座吊坠', '檀木手串', '珍珠胸针', '流星戒指',
    '星云耳钉', '守护符挂件', '金丝眼镜链', '皮革手环'
  ];
  const luckyAccessory = accessories[Math.floor(pseudoRandom(8) * accessories.length)];

  // 星级评分（3-5星）
  const starRating = Math.floor(pseudoRandom(9) * 3) + 3;

  return {
    luckyNumber,
    luckyColor,
    colorIntensity,
    matchedZodiacs,
    saying,
    luckyColorName,
    luckyDirection,
    luckyAccessory,
    starRating,
  };
}

/**
 * 生成完整运势内容（合并主内容和个性化）
 */
export function generateCompleteFortune(
  mainContent: {
    overall: string;
    love: string;
    career: string;
    health: string;
    wealth: string;
  },
  personalized: PersonalizedContent
): string {
  const { randomElements } = personalized;

  const sections = [
    `🌟 ${personalized.timeGreeting}`,
    '',
    `📅 ${personalized.dayInCycleText}`,
    `✨ ${personalized.birthdayTrait}`,
    '',
    '📊 整体运势',
    mainContent.overall,
    '',
    '💖 爱情运势',
    mainContent.love,
    '',
    '💼 事业学业',
    mainContent.career,
    '',
    '🏥 健康状态',
    mainContent.health,
    '',
    '💰 财运',
    mainContent.wealth,
    '',
    '🎯 今日提示',
    `幸运数字：${randomElements.luckyNumber}`,
    `幸运颜色：${randomElements.colorIntensity}${randomElements.luckyColor}`,
    `速配星座：${randomElements.matchedZodiacs.join('、')}`,
    '',
    '💫 今日箴言',
    randomElements.saying,
  ];

  return sections.join('\n');
}

/**
 * 计算运势内容的估计字数
 */
export function estimateWordCount(content: string): number {
  // 简单的中文字数估算：中文字符数量
  const chineseChars = content.match(/[\u4e00-\u9fa5]/g);
  const chineseCount = chineseChars ? chineseChars.length : 0;

  // 加上其他字符的权重
  const otherChars = content.length - (chineseChars?.length || 0);

  // 粗略估算：中文字符1字，其他字符0.3字
  return Math.round(chineseCount + otherChars * 0.3);
}

/**
 * 验证运势内容长度是否符合要求（500-600字）
 */
export function validateContentLength(
  content: string,
  minWords: number = 500,
  maxWords: number = 600
): { isValid: boolean; wordCount: number; message: string } {
  const wordCount = estimateWordCount(content);

  if (wordCount < minWords) {
    return {
      isValid: false,
      wordCount,
      message: `内容过短，当前${wordCount}字，需要至少${minWords}字`,
    };
  }

  if (wordCount > maxWords) {
    return {
      isValid: false,
      wordCount,
      message: `内容过长，当前${wordCount}字，最多${maxWords}字`,
    };
  }

  return {
    isValid: true,
    wordCount,
    message: `内容长度合适：${wordCount}字`,
  };
}
