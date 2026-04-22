"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setSiteVariant } from "@/lib/actions";
import { Monitor, RefreshCw } from "lucide-react";

/**
 * 開発環境でのみ表示されるデバッグ用オーバーレイ。
 * ビューポートサイズ（ブレークポイント）の確認と、
 * サイトバリアント（Portfolio / MathKB）のクイック切り替えを提供します。
 */
export function DevOverlay() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // NODE_ENV が development の場合のみマウントを許可
    if (process.env.NODE_ENV === "development") {
      setMounted(true);
    }
  }, []);

  if (!mounted) return null;

  const handleSwitch = async (v: "portfolio" | "mathkb" | "default") => {
    await setSiteVariant(v);
    router.refresh();
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start gap-3 pointer-events-none select-none">
      {/* ビューポートサイズ・インジケーター（ポートフォリオサイズ確認用） */}
      <div className="flex items-center gap-2 rounded-xl bg-zinc-900/90 px-3 py-2 text-[10px] font-black text-white shadow-2xl backdrop-blur-md ring-1 ring-white/10 dark:bg-white/90 dark:text-zinc-900 dark:ring-black/10">
        <Monitor className="h-3 w-3 text-sky-400 dark:text-sky-600" />
        <span className="opacity-50 uppercase tracking-[0.2em]">Size:</span>
        <span className="block sm:hidden">XS</span>
        <span className="hidden sm:block md:hidden">SM</span>
        <span className="hidden md:block lg:hidden">MD</span>
        <span className="hidden lg:block xl:hidden">LG</span>
        <span className="hidden xl:block 2xl:hidden">XL</span>
        <span className="hidden 2xl:block">2XL</span>
      </div>

      {/* バリアント切り替えボタン */}
      <div className="flex items-center gap-1 rounded-xl bg-zinc-900/90 p-1 shadow-2xl backdrop-blur-md ring-1 ring-white/10 pointer-events-auto dark:bg-white/90 dark:ring-black/10">
        <button
          onClick={() => handleSwitch("portfolio")}
          className="rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-400 transition-all hover:text-white dark:text-zinc-500 dark:hover:text-zinc-900"
        >
          Portfolio
        </button>
        <div className="h-3 w-[1px] bg-white/10 dark:bg-zinc-900/10" />
        <button
          onClick={() => handleSwitch("mathkb")}
          className="rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-400 transition-all hover:text-white dark:text-zinc-500 dark:hover:text-zinc-900"
        >
          MathKB
        </button>
        <div className="h-3 w-[1px] bg-white/10 dark:bg-zinc-900/10" />
        <button
          onClick={() => handleSwitch("default")}
          className="group flex h-7 w-7 items-center justify-center rounded-lg transition-all hover:bg-white/10 dark:hover:bg-zinc-900/10"
          title="Reset to Default"
        >
          <RefreshCw className="h-3 w-3 text-zinc-400 transition-transform group-hover:rotate-180 dark:text-zinc-500" />
        </button>
      </div>
    </div>
  );
}
