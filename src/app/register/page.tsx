"use client";

import { useActionState } from "react";
import { register } from "@/app/actions";
import Link from "next/link";
import { Server, User, Mail, Lock } from "lucide-react";

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(register, undefined);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[-10%] h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl motion-safe:animate-[floatSlow_18s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-15%] left-[-10%] h-72 w-72 rounded-full bg-amber-500/20 blur-3xl motion-safe:animate-[floatSlow_20s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_60%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_35px_80px_-55px_rgba(15,23,42,0.9)] backdrop-blur motion-safe:animate-[fadeUp_0.8s_ease-out]">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-amber-400 text-slate-950">
                <Server className="h-6 w-6" />
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">新規ポータル</span>
            </div>

            <h2 className="mt-6 text-3xl font-semibold text-white">アカウント作成</h2>
            <p className="mt-2 text-sm text-slate-300">
              Proxmox ルーチンのためのセキュアなワークスペースを開始しましょう。
            </p>

            <form action={action} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 pl-11 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                    placeholder="氏名（フルネーム）"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 pl-11 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                    placeholder="メールアドレス"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 pl-11 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                    placeholder="パスワード"
                  />
                </div>
              </div>

              {state?.error && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
                  {state.error}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:opacity-60"
              >
                {isPending ? "アカウント作成中..." : "新規登録"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-300">
              <span>すでにアカウントをお持ちですか？ </span>
              <Link href="/login" className="font-semibold text-cyan-200 hover:text-cyan-100">
                ログイン
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
