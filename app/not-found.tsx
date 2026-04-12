import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          页面未找到
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          抱歉，您访问的页面不存在。可能已被移动或删除。
        </p>
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-block w-full rounded-lg bg-primary-600 px-6 py-3 text-center font-medium text-white hover:bg-primary-700 transition-colors"
          >
            返回首页
          </Link>
          <Link
            href="/history"
            className="inline-block w-full rounded-lg border border-gray-300 px-6 py-3 text-center font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            查看历史记录
          </Link>
        </div>
      </div>
    </div>
  );
}