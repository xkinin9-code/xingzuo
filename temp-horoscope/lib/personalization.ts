/**
 * 个性化规则引擎
 * 基于生日生成个性化运势内容
 */

import { generateBirthdaySeed } from './birthday';
import { getZodiacSign, ZODIAC_INFO, type ZodiacInfo } from './zodiac';

export interface PersonalizationResult {
  luckyNumbers: number[];
  luckyColor: string;
  compatibleSigns: ZodiacInfo[];
  advice: string;
  mood: string;
  focusAreas: string[];
}

// 幸运颜色池
const LUCKY_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#F8C471', '#A569BD',
  '#5DADE2', '#85C1E9', '#FF9FF3', '#54A0FF', '#00D2D3'
];

// 心情描述
const MOODS = [
  '充满活力', '心情愉快', '平静祥和', '充满创意', '积极向上',
  '深思熟虑', '浪漫感性', '务实稳重', '冒险精神', '社交达人'
];

// 建议内容
const ADVICES = [
  '今天适合尝试新的事物，可能会有意外收获。',
  '保持开放的心态，机会可能来自意想不到的地方。',
  '关注细节，小的改进会带来大的变化。',
  '与他人合作会事半功倍，不要单打独斗。',
  '给自己一些独处的时间，思考未来的方向。',
  '财务方面需要谨慎，避免冲动消费。',
  '健康是第一位的，注意休息和饮食。',
  '感情方面需要主动沟通，表达真实感受。',
  '学习新技能的好时机，投资自己永远值得。',
  '帮助他人也会给自己带来好运。'
];

// 关注领域
const FOCUS_AREAS = [
  '事业', '财富', '健康', '感情', '家庭',
  '学习', '社交', '创意', '旅行', '个人成长'
];

/**
 * 生成个性化运势内容
 * @param year 出生年份
 * @param month 出生月份
 * @param day 出生日期
 * @returns 个性化结果
 */
export function generatePersonalization(
  year: number,
  month: number,
  day: number
): PersonalizationResult {
  const seed = generateBirthdaySeed({ year, month, day });
  const zodiac = getZodiacSign(month, day);

  // 使用种子生成确定性随机结果
  const random = createSeededRandom(seed);

  // 生成幸运数字（3个）
  const luckyNumbers = generateLuckyNumbers(seed, month, day);

  // 选择幸运颜色
  const luckyColor = LUCKY_COLORS[Math.floor(random() * LUCKY_COLORS.length)];

  // 生成速配星座（基于星座元素）
  const compatibleSigns = generateCompatibleSigns(zodiac);

  // 选择心情
  const mood = MOODS[Math.floor(random() * MOODS.length)];

  // 选择建议
  const advice = ADVICES[Math.floor(random() * ADVICES.length)];

  // 选择关注领域（3个）
  const focusAreas = generateFocusAreas(seed);

  return {
    luckyNumbers,
    luckyColor,
    compatibleSigns,
    advice,
    mood,
    focusAreas
  };
}

/**
 * 创建种子随机数生成器
 */
function createSeededRandom(seed: number): () => number {
  return function() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

/**
 * 生成幸运数字
 */
function generateLuckyNumbers(seed: number, month: number, day: number): number[] {
  const random = createSeededRandom(seed);
  const numbers = new Set<number>();

  // 添加与生日相关的数字
  numbers.add(month);
  numbers.add(day);
  numbers.add((month + day) % 9 || 9);

  // 添加随机数字直到有3个
  while (numbers.size < 3) {
    numbers.add(Math.floor(random() * 20) + 1);
  }

  return Array.from(numbers).slice(0, 3).sort((a, b) => a - b);
}

/**
 * 生成速配星座（基于星座元素）
 */
function generateCompatibleSigns(zodiac: ZodiacInfo): ZodiacInfo[] {
  // 简单规则：相同元素或相容元素的星座
  const compatibleElements: Record<string, string[]> = {
    fire: ['fire', 'air'],     // 火与火、风相容
    earth: ['earth', 'water'], // 土与土、水相容
    air: ['air', 'fire'],      // 风与风、火相容
    water: ['water', 'earth']  // 水与水、土相容
  };

  const compatibleElementList = compatibleElements[zodiac.element] || [];
  const allZodiacs = Object.values(ZODIAC_INFO);

  // 过滤出相容元素的星座（排除自己）
  return allZodiacs
    .filter(z =>
      z.sign !== zodiac.sign &&
      compatibleElementList.includes(z.element)
    )
    .slice(0, 2); // 取前2个
}

/**
 * 生成关注领域
 */
function generateFocusAreas(seed: number): string[] {
  const random = createSeededRandom(seed);
  const areas = new Set<string>();

  while (areas.size < 3) {
    const index = Math.floor(random() * FOCUS_AREAS.length);
    areas.add(FOCUS_AREAS[index]);
  }

  return Array.from(areas);
}

/**
 * 生成今日运势摘要
 */
export function generateFortuneSummary(
  personalization: PersonalizationResult,
  zodiac: ZodiacInfo
): string {
  return `${zodiac.nameCN}的你今天${personalization.mood}。${personalization.advice} 幸运数字是${personalization.luckyNumbers.join('、')}，幸运颜色是<span style="color:${personalization.luckyColor}">■</span>。`;
}

/**
 * 生成详细运势内容
 */
export function generateDetailedFortune(
  personalization: PersonalizationResult,
  zodiac: ZodiacInfo
): string[] {
  return [
    `今天是${zodiac.nameCN}的好日子！星星们为你带来积极的能量。`,
    `整体运势：${personalization.mood}，${personalization.advice}`,
    `幸运数字：${personalization.luckyNumbers.join('、')}`,
    `幸运颜色：<span style="color:${personalization.luckyColor}">${personalization.luckyColor}</span>`,
    `速配星座：${personalization.compatibleSigns.map(z => z.nameCN).join('、')}`,
    `关注领域：${personalization.focusAreas.join('、')}`,
    `建议：${personalization.advice}`,
    `记住，${zodiac.symbol} ${zodiac.nameCN}的你是${zodiac.description}，相信自己的直觉，勇敢追求所想！`
  ];
}