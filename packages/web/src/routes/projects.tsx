import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import {
  getFeaturedProjects,
  getOtherProjects,
  getProjectPost,
  getAllProjects,
  type ProjectMeta,
} from "~/lib/content";
import {
  generateMeta,
  generateLinks,
  SITE_URL,
  getProjectsPageSchema,
  getBreadcrumbSchema,
  serializeJsonLd,
} from "~/lib/seo";

const PROJECTS_DESCRIPTION = "Open source projects and things I've built.";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  loader: async () => {
    const featured = getFeaturedProjects();
    const other = getOtherProjects();
    const allProjects = getAllProjects();
    return { featured, other, allProjects };
  },
  head: ({ loaderData }) => {
    const projects = loaderData?.allProjects || [];
    return {
      meta: generateMeta({
        title: "Projects",
        description: PROJECTS_DESCRIPTION,
        path: "/projects",
        ogImage: `${SITE_URL}/og/projects.png`,
        keywords: [
          "Ryan Yogan",
          "projects",
          "open source",
          "Elixir",
          "Phoenix",
          "React",
          "TypeScript",
          "Cloudflare Workers",
        ],
      }),
      links: generateLinks("/projects"),
      scripts: [
        {
          type: "application/ld+json",
          children: serializeJsonLd([
            getProjectsPageSchema(projects),
            getBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Projects", url: "/projects" },
            ]),
          ]),
        },
      ],
    };
  },
});

function ProjectItem({ project }: { project: ProjectMeta }) {
  const href = project.url || project.github;
  const isExternal = href?.startsWith("http");
  const blogPost = getProjectPost(project.slug);

  const content = (
    <div className="project-item-content">
      <div className="project-item-header">
        <span className="project-name">{project.name}</span>
        <span className="project-tech-inline">{project.tech.join(", ")}</span>
      </div>
      <span className="project-description">{project.description}</span>
      {blogPost && (
        <Link
          to="/writing/$slug"
          params={{ slug: blogPost.slug }}
          className="project-read-more"
          onClick={(e) => e.stopPropagation()}
        >
          Read the write-up
        </Link>
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="project-item"
      >
        {content}
      </a>
    );
  }

  return <div className="project-item">{content}</div>;
}

function ProjectsPage() {
  const { featured, other } = Route.useLoaderData();

  return (
    <PageLayout>
      <header className="section-header-with-description">
        <h2 className="section-header">Projects</h2>
        <p className="page-description">
          A mix of open source work, side projects, and experiments.
        </p>
      </header>

      {/* 2026 Projects */}
      {featured.length > 0 && (
        <section className="projects-section">
          <h2 className="projects-section-title">2026 Projects</h2>
          <div className="projects-list">
            {featured.map((project) => (
              <ProjectItem key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Past Projects & Repositories */}
      {other.length > 0 && (
        <section className="projects-section">
          <h2 className="projects-section-title">Past Projects & Repositories</h2>
          <div className="projects-list">
            {other.map((project) => (
              <ProjectItem key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}
    </PageLayout>
  );
}
