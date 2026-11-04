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
  plugins: [
    tanstackStart(),
    viteReact(),
    tailwindcss(),
    mdx(),
  ],
}));
