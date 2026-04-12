/**
 * 星座判断工具
 * 采用国际通用的星座日期范围
 */

export enum ZodiacSign {
  ARIES = '白羊座',
  TAURUS = '金牛座',
  GEMINI = '双子座',
  CANCER = '巨蟹座',
  LEO = '狮子座',
  VIRGO = '处女座',
  LIBRA = '天秤座',
  SCORPIO = '天蝎座',
  SAGITTARIUS = '射手座',
  CAPRICORN = '摩羯座',
  AQUARIUS = '水瓶座',
  PISCES = '双鱼座',
}

export interface ZodiacInfo {
  sign: ZodiacSign;
  chineseName: string;
  englishName: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  color: string; // 代表色
  element: string; // 元素
}

/**
 * 星座日期范围定义
 * 包含起始日，不包含结束日
 */
export const ZODIAC_RANGES: ZodiacInfo[] = [
  {
    sign: ZodiacSign.ARIES,
    chineseName: '白羊座',
    englishName: 'Aries',
    startMonth: 3,
    startDay: 21,
    endMonth: 4,
    endDay: 20,
    color: '#FF6B6B',
    element: '火',
  },
  {
    sign: ZodiacSign.TAURUS,
    chineseName: '金牛座',
    englishName: 'Taurus',
    startMonth: 4,
    startDay: 20,
    endMonth: 5,
    endDay: 21,
    color: '#4ECDC4',
    element: '土',
  },
  {
    sign: ZodiacSign.GEMINI,
    chineseName: '双子座',
    englishName: 'Gemini',
    startMonth: 5,
    startDay: 21,
    endMonth: 6,
    endDay: 22,
    color: '#45B7D1',
    element: '风',
  },
  {
    sign: ZodiacSign.CANCER,
    chineseName: '巨蟹座',
    englishName: 'Cancer',
    startMonth: 6,
    startDay: 22,
    endMonth: 7,
    endDay: 23,
    color: '#96CEB4',
    element: '水',
  },
  {
    sign: ZodiacSign.LEO,
    chineseName: '狮子座',
    englishName: 'Leo',
    startMonth: 7,
    startDay: 23,
    endMonth: 8,
    endDay: 23,
    color: '#FFEAA7',
    element: '火',
  },
  {
    sign: ZodiacSign.VIRGO,
    chineseName: '处女座',
    englishName: 'Virgo',
    startMonth: 8,
    startDay: 23,
    endMonth: 9,
    endDay: 23,
    color: '#DDA0DD',
    element: '土',
  },
  {
    sign: ZodiacSign.LIBRA,
    chineseName: '天秤座',
    englishName: 'Libra',
    startMonth: 9,
    startDay: 23,
    endMonth: 10,
    endDay: 24,
    color: '#98D8C8',
    element: '风',
  },
  {
    sign: ZodiacSign.SCORPIO,
    chineseName: '天蝎座',
    englishName: 'Scorpio',
    startMonth: 10,
    startDay: 24,
    endMonth: 11,
    endDay: 23,
    color: '#6C5B7B',
    element: '水',
  },
  {
    sign: ZodiacSign.SAGITTARIUS,
    chineseName: '射手座',
    englishName: 'Sagittarius',
    startMonth: 11,
    startDay: 23,
    endMonth: 12,
    endDay: 22,
    color: '#F8B195',
    element: '火',
  },
  {
    sign: ZodiacSign.CAPRICORN,
    chineseName: '摩羯座',
    englishName: 'Capricorn',
    startMonth: 12,
    startDay: 22,
    endMonth: 1,
    endDay: 20,
    color: '#355C7D',
    element: '土',
  },
  {
    sign: ZodiacSign.AQUARIUS,
    chineseName: '水瓶座',
    englishName: 'Aquarius',
    startMonth: 1,
    startDay: 20,
    endMonth: 2,
    endDay: 19,
    color: '#A8E6CF',
    element: '风',
  },
  {
    sign: ZodiacSign.PISCES,
    chineseName: '双鱼座',
    englishName: 'Pisces',
    startMonth: 2,
    startDay: 19,
    endMonth: 3,
    endDay: 21,
    color: '#FFAAA5',
    element: '水',
  },
];

/**
 * 根据生日判断星座
 * @param month 月份 (1-12)
 * @param day 日期 (1-31)
 * @returns 星座信息
 */
export function getZodiacByDate(month: number, day: number): ZodiacInfo {
  // 检查摩羯座（跨年情况）
  if ((month === 12 && day >= 22) || (month === 1 && day < 20)) {
    return ZODIAC_RANGES.find(z => z.sign === ZodiacSign.CAPRICORN)!;
  }

  // 检查其他星座
  for (const zodiac of ZODIAC_RANGES) {
    // 跳过摩羯座（已处理）
    if (zodiac.sign === ZodiacSign.CAPRICORN) continue;

    // 检查是否在该星座范围内
    const isStartMonth = month === zodiac.startMonth;
    const isEndMonth = month === zodiac.endMonth;

    if (
      (isStartMonth && day >= zodiac.startDay) ||
      (isEndMonth && day < zodiac.endDay) ||
      (month > zodiac.startMonth && month < zodiac.endMonth)
    ) {
      return zodiac;
    }
  }

  // 默认返回白羊座（理论上不会执行到这里）
  return ZODIAC_RANGES[0];
}

/**
 * 根据生日字符串判断星座
 * @param birthday 生日字符串，格式：YYYY-MM-DD
 * @returns 星座信息
 */
export function getZodiacByBirthday(birthday: string): ZodiacInfo {
  const [year, monthStr, dayStr] = birthday.split('-');
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  return getZodiacByDate(month, day);
}

/**
 * 计算今天是星座周期的第几天
 * @param zodiac 星座信息
 * @param currentDate 当前日期，默认为今天
 * @returns 第几天（1开始）
 */
export function getDayInZodiacCycle(
  zodiac: ZodiacInfo,
  currentDate: Date = new Date()
): number {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  // 计算星座起始日期
  let startYear = currentYear;
  let startMonth = zodiac.startMonth;
  let startDay = zodiac.startDay;

  // 处理摩羯座跨年情况
  if (zodiac.sign === ZodiacSign.CAPRICORN) {
    if (currentMonth === 12 && currentDay >= 22) {
      // 当前日期在12月22日之后，星座从今年12月22日开始
      startYear = currentYear;
    } else if (currentMonth === 1 && currentDay < 20) {
      // 当前日期在1月20日之前，星座从去年12月22日开始
      startYear = currentYear - 1;
    }
  } else if (currentMonth < zodiac.startMonth ||
             (currentMonth === zodiac.startMonth && currentDay < zodiac.startDay)) {
    // 如果当前日期在星座开始日期之前，星座从去年开始
    startYear = currentYear - 1;
  }

  const startDate = new Date(startYear, startMonth - 1, startDay);
  const diffTime = currentDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays + 1; // 第1天开始
}

/**
 * 获取所有星座信息
 */
export function getAllZodiacs(): ZodiacInfo[] {
  return ZODIAC_RANGES;
}

/**
 * 根据英文名称获取星座信息
 */
export function getZodiacByEnglishName(englishName: string): ZodiacInfo | undefined {
  return ZODIAC_RANGES.find(z =>
    z.englishName.toLowerCase() === englishName.toLowerCase()
  );
}

/**
 * 根据中文名称获取星座信息
 */
export function getZodiacByChineseName(chineseName: string): ZodiacInfo | undefined {
  return ZODIAC_RANGES.find(z => z.chineseName === chineseName);
}