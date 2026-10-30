import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Container, Tags } from "@/components/ui";
import { SplitHeading } from "@/components/SplitHeading";
import { AXES, getCaseBySlug } from "@/lib/cases";
import { splitIntoChunks } from "@/lib/chunks";
import { pageHead } from "@/lib/metadata";
import { useMDXComponents } from "../../../mdx-components";

const mdxModules = import.meta.glob<{
  default: ComponentType<{ components?: MDXComponents }>;
}>("../../content/cases/*.mdx", { eager: true });

const mdxComponents = useMDXComponents({});

export const Route = createFileRoute("/cases/$slug")({
  loader: ({ params }) => {
    const item = getCaseBySlug(params.slug);
    if (!item) {
      throw notFound();
    }
    return { item };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.item) return {};
    const { item } = loaderData;
    return pageHead({
      title: item.title,
      description: item.summary,
      path: `/cases/${item.slug}`,
      type: "article",
    });
  },
  component: CaseDetailPage,
});

function CaseDetailPage() {
  const { slug } = Route.useParams();
  const { item } = Route.useLoaderData();
  const Content = mdxModules[`../../content/cases/${slug}.mdx`]?.default;

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
            to={axis.href}
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
          <p className="font-mono text-xs text-muted">{item.publishedAt} 公開</p>
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
            {Content ? <Content components={mdxComponents} /> : null}
          </div>
        </article>
      </Container>
    </main>
  );
}
