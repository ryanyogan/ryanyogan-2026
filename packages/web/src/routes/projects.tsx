import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import { getProjects } from "~/lib/server/db";
import type { Project } from "@ryanyogan/db/schema";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  loader: async () => {
    const projects = await getProjects();
    return { projects };
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

function ProjectsPage() {
  const { projects } = Route.useLoaderData() as { projects: Project[] };

  return (
    <PageLayout>
      <h1 style={{ marginBottom: "1rem" }}>projects</h1>
      <p style={{ color: "var(--color-muted)", marginBottom: "2rem" }}>
        A mix of open source work, side projects, and experiments.
      </p>

      <div className="projects-list">
        {projects.map((project) => {
          const href = project.url || project.githubUrl;
          const isExternal = href?.startsWith("http");

          if (href) {
            return (
              <a
                key={project.id}
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="project-item"
              >
                <span className="project-name">{project.name}</span>
                <span className="project-description">{project.description}</span>
              </a>
            );
          }

          return (
            <div key={project.id} className="project-item">
              <span className="project-name">{project.name}</span>
              <span className="project-description">{project.description}</span>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
