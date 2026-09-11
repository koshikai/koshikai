import Image from "next/image";
import { ArrowLink, Tags } from "@/components/ui";
import { STATUS_LABELS, type Work } from "@/lib/works";

export function StatusBadge({ work }: { work: Work }) {
  const dot =
    work.status === "live"
      ? "bg-emerald-600 dark:bg-emerald-400"
      : work.status === "demo"
        ? "bg-amber-500"
        : "border border-muted bg-transparent";
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-xs text-muted">
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {STATUS_LABELS[work.status]}
    </span>
  );
}

/**
 * サムネイル枠は 16:10 に統一する。縦長のスマホ画面は枠の中央に収め、
 * スクリーンショットの無い private な作品は構成の要約を代わりに置く。
 */
export function WorkThumb({ work, sizes }: { work: Work; sizes: string }) {
  if (work.image) {
    const portrait = work.image.height > work.image.width;
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded border border-border bg-surface">
        <Image
          src={work.image.src}
          alt={work.image.alt}
          fill
          sizes={sizes}
          className={portrait ? "object-contain p-4" : "object-cover object-top"}
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-[16/10] flex-col justify-center rounded border border-border bg-surface px-5 py-4">
      <p className="font-mono text-[11px] text-muted">architecture</p>
      <ol role="list" className="mt-3 list-none space-y-1.5">
        {work.architecture?.map((step, i) => (
          <li key={step} className="flex items-baseline gap-2 font-mono text-xs text-foreground">
            <span className="text-accent" aria-hidden="true">
              {i === 0 ? "›" : "↓"}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** トップの Featured Works 用。1 枚で「何を・どこまで・今どうなっているか」を伝える */
export function WorkCard({ work }: { work: Work }) {
  return (
    <article id={work.slug} className="flex h-full flex-col">
      <WorkThumb work={work} sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" />
      <div className="mt-5 flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{work.name}</h3>
        <StatusBadge work={work} />
      </div>
      <p className="mt-2 text-pretty text-sm leading-[1.8] text-foreground">{work.tagline}</p>

      <dl className="mt-4 space-y-1.5 text-[13px] leading-relaxed">
        <div className="flex gap-3">
          <dt className="w-8 shrink-0 text-xs leading-[1.6rem] text-muted">範囲</dt>
          <dd className="text-muted">{work.scope}</dd>
        </div>
        {work.operation && (
          <div className="flex gap-3">
            <dt className="w-8 shrink-0 text-xs leading-[1.6rem] text-muted">運用</dt>
            <dd className="text-muted">{work.operation}</dd>
          </div>
        )}
      </dl>

      <Tags items={work.stack} className="mt-4" />

      <div className="mt-auto flex flex-wrap gap-x-5 pt-4">
        {work.links.caseSlug && <ArrowLink href={`/cases/${work.links.caseSlug}`}>事例を読む</ArrowLink>}
        {work.links.live && (
          <ArrowLink href={work.links.live}>{work.status === "demo" ? "デモ" : "サイト"}</ArrowLink>
        )}
        {!work.links.caseSlug && !work.links.live && (
          <ArrowLink href={`/works#${work.slug}`}>詳細</ArrowLink>
        )}
      </div>
    </article>
  );
}
