/**
 * 生日处理工具
 * 支持生日验证、格式化、解析等功能
 */

export interface BirthdayInfo {
  year: number;
  month: number;
  day: number;
  isValid: boolean;
  error?: string;
}

/**
 * 验证生日字符串
 * @param birthday 生日字符串，支持格式：YYYY-MM-DD
 * @returns 验证结果
 */
export function validateBirthday(birthday: string): BirthdayInfo {
  // 基本格式检查
  const regex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
  const match = birthday.match(regex);

  if (!match) {
    return {
      year: 0,
      month: 0,
      day: 0,
      isValid: false,
      error: '请输入正确的日期格式，例如：1995-03-21',
    };
  }

  const [, yearStr, monthStr, dayStr] = match;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  // 基本范围检查
  if (year < 1900 || year > new Date().getFullYear()) {
    return {
      year,
      month,
      day,
      isValid: false,
      error: `年份必须在1900-${new Date().getFullYear()}之间`,
    };
  }

  if (month < 1 || month > 12) {
    return {
      year,
      month,
      day,
      isValid: false,
      error: '月份必须在1-12之间',
    };
  }

  // 日期有效性检查
  const lastDayOfMonth = getLastDayOfMonth(year, month);
  if (day < 1 || day > lastDayOfMonth) {
    return {
      year,
      month,
      day,
      isValid: false,
      error: `日期无效，${year}年${month}月最多有${lastDayOfMonth}天`,
    };
  }

  // 不能是未来日期
  const today = new Date();
  const inputDate = new Date(year, month - 1, day);
  if (inputDate > today) {
    return {
      year,
      month,
      day,
      isValid: false,
      error: '生日不能是未来日期',
    };
  }

  return {
    year,
    month,
    day,
    isValid: true,
  };
}

/**
 * 获取月份的最后一天
 */
function getLastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * 格式化日期为YYYY-MM-DD
 */
export function formatBirthday(year: number, month: number, day: number): string {
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  return `${year}-${monthStr}-${dayStr}`;
}

/**
 * 从Date对象格式化生日
 */
export function formatDateToBirthday(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return formatBirthday(year, month, day);
}

/**
 * 解析生日字符串为Date对象
 */
export function parseBirthday(birthday: string): Date | null {
  const info = validateBirthday(birthday);
  if (!info.isValid) {
    return null;
  }
  return new Date(info.year, info.month - 1, info.day);
}

/**
 * 计算年龄
 */
export function calculateAge(birthday: string): number | null {
  const birthDate = parseBirthday(birthday);
  if (!birthDate) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // 如果还没过生日，年龄减1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * 获取生日特质（基于出生日期）
 * @param day 出生日期（1-31）
 * @returns 特质描述
 */
export function getBirthdayTrait(day: number): string {
  if (day >= 1 && day <= 10) {
    return '今日行动力较强，适合主动出击';
  } else if (day >= 11 && day <= 20) {
    return '今日直觉灵敏，宜倾听内心声音';
  } else if (day >= 21 && day <= 31) {
    return '今日合作运佳，多与人交流获益';
  } else {
    return '今日宜保持平和心态，享受当下';
  }
}

/**
 * 根据访问时间获取问候语
 * @param date 访问时间
 * @returns 问候语
 */
export function getTimeGreeting(date: Date = new Date()): string {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return '早晨好，新的一天开始啦！';
  } else if (hour >= 12 && hour < 18) {
    return '下午好，愿你的午后时光充满惊喜';
  } else if (hour >= 18 && hour < 22) {
    return '晚上好，适合回顾一天的美好';
  } else {
    return '夜深了，愿你在星光下找到平静';
  }
}

/**
 * 从生日字符串中提取日期的个位数
 * 用于随机种子生成
 */
export function getBirthdaySeed(birthday: string): number {
  const info = validateBirthday(birthday);
  if (!info.isValid) return 0;

  // 使用日期的个位数
  return info.day % 10;
}