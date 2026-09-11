import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * OG 画像用のフォント。satori は woff2 を読めないので woff を渡す。
 * 見出しに日本語が入るため、Noto Sans JP は分割前の japanese サブセットを使う
 * （ビルド時・サーバー側でしか読まないので、ブラウザの転送量には影響しない）。
 */
export async function loadOgFonts() {
  const fontsDir = join(process.cwd(), "node_modules", "@fontsource");
  const [sansJa, sansLatin, mono] = await Promise.all([
    readFile(join(fontsDir, "noto-sans-jp", "files", "noto-sans-jp-japanese-700-normal.woff")),
    readFile(join(fontsDir, "noto-sans-jp", "files", "noto-sans-jp-latin-700-normal.woff")),
    readFile(join(fontsDir, "jetbrains-mono", "files", "jetbrains-mono-latin-400-normal.woff")),
  ]);
  return [
    { name: "Noto Sans JP", data: sansLatin, style: "normal" as const, weight: 700 as const },
    { name: "Noto Sans JP", data: sansJa, style: "normal" as const, weight: 700 as const },
    { name: "JetBrains Mono", data: mono, style: "normal" as const, weight: 400 as const },
  ];
}

export const OG_COLORS = {
  background: "#fafaf7",
  foreground: "#17171a",
  muted: "#62626a",
  border: "#e4e3dc",
  accent: "#c0392b",
};

export const OG_SIZE = { width: 1200, height: 630 };
