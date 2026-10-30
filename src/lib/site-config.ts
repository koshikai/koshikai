const BASE_URL = process.env.SITE_URL ?? "https://koshikai.dev";

export interface SiteConfig {
  baseUrl: string;
  description: string;
  headline: string;
  keywords: string[];
  locale: string;
  name: string;
  title: string;
  twitterHandle: string;
  twitterTitle: string;
}

export function getSiteConfig(): SiteConfig {
  return {
    baseUrl: BASE_URL,
    name: "koshikai.dev",
    title: "koshikai — build · operate · research",
    twitterHandle: "@siywyk",
    twitterTitle: "koshikai — build · operate · research",
    headline: "build · operate · research",
    description:
      "ソフトウェアエンジニア koshikai のポートフォリオ。Web・AI のプロダクト開発、自宅サーバーでのインフラ運用、強化学習・統計モデルの研究を掲載しています。",
    locale: "ja_JP",
    keywords: [
      "koshikai",
      "ポートフォリオ",
      "ソフトウェアエンジニア",
      "TypeScript",
      "React",
      "TanStack Start",
      "Next.js",
      "Proxmox",
      "self-hosting",
      "MCP",
      "強化学習",
    ],
  };
}
