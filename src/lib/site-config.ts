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
