import type { Metadata, Viewport } from "next";
import "@fontsource/noto-sans-jp/japanese-400.css";
import "@fontsource/noto-sans-jp/japanese-500.css";
import "@fontsource/noto-sans-jp/japanese-700.css";
import "@fontsource/zen-old-mincho/japanese-400.css";
import "@fontsource/zen-old-mincho/japanese-600.css";
import "@fontsource/zen-old-mincho/japanese-700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";
import "./globals.css";
import { getSiteConfig } from "@/lib/site-config";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#131315" },
  ],
};

export function generateMetadata(): Metadata {
  const site = getSiteConfig();

  return {
    metadataBase: new URL(site.baseUrl),
    title: {
      default: site.title,
      template: "%s | koshikai.dev",
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

const themeInitScript = `
try {
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle(
    "dark",
    storedTheme === "dark" || (storedTheme === null && prefersDark),
  );
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
      jobTitle: "Software Developer",
      description: site.description,
      sameAs: ["https://github.com/koshikai"],
      knowsAbout: [
        "Next.js",
        "React",
        "TypeScript",
        "Python",
        "AI Agents",
        "LLMs",
        "MCP",
      ],
    },
  ];

  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Reveal は初期状態が opacity-0 で、可視化を IntersectionObserver に
            依存している。JS が無効だとトップの全セクションが空白になるため、
            その場合だけ CSS で見せる。 */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: ".reveal-root{opacity:1!important;transform:none!important}",
            }}
          />
        </noscript>
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:outline-2 focus:outline-accent"
        >
          メインコンテンツへスキップ
        </a>
        {/* Footer は全ページ共通。下層ページや 404 / error が
            「戻る」リンク1本だけの行き止まりにならないようにする。 */}
        <div className="flex min-h-dvh flex-col">
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </div>
        <ThemeToggle />
      </body>
    </html>
  );
}
