import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "@fontsource/m-plus-rounded-1c/japanese-400.css";
import "@fontsource/m-plus-rounded-1c/japanese-500.css";
import "@fontsource/m-plus-rounded-1c/japanese-700.css";
import "@fontsource/m-plus-rounded-1c/japanese-800.css";
import "./globals.css";
import { getSiteConfig } from "@/lib/site-config";
import { DevOverlay } from "@/components/DevOverlay";
import { ThemeToggle } from "@/components/ThemeToggle";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffbf0" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1625" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteConfig();
  const isMathKb = site.variant === "mathkb";

  return {
    metadataBase: new URL(site.baseUrl),
    title: {
      default: site.title,
      template: isMathKb ? "%s | Private Math Knowledge Base" : "%s | koshikai.dev",
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
      creator: "@koshikai",
    },
    robots: isMathKb
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
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
}


async function getThemeClass() {
  try {
    const cookieStore = await cookies();
    const theme = cookieStore.get("theme")?.value;
    return theme === "dark" ? "dark" : "";
  } catch {
    return "";
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = getSiteConfig();
  const themeClass = await getThemeClass();
  const jsonLd =
    site.variant === "mathkb"
      ? {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: site.baseUrl,
          description: site.description,
          inLanguage: "ja-JP",
        }
      : {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "koshikai",
          url: site.baseUrl,
          jobTitle: "Software Developer",
          description:
            "Personal Developer & Creator building apps that make life better.",
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
        };

  return (
    <html lang="ja" suppressHydrationWarning className={themeClass}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-900 focus:shadow-lg dark:focus:bg-zinc-900 dark:focus:text-zinc-100"
        >
          メインコンテンツへスキップ
        </a>
        {children}
        <ThemeToggle />
        <DevOverlay />
      </body>
    </html>
  );
}
