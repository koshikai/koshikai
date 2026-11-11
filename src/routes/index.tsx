import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ParticleType } from "@/components/ParticleType";
import { Chars, CountUp, Layers, Pipeline, ResearchPapers, SectionHead, StackRows } from "@/components/rdx";
import { WorkItem } from "@/components/WorkItem";
import { operationFacts } from "@/lib/engineering";
import { profile } from "@/lib/profile";
import { featuredResearch } from "@/lib/research";
import { getSiteConfig } from "@/lib/site-config";
import { useReveal } from "@/lib/use-reveal";
import { featuredWorks, works } from "@/lib/works";
import { pad2 } from "@/lib/format";

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

function Home() {
  const ref = useReveal();
  const { email, links } = profile.contact;

  return (
    <main id="main-content" className="rdx" ref={ref}>
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
                  <span className="rdx-axis-no rdx-mono">{pad2(i + 1)}</span>
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

            <Pipeline />

            <div className="rdx-ops">
              <ol className="rdx-ops-facts" data-rv="stagger">
                {operationFacts.slice(0, 4).map((fact, i) => (
                  <li key={fact.title}>
                    <span className="rdx-mono" aria-hidden="true">
                      {pad2(i + 1)}
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
                <Layers />
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
        <ResearchPapers topics={featuredResearch} />
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
        <StackRows />
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
