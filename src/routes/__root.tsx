import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

// フォントとグローバルCSS
import "@fontsource-variable/geist/wght.css";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/500.css";
import "@fontsource/noto-sans-jp/700.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
import "../styles/globals.css";

import { getSiteConfig } from "@/lib/site-config";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";

// ライトが既定。明示的にダークを選んだ人だけ、描画前に dark クラスを付ける。
const themeInitScript = `
document.documentElement.classList.add("js");
try {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
} catch {}
`;

export const Route = createRootRoute({
  head: () => {
    const site = getSiteConfig();
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#fafaf7" },
        { title: site.title },
        { name: "description", content: site.description },
        { name: "keywords", content: site.keywords.join(", ") },
        { property: "og:title", content: site.title },
        { property: "og:description", content: site.description },
        { property: "og:url", content: site.baseUrl },
        { property: "og:site_name", content: site.name },
        { property: "og:locale", content: site.locale },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: site.twitterTitle },
        { name: "twitter:description", content: site.description },
        { name: "twitter:creator", content: site.twitterHandle },
      ],
      links: [
        { rel: "icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/apple-icon.png" },
        { rel: "manifest", href: "/manifest.json" },
        { rel: "canonical", href: site.baseUrl },
      ],
    };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
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
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:outline-2 focus:outline-accent"
        >
          メインコンテンツへスキップ
        </a>
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
