import type { Metadata } from "next";
import { Inter, Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import MusicPlayer from "@/components/MusicPlayer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://xingzuo-opal.vercel.app"),
  title: "寰宇神谕 | 输入生日查看今日运势",
  description: "免费星座运势查询，输入生日即可获取个性化的今日星座运势解读。涵盖爱情、事业、健康、财运等方面，无需注册，完全免费。",
  keywords: ["星座运势", "今日运势", "星座查询", "生日运势", "星座占卜", "星座运势每日更新"],
  authors: [{ name: "寰宇神谕" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://xingzuo-opal.vercel.app",
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
        className={`${inter.variable} ${notoSansSC.variable} ${notoSerifSC.variable} font-sans min-h-screen antialiased`}
      >
        <div className="relative min-h-screen flex flex-col">
          <main className="flex-1 w-full relative">
            {children}
          </main>
        </div>
        <MusicPlayer />
      </body>
    </html>
  );
}
