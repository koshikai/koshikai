import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  Link,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";

// フォントとグローバルCSS
import "@fontsource-variable/geist/wght.css";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/500.css";
import "@fontsource/noto-sans-jp/700.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
import "../styles/globals.css";
import "../styles/site-chrome.css";
import "../styles/rdx.css";

import { getSiteConfig } from "@/lib/site-config";
import { pad2 } from "@/lib/format";
import { primaryNav } from "@/lib/navigation";
import { useReveal } from "@/lib/use-reveal";
import { Footer } from "@/components/Footer";
import { SectionHead } from "@/components/rdx";
import { SiteHeader } from "@/components/SiteHeader";

// ライトが既定。明示的にダークを選んだ人だけ、描画前に dark クラスを付け、color-scheme meta を更新する。
const themeInitScript = `
document.documentElement.classList.add("js");
try {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
    var meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.content = "dark";
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = "#131315";
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
        { name: "color-scheme", content: "light" },
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
      ],
    };
  },
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: RootErrorComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

/** 404 とエラーで共通の、行き先の一覧 */
function Destinations() {
  const rows = [{ label: "トップ", href: "/" }, ...primaryNav, { label: "Cases", href: "/cases" }];
  return (
    <nav aria-label="行き先">
      <ol className="rdx-index" data-rv="stagger">
        {rows.map((row, i) => (
          <li key={row.href}>
            <Link to={row.href} className="rdx-index-row">
              <span className="rdx-index-no rdx-mono">{pad2(i + 1)}</span>
              <span className="rdx-index-name">{row.label}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function NotFoundComponent() {
  const ref = useReveal<HTMLElement>();
  return (
    <main id="main-content" className="rdx" ref={ref}>
      <div className="rdx-wrap rdx-page-hero">
        <SectionHead
          as="h1"
          label="404"
          title="ページが見つかりません"
          description="URL を確認するか、下の一覧から目的のページへ進んでください。"
        />
        <Destinations />
      </div>
    </main>
  );
}

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  const ref = useReveal<HTMLElement>();
  return (
    <RootDocument>
      <main id="main-content" className="rdx" ref={ref}>
        <div className="rdx-wrap rdx-page-hero" role="alert">
          <SectionHead
            as="h1"
            label="Error"
            title="問題が発生しました"
            description="予期しないエラーが発生しました。再試行するか、下の一覧からやり直してください。"
          />
          {import.meta.env.DEV && error instanceof Error && (
            <pre className="rdx-mono rdx-error-detail">{error.message}</pre>
          )}
          <div className="rdx-cta rdx-error-actions">
            <button type="button" onClick={reset} className="rdx-btn">
              <RefreshCw aria-hidden="true" />
              再試行
            </button>
          </div>
          <Destinations />
        </div>
      </main>
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
        "TanStack Start",
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
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:outline-2 focus:outline-accent"
        >
          メインコンテンツへスキップ
        </a>
        <div className="site-progress" aria-hidden="true" />
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <div className="site-body flex flex-1 flex-col">{children}</div>
          <Footer />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
