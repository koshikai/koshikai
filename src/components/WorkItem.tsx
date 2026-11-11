import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { STATUS_LABELS, type Work } from "@/lib/works";

/**
 * 作品 1 件。トップと /works の両方で使う（見た目は `styles/home.css` の `.rdx-work`）。
 *
 * - compact: 小さい版。概要文と運用の行を省き、1 画面に並べる
 * - heading: 置く場所の見出し階層に合わせる
 * - index: 通し番号を出すときに渡す（1 始まり）
 * - flip: 広い画面で画像と説明の左右を入れ替える
 *
 * 画像は、狭い画面では縦長の実機画面に差し替える。
 * 画像の無い非公開の作品は、構成の要約を同じ枠に出す。
 */
export function WorkItem({
  work,
  compact = false,
  heading: Heading = "h3",
  index,
  flip = false,
  anchor = false,
}: {
  work: Work;
  compact?: boolean;
  heading?: "h2" | "h3";
  index?: number;
  flip?: boolean;
  /** true なら slug を id にして、ページ内リンクの行き先にする */
  anchor?: boolean;
}) {
  const external = work.links.live ?? work.links.download;
  const image = work.image && (
    <picture>
      <source
        media="(min-width: 40rem)"
        srcSet={work.image.desktop.src}
        width={work.image.desktop.width}
        height={work.image.desktop.height}
      />
      <img
        src={work.image.mobile.src}
        width={work.image.mobile.width}
        height={work.image.mobile.height}
        alt={work.image.alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
  const className = ["rdx-work", compact && "rdx-work--compact", flip && "rdx-work--flip"]
    .filter(Boolean)
    .join(" ");
  const note =
    work.statusNote ??
    (work.status === "private" ? "非公開のため、公開できる範囲の技術概要のみ掲載" : undefined);

  return (
    <article id={anchor ? work.slug : undefined} className={className} data-rv>
      {image &&
        (external ? (
          <a
            className="rdx-work-media"
            href={external}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${work.name} を開く（新しいタブ）`}
          >
            {image}
          </a>
        ) : (
          <div className="rdx-work-media">{image}</div>
        ))}
      {!image && work.architecture && (
        <div className="rdx-work-media rdx-work-arch">
          <p className="rdx-mono">構成</p>
          <ol className="rdx-mono">
            {work.architecture.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="rdx-work-body">
        <p className="rdx-work-meta rdx-mono">
          {index !== undefined && <span>{String(index).padStart(2, "0")}</span>}
          <span>{work.since}</span>
          <span className="rdx-pill" data-status={work.status}>
            {STATUS_LABELS[work.status]}
          </span>
        </p>
        <Heading className="rdx-work-name">{work.name}</Heading>
        <p className="rdx-work-tagline">{work.tagline}</p>
        {!compact && <p className="rdx-work-summary">{work.summary}</p>}

        <dl className="rdx-facts">
          <div>
            <dt className="rdx-mono">担当</dt>
            <dd>{work.scope}</dd>
          </div>
          {!compact && work.operation && (
            <div>
              <dt className="rdx-mono">運用</dt>
              <dd>{work.operation}</dd>
            </div>
          )}
          {note && (
            <div>
              <dt className="rdx-mono">公開</dt>
              <dd>{note}</dd>
            </div>
          )}
          <div>
            <dt className="rdx-mono">技術</dt>
            <dd>
              <ul className="rdx-chips rdx-mono">
                {work.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <div className="rdx-work-links">
          {work.links.caseSlug && (
            <Link to="/cases/$slug" params={{ slug: work.links.caseSlug }} className="rdx-more">
              設計と判断を読む
              <ArrowUpRight aria-hidden="true" />
            </Link>
          )}
          {work.links.live && (
            <a href={work.links.live} target="_blank" rel="noopener noreferrer" className="rdx-more">
              {work.status === "demo" ? "デモを見る" : "サイトを開く"}
              <ArrowUpRight aria-hidden="true" />
            </a>
          )}
          {work.links.download && (
            <a
              href={work.links.download}
              target="_blank"
              rel="noopener noreferrer"
              className="rdx-more"
            >
              ダウンロード
              <ArrowUpRight aria-hidden="true" />
            </a>
          )}
          {work.links.repo && (
            <a href={work.links.repo} target="_blank" rel="noopener noreferrer" className="rdx-more">
              ソースコード
              <ArrowUpRight aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
