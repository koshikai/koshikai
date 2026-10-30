import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@next/next/no-head-element": "off",
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([
    ".next/**",
    ".tanstack/**",
    "dist/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "server.mjs",
  ]),
]);

export default eslintConfig;
