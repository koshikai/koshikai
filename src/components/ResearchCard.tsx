import { ArrowLink, Tags } from "@/components/ui";
import type { ResearchTopic } from "@/lib/research";

const ROWS = [
  { key: "problem", label: "Problem" },
  { key: "method", label: "Method" },
  { key: "result", label: "Result" },
] as const;

/** 研究を Problem / Method / Result で見せる。所属や学会名は載せない */
export function ResearchCard({ topic, headingLevel = "h3" }: { topic: ResearchTopic; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article id={topic.slug} className="flex h-full flex-col rounded border border-border bg-background p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-xs text-muted">{topic.context}</p>
        {topic.status === "in-progress" && (
          <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[11px] text-muted">in progress</span>
        )}
      </div>
      <Heading className="mt-2 text-lg font-semibold tracking-tight text-foreground">{topic.title}</Heading>

      <dl className="mt-5 space-y-4">
        {ROWS.map((row) => (
          <div key={row.key} className="grid grid-cols-[4.5rem_1fr] gap-3">
            <dt className={`font-mono text-xs leading-6 ${row.key === "result" ? "text-accent" : "text-muted"}`}>
              {row.label}
            </dt>
            <dd className="text-sm leading-[1.8] text-foreground">{topic[row.key]}</dd>
          </div>
        ))}
      </dl>

      {topic.metric && (
        <p className="mt-5 flex items-baseline gap-3 border-t border-border pt-4">
          <span className="font-mono text-2xl font-medium tracking-tight text-foreground">{topic.metric.value}</span>
          <span className="text-xs text-muted">{topic.metric.label}</span>
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
        <Tags items={topic.tags} />
        {topic.caseSlug && <ArrowLink href={`/cases/${topic.caseSlug}`}>詳しく読む</ArrowLink>}
      </div>
    </article>
  );
}
