import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "寰宇神谕 | 输入生日查看今日运势",
  description: "免费星座运势查询，输入生日即可获取个性化的今日星座运势解读。涵盖爱情、事业、健康、财运等方面，无需注册，完全免费。",
  keywords: ["星座运势", "今日运势", "星座查询", "生日运势", "星座占卜", "星座运势每日更新"],
  authors: [{ name: "寰宇神谕" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://horoscope.example.com",
    title: "寰宇神谕",
    description: "输入生日，获取你的今日星座运势",
    siteName: "寰宇神谕",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "寰宇神谕",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "寰宇神谕",
    description: "输入生日，获取你的今日星座运势",
    images: ["/og-image.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans min-h-screen antialiased`}
      >
        <div className="relative min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 w-full relative">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
