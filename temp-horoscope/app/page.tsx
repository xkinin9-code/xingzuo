'use client';

import { useState } from 'react';
import Link from 'next/link';
import BirthdayForm from '@/components/BirthdayForm';
import HistoryList from '@/components/HistoryList';
import Button from '@/components/ui/button';
import { getZodiacSign, type ZodiacInfo } from '@/lib/zodiac';
import { generatePersonalization } from '@/lib/personalization';

// 模拟的运势模板
const FORTUNE_TEMPLATES: Record<string, string[]> = {
  aries: [
    "白羊座的你今天是行动力爆棚的一天！",
    "事业方面，大胆尝试新项目会有意想不到的收获。",
    "感情上，主动表达会让你更接近心仪的对象。",
    "健康方面，注意劳逸结合，避免过度劳累。",
    "幸运提示：红色是你的幸运色，穿红色衣物能增强能量。"
  ],
  taurus: [
    "金牛座的你今天适合稳定发展，不宜冒险。",
    "财务方面，保守投资会有稳定回报。",
    "感情上，细心体贴会让关系更加融洽。",
    "健康方面，注意饮食均衡，避免暴饮暴食。",
    "幸运提示：绿色是你的幸运色，接触自然能带来好运。"
  ],
  gemini: [
    "双子座的你今天思维敏捷，沟通顺畅。",
    "事业方面，合作项目会进展顺利。",
    "感情上，真诚交流能化解误会。",
    "健康方面，注意呼吸道健康。",
    "幸运提示：黄色是你的幸运色，佩戴黄色饰品能提升运势。"
  ],
  cancer: [
    "巨蟹座的你今天情绪敏感，需要更多关怀。",
    "家庭方面，与家人共度时光会带来温暖。",
    "感情上，表达内心感受能让关系更深。",
    "健康方面，注意肠胃健康。",
    "幸运提示：银色是你的幸运色。"
  ],
  leo: [
    "狮子座的你今天充满自信，魅力四射。",
    "事业方面，展现领导才能会得到认可。",
    "感情上，浪漫举动能让感情升温。",
    "健康方面，注意心脏健康。",
    "幸运提示：金色是你的幸运色。"
  ]
};

type FortuneState = {
  birthday: { year: number; month: number; day: number } | null;
  zodiac: ZodiacInfo | null;
  personalization: any | null;
  fortuneContent: string[];
  showResult: boolean;
  showHistory: boolean;
};

