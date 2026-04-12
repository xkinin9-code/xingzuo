import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 星座主题颜色
        zodiac: {
          aries: '#FF6B6B', // 白羊座 - 红色
          taurus: '#4ECDC4', // 金牛座 - 青色
          gemini: '#45B7D1', // 双子座 - 蓝色
          cancer: '#96CEB4', // 巨蟹座 - 绿色
          leo: '#FFEAA7', // 狮子座 - 黄色
          virgo: '#DDA0DD', // 处女座 - 紫色
          libra: '#98D8C8', // 天秤座 - 薄荷色
          scorpio: '#6C5B7B', // 天蝎座 - 深紫色
          sagittarius: '#F8B195', // 射手座 - 橙色
          capricorn: '#355C7D', // 摩羯座 - 深蓝色
          aquarius: '#A8E6CF', // 水瓶座 - 浅绿色
          pisces: '#FFAAA5', // 双鱼座 - 粉红色
        },
        // 应用主题
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // 运势模块颜色
        fortune: {
          love: '#fecdd3', // 爱情 - 粉红
          career: '#bbf7d0', // 事业 - 绿色
          health: '#dbeafe', // 健康 - 蓝色
          wealth: '#fef3c7', // 财运 - 黄色
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
        chinese: [
          'PingFang SC',
          'Microsoft YaHei',
          'Hiragino Sans GB',
          'WenQuanYi Micro Hei',
          'sans-serif',
        ],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      },
      backgroundImage: {
        'gradient-zodiac': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-stars': 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
        'gradient-constellation': 'linear-gradient(180deg, #1e3c72 0%, #2a5298 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'zodiac': '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 20px rgba(99, 102, 241, 0.1)',
        'fortune': '0 4px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}

export default config