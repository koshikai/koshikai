import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { CaseItem } from "@/lib/cases";
import { capabilities, homelabLayers, pipelineSteps } from "@/lib/engineering";

/**
 * トップと下層ページで共有する部品。見た目は `styles/home.css` の `.rdx` 配下。
 * どれも `<main className="rdx">` の内側で使う。
 */

/** セクションの見出し。ページ冒頭では `as="h1"` で同じ形を使う */
export function SectionHead({
  id,
  label,
  title,
  description,
  as: Heading = "h2",
}: {
  id?: string;
  label: string;
  title: string;
  description?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="rdx-head" data-rv>
      <p className="rdx-label rdx-mono">{label}</p>
      <Heading id={id} className="rdx-h2">
        <span>{title}</span>
      </Heading>
      {description && <p className="rdx-head-desc">{description}</p>}
    </div>
  );
}

/** 事例を行で並べる一覧 */
export function CaseRows({ items }: { items: CaseItem[] }) {
  return (
    <ul className="rdx-cases" data-rv="stagger">
      {items.map((item) => (
        <li key={item.slug}>
          <Link to="/cases/$slug" params={{ slug: item.slug }} className="rdx-case">
            <div className="rdx-case-main">
              <h3>{item.title}</h3>
              <p className="rdx-case-sum">{item.summary}</p>
            </div>
            <div className="rdx-case-tags rdx-mono">
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <ArrowUpRight className="rdx-case-arrow" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** このサイトの配信経路。`anchor` を付けると `#pipeline` の行き先になる */
export function Pipeline({ anchor = false }: { anchor?: boolean }) {
  return (
    <div id={anchor ? "pipeline" : undefined} className="rdx-pipe" data-rv>
      <p className="rdx-pipe-title rdx-mono">
        <span>このサイトの配信経路</span>
      </p>
      <ol className="rdx-pipe-steps">
        {pipelineSteps.map((step, i) => (
          <li key={step.label} className="rdx-pipe-step" style={{ "--i": i } as React.CSSProperties}>
            <span className="rdx-pipe-node" aria-hidden="true" />
            <span className="rdx-pipe-name rdx-mono">{step.label}</span>
            <span className="rdx-pipe-detail rdx-mono"> {step.detail}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** 自宅基盤の層ごとの構成 */
export function Layers({ wide = false }: { wide?: boolean }) {
  return (
    <dl className={wide ? "rdx-layers rdx-layers--wide" : "rdx-layers"} data-rv="stagger">
      {homelabLayers.map((layer) => (
        <div key={layer.layer} className="rdx-layer">
          <dt className="rdx-mono">{layer.layer}</dt>
          <dd>{layer.items.join(" · ")}</dd>
        </div>
      ))}
    </dl>
  );
}

/** 技術と、それを使った作品・事例の対応 */
export function StackRows() {
  return (
    <ul className="rdx-stack" data-rv="stagger">
      {capabilities.map((capability) => (
        <li key={capability.area} className="rdx-stack-row">
          <span className="rdx-stack-area rdx-mono">{capability.area}</span>
          <span className="rdx-stack-tools">
            {capability.tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </span>
          <span className="rdx-stack-ev">
            {capability.evidence.map((evidence) => (
              <a key={evidence.href} href={evidence.href}>
                {evidence.label}
              </a>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}
