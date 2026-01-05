import Link from "next/link";
import { auth } from "@/auth";
import { Activity, ArrowUpRight, Cpu, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    title: "ノード認識ワークフロー",
    description: "タスクをクラスタ、ホスト、またはサービスに関連付け、すべての実行を整理して管理します。",
    icon: Cpu,
  },
  {
    title: "ローカルファーストのセキュリティ",
    description: "資格情報はハードウェア内に留まり、変更履歴は監査可能な形で追跡されます。",
    icon: ShieldCheck,
  },
  {
    title: "オートメーションフック",
    description: "タスクの完了に合わせて、スクリプト、WebHook、および後続のプレイブックをトリガーします。",
    icon: Sparkles,
  },
];

export default async function Home() {
  const session = await auth();

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-5%] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl motion-safe:animate-[floatSlow_16s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-80 w-80 rounded-full bg-amber-500/20 blur-3xl motion-safe:animate-[floatSlow_18s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.6),transparent_70%)]" />
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-7 motion-safe:animate-[fadeUp_0.9s_ease-out]">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-300/80">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                セルフホスト
              </span>
              <span className="text-slate-400">Proxmox オペレーター向けに構築</span>
            </div>

            <h1 className="text-4xl font-semibold leading-tight text-slate-100 sm:text-6xl">
              ホームラボのタスクを
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300">
                Koshikai<span className="text-slate-100">.PMX</span>
              </span>
              でオーケストレート。
            </h1>

            <p className="max-w-xl text-base text-slate-300 sm:text-lg">
              Proxmoxクラスタのためのセキュアなコマンドセンター。メンテナンスの追跡、ルーチンの自動化、クラウドに依存しないホームラボの信頼性維持をサポートします。
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {session ? (
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-amber-400 px-8 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
                >
                  ダッシュボードへ移動
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-amber-400 px-8 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
                  >
                    ログイン
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                  >
                    新規登録
                  </Link>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                ローカルストレージのみ
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                自動化対応済み
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                監査証跡を同梱
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_35px_80px_-55px_rgba(15,23,42,0.9)] backdrop-blur motion-safe:animate-[fadeUp_1.1s_ease-out]">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">クラスタ・パルス</span>
              <span className="inline-flex items-center gap-2 text-xs text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                オンライン
              </span>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>ノード稼働状況</span>
                  <span className="text-lg font-semibold text-white">3/3</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-emerald-300">
                  <Activity className="h-3 w-3" />
                  すべてのサービスが健全
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>キュー内のタスク</span>
                  <span className="text-lg font-semibold text-white">12</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-cyan-300">
                  <ArrowUpRight className="h-3 w-3" />
                  夜間に4件の予定
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>レイテンシ</span>
                  <span className="text-lg font-semibold text-white">14ms</span>
                </div>
                <div className="mt-2 text-xs text-slate-400">エッジゲートウェイ、有線</div>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
              <span className="font-mono text-cyan-200">pve-node-01</span> - スナップショットウィンドウ 02:00 開始
            </div>
          </div>
        </div>

        <section id="features" className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-amber-400/20 text-cyan-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
                <div className="mt-6 h-px w-full bg-gradient-to-r from-cyan-400/40 via-amber-400/10 to-transparent" />
              </div>
            );
          })}
        </section>

      </main>
    </div>
  );
}
