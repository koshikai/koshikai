import { useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import "../styles/home.css";

import { ParticleType } from "@/components/ParticleType";
import { countFrame } from "@/lib/count-up";
import { capabilities, homelabLayers, operationFacts, pipelineSteps } from "@/lib/engineering";
import { profile } from "@/lib/profile";
import { featuredResearch } from "@/lib/research";
import { getSiteConfig } from "@/lib/site-config";
import { featuredWorks, STATUS_LABELS, works, type Work } from "@/lib/works";

/**
 * トップページ。
 *
 * ファーストビューで「Web/AI/ゲームのプロダクト開発」「インフラ運用」
 * 「研究・データ分析」の 3 軸が伝わる構成。
 * 所属・学会名・受賞はトップに出さない（About と Research に置く）。
 *
 * レイアウトは `styles/home.css` の `.rdx` 配下だけで組む。ヘッダーとフッターは
 * 全ページ共通のもの（`__root.tsx`）を使う。
 * 色は下層ページと同じトークンを読む。表示する事実（作品・運用・研究）は
 * `src/lib/` のデータから出す。
 */
export const Route = createFileRoute("/")({
  head: () => {
    const site = getSiteConfig();
    return {
      links: [{ rel: "canonical", href: site.baseUrl }],
    };
  },
  component: Home,
});

const axes = [
  {
    key: "build",
    href: "#works",
    summary: "Web・AI・ゲームの個人開発",
    value: String(works.length),
    proof: "つの個人プロダクトを単独で開発",
  },
  {
    key: "operate",
    href: "#operate",
    summary: "自宅サーバーと CI/CD によるインフラ運用",
    value: "10+",
    proof: "のサービスを Proxmox 上で運用",
  },
  {
    key: "research",
    href: "#research",
    summary: "強化学習と統計モデルによる検証",
    value: "96/96",
    proof: "の初期状態で安定化（Wnt5a）",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

/** 画面に入った要素へ一度だけ .is-in を付ける */
function useReveal() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>("[data-rv]");
    if (typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}

/** 1 文字ずつ下からせり上がる。読み上げには親の aria-label を使う */
function Chars({ text }: { text: string }) {
  return (
    <span className="rdx-chars" aria-hidden="true">
      {Array.from(text).map((char, i) => (
        <span key={i} style={{ "--i": i } as React.CSSProperties}>
          {char}
        </span>
      ))}
    </span>
  );
}

/**
 * 画面に入ったとき、文字列の中の数値だけを 0 から数え上げる（"96/96" "43.2×" "10+"）。
 * サーバーが出す値は最終値のままなので、JS が無くても正しい数字が読める。
 */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1400);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = countFrame(value, eased);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [value]);

  return (
    <>
      <span className="rdx-sr">{value}</span>
      <span ref={ref} aria-hidden="true">
        {value}
      </span>
    </>
  );
}

function SectionHead({
  id,
  label,
  title,
  description,
}: {
  id: string;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rdx-head" data-rv>
      <p className="rdx-label rdx-mono">{label}</p>
      <h2 id={id} className="rdx-h2">
        <span>{title}</span>
      </h2>
      <p className="rdx-head-desc">{description}</p>
    </div>
  );
}

/**
 * compact は 2 作品目以降の小さい版。概要文と運用の行を省き、1 画面に並べる。
 * 画像は現行と同じく、狭い画面では縦長の実機画面に差し替える。
 */
