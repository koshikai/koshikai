import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCaseBySlug, getCaseContentComponent, caseItems } from "@/lib/cases";
import { getSiteConfig, getSiteVariant } from "@/lib/site-config";

interface CaseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: CaseDetailPageProps): Promise<Metadata> {
  if (getSiteVariant() !== "portfolio") {
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
  if (getSiteVariant() !== "portfolio") {
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
      <main id="main-content" className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-8 sm:py-14">
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-bold text-zinc-700 transition-colors hover:border-sky-300 hover:text-sky-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:border-sky-700 dark:hover:text-sky-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cases
        </Link>

        <article className="mt-6 rounded-4xl border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
          <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            {item.publishedAt}
          </p>
          <h1 className="mt-3 text-balance text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            {item.title}
          </h1>
          <p className="mt-4 text-base leading-8 text-zinc-600 dark:text-zinc-300">
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
          <div className="mt-10">
            <Content />
          </div>
        </article>
      </main>
    </div>
  );
}
