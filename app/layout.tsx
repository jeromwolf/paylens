import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PayLens - 내 연봉은 상위 몇%?",
  description: "연봉만 입력하면 바로 알 수 있는 내 소득 순위. 한국과 미국 비교까지!",
  keywords: "연봉, 소득, 상위, 순위, 연봉계산기, 연봉비교, salary, income, rank",
  openGraph: {
    title: "PayLens - 내 연봉은 상위 몇%?",
    description: "연봉만 입력하면 바로 알 수 있는 내 소득 순위",
    type: "website",
    locale: "ko_KR",
    url: "https://paylens.com",
    siteName: "PayLens",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} font-sans antialiased bg-white`}>
        <Header />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
