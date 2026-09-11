import type { Metadata, Viewport } from "next";
// Inter は可変フォント1本で全ウェイトを賄う。Noto Sans JP は unicode-range で
// 分割された版を使い、ページに出る文字を含む断片だけを読み込ませる
// （japanese-*.css は分割なしの1ファイル約1MBで、全ページがそれを落としていた）。
import "@fontsource-variable/inter/wght.css";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/500.css";
import "@fontsource/noto-sans-jp/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import { getSiteConfig } from "@/lib/site-config";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fafaf7",
};

export function generateMetadata(): Metadata {
  const site = getSiteConfig();

  return {
    metadataBase: new URL(site.baseUrl),
    title: {
      default: site.title,
      template: "%s | koshikai",
    },
    description: site.description,
    keywords: site.keywords,
    authors: [{ name: "koshikai", url: site.baseUrl }],
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
      title: site.title,
      description: site.description,
      url: site.baseUrl,
      siteName: site.name,
      locale: site.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: site.twitterTitle,
      description: site.description,
      creator: "@siywyk",
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
  };
}

// ライトが既定。明示的にダークを選んだ人だけ、描画前に dark クラスを付ける。
const themeInitScript = `
try {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
} catch {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = getSiteConfig();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "koshikai.dev",
      alternateName: ["koshikai"],
      url: site.baseUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "koshikai",
      url: site.baseUrl,
      jobTitle: "Software Engineer",
      description: site.description,
      sameAs: ["https://github.com/koshikai", "https://x.com/siywyk"],
      knowsAbout: [
        "TypeScript",
        "React",
        "Next.js",
        "Python",
        "PostgreSQL",
        "Docker",
        "Proxmox",
        "CI/CD",
        "LLM",
        "MCP",
        "Reinforcement Learning",
      ],
    },
  ];

  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:outline-2 focus:outline-accent"
        >
          メインコンテンツへスキップ
        </a>
        {/* ヘッダーとフッターは全ページ共通。下層ページや 404 / error が
            「戻る」リンク1本だけの行き止まりにならないようにする。 */}
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
