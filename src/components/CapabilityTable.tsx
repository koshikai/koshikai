import Link from "next/link";
import { capabilities } from "@/lib/engineering";

/**
 * 技術名の羅列にしないため、各行に「どこで使ったか」を必ず添える。
 * スマホでは 領域 → 技術 → 使用例 の縦積みにする。
 */
export function CapabilityTable() {
  return (
    <div className="rounded border border-border">
      <div className="hidden grid-cols-12 gap-6 border-b border-border bg-surface px-5 py-2.5 font-mono text-[11px] text-muted md:grid">
        <span className="col-span-2">area</span>
        <span className="col-span-6">tools</span>
        <span className="col-span-4">used in</span>
      </div>
      <dl>
        {capabilities.map((capability) => (
          <div
            key={capability.area}
            className="row-hover grid grid-cols-12 gap-x-6 gap-y-1.5 border-b border-border px-5 py-4 last:border-b-0"
          >
            <dt className="col-span-12 font-mono text-xs text-muted md:col-span-2 md:leading-6">
              {capability.area}
            </dt>
            <dd className="col-span-12 text-sm leading-6 text-foreground md:col-span-6">
              {capability.tools.join(" · ")}
            </dd>
            <dd className="col-span-12 flex flex-wrap gap-x-3 gap-y-1 text-[13px] leading-6 md:col-span-4">
              <span className="sr-only">使用例:</span>
              {capability.evidence.map((evidence) => (
                <Link
                  key={evidence.label}
                  href={evidence.href}
                  className="focus-ring text-muted underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  {evidence.label}
                </Link>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
