/**
 * 星座判断工具函数
 * 基于国际通用星座日期范围
 */

export type ZodiacSign =
  | 'aries'      // 白羊座 3.21-4.19
  | 'taurus'     // 金牛座 4.20-5.20
  | 'gemini'     // 双子座 5.21-6.21
  | 'cancer'     // 巨蟹座 6.22-7.22
  | 'leo'        // 狮子座 7.23-8.22
  | 'virgo'      // 处女座 8.23-9.22
  | 'libra'      // 天秤座 9.23-10.23
  | 'scorpio'    // 天蝎座 10.24-11.22
  | 'sagittarius' // 射手座 11.23-12.21
  | 'capricorn'  // 摩羯座 12.22-1.19
  | 'aquarius'   // 水瓶座 1.20-2.18
  | 'pisces';    // 双鱼座 2.19-3.20

export interface ZodiacInfo {
  sign: ZodiacSign;
  name: string;
  nameCN: string;
  dateRange: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  color: string;
  luckyNumbers: number[];
  symbol: string;
  description: string;
}

// 星座日期范围（月/日）
const ZODIAC_DATE_RANGES: Array<{
  sign: ZodiacSign;
  start: { month: number; day: number };
  end: { month: number; day: number };
}> = [
  { sign: 'aries', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
  { sign: 'taurus', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
  { sign: 'gemini', start: { month: 5, day: 21 }, end: { month: 6, day: 21 } },
  { sign: 'cancer', start: { month: 6, day: 22 }, end: { month: 7, day: 22 } },
  { sign: 'leo', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
  { sign: 'virgo', start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
  { sign: 'libra', start: { month: 9, day: 23 }, end: { month: 10, day: 23 } },
  { sign: 'scorpio', start: { month: 10, day: 24 }, end: { month: 11, day: 22 } },
  { sign: 'sagittarius', start: { month: 11, day: 23 }, end: { month: 12, day: 21 } },
  { sign: 'capricorn', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
  { sign: 'aquarius', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
  { sign: 'pisces', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
];

// 星座详细信息
export const ZODIAC_INFO: Record<ZodiacSign, ZodiacInfo> = {
  aries: {
    sign: 'aries',
    name: 'Aries',
    nameCN: '白羊座',
    dateRange: '3月21日-4月19日',
    element: 'fire',
    color: '#FF6B6B',
    luckyNumbers: [1, 9, 18],
    symbol: '♈',
    description: '充满活力、勇敢、直接的星座'
  },
  taurus: {
    sign: 'taurus',
    name: 'Taurus',
    nameCN: '金牛座',
    dateRange: '4月20日-5月20日',
    element: 'earth',
    color: '#4ECDC4',
    luckyNumbers: [2, 6, 12],
    symbol: '♉',
    description: '稳重、务实、享受生活的星座'
  },
  gemini: {
    sign: 'gemini',
    name: 'Gemini',
    nameCN: '双子座',
    dateRange: '5月21日-6月21日',
    element: 'air',
    color: '#45B7D1',
    luckyNumbers: [3, 5, 14],
    symbol: '♊',
    description: '聪明、好奇、善于交流的星座'
  },
  cancer: {
    sign: 'cancer',
    name: 'Cancer',
    nameCN: '巨蟹座',
    dateRange: '6月22日-7月22日',
    element: 'water',
    color: '#96CEB4',
    luckyNumbers: [2, 7, 11],
    symbol: '♋',
    description: '感性、保护性强、家庭导向的星座'
  },
  leo: {
    sign: 'leo',
    name: 'Leo',
    nameCN: '狮子座',
    dateRange: '7月23日-8月22日',
    element: 'fire',
    color: '#FFEAA7',
    luckyNumbers: [1, 4, 10],
    symbol: '♌',
    description: '自信、慷慨、有领导力的星座'
  },
  virgo: {
    sign: 'virgo',
    name: 'Virgo',
    nameCN: '处女座',
    dateRange: '8月23日-9月22日',
    element: 'earth',
    color: '#DDA0DD',
    luckyNumbers: [5, 14, 23],
    symbol: '♍',
    description: '细心、分析力强、追求完美的星座'
  },
  libra: {
    sign: 'libra',
    name: 'Libra',
    nameCN: '天秤座',
    dateRange: '9月23日-10月23日',
    element: 'air',
    color: '#98D8C8',
    luckyNumbers: [6, 15, 24],
    symbol: '♎',
    description: '和谐、公正、注重关系的星座'
  },
  scorpio: {
    sign: 'scorpio',
    name: 'Scorpio',
    nameCN: '天蝎座',
    dateRange: '10月24日-11月22日',
    element: 'water',
    color: '#F7DC6F',
    luckyNumbers: [8, 11, 18],
    symbol: '♏',
    description: '热情、神秘、有洞察力的星座'
  },
  sagittarius: {
    sign: 'sagittarius',
    name: 'Sagittarius',
    nameCN: '射手座',
    dateRange: '11月23日-12月21日',
    element: 'fire',
    color: '#F8C471',
    luckyNumbers: [3, 12, 21],
    symbol: '♐',
    description: '乐观、爱自由、爱冒险的星座'
  },
  capricorn: {
    sign: 'capricorn',
    name: 'Capricorn',
    nameCN: '摩羯座',
    dateRange: '12月22日-1月19日',
    element: 'earth',
    color: '#A569BD',
    luckyNumbers: [4, 8, 13],
    symbol: '♑',
    description: '负责、有野心、实际的星座'
  },
  aquarius: {
    sign: 'aquarius',
    name: 'Aquarius',
    nameCN: '水瓶座',
    dateRange: '1月20日-2月18日',
    element: 'air',
    color: '#5DADE2',
    luckyNumbers: [4, 7, 11],
    symbol: '♒',
    description: '创新、独立、人道的星座'
  },
  pisces: {
    sign: 'pisces',
    name: 'Pisces',
    nameCN: '双鱼座',
    dateRange: '2月19日-3月20日',
    element: 'water',
    color: '#85C1E9',
    luckyNumbers: [3, 9, 12],
    symbol: '♓',
    description: '富有同情心、直觉强、有艺术气质的星座'
  }
};

/**
 * 根据生日判断星座
 * @param month 月份 (1-12)
 * @param day 日期 (1-31)
 * @returns 星座信息
 */
export function getZodiacSign(month: number, day: number): ZodiacInfo {
  // 验证输入
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error('无效的日期');
  }

  // 特殊处理摩羯座跨年情况
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return ZODIAC_INFO.capricorn;
  }

  // 查找对应的星座
  for (const range of ZODIAC_DATE_RANGES) {
    if (range.sign === 'capricorn') continue; // 已特殊处理

    const isStartMonth = month === range.start.month;
    const isEndMonth = month === range.end.month;

    if (isStartMonth && day >= range.start.day) {
      return ZODIAC_INFO[range.sign];
    }

    if (isEndMonth && day <= range.end.day) {
      return ZODIAC_INFO[range.sign];
    }

    // 如果月份在开始和结束月份之间
    if (month > range.start.month && month < range.end.month) {
      return ZODIAC_INFO[range.sign];
    }
  }

  // 默认返回白羊座（理论上不会执行到这里）
  return ZODIAC_INFO.aries;
}

/**
 * 根据生日计算星座周期天数
 * @param month 月份
 * @param day 日期
 * @returns 在星座周期中的第几天
 */
export function getZodiacCycleDay(month: number, day: number): number {
  const zodiac = getZodiacSign(month, day);
  const range = ZODIAC_DATE_RANGES.find(r => r.sign === zodiac.sign);

  if (!range) return 1;

  // 计算从星座开始日期到当前日期的天数
  const startDate = new Date(2024, range.start.month - 1, range.start.day);
  const currentDate = new Date(2024, month - 1, day);

  // 处理摩羯座跨年情况
  if (zodiac.sign === 'capricorn') {
    if (month === 12) {
      // 12月的日期
      const decStart = new Date(2024, 11, 22); // 12月22日
      const diffTime = currentDate.getTime() - decStart.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } else {
      // 1月的日期
      const janStart = new Date(2024, 0, 1); // 1月1日
      const diffTime = currentDate.getTime() - janStart.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1 + 10; // 加上12月的10天
    }
  }

  const diffTime = currentDate.getTime() - startDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * 获取所有星座信息
 */
export function getAllZodiacs(): ZodiacInfo[] {
  return Object.values(ZODIAC_INFO);
}

/**
 * 根据星座标识获取星座信息
 */
export function getZodiacInfo(sign: ZodiacSign): ZodiacInfo {
  return ZODIAC_INFO[sign];
}