import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { SplitHeading } from "@/components/SplitHeading";
import { splitIntoChunks } from "@/lib/chunks";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex flex-1 items-center justify-center bg-background px-6 py-12 text-foreground"
    >
      <section className="w-full max-w-2xl border-t border-border pt-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-border text-accent">
          {/* 行き先を探している、というページの役割を動きで補う */}
          <Compass className="notfound-compass h-6 w-6" aria-hidden="true" />
        </div>

        <SplitHeading
          as="p"
          text="404"
          skew
          delayStart={80}
          delayStep={90}
          className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-accent"
        />

        <SplitHeading
          as="h1"
          text="ページが見つかりません"
          chunks={splitIntoChunks("ページが見つかりません")}
          delayStart={260}
          delayStep={26}
          className="mt-3 text-3xl font-semibold tracking-tight text-foreground"
        />

        <p className="mt-4 text-sm leading-[1.9] text-muted">
          URL を確認するか、トップページから目的のページへ戻ってください。
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="focus-ring group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
            トップへ戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
