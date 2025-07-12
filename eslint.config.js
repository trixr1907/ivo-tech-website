import { baseConfig } from "@config/eslint/base";

/** @type {import("eslint").Linter.Config} */
export default [
  ...baseConfig,
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".next/**",
      ".turbo/**",
      "coverage/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
    ],
  },
];
