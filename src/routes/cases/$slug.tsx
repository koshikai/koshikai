import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SectionHead } from "@/components/rdx";
import { AXES, getCaseBySlug } from "@/lib/cases";
import { pageHead } from "@/lib/metadata";
import { useReveal } from "@/lib/use-reveal";
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
  const ref = useReveal<HTMLElement>();
  const Content = mdxModules[`../../content/cases/${slug}.mdx`]?.default;

  const axis = AXES[item.axis];
  const brief = [
    { label: "課題", body: item.challenge },
    { label: "対応", body: item.action },
    { label: "結果", body: item.result },
    { label: "学び", body: item.learning },
  ].filter((d) => d.body);

  // 本文（MDX）は .rdx の外に置く。.rdx は見出しや段落の余白を消すので、
  // 中に入れると記事の組みが崩れる。
  return (
    <main id="main-content" ref={ref}>
      <div className="rdx">
        <div className="rdx-wrap rdx-page-hero">
          <nav aria-label="パンくずリスト" className="rdx-crumb">
            <Link to={axis.href} className="rdx-back">
              <ArrowLeft aria-hidden="true" />
              {axis.section}
            </Link>
          </nav>
          <SectionHead
            as="h1"
            small
            label={`${item.publishedAt} 公開`}
            title={item.title}
            description={item.summary}
          />
          <ul className="rdx-chips rdx-mono rdx-article-tags" data-rv>
            {item.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="case-layout">
        {brief.length > 0 && (
          <aside className="rdx case-brief" aria-label="この事例の要約">
            <dl className="rdx-pmr">
              {brief.map((d) => (
                <div key={d.label}>
                  <dt className="rdx-mono">{d.label}</dt>
                  <dd>{d.body}</dd>
                </div>
              ))}
            </dl>
          </aside>
        )}
        <article className="case-article-content">
          {Content ? <Content components={mdxComponents} /> : null}
        </article>
      </div>

      <div className="rdx">
        <div className="rdx-wrap">
          <div className="rdx-foot">
            <span>{AXES[item.axis].casesTitle}</span>
            <span className="rdx-foot-links">
              <Link to={axis.href} className="rdx-more">
                {axis.section}
                <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link to="/cases" className="rdx-more">
                すべての事例
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}