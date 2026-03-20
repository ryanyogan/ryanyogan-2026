import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import { getProjectBySlug, getProjectPost, type ProjectMeta } from "~/lib/content";
import {
  generateMeta,
  generateLinks,
  SITE_URL,
  getProjectSchema,
  getBreadcrumbSchema,
  serializeJsonLd,
} from "~/lib/seo";
import { highlight } from "sugar-high";

/**
 * Simple markdown renderer for README content.
 * Handles: headers, code blocks, inline code, links, lists, bold, italic, blockquotes, hr
 */
function renderMarkdown(markdown: string): string {
  const html = markdown
    // Escape HTML first
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Code blocks with syntax highlighting (```lang ... ```)
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
      const trimmedCode = code.trim();
      const highlighted = highlight(trimmedCode);
      return `<pre data-language="${lang || ""}"><code class="language-${lang || "text"}">${highlighted}</code></pre>`;
    })
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Headers (process from h6 to h1 to avoid conflicts)
    .replace(/^###### (.+)$/gm, "<h6>$1</h6>")
    .replace(/^##### (.+)$/gm, "<h5>$1</h5>")
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // Blockquotes
    .replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>")
    // Horizontal rules
    .replace(/^---$/gm, "<hr />")
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // Paragraphs - wrap non-tagged lines
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      // Don't wrap if already a block element
      if (
        block.startsWith("<h") ||
        block.startsWith("<pre") ||
        block.startsWith("<blockquote") ||
        block.startsWith("<hr") ||
        block.startsWith("<li")
      ) {
        // Wrap consecutive <li> in <ul>
        if (block.includes("<li>")) {
          return `<ul>${block}</ul>`;
        }
        return block;
      }
      // Wrap in paragraph
      return `<p>${block.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return html;
}

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectDetailPage,
  loader: async ({ params }) => {
    const project = getProjectBySlug(params.slug);
    if (!project) {
      throw notFound();
    }
    const relatedPost = getProjectPost(params.slug);
    return { project, relatedPost };
  },
  head: ({ loaderData }) => {
    const project = loaderData?.project;

    if (!project) {
      return {
        meta: [{ title: "Project - Ryan Yogan" }],
      };
    }

    return {
      meta: generateMeta({
        title: project.name,
        description: project.tagline,
        path: `/projects/${project.slug}`,
        ogImage: `${SITE_URL}/og/projects.png`,
        keywords: ["Ryan Yogan", "project", project.name, ...project.tech],
      }),
      links: generateLinks(`/projects/${project.slug}`),
      scripts: [
        {
          type: "application/ld+json",
          children: serializeJsonLd([
            getProjectSchema(project),
            getBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Projects", url: "/projects" },
              { name: project.name, url: `/projects/${project.slug}` },
            ]),
          ]),
        },
      ],
    };
  },
});

function ProjectDetailPage() {
  const { project, relatedPost } = Route.useLoaderData() as {
    project: ProjectMeta;
    relatedPost: { slug: string; title: string } | undefined;
  };

  // Format tech stack as readable text
  const techText = project.tech.join(", ");

  // Build links array for cleaner rendering
  const links = [
    project.github && { href: project.github, label: "GitHub" },
    project.url && { href: project.url, label: "Live Site" },
    project.npm && { href: project.npm, label: "npm" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <PageLayout>
      <article className="project-detail">
        {/* Back navigation */}
        <Link to="/projects" className="project-detail-back">
          <span aria-hidden="true">←</span> Projects
        </Link>

        {/* Header: Title + Tagline */}
        <header className="project-detail-header">
          <h1 className="project-detail-title">{project.name}</h1>
          <p className="project-detail-tagline">{project.tagline}</p>
        </header>

        {/* Meta: Tech stack + Links */}
        <div className="project-detail-meta">
          <p className="project-detail-tech">
            <span className="project-detail-label">Built with</span> {techText}
          </p>

          {links.length > 0 && (
            <p className="project-detail-links">
              {links.map((link, i) => (
                <span key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-detail-link"
                  >
                    {link.label}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                  {i < links.length - 1 && <span className="project-detail-link-sep"> · </span>}
                </span>
              ))}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="project-detail-description">
          <p>{project.description}</p>
        </div>

        {/* Related blog post */}
        {relatedPost && (
          <div className="project-detail-writeup">
            <Link
              to="/writing/$slug"
              params={{ slug: relatedPost.slug }}
              className="project-detail-writeup-link"
            >
              Read the write-up <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        {/* README content */}
        {project.readme && (
          <section className="project-detail-readme">
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(project.readme) }}
            />
          </section>
        )}
      </article>
    </PageLayout>
  );
}