export default function Home() {
  const [state, setState] = useState<FortuneState>({
    birthday: null,
    zodiac: null,
    personalization: null,
    fortuneContent: [],
    showResult: false,
    showHistory: false
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleBirthdaySubmit = async (birthday: { year: number; month: number; day: number }) => {
    setIsLoading(true);

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // 获取星座信息
      const zodiac = getZodiacSign(birthday.month, birthday.day);

      // 生成个性化内容
      const personalization = generatePersonalization(birthday.year, birthday.month, birthday.day);

      // 获取运势内容（使用模板或模拟数据）
      const fortuneContent = FORTUNE_TEMPLATES[zodiac.sign] || [
        `${zodiac.nameCN}的你今天运势平稳。`,
        '保持积极心态，好运自然来。',
        '注意与同事的沟通方式。',
        '感情方面需要更多耐心。',
        `幸运数字：${personalization.luckyNumbers.join('、')}`
      ];

      setState({
        birthday,
        zodiac,
        personalization,
        fortuneContent,
        showResult: true,
        showHistory: false
      });

      // 模拟保存到本地历史记录
      const historyItem = {
        date: new Date().toISOString(),
        birthday,
        zodiac: zodiac.sign,
        summary: `${zodiac.nameCN}今日运势`
      };

      // 保存到 localStorage（实际项目中应在组件中实现）
      try {
        const existingHistory = JSON.parse(localStorage.getItem('horoscope-history') || '[]');
        existingHistory.unshift(historyItem);
        localStorage.setItem('horoscope-history', JSON.stringify(existingHistory.slice(0, 10))); // 只保留最近10条
      } catch (err) {
        console.log('本地历史记录保存失败，但运势正常显示');
      }

    } catch (error) {
      console.error('生成运势时出错:', error);
      alert('生成运势时出现错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setState({
      birthday: null,
      zodiac: null,
      personalization: null,
      fortuneContent: [],
      showResult: false,
      showHistory: false
    });
  };

  const formatBirthdayDisplay = () => {
    if (!state.birthday) return '';
    return `${state.birthday.year}年${state.birthday.month}月${state.birthday.day}日`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* 头部 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">♈</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">星座运势</h1>
                  <p className="text-sm text-gray-600">根据生日生成你的今日运势</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/history"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                📋 历史记录
              </Link>
              <Link
                href="/analytics"
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                📊 数据分析
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 引导语 */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              探索你的星座运势
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              输入你的生日，系统将自动判断你的星座并生成专属的今日运势报告。
              无需注册，完全免费。
            </p>
          </div>

          {!state.showResult ? (
            // 生日输入表单
            <div className="mb-12">
              <BirthdayForm
                onSubmit={handleBirthdaySubmit}
                isLoading={isLoading}
              />
            </div>
          ) : (
            // 运势结果显示
            <div className="space-y-8">
              {/* 结果头部 */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                      style={{ backgroundColor: state.zodiac?.color || '#8B5CF6' }}
                    >
                      <span className="text-white">{state.zodiac?.symbol}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {state.zodiac?.nameCN}今日运势
                      </h2>
                      <p className="text-gray-600">
                        生日：{formatBirthdayDisplay()}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="md"
                  >
                    重新查询
                  </Button>
                </div>

                {/* 个性化信息 */}
                {state.personalization && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-700 mb-2">幸运数字</h3>
                      <div className="flex space-x-2">
                        {state.personalization.luckyNumbers.map((num: number, index: number) => (
                          <div
                            key={index}
                            className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold"
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-700 mb-2">幸运颜色</h3>
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-lg"
                          style={{ backgroundColor: state.personalization.luckyColor }}
                        />
                        <span className="font-medium">
                          {state.personalization.luckyColor}
                        </span>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-700 mb-2">今日心情</h3>
                      <p className="text-lg font-medium">{state.personalization.mood}</p>
                    </div>
                  </div>
                )}

                {/* 运势内容 */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">今日运势详解</h3>
                  {state.fortuneContent.map((content, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{content}</p>
                    </div>
                  ))}
                </div>

                {/* 功能按钮 */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button
                    onClick={() => setState(prev => ({ ...prev, showHistory: !prev.showHistory }))}
                    variant="outline"
                    size="md"
                    className="flex-1"
                  >
                    📋 {state.showHistory ? '隐藏历史' : '历史记录'}
                  </Button>
                </div>

                {/* 历史记录面板 */}
                {state.showHistory && (
                  <div className="mt-6">
                    <HistoryList onClear={() => setState(prev => ({ ...prev, showHistory: false }))} />
                  </div>
                )}

                {/* 速配星座 */}
                {state.personalization?.compatibleSigns && state.personalization.compatibleSigns.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">速配星座</h3>
                    <div className="flex flex-wrap gap-3">
                      {state.personalization.compatibleSigns.map((sign: ZodiacInfo, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg"
                        >
                          <span className="text-xl">{sign.symbol}</span>
                          <span className="font-medium">{sign.nameCN}</span>
                          <span className="text-sm text-gray-500">{sign.dateRange}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 行动建议 */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-3">行动建议</h3>
                <p className="mb-4">{state.personalization?.advice || '保持积极心态，好运自然来。'}</p>
                <div className="flex flex-wrap gap-3">
                  {state.personalization?.focusAreas?.map((area: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* 功能提示 */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">📱</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">手机优先</h4>
                    <p className="text-sm text-gray-600">专为移动设备优化，随时随地查看运势</p>
                  </div>

                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">🔒</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">隐私保护</h4>
                    <p className="text-sm text-gray-600">无需注册，历史记录仅保存在本地</p>
                  </div>

                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">✨</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">每日更新</h4>
                    <p className="text-sm text-gray-600">运势内容每日更新，每天都有新发现</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 使用说明 */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">使用说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">如何开始？</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
                    <span>在上方输入你的出生年月日</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
                    <span>点击"查看今日运势"按钮</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
                    <span>查看专属你的星座运势报告</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">注意事项</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600">•</span>
                    <span>运势内容仅供参考，请勿过度依赖</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600">•</span>
                    <span>历史记录保存在浏览器本地，清空浏览器数据会丢失</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600">•</span>
                    <span>支持国际通用的星座日期范围</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="mt-12 py-6 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">星座运势网站 &copy; {new Date().getFullYear()}</p>
          <p className="text-sm text-gray-400">仅供娱乐参考，运势内容每日更新</p>
        </div>
      </footer>
    </div>
  );
}