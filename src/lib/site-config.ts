import { cookies } from "next/headers";

export type SiteVariant = "portfolio" | "mathkb";

export interface SiteConfig {
  baseUrl: string;
  description: string;
  headline: string;
  keywords: string[];
  locale: string;
  name: string;
  title: string;
  twitterTitle: string;
  variant: SiteVariant;
}

function getConfiguredBaseUrl(variant: SiteVariant) {
  const fallbackUrl =
    variant === "mathkb" ? "http://127.0.0.1:3103" : "https://koshikai.dev";

  return process.env.SITE_URL ?? fallbackUrl;
}

export function getSiteVariant(): SiteVariant {
  return process.env.SITE_VARIANT === "mathkb" ? "mathkb" : "portfolio";
}

export async function getEffectiveVariant(): Promise<SiteVariant> {
  const baseVariant = getSiteVariant();
  if (process.env.NODE_ENV === "production" && baseVariant === "portfolio") {
    return "portfolio";
  }

  try {
    const cookieStore = await cookies();
    const override = cookieStore.get("site-variant")?.value;
    if (override === "mathkb" || override === "portfolio") {
      return override as SiteVariant;
    }
  } catch {
    // cookies() might fail in some contexts, fallback to env
  }
  return baseVariant;
}

export function getSiteConfig(): SiteConfig {
  return getSiteConfigByVariant(getSiteVariant());
}

export async function getEffectiveSiteConfig(): Promise<SiteConfig> {
  const variant = await getEffectiveVariant();
  return getSiteConfigByVariant(variant);
}

export function getSiteConfigByVariant(variant: SiteVariant): SiteConfig {
  if (variant === "mathkb") {
    return {
      variant,
      baseUrl: getConfiguredBaseUrl(variant),
      name: "Private Math Knowledge Base",
      title: "Private Math Knowledge Base",
      twitterTitle: "Private Math Knowledge Base",
      headline: "Research notes for internal use",
      description:
        "数学研究ノートを内部向けに蓄積・検索するためのプライベートナレッジベース。",
      locale: "ja_JP",
      keywords: [
        "math knowledge base",
        "private research notes",
        "PostgreSQL search",
        "MCP",
      ],
    };
  }

  return {
    variant,
    baseUrl: getConfiguredBaseUrl(variant),
    name: "koshikai.dev",
    title: "koshikai.dev | Solving everyday problems with systems",
    twitterTitle: "koshikai.dev | Solving everyday problems with systems",
    headline: "Solving everyday problems with systems",
    description:
      "個人開発者 koshikai のポートフォリオ。自宅サーバー運用やアプリ開発を通して、生活や運用の課題を発見し、実装し、改善する取り組みをまとめています。",
    locale: "ja_JP",
    keywords: [
      "koshikai",
      "個人開発",
      "ポートフォリオ",
      "課題解決",
      "自宅サーバー",
      "運用改善",
      "Next.js",
      "Proxmox",
    ],
  };
}
