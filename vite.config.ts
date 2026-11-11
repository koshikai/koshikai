import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";

export default defineConfig(({ command }) => ({
  resolve: {
    tsconfigPaths: true,
  },
  ssr: {
    noExternal: command === "build" ? true : undefined,
  },
  build: {
    // 小さなフォントを data: URI にしない。CSP の font-src 'self' に弾かれ、
    // その文字だけ代替フォントで描かれてしまう。
    assetsInlineLimit: 0,
  },
  plugins: [
    tanstackStart(),
    viteReact(),
    tailwindcss(),
    mdx(),
  ],
}));
