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
  let html = markdown
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

  return (
    <PageLayout>
      <Link to="/projects" className="post-back">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        back to projects
      </Link>

      <article className="project-detail">
        <header className="project-detail-header">
          <h1 className="project-detail-title">{project.name}</h1>
          <p className="project-detail-tagline">{project.tagline}</p>
        </header>

        <div className="project-detail-content">
          {project.openSource && <span className="project-detail-badge">Open Source</span>}

          <p className="project-detail-description">{project.description}</p>

          <div className="project-detail-tech">
            {project.tech.map((tech) => (
              <span key={tech} className="project-detail-tech-tag">
                {tech}
              </span>
            ))}
          </div>

          <div className="project-detail-links">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="project-detail-link"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-detail-link"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
                Live Site
              </a>
            )}
            {project.npm && (
              <a
                href={project.npm}
                target="_blank"
                rel="noopener noreferrer"
                className="project-detail-link"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
                </svg>
                npm
              </a>
            )}
          </div>

          {relatedPost && (
            <div className="project-detail-writeup">
              <Link
                to="/writing/$slug"
                params={{ slug: relatedPost.slug }}
                className="project-detail-writeup-link"
              >
                Read the write-up
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}

          {project.readme && (
            <div className="project-detail-readme">
              <h2 className="project-detail-readme-title">README</h2>
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(project.readme) }}
              />
            </div>
          )}
        </div>
      </article>
    </PageLayout>
  );
}
