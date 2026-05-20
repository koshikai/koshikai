"use client";

import { useRouter } from "next/navigation";
import { setSiteVariant } from "@/lib/actions";
import type { SiteVariant } from "@/lib/site-config";

interface VariantSwitcherProps {
  currentVariant: SiteVariant;
}

export function VariantSwitcher({ currentVariant }: VariantSwitcherProps) {
  const router = useRouter();

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const handleSwitch = async (v: "portfolio" | "notes" | "default") => {
    await setSiteVariant(v);
    router.refresh();
  };

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 sm:justify-start">
      <button
        onClick={() => handleSwitch("portfolio")}
        className={`transition-colors hover:text-zinc-600 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded ${
          currentVariant === "portfolio" ? "text-sky-500 underline underline-offset-4" : ""
        }`}
      >
        Portfolio
      </button>
      <button
        onClick={() => handleSwitch("notes")}
        className={`transition-colors hover:text-zinc-600 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded ${
          currentVariant === "notes" ? "text-sky-500 underline underline-offset-4" : ""
        }`}
      >
        notes
      </button>
      <button
        onClick={() => handleSwitch("default")}
        className="transition-colors hover:text-zinc-600 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
      >
        Reset to Default
      </button>
    </div>
  );
}
