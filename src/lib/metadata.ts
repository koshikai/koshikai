import { getSiteConfig } from "@/lib/site-config";

interface PageMetadataInput {
  /** ページ固有の名前。`%s | koshikai` のテンプレートと OG の title に使う */
  title: string;
  description: string;
  /** 先頭が `/` のパス。canonical と og:url の両方に使う */
  path: string;
  type?: "website" | "article";
}

/**
 * サブページの head メタデータを組み立てる。
 *
 * 共通レイアウトが openGraph を定義しているため、ページ側で openGraph を
 * 書かないと title / url がトップの値のまま継承され、canonical と食い違う。
 * SNS の共有カードが全ページ同じになるので、サブページは必ずこれを通す。
 */
export function pageHead({
  title,
  description,
  path,
  type = "website",
}: PageMetadataInput) {
  const site = getSiteConfig();
  const fullTitle = `${title} | koshikai`;
  const url = `${site.baseUrl}${path}`;

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:site_name", content: site.name },
      { property: "og:locale", content: site.locale },
      { property: "og:type", content: type },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:creator", content: site.twitterHandle },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
