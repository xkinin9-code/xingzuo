import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并多个class名称，处理Tailwind CSS类冲突
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化日期为中文格式
 */
export function formatChineseDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 格式化时间为中文格式（如：上午 10:30）
 */
export function formatChineseTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours < 12 ? "上午" : "下午";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${period} ${formattedHours}:${formattedMinutes}`;
}

/**
 * 生成随机颜色
 */
export function getRandomColor(): string {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#98D8C8", "#6C5B7B", "#F8B195", "#355C7D",
    "#A8E6CF", "#FFAAA5", "#FFD166", "#06D6A0", "#118AB2",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * 截断文本，添加省略号
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * 延迟函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 检查是否在移动设备上
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * 检查是否在微信浏览器中
 */
export function isWechatBrowser(): boolean {
  if (typeof window === "undefined") return false;
  return /MicroMessenger/i.test(navigator.userAgent);
}

/**
 * 格式化金额（保留两位小数）
 */
export function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

/**
 * 获取当前季节
 */
export function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "春季";
  if (month >= 6 && month <= 8) return "夏季";
  if (month >= 9 && month <= 11) return "秋季";
  return "冬季";
}