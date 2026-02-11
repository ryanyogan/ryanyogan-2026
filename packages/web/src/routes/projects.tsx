import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import {
  getFeaturedProjects,
  getOtherProjects,
  getProjectPost,
  type ProjectMeta,
} from "~/lib/content";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  loader: async () => {
    const featured = getFeaturedProjects();
    const other = getOtherProjects();
    return { featured, other };
  },
  head: () => ({
    meta: [
      { title: "Projects - Ryan Yogan" },
      {
        name: "description",
        content: "Open source projects and things I've built.",
      },
      { property: "og:title", content: "Projects - Ryan Yogan" },
    ],
  }),
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
