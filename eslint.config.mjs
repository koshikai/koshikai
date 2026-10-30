import js from "@eslint/js";
import ts from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  globalIgnores([
    ".next/**",
    ".tanstack/**",
    ".vinxi/**",
    "dist/**",
    "out/**",
    "build/**",
    "server.mjs",
    "src/routeTree.gen.ts",
    "node_modules/**",
  ]),
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    extends: [
      js.configs.recommended,
      ...ts.configs.recommended,
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
