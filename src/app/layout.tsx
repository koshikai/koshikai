import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";

const mPlusRounded1c = M_PLUS_Rounded_1c({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
  variable: "--font-m-plus-rounded",
});

const baseUrl = "https://koshikai.dev";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "koshikai.dev | Building apps that make life better",
    template: "%s | koshikai.dev",
  },
  description: "個人開発者 koshikai のポートフォリオ。禁煙支援アプリ 'no' や、カップル向けアプリ 'Knot' など、「日常をより良くする」プロダクトを開発しています。",
  keywords: ["koshikai", "個人開発", "エンジニア", "ポートフォリオ", "Next.js", "React", "TypeScript", "AIエージェント"],
  authors: [{ name: "koshikai", url: baseUrl }],
  creator: "koshikai",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "koshikai.dev | Building apps that make life better",
    description: "個人開発者 koshikai のポートフォリオ。日常をより良くするプロダクトを開発中。",
    url: baseUrl,
    siteName: "koshikai.dev",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "koshikai.dev | Building apps that make life better",
    description: "個人開発者 koshikai のポートフォリオ。日常をより良くするプロダクトを開発中。",
    creator: "@koshikai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "koshikai",
  url: baseUrl,
  jobTitle: "Software Developer",
  description: "Personal Developer & Creator building apps that make life better.",
  sameAs: [
    "https://github.com/koshikai",
    // Add other social links here
  ],
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Python",
    "AI Agents",
    "LLMs"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${mPlusRounded1c.className} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-900 focus:shadow-lg dark:focus:bg-zinc-900 dark:focus:text-zinc-100"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
