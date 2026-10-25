import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/site-config";

interface PageMetadataInput {
  /** ページ固有の名前。`%s | koshikai` のテンプレートと OG の title に使う */
  title: string;
  description: string;
  /** 先頭が `/` のパス。canonical と og:url の両方に使う */
  path: string;
}

/**
 * サブページの metadata を組み立てる。
 *
 * 共通レイアウトが openGraph を定義しているため、ページ側で openGraph を
 * 書かないと title / url がトップの値のまま継承され、canonical と食い違う。
 * SNS の共有カードが全ページ同じになるので、サブページは必ずこれを通す。
 */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const site = getSiteConfig();
  const socialTitle = `${title} | koshikai`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url: `${site.baseUrl}${path}`,
      siteName: site.name,
      locale: site.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      creator: site.twitterHandle,
    },
  };
}
