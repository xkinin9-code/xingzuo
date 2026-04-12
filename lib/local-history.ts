/**
 * 本地历史记录管理
 * 使用localStorage存储用户查询历史
 */

export interface HistoryRecord {
  id: string;
  birthday: string;
  zodiac: string;
  zodiacEnglish: string;
  queryTime: number; // 时间戳
  fortuneContent?: {
    // 可选：存储部分运势内容用于历史展示
    overall?: string;
    luckyNumber?: number;
    luckyColor?: string;
  };
}

export interface HistoryStats {
  totalQueries: number;
  mostFrequentZodiac: string;
  firstQueryDate: number | null;
  lastQueryDate: number | null;
}

const STORAGE_KEY = 'horoscope_history';
const MAX_RECORDS = 50; // 最大保存记录数

/**
 * 获取所有历史记录
 */
export function getAllHistory(): HistoryRecord[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const historyJson = localStorage.getItem(STORAGE_KEY);
    if (!historyJson) return [];

    const records = JSON.parse(historyJson) as HistoryRecord[];
    // 按查询时间倒序排序
    return records.sort((a, b) => b.queryTime - a.queryTime);
  } catch (error) {
    console.error('读取历史记录失败:', error);
    return [];
  }
}

/**
 * 添加历史记录
 */
export function addHistoryRecord(
  birthday: string,
  zodiac: string,
  zodiacEnglish: string,
  fortuneContent?: HistoryRecord['fortuneContent']
): HistoryRecord {
  const records = getAllHistory();

  // 创建新记录
  const newRecord: HistoryRecord = {
    id: generateId(),
    birthday,
    zodiac,
    zodiacEnglish,
    queryTime: Date.now(),
    fortuneContent,
  };

  // 添加到开头
  records.unshift(newRecord);

  // 限制记录数量
  const limitedRecords = records.slice(0, MAX_RECORDS);

  // 保存到localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedRecords));
  } catch (error) {
    console.error('保存历史记录失败:', error);
    // 如果存储失败，尝试清理旧记录
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      clearOldRecords(limitedRecords.slice(0, Math.floor(MAX_RECORDS / 2)));
    }
  }

  return newRecord;
}

/**
 * 删除历史记录
 */
export function deleteHistoryRecord(id: string): boolean {
  const records = getAllHistory();
  const initialLength = records.length;
  const filteredRecords = records.filter(record => record.id !== id);

  if (filteredRecords.length === initialLength) {
    return false; // 未找到记录
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
    return true;
  } catch (error) {
    console.error('删除历史记录失败:', error);
    return false;
  }
}

/**
 * 清空所有历史记录
 */
export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('清空历史记录失败:', error);
  }
}

/**
 * 获取历史统计信息
 */
export function getHistoryStats(): HistoryStats {
  const records = getAllHistory();

  if (records.length === 0) {
    return {
      totalQueries: 0,
      mostFrequentZodiac: '暂无',
      firstQueryDate: null,
      lastQueryDate: null,
    };
  }

  // 统计星座频率
  const zodiacCount: Record<string, number> = {};
  records.forEach(record => {
    zodiacCount[record.zodiac] = (zodiacCount[record.zodiac] || 0) + 1;
  });

  let mostFrequentZodiac = '';
  let maxCount = 0;
  Object.entries(zodiacCount).forEach(([zodiac, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentZodiac = zodiac;
    }
  });

  return {
    totalQueries: records.length,
    mostFrequentZodiac,
    firstQueryDate: records[records.length - 1]?.queryTime || null,
    lastQueryDate: records[0]?.queryTime || null,
  };
}

/**
 * 按星座筛选历史记录
 */
export function getHistoryByZodiac(zodiac: string): HistoryRecord[] {
  const records = getAllHistory();
  return records.filter(record => record.zodiac === zodiac);
}

/**
 * 检查是否有重复查询（相同生日，24小时内）
 */
export function hasRecentDuplicate(birthday: string, hoursThreshold: number = 24): boolean {
  const records = getAllHistory();
  const now = Date.now();
  const threshold = hoursThreshold * 60 * 60 * 1000;

  return records.some(record =>
    record.birthday === birthday &&
    (now - record.queryTime) < threshold
  );
}

/**
 * 导出历史记录
 */
export function exportHistory(): string {
  const records = getAllHistory();
  return JSON.stringify(records, null, 2);
}

/**
 * 导入历史记录
 */
export function importHistory(historyJson: string): boolean {
  try {
    const records = JSON.parse(historyJson) as HistoryRecord[];

    // 验证数据格式
    if (!Array.isArray(records)) {
      throw new Error('历史记录格式不正确');
    }

    // 验证每个记录的基本字段
    for (const record of records) {
      if (!record.id || !record.birthday || !record.zodiac || !record.queryTime) {
        throw new Error('历史记录字段不完整');
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('导入历史记录失败:', error);
    return false;
  }
}

/**
 * 生成唯一ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * 清理旧记录（当存储空间不足时）
 */
function clearOldRecords(recordsToKeep: HistoryRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recordsToKeep));
  } catch (error) {
    console.error('清理旧记录失败:', error);
    // 如果仍然失败，尝试清空
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * 获取存储使用情况
 */
export function getStorageUsage(): { used: number; percent: number } {
  if (typeof window === 'undefined') {
    return { used: 0, percent: 0 };
  }

  try {
    const historyJson = localStorage.getItem(STORAGE_KEY) || '';
    const used = historyJson.length * 2; // 近似字节数（UTF-16）
    const max = 5 * 1024 * 1024; // 5MB（localStorage典型限制）
    const percent = (used / max) * 100;

    return { used, percent };
  } catch (error) {
    return { used: 0, percent: 0 };
  }
}