import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCaseBySlug, getCaseContentComponent, caseItems } from "@/lib/cases";
import { getSiteConfig, getEffectiveVariant } from "@/lib/site-config";

interface CaseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: CaseDetailPageProps): Promise<Metadata> {
  const variant = await getEffectiveVariant();
  if (variant !== "portfolio") {
    return {};
  }

  const { slug } = await params;
  const item = getCaseBySlug(slug);
  if (!item) return {};

  const site = getSiteConfig();

  return {
    title: `${item.title} | Case Studies`,
    description: item.summary,
    alternates: {
      canonical: `/cases/${item.slug}`,
    },
    openGraph: {
      title: `${item.title} | Case Studies`,
      description: item.summary,
      url: `${site.baseUrl}/cases/${item.slug}`,
      siteName: site.name,
      locale: site.locale,
      type: "article",
    },
  };
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const variant = await getEffectiveVariant();
  if (variant !== "portfolio") {
    notFound();
  }

  const { slug } = await params;
  const item = getCaseBySlug(slug);
  const Content = await getCaseContentComponent(slug);

  if (!item || !Content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.2),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_55%,#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_28%),linear-gradient(180deg,#09090b_0%,#111827_60%,#09090b_100%)]">
      <main
        id="main-content"
        className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14"
      >
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-bold text-zinc-700 transition-colors hover:border-sky-300 hover:text-sky-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:border-sky-700 dark:hover:text-sky-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cases
        </Link>

        <article className="case-article-shell mt-5 sm:mt-6">
          <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            {item.publishedAt}
          </p>
          <h1 className="mt-3 text-balance text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-50">
            {item.title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base sm:leading-8 dark:text-zinc-300">
            {item.summary}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="case-article-content mt-8 sm:mt-10">
            <Content />
          </div>
        </article>
      </main>
    </div>
  );
}
