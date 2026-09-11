import { homelabLayers } from "@/lib/engineering";

/** 自宅基盤を上（外部）から下（物理）へ積んだ層として見せる */
export function HomelabStack() {
  return (
    <figure className="rounded border border-border bg-background">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-5 py-3">
        <span className="text-sm font-medium text-foreground">自宅基盤の構成</span>
        <span className="font-mono text-[11px] text-muted">Proxmox VE · 10+ services</span>
      </figcaption>
      <dl className="px-5 py-2">
        {homelabLayers.map((row) => (
          <div
            key={row.layer}
            className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-b border-dashed border-border py-3 last:border-b-0"
          >
            <dt className="text-xs text-muted">{row.layer}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {row.items.map((item) => (
                <span
                  key={item}
                  className="rounded border border-border bg-surface px-2 py-0.5 text-[13px] text-foreground"
                >
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