function WorkItem({ work, compact = false }: { work: Work; compact?: boolean }) {
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

  return (
    <article className={compact ? "rdx-work rdx-work--compact" : "rdx-work"} data-rv>
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

      <div className="rdx-work-body">
        <p className="rdx-work-meta rdx-mono">
          <span>{work.since}</span>
          <span className="rdx-pill" data-status={work.status}>
            {STATUS_LABELS[work.status]}
          </span>
        </p>
        <h3 className="rdx-work-name">{work.name}</h3>
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
          {work.statusNote && (
            <div>
              <dt className="rdx-mono">公開</dt>
              <dd>{work.statusNote}</dd>
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
              サイトを開く
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

function Home() {
  const ref = useReveal();
  const { email, links } = profile.contact;

  return (
    <main id="main-content" className="rdx" ref={ref}>
      <div className="rdx-progress" aria-hidden="true" />

      {/* --- Hero --- */}
      <section className="rdx-wrap rdx-hero" aria-labelledby="rdx-hero-heading">
        <div className="rdx-hero-top">
          <div>
            <h1 id="rdx-hero-heading" className="rdx-name rdx-mono" aria-label={profile.name}>
              <Chars text={profile.name} />
              <span className="rdx-caret" aria-hidden="true" />
            </h1>
            <p className="rdx-statement">
              {["作ったものを、", "自分のサーバーで", "動かしている。"].map((line, i) => (
                <span key={line} style={{ "--i": i } as React.CSSProperties}>
                  <span>{line}</span>
                </span>
              ))}
            </p>

            <div className="rdx-hero-sub">
              <p className="rdx-lead">{profile.lead}</p>
              <div className="rdx-cta">
                <Link to="/works" className="rdx-btn">
                  作品を見る
                  <ArrowUpRight aria-hidden="true" />
                </Link>
                <a
                  href="https://github.com/koshikai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rdx-btn rdx-btn--ghost"
                >
                  GitHub
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* 現行トップの粒子表現。3 軸の語を組み替える */}
          <div className="rdx-hero-art">
            <ParticleType
              words={profile.keywords}
              label="build / operate / research"
              className="aspect-[3/2] sm:aspect-[16/9] lg:aspect-[3/2]"
            />
          </div>
        </div>

        <nav aria-label="3つの軸">
          <ul className="rdx-axes">
            {axes.map((axis, i) => (
              <li key={axis.key} data-rv style={{ "--rv-delay": `${i * 80}ms` } as React.CSSProperties}>
                <a href={axis.href} className="rdx-axis">
                  <span className="rdx-axis-no rdx-mono">{pad(i + 1)}</span>
                  <span className="rdx-axis-key">{axis.key}</span>
                  <span className="rdx-axis-sum">{axis.summary}</span>
                  <span className="rdx-axis-proof">
                    <b className="rdx-mono">
                      <CountUp value={axis.value} />
                    </b>
                    {axis.proof}
                  </span>
                  <ArrowDown className="rdx-axis-arrow" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* --- build --- */}
      <section id="works" className="rdx-wrap rdx-section" aria-labelledby="rdx-works-heading">
        <SectionHead
          id="rdx-works-heading"
          label="01"
          title="個人開発"
          description="企画からデプロイまでひとりでやっています。"
        />
        <div className="rdx-works">
          {featuredWorks.slice(0, 1).map((work) => (
            <WorkItem key={work.slug} work={work} />
          ))}
          {featuredWorks.length > 1 && (
            <div className="rdx-works-rest">
              {featuredWorks.slice(1).map((work) => (
                <WorkItem key={work.slug} work={work} compact />
              ))}
            </div>
          )}
        </div>
        <div className="rdx-foot" data-rv>
          <span>
            全 {works.length} 作品のうち {featuredWorks.length} 作品を掲載
          </span>
          <Link to="/works" className="rdx-more">
            すべての作品
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* --- operate --- */}
      <div className="rdx-band-outer">
        <section id="operate" className="rdx-band" aria-labelledby="rdx-operate-heading">
          <div className="rdx-wrap">
            <SectionHead
              id="rdx-operate-heading"
              label="02"
              title="デプロイと自宅サーバーの運用"
              description="main に push したものが、自宅の Proxmox 上でそのまま本番に上がります。バックアップも同じ場所で取っています。"
            />

            <div className="rdx-pipe" data-rv>
              <p className="rdx-pipe-title rdx-mono">
                <span>このサイトの配信経路</span>
              </p>
              <ol className="rdx-pipe-steps">
                {pipelineSteps.map((step, i) => (
                  <li
                    key={step.label}
                    className="rdx-pipe-step"
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <span className="rdx-pipe-node" aria-hidden="true" />
                    <span className="rdx-pipe-name rdx-mono">{step.label}</span>
                    <span className="rdx-pipe-detail rdx-mono"> {step.detail}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rdx-ops">
              <ol className="rdx-ops-facts" data-rv="stagger">
                {operationFacts.slice(0, 4).map((fact, i) => (
                  <li key={fact.title}>
                    <span className="rdx-mono" aria-hidden="true">
                      {pad(i + 1)}
                    </span>
                    <h3>{fact.title}</h3>
                    <p>{fact.body}</p>
                  </li>
                ))}
              </ol>

              <div>
                <p className="rdx-layers-title rdx-mono" data-rv>
                  層ごとの構成
                </p>
                <dl className="rdx-layers" data-rv="stagger">
                  {homelabLayers.map((layer) => (
                    <div key={layer.layer} className="rdx-layer">
                      <dt className="rdx-mono">{layer.layer}</dt>
                      <dd>{layer.items.join(" · ")}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="rdx-foot" data-rv>
              <span>構成図・バックアップ方針・技術の詳細</span>
              <Link to="/engineering" className="rdx-more">
                Engineering
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* --- research --- */}
      <section id="research" className="rdx-wrap rdx-section" aria-labelledby="rdx-research-heading">
        <SectionHead
          id="rdx-research-heading"
          label="03"
          title="研究とデータ分析"
          description="強化学習によるネットワーク制御と、実データを使った統計分析。"
        />
        <ul className="rdx-research">
          {featuredResearch.map((topic, i) => (
            <li
              key={topic.slug}
              className="rdx-paper"
              data-rv
              style={{ "--rv-delay": `${i * 100}ms` } as React.CSSProperties}
            >
              {topic.metric && (
                <>
                  <p className="rdx-metric">
                    <CountUp value={topic.metric.value} />
                  </p>
                  <p className="rdx-metric-label rdx-mono">{topic.metric.label}</p>
                </>
              )}
              <h3>{topic.title}</h3>
              <p className="rdx-paper-context">{topic.context}</p>
              <dl className="rdx-pmr">
                <div>
                  <dt className="rdx-mono">課題</dt>
                  <dd>{topic.problem}</dd>
                </div>
                <div>
                  <dt className="rdx-mono">手法</dt>
                  <dd>{topic.method}</dd>
                </div>
                <div>
                  <dt className="rdx-mono">結果</dt>
                  <dd>{topic.result}</dd>
                </div>
              </dl>
              {topic.caseSlug && (
                <Link to="/cases/$slug" params={{ slug: topic.caseSlug }} className="rdx-more">
                  進め方を読む
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="rdx-foot" data-rv>
          <span>発表・進行中の研究・公開コード</span>
          <Link to="/research" className="rdx-more">
            Research
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* --- stack --- */}
      <section className="rdx-wrap rdx-section" aria-labelledby="rdx-stack-heading">
        <SectionHead
          id="rdx-stack-heading"
          label="04"
          title="使用技術"
          description="実際に使った技術だけを、使った場所へのリンク付きで並べています。"
        />
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
      </section>

      {/* --- contact --- */}
      <section className="rdx-wrap rdx-contact" aria-labelledby="rdx-contact-heading">
        <div data-rv>
          <p className="rdx-label rdx-mono">05</p>
          <h2 id="rdx-contact-heading" className="rdx-sr">
            Contact
          </h2>
          {email ? (
            <a href={`mailto:${email}`} className="rdx-mail" aria-label={email}>
              <Chars text={email} />
            </a>
          ) : (
            <Link to="/about" hash="contact" className="rdx-mail">
              Contact
            </Link>
          )}
          <div className="rdx-contact-links">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rdx-more"
              >
                {link.label} {link.handle}
                <ArrowUpRight aria-hidden="true" />
              </a>
            ))}
            <Link to="/about" className="rdx-more">
              経歴を見る
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
