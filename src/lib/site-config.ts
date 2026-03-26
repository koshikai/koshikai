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
    variant === "mathkb" ? "http://127.0.0.1:3003" : "https://koshikai.dev";

  return process.env.SITE_URL ?? fallbackUrl;
}

export function getSiteVariant(): SiteVariant {
  return process.env.SITE_VARIANT === "mathkb" ? "mathkb" : "portfolio";
}

export function getSiteConfig(): SiteConfig {
  const variant = getSiteVariant();

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
    title: "koshikai.dev | Building apps that make life better",
    twitterTitle: "koshikai.dev | Building apps that make life better",
    headline: "Building apps that make life better",
    description:
      "個人開発者 koshikai のポートフォリオ。禁煙支援アプリ 'no' や、カップル向けアプリ 'Knot' など、「日常をより良くする」プロダクトを開発しています。",
    locale: "ja_JP",
    keywords: [
      "koshikai",
      "個人開発",
      "エンジニア",
      "ポートフォリオ",
      "Next.js",
      "React",
      "TypeScript",
      "AIエージェント",
    ],
  };
}
