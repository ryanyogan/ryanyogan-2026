import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";

export default defineConfig({
  plugins: [
    // MDX support - must come before React
    mdx({
      remarkPlugins: [remarkGfm, remarkFrontmatter],
      providerImportSource: "@mdx-js/react",
    }),
    // Tailwind must come first for CSS processing
    tailwindcss(),
    // Cloudflare for Workers deployment
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    // TanStack Start for routing and SSR
    tanstackStart(),
    // React for JSX
    react(),
    // TypeScript path aliases
    tsconfigPaths(),
  ],
});
