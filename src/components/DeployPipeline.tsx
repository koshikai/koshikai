import { pipelineSteps } from "@/lib/engineering";

/**
 * このサイト自体のデプロイ経路。「運用できる」を文章で主張する代わりに、
 * いま見ているページがどう届いているかをそのまま見せる。
 * 縦並びにしておけば、スマホでも横スクロールなしで同じ図が読める。
 */
export function DeployPipeline() {
  return (
    <figure id="pipeline" className="rounded border border-border bg-background">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-5 py-3">
        <span className="text-sm font-medium text-foreground">このサイトが届くまで</span>
        <span className="font-mono text-[11px] text-muted">.github/workflows/deploy.yml</span>
      </figcaption>
      <ol role="list" className="list-none px-5 py-4">
        {pipelineSteps.map((step, i) => (
          <li key={step.label} className="relative flex items-baseline gap-4 py-1.5">
            {i < pipelineSteps.length - 1 && (
              <span aria-hidden="true" className="absolute left-[0.6875rem] top-[1.35rem] h-full w-px bg-border" />
            )}
            <span
              aria-hidden="true"
              className={`relative z-10 flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center rounded-full border font-mono text-[10px] ${
                i === pipelineSteps.length - 1
                  ? "border-accent bg-accent text-background"
                  : "border-border bg-background text-muted"
              }`}
            >
              {i + 1}
            </span>
            <span className="font-mono text-[13px] text-foreground">{step.label}</span>
            <span className="ml-auto text-right text-xs text-muted">{step.detail}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
