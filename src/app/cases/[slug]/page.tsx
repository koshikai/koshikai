import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container, Tags } from "@/components/ui";
import { SplitHeading } from "@/components/SplitHeading";
import { AXES, getCaseBySlug, getCaseContentComponent, caseItems } from "@/lib/cases";
import { splitIntoChunks } from "@/lib/chunks";
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

  const axis = AXES[item.axis];
  const summary = [
    { label: "Challenge", body: item.challenge },
    { label: "Action", body: item.action },
    { label: "Result", body: item.result, accent: true },
    { label: "Learning", body: item.learning },
  ].filter((d) => d.body);

  return (
    <main id="main-content">
      <Container size="narrow">
        <nav aria-label="パンくずリスト" className="pt-10 sm:pt-14">
          <Link
            href={axis.href}
            className="focus-ring group inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
            {axis.section}
          </Link>
        </nav>

        <article className="case-article-shell mt-4">
          <p className="font-mono text-xs text-muted">
            {axis.label.toLowerCase()} — case study · {item.publishedAt}
          </p>
          <SplitHeading
            as="h1"
            text={item.title}
            chunks={splitIntoChunks(item.title)}
            delayStart={60}
            delayStep={24}
            className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          />
          <p className="mt-5 text-pretty text-base leading-[1.9] text-muted">{item.summary}</p>
          <Tags items={item.tags} className="mt-5" />

          {summary.length > 0 && (
            <dl className="mt-10 grid gap-px overflow-hidden rounded border border-border bg-border sm:grid-cols-2">
              {summary.map((d) => (
                <div key={d.label} className="bg-background p-5 sm:p-6">
                  <dt className={`font-mono text-xs ${d.accent ? "text-accent" : "text-muted"}`}>{d.label}</dt>
                  <dd className="mt-2 text-sm leading-[1.85] text-foreground">{d.body}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="case-article-content mt-12">
            <Content />
          </div>
        </article>
      </Container>
    </main>
  );
}
