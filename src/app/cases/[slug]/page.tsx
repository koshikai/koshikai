import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, ArrowLeft, CheckCircle, Lightbulb, Wrench } from "lucide-react";
import { getCaseBySlug, getCaseContentComponent, caseItems } from "@/lib/cases";
import { getSiteConfig } from "@/lib/site-config";

interface CaseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: CaseDetailPageProps): Promise<Metadata> {
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
  const { slug } = await params;
  const item = getCaseBySlug(slug);
  const Content = await getCaseContentComponent(slug);

  if (!item || !Content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-page-gradient">
      <main
        id="main-content"
        className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14"
      >
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-bold text-zinc-700 transition-colors hover:border-sky-300 hover:text-sky-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:border-sky-700 dark:hover:text-sky-200"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
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

          {/* Summary Dashboard Grid */}
          {(item.challenge || item.action || item.result || item.learning) && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {item.challenge && (
                <div className="flex flex-col gap-2 rounded-2xl border border-red-200/60 bg-red-50/20 p-5 dark:border-red-900/40 dark:bg-red-950/10">
                  <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400">
                    <AlertCircle className="h-5 w-5" aria-hidden="true" />
                    <span>Challenge / 課題</span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
                    {item.challenge}
                  </p>
                </div>
              )}
              {item.action && (
                <div className="flex flex-col gap-2 rounded-2xl border border-sky-200/60 bg-sky-50/20 p-5 dark:border-sky-900/40 dark:bg-sky-950/10">
                  <div className="flex items-center gap-2 font-bold text-sky-700 dark:text-sky-400">
                    <Wrench className="h-5 w-5" aria-hidden="true" />
                    <span>Action / 解決策</span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
                    {item.action}
                  </p>
                </div>
              )}
              {item.result && (
                <div className="flex flex-col gap-2 rounded-2xl border border-emerald-200/60 bg-emerald-50/20 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/10">
                  <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle className="h-5 w-5" aria-hidden="true" />
                    <span>Result / 結果</span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
                    {item.result}
                  </p>
                </div>
              )}
              {item.learning && (
                <div className="flex flex-col gap-2 rounded-2xl border border-purple-200/60 bg-purple-50/20 p-5 dark:border-purple-900/40 dark:bg-purple-950/10">
                  <div className="flex items-center gap-2 font-bold text-purple-700 dark:text-purple-400">
                    <Lightbulb className="h-5 w-5" aria-hidden="true" />
                    <span>Learning / 学び</span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
                    {item.learning}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="case-article-content mt-8 sm:mt-10">
            <Content />
          </div>
        </article>
      </main>
    </div>
  );
}
