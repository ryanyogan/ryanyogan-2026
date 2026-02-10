import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Plugin to load content at build time from markdown files.
 * Creates a virtual module "virtual:content" with projects and posts data.
 */
function contentPlugin(): Plugin {
  const virtualModuleId = "virtual:content";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "content-plugin",
    resolveId(id: string) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const contentDir = path.resolve(__dirname, "content");

        // Load projects from projects.md
        const projectsPath = path.join(contentDir, "projects.md");
        let projects: unknown[] = [];
        if (fs.existsSync(projectsPath)) {
          const projectsFile = fs.readFileSync(projectsPath, "utf-8");
          const { data } = matter(projectsFile);
          projects = data.projects || [];
        }

        // Load posts from writing/*.mdx frontmatter
        const writingDir = path.join(contentDir, "writing");
        const posts: unknown[] = [];
        if (fs.existsSync(writingDir)) {
          const mdxFiles = fs
            .readdirSync(writingDir)
            .filter((f) => f.endsWith(".mdx"));
          for (const file of mdxFiles) {
            const content = fs.readFileSync(
              path.join(writingDir, file),
              "utf-8"
            );
            const { data } = matter(content);
            posts.push({
              slug: file.replace(".mdx", ""),
              title: data.title || "",
              date: data.date || "",
              description: data.description || "",
              featured: data.featured || false,
            });
          }
        }

        return `
          export const projects = ${JSON.stringify(projects)};
          export const posts = ${JSON.stringify(posts)};
        `;
      }
    },
  };
}

export default defineConfig({
  plugins: [
    // Content loading (must be early for virtual module)
    contentPlugin(),
    // MDX support - must come before React
    mdx({
      remarkPlugins: [remarkGfm, remarkFrontmatter],
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
