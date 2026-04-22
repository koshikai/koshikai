"use client";

import { useRouter } from "next/navigation";
import { setSiteVariant } from "@/lib/actions";

interface VariantSwitcherProps {
  currentVariant: string;
}

export function VariantSwitcher({ currentVariant }: VariantSwitcherProps) {
  const router = useRouter();

  const handleSwitch = async (v: "portfolio" | "mathkb" | "default") => {
    await setSiteVariant(v);
    router.refresh();
  };

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 sm:justify-start">
      <button
        onClick={() => handleSwitch("portfolio")}
        className={`transition-colors hover:text-zinc-600 ${
          currentVariant === "portfolio" ? "text-sky-500 underline underline-offset-4" : ""
        }`}
      >
        Portfolio
      </button>
      <button
        onClick={() => handleSwitch("mathkb")}
        className={`transition-colors hover:text-zinc-600 ${
          currentVariant === "mathkb" ? "text-sky-500 underline underline-offset-4" : ""
        }`}
      >
        MathKB
      </button>
      <button
        onClick={() => handleSwitch("default")}
        className="transition-colors hover:text-zinc-600"
      >
        Reset to Default
      </button>
    </div>
  );
}
