import { defineConfig } from "vite-plus";

export default defineConfig({
  // ============================================
  // OXLINT: Linter configuration
  // ============================================
  lint: {
    ignorePatterns: [
      "dist/**",
      ".output/**",
      "node_modules/**",
      "coverage/**",
      "*.gen.ts",
      "**/scripts/**",
      "**/seed.ts",
    ],
    rules: {
      "no-console": ["warn", { allow: ["warn", "error", "log"] }],
    },
  },

  // ============================================
  // OXFMT: Formatter configuration
  // ============================================
  fmt: {
    semi: true,
    singleQuote: false,
    tabWidth: 2,
    useTabs: false,
    trailingComma: "es5",
    sortPackageJson: true,
  },

  // ============================================
  // PRE-COMMIT: Staged file checks
  // ============================================
  staged: {
    "*.{js,ts,tsx,jsx,json,md,mdx}": "vp check --fix",
  },
});
