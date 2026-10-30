import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  Link,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { ArrowLeft, RefreshCw } from "lucide-react";

// フォントとグローバルCSS
import "@fontsource-variable/geist/wght.css";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/500.css";
import "@fontsource/noto-sans-jp/700.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
import "../styles/globals.css";

import { getSiteConfig } from "@/lib/site-config";
import { splitIntoChunks } from "@/lib/chunks";
import { CursorCompass } from "@/components/CursorCompass";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { SplitHeading } from "@/components/SplitHeading";

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

function NotFoundComponent() {
  return (
    <main
      id="main-content"
      className="flex flex-1 items-center justify-center bg-background px-6 py-12 text-foreground"
    >
      <section className="w-full max-w-2xl border-t border-border pt-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-border text-accent">
          <CursorCompass className="h-6 w-6" />
        </div>

        <SplitHeading
          as="p"
          text="404"
          skew
          delayStart={80}
          delayStep={90}
          className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-accent"
        />

        <SplitHeading
          as="h1"
          text="ページが見つかりません"
          chunks={splitIntoChunks("ページが見つかりません")}
          delayStart={260}
          delayStep={26}
          className="mt-3 text-3xl font-semibold tracking-tight text-foreground"
        />

        <p className="mt-4 text-sm leading-[1.9] text-muted">
          URL を確認するか、トップページから目的のページへ戻ってください。
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="focus-ring group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
            トップへ戻る
          </Link>
        </div>
      </section>
    </main>
  );
}

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <RootDocument>
      <main
        id="main-content"
        className="flex flex-1 items-center justify-center bg-background px-6 py-12 text-foreground"
      >
        <section role="alert" className="w-full max-w-2xl border-t border-border pt-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center border border-border text-accent">
            <RefreshCw className="h-6 w-6" aria-hidden="true" />
          </div>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
            Error
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            問題が発生しました
          </h1>

          <p className="mt-4 text-sm leading-[1.9] text-muted">
            予期しないエラーが発生しました。再試行するか、トップページからやり直してください。
          </p>

          {import.meta.env.DEV && error instanceof Error && (
            <pre className="mt-4 overflow-x-auto rounded-sm border border-border bg-surface p-4 text-left font-mono text-xs text-foreground">
              {error.message}
            </pre>
          )}

          <div className="mt-8 flex justify-center gap-6">
            <button
              type="button"
              onClick={reset}
              className="focus-ring inline-flex min-h-11 items-center gap-2 border border-accent bg-accent px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-background transition-opacity hover:opacity-90"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              再試行
            </button>
            <Link
              to="/"
              className="focus-ring group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
            >
              <ArrowLeft
                className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
              トップへ戻る
            </Link>
          </div>
        </section>
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
