import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "产品",
      links: [
        { href: "/", label: "今日运势" },
        { href: "/history", label: "查询记录" },
        { href: "#features", label: "功能特色" },
        { href: "#faq", label: "常见问题" },
      ],
    },
    {
      title: "支持",
      links: [
        { href: "#help", label: "使用帮助" },
        { href: "#contact", label: "联系我们" },
        { href: "#feedback", label: "意见反馈" },
        { href: "#privacy", label: "隐私政策" },
      ],
    },
    {
      title: "关于",
      links: [
        { href: "#about", label: "关于我们" },
        { href: "#terms", label: "服务条款" },
        { href: "#disclaimer", label: "免责声明" },
        { href: "#version", label: "版本信息" },
      ],
    },
  ];

  const socialLinks = [
    { platform: "微信", icon: "💬" },
    { platform: "微博", icon: "📱" },
    { platform: "GitHub", icon: "🐙" },
  ];

  return (
    <footer className="mt-auto border-t border-gray-200/50 bg-white/60 dark:border-gray-800/50 dark:bg-gray-900/60">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <span className="text-2xl font-bold text-white">♈</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  星座运势每日占卜
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  专业、准确、有趣的星座运势
                </p>
              </div>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              输入生日，获取你的个性化今日星座运势解读。
              涵盖爱情、事业、健康、财运等各方面，每日更新。
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <button
                  key={social.platform}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-lg transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  aria-label={social.platform}
                  title={social.platform}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} 星座运势每日占卜. 保留所有权利.
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              本网站仅供娱乐参考，不构成专业建议.
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="#privacy"
              className="text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            >
              隐私政策
            </Link>
            <Link
              href="#terms"
              className="text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            >
              服务条款
            </Link>
            <Link
              href="#disclaimer"
              className="text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            >
              免责声明
            </Link>
          </div>
        </div>

        {/* 星座装饰 */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-1">
            {["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"].map(
              (symbol, index) => (
                <span
                  key={index}
                  className="text-lg opacity-30 transition-opacity hover:opacity-70"
                  aria-label={`星座符号 ${symbol}`}
                >
                  {symbol}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}