const BASE_URL = process.env.SITE_URL ?? "https://koshikai.dev";

export interface SiteConfig {
  baseUrl: string;
  description: string;
  headline: string;
  keywords: string[];
  locale: string;
  name: string;
  title: string;
  twitterTitle: string;
}

export function getSiteConfig(): SiteConfig {
  return {
    baseUrl: BASE_URL,
    name: "koshikai.dev",
    title: "koshikai — build · operate · research",
    twitterTitle: "koshikai — build · operate · research",
    headline: "build · operate · research",
    description:
      "ソフトウェアエンジニア koshikai のポートフォリオ。Web・AI のプロダクトを自分で作り、自宅のインフラで運用し、研究とデータ分析で検証しています。",
    locale: "ja_JP",
    keywords: [
      "koshikai",
      "ポートフォリオ",
      "ソフトウェアエンジニア",
      "Next.js",
      "TypeScript",
      "Proxmox",
      "self-hosting",
      "MCP",
      "強化学習",
    ],
  };
}
