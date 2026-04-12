/**
 * 生日验证和格式化工具
 */

export interface Birthday {
  year: number;
  month: number;
  day: number;
}

export interface BirthdayValidationResult {
  isValid: boolean;
  error?: string;
  birthday?: Birthday;
  formattedDate?: string;
}

/**
 * 验证生日日期是否有效
 * @param year 年份
 * @param month 月份 (1-12)
 * @param day 日期 (1-31)
 * @returns 验证结果
 */
export function validateBirthday(year: number, month: number, day: number): BirthdayValidationResult {
  // 基本范围验证
  if (year < 1900 || year > new Date().getFullYear()) {
    return {
      isValid: false,
      error: `年份必须在1900-${new Date().getFullYear()}之间`
    };
  }

  if (month < 1 || month > 12) {
    return {
      isValid: false,
      error: '月份必须在1-12之间'
    };
  }

  if (day < 1 || day > 31) {
    return {
      isValid: false,
      error: '日期必须在1-31之间'
    };
  }

  // 具体月份天数验证
  const daysInMonth = getDaysInMonth(month, year);
  if (day > daysInMonth) {
    return {
      isValid: false,
      error: `${month}月最多有${daysInMonth}天`
    };
  }

  // 不能是未来日期
  const today = new Date();
  const inputDate = new Date(year, month - 1, day);

  if (inputDate > today) {
    return {
      isValid: false,
      error: '生日不能是未来日期'
    };
  }

  // 不能太古老（超过150岁）
  const age = calculateAge(year, month, day);
  if (age > 150) {
    return {
      isValid: false,
      error: '生日日期过于久远'
    };
  }

  const birthday: Birthday = { year, month, day };

  return {
    isValid: true,
    birthday,
    formattedDate: formatBirthday(birthday)
  };
}

/**
 * 从字符串解析生日（支持YYYY-MM-DD格式）
 */
export function parseBirthdayFromString(dateStr: string): BirthdayValidationResult {
  // 移除空格
  const cleaned = dateStr.trim();

  // 支持 YYYY-MM-DD 格式
  const match = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (!match) {
    return {
      isValid: false,
      error: '请输入正确的日期格式：YYYY-MM-DD'
    };
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  return validateBirthday(year, month, day);
}

/**
 * 从Date对象获取生日
 */
export function getBirthdayFromDate(date: Date): Birthday {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
}

/**
 * 格式化生日显示
 */
export function formatBirthday(birthday: Birthday): string {
  return `${birthday.year}年${birthday.month}月${birthday.day}日`;
}

/**
 * 格式化生日为YYYY-MM-DD
 */
export function formatBirthdayISO(birthday: Birthday): string {
  return `${birthday.year.toString().padStart(4, '0')}-${birthday.month.toString().padStart(2, '0')}-${birthday.day.toString().padStart(2, '0')}`;
}

/**
 * 计算年龄
 */
export function calculateAge(year: number, month: number, day: number): number {
  const today = new Date();
  const birthDate = new Date(year, month - 1, day);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * 获取月份的天数
 */
function getDaysInMonth(month: number, year: number): number {
  // 注意：月份参数是1-12，但Date构造函数需要0-11
  return new Date(year, month, 0).getDate();
}

/**
 * 生成生日占星种子（用于个性化规则）
 */
export function generateBirthdaySeed(birthday: Birthday): number {
  // 使用简单的哈希算法生成一个可重复的种子
  const str = `${birthday.year}-${birthday.month}-${birthday.day}`;
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }

  return Math.abs(hash);
}

/**
 * 获取生日季节
 */
export function getBirthdaySeason(month: number): string {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

/**
 * 获取生日季节（中文）
 */
export function getBirthdaySeasonCN(month: number): string {
  if (month >= 3 && month <= 5) return '春季';
  if (month >= 6 && month <= 8) return '夏季';
  if (month >= 9 && month <= 11) return '秋季';
  return '冬季';
}