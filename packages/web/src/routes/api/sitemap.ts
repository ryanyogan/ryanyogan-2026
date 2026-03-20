/**
 * Dynamic sitemap.xml generation for SEO.
 *
 * This route generates a sitemap with all pages, blog posts, and projects.
 * The sitemap is referenced in robots.txt and submitted to search engines.
 *
 * Access at: /api/sitemap
 * Note: robots.txt should reference https://ryanyogan.com/api/sitemap
 */

import { createFileRoute } from "@tanstack/react-router";
import { getAllPosts } from "~/lib/content";
import { SITE_URL } from "~/lib/seo";

// Static pages with their change frequency and priority
const STATIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/work", changefreq: "monthly", priority: 0.8 },
  { path: "/projects", changefreq: "weekly", priority: 0.8 },
  { path: "/writing", changefreq: "weekly", priority: 0.9 },
];

function formatDate(date: Date): string {
  const iso = date.toISOString().split("T")[0];
  return iso ?? date.toISOString().substring(0, 10);
}

function generateSitemapXml(): string {
  const today = formatDate(new Date());
  const posts = getAllPosts();

  const urls: string[] = [];

  // Add static pages
  for (const page of STATIC_PAGES) {
    urls.push(`
    <url>
      <loc>${SITE_URL}${page.path}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`);
  }

  // Add blog posts
  for (const post of posts) {
    const lastmod = formatDate(new Date(post.date));
    urls.push(`
    <url>
      <loc>${SITE_URL}/writing/${post.slug}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${urls.join("")}
</urlset>`;
}

export const Route = createFileRoute("/api/sitemap")({
  server: {
    handlers: {
      GET: async () => {
        const xml = generateSitemapXml();

        return new Response(xml, {
          status: 200,
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      },
    },
  },
});
