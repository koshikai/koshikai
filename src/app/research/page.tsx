import type { Metadata } from "next";
import Image from "next/image";
import { CaseList } from "@/components/CaseList";
import { ResearchCard } from "@/components/ResearchCard";
import { ArrowLink, Container, PageHeader, SectionHeader } from "@/components/ui";
import { getCasesByAxis } from "@/lib/cases";
import { publications, researchCode, researchNotes, researchTopics } from "@/lib/research";

export const metadata: Metadata = {
  title: "Research",
  description:
    "強化学習によるネットワーク制御と、データ分析の取り組み。問題設定・手法・検証結果を分けてまとめています。",
  alternates: { canonical: "/research" },
};

const figureAlt =
  "Wnt5a モデルの制御結果。上段は目標集合へのハミング距離が時刻 2 で 0 に到達し以後維持される様子、下段は各時刻に除去したエッジを示すヒートマップ。";

const PUBLICATION_STATUS = { presented: "発表済み", accepted: "採択" } as const;

export default function ResearchPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          label="research — Research"
          title="問いを立て、データと実験で確かめる"
          description="ブーリアンネットワークの制御を中心に、強化学習と形式手法を組み合わせた研究をしています。データ分析の実務的なプロジェクトも含め、問題設定・手法・検証結果を分けてまとめています。"
        />

        <ul role="list" className="grid list-none grid-cols-1 gap-6 md:grid-cols-2">
          {researchTopics.map((topic) => (
            <li key={topic.slug}>
              <ResearchCard topic={topic} headingLevel="h2" />
            </li>
          ))}
        </ul>

        <figure className="mt-16 grid grid-cols-12 gap-x-6 gap-y-4">
          <div className="relative col-span-12 aspect-[2081/1535] w-full overflow-hidden rounded border border-border bg-background lg:col-span-8">
            <Image
              src="/images/research/trajectory-recovery-light.webp"
              alt={figureAlt}
              fill
              sizes="(min-width: 1024px) 720px, 100vw"
              className="object-contain dark:hidden"
            />
            <Image
              src="/images/research/trajectory-recovery-dark.webp"
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 1024px) 720px, 100vw"
              className="hidden object-contain dark:block"
            />
          </div>
          <figcaption className="col-span-12 self-end lg:col-span-4">
            <span className="block font-mono text-xs text-muted">Fig. Wnt5a / recovery constraint</span>
            <p className="mt-2 text-sm leading-[1.8] text-muted">
              学習した方策による制御の実行例。上段は目標集合へのハミング距離で、時刻 2 で 0 に到達し、到達期限を越えて以降も維持されています。下段は各時刻に除去したエッジで、
              <span className="text-accent">朱色のマス</span>
              が介入です。96 個の初期状態すべてで安定化に成功しました。
            </p>
          </figcaption>
        </figure>

        <section aria-labelledby="publications-heading" className="mt-20">
          <SectionHeader id="publications-heading" label="publications" title="発表" />
          <ul role="list" className="list-none border-t border-border">
            {publications.map((pub) => (
              <li key={pub.title} className="grid grid-cols-12 gap-x-6 gap-y-2 border-b border-border py-5">
                <p className="col-span-12 font-mono text-xs text-muted md:col-span-2 md:leading-6">{pub.date}</p>
                <div className="col-span-12 md:col-span-10">
                  <p className="text-[0.9375rem] font-medium leading-relaxed text-foreground">{pub.title}</p>
                  <p className="mt-1.5 text-sm text-muted">
                    {pub.venue} · {pub.format} · {PUBLICATION_STATUS[pub.status]}
                    {pub.award && <span className="text-foreground"> · {pub.award}</span>}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="notes-heading" className="mt-20">
          <SectionHeader id="notes-heading" label="notes & code" title="関連コンテンツ" />
          <ul role="list" className="grid list-none grid-cols-1 gap-6 md:grid-cols-2">
            {researchNotes.map((note) => (
              <li key={note.href} className="rounded border border-border p-5">
                <p className="font-mono text-xs text-muted">note</p>
                <p className="mt-1.5 text-base font-semibold text-foreground">{note.title}</p>
                <p className="mt-1.5 text-sm leading-[1.8] text-muted">{note.description}</p>
                <ArrowLink href={note.href} className="mt-2">
                  {note.title} を開く
                </ArrowLink>
              </li>
            ))}
            <li className="rounded border border-border p-5">
              <p className="font-mono text-xs text-muted">code</p>
              <p className="mt-1.5 text-base font-semibold text-foreground">{researchCode.label}</p>
              <p className="mt-1.5 text-sm leading-[1.8] text-muted">{researchCode.description}</p>
              <ArrowLink href={researchCode.href} className="mt-2">
                GitHub で見る
              </ArrowLink>
            </li>
          </ul>
        </section>

        <section aria-labelledby="research-cases" className="mt-20">
          <SectionHeader id="research-cases" label="case studies" title="研究・分析の事例" />
          <CaseList items={getCasesByAxis("research")} />
        </section>
      </Container>
    </main>
  );
}
