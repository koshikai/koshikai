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

  const dashboard = [
    { key: item.challenge, icon: AlertCircle, label: "Challenge / 課題" },
    { key: item.action, icon: Wrench, label: "Action / 解決策" },
    { key: item.result, icon: CheckCircle, label: "Result / 結果", accent: true },
    { key: item.learning, icon: Lightbulb, label: "Learning / 学び" },
  ].filter((d) => d.key);

  return (
    <div className="bg-background text-foreground">
      <main
        id="main-content"
        className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16 lg:py-20"
      >
        <Link
          href="/cases"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
            aria-hidden="true"
          />
          Back to cases
        </Link>

        <article className="case-article-shell mt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {item.publishedAt}
          </p>
          <h1 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {item.title}
          </h1>
          <p className="mt-6 text-base leading-[1.9] text-muted">
            {item.summary}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Summary Dashboard Grid */}
          {dashboard.length > 0 && (
            <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
              {dashboard.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.label} className="flex flex-col gap-2 bg-background p-6">
                    <div
                      className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] ${
                        d.accent ? "text-accent" : "text-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{d.label}</span>
                    </div>
                    <p className="text-sm leading-[1.9] text-foreground">{d.key}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="case-article-content mt-12">
            <Content />
          </div>
        </article>
      </main>
    </div>
  );
}
