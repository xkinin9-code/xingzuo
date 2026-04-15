import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 bg-black/20 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#F5E6C8]/60">
          <p>
            © {currentYear} THE CELESTIAL ORACLE. 版权所有。
          </p>
          <div className="flex items-center space-x-6">
            <Link
              href="#terms"
              className="hover:text-[#D4AF37] transition-colors"
            >
              服务条款
            </Link>
            <Link
              href="#privacy"
              className="hover:text-[#D4AF37] transition-colors"
            >
              隐私政策
            </Link>
            <Link
              href="#contact"
              className="hover:text-[#D4AF37] transition-colors"
            >
              联系我们
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
