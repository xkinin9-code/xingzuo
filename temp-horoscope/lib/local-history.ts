import { format } from 'date-fns';

export interface FortuneHistory {
  id: string;
  date: string; // 查询日期
  birthday: string; // 生日 YYYY-MM-DD
  zodiac: string; // 星座
  fortuneContent: {
    overall: string;
    love: string;
    career: string;
    health: string;
    wealth: string;
    saying: string;
  };
  personalization: {
    luckyNumbers: number[];
    luckyColor: string;
    compatibleSigns: string[];
    mood: string;
    advice: string;
  };
  timestamp: number;
}

export interface HistoryStats {
  totalQueries: number;
  mostFrequentZodiac: string;
  lastQueryDate: string | null;
  queryDates: string[];
  zodiacCounts: Record<string, number>;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  recentActivity: {
    last7Days: number;
    last30Days: number;
  };
}

class LocalHistoryManager {
  private readonly STORAGE_KEY = 'horoscope_fortune_history';
  private readonly MAX_HISTORY = 50;

  // 添加历史记录
  addHistory(history: Omit<FortuneHistory, 'id' | 'timestamp'>): FortuneHistory {
    const histories = this.getAllHistories();
    const newHistory: FortuneHistory = {
      ...history,
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    // 添加到开头
    histories.unshift(newHistory);

    // 限制历史记录数量
    if (histories.length > this.MAX_HISTORY) {
      histories.splice(this.MAX_HISTORY);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(histories));
    return newHistory;
  }

  // 获取所有历史记录
  getAllHistories(): FortuneHistory[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to read history from localStorage:', error);
      return [];
    }
  }

  // 获取最近的历史记录
  getRecentHistories(limit: number = 10): FortuneHistory[] {
    const histories = this.getAllHistories();
    return histories.slice(0, limit);
  }

  // 按星座筛选历史记录
  getHistoriesByZodiac(zodiac: string): FortuneHistory[] {
    const histories = this.getAllHistories();
    return histories.filter(h => h.zodiac === zodiac);
  }

  // 按日期筛选历史记录
  getHistoriesByDate(date: string): FortuneHistory[] {
    const histories = this.getAllHistories();
    return histories.filter(h => h.date === date);
  }

  // 删除历史记录
  deleteHistory(id: string): boolean {
    const histories = this.getAllHistories();
    const initialLength = histories.length;
    const filtered = histories.filter(h => h.id !== id);

    if (filtered.length !== initialLength) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  }

  // 清空历史记录
  clearAllHistories(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // 获取统计信息
  getStats(): HistoryStats {
    const histories = this.getAllHistories();

    if (histories.length === 0) {
      return {
        totalQueries: 0,
        mostFrequentZodiac: '无',
        lastQueryDate: null,
        queryDates: [],
        zodiacCounts: {},
        dateRange: {
          startDate: '',
          endDate: ''
        },
        recentActivity: {
          last7Days: 0,
          last30Days: 0
        }
      };
    }

    // 计算星座频率
    const zodiacCounts: Record<string, number> = {};
    histories.forEach(history => {
      zodiacCounts[history.zodiac] = (zodiacCounts[history.zodiac] || 0) + 1;
    });

    // 找出最常见的星座
    let mostFrequentZodiac = '';
    let maxCount = 0;
    for (const [zodiac, count] of Object.entries(zodiacCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentZodiac = zodiac;
      }
    }

    // 获取查询日期
    const queryDates = [...new Set(histories.map(h => h.date))].sort().reverse();

    // 计算日期范围
    const dates = histories.map(h => new Date(h.date).getTime());
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    // 计算最近7天和30天的查询次数
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const recent7Days = histories.filter(h => new Date(h.date).getTime() >= sevenDaysAgo).length;
    const recent30Days = histories.filter(h => new Date(h.date).getTime() >= thirtyDaysAgo).length;

    return {
      totalQueries: histories.length,
      mostFrequentZodiac,
      lastQueryDate: histories[0]?.date || null,
      queryDates,
      zodiacCounts,
      dateRange: {
        startDate: minDate.toISOString().split('T')[0],
        endDate: maxDate.toISOString().split('T')[0]
      },
      recentActivity: {
        last7Days: recent7Days,
        last30Days: recent30Days
      }
    };
  }

  // 获取按星座的详细统计
  getZodiacStats(): Record<string, {
    count: number;
    percentage: number;
    lastQueried: string | null;
  }> {
    const stats = this.getStats();
    const total = stats.totalQueries || 1; // 避免除以0

    const result: Record<string, {
      count: number;
      percentage: number;
      lastQueried: string | null;
    }> = {};

    for (const [zodiac, count] of Object.entries(stats.zodiacCounts)) {
      result[zodiac] = {
        count,
        percentage: Math.round((count / total) * 100),
        lastQueried: this.getHistoriesByZodiac(zodiac).at(0)?.date || null
      };
    }

    return result;
  }

  // 获取按日期的统计
  getDateStats(days: number = 30): {
    date: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }[] {
    const histories = this.getAllHistories();
    const today = new Date();
    const dateMap: Record<string, number> = {};
    const result: {
      date: string;
      count: number;
      trend: 'up' | 'down' | 'stable';
    }[] = [];

    // 初始化最近N天
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap[dateStr] = 0;
    }

    // 统计每天的数量
    histories.forEach(history => {
      if (dateMap[history.date] !== undefined) {
        dateMap[history.date] = (dateMap[history.date] || 0) + 1;
      }
    });

    // 转换为数组
    for (const [date, count] of Object.entries(dateMap)) {
      result.push({ date, count, trend: 'stable' });
    }

    // 计算趋势
    for (let i = 1; i < result.length; i++) {
      if (result[i].count > result[i - 1].count) {
        result[i].trend = 'up';
      } else if (result[i].count < result[i - 1].count) {
        result[i].trend = 'down';
      }
    }

    return result;
  }

  // 导出历史记录
  exportHistories(): string {
    const histories = this.getAllHistories();
    return JSON.stringify(histories, null, 2);
  }

  // 导入历史记录
  importHistories(jsonString: string): boolean {
    try {
      const histories = JSON.parse(jsonString);

      // 验证数据结构
      if (!Array.isArray(histories)) {
        throw new Error('Invalid data format');
      }

      // 简单验证每个条目
      for (const history of histories) {
        if (!history.id || !history.date || !history.zodiac) {
          throw new Error('Invalid history entry');
        }
      }

      localStorage.setItem(this.STORAGE_KEY, jsonString);
      return true;
    } catch (error) {
      console.error('Failed to import histories:', error);
      return false;
    }
  }
}

export const historyManager = new LocalHistoryManager();