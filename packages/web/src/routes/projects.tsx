import { createFileRoute } from "@tanstack/react-router";
import { ExternalLinkIcon, GitHubIcon } from "~/components/ui/icons";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
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
  const featured = [
    {
      title: "Yogan Hockey",
      description: "Real-time NHL stats app built with Phoenix LiveView. Uses ETS for incremental static regeneration, outperforming Next.js in speed tests.",
      href: "https://yogan-hockey.fly.dev",
      github: "https://github.com/ryanyogan/yogan-hockey",
      tags: ["Elixir", "Phoenix", "LiveView", "Tailwind"],
      image: null,
    },
    {
      title: "10.yogan.dev",
      description: "Westworld-themed Valentine's Day experience with immersive animations, custom cursors, and cinematic transitions.",
      href: "https://10.yogan.dev",
      github: "https://github.com/ryanyogan/10-year",
      tags: ["React", "GSAP", "Framer Motion", "Design"],
      image: null,
    },
    {
      title: "Ice Yeti",
      description: "Hockey social network for players, coaches, and fans. Team management, game scheduling, and stats tracking.",
      href: "https://slax.yogan.dev",
      github: null,
      tags: ["Elixir", "Phoenix", "LiveView", "PostgreSQL"],
      image: null,
    },
  ];

  const sideProjects = [
    {
      title: "ryanyogan.com",
      description: "This site. AI-powered personal website with TanStack Start on Cloudflare Workers.",
      href: "https://github.com/ryanyogan/ryanyogan.com",
      tags: ["TanStack Start", "Cloudflare", "Workers AI"],
    },
    {
      title: "Embedded Training System",
      description: "Ice training equipment with embedded sensors. Hardware meets software for athlete performance tracking.",
      href: null,
      tags: ["Embedded", "Rust", "IoT", "Hardware"],
    },
    {
      title: "AI Dev Experiments",
      description: "Collection of experiments with LLMs for code generation, review, and documentation.",
      href: "https://github.com/ryanyogan",
      tags: ["AI", "LLM", "TypeScript"],
    },
  ];

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Projects</h1>
        <p className="page-description">
          A mix of open source work, side projects, and experiments. Most of my professional 
          work is proprietary, but I share what I can.
        </p>
      </header>

      {/* Featured Projects */}
      <section className="section">
        <h2 className="section-label">Featured</h2>
        <div className="featured-grid">
          {featured.map((project) => (
            <div key={project.title} className="featured-card">
              <div className="featured-card-content">
                <div className="featured-card-header">
                  <h3 className="featured-card-title">{project.title}</h3>
                  <div className="featured-card-links">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-btn-sm"
                        aria-label="View source on GitHub"
                      >
                        <GitHubIcon size={16} />
                      </a>
                    )}
                    {project.href && (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-btn-sm"
                        aria-label="Visit project"
                      >
                        <ExternalLinkIcon size={16} />
                      </a>
                    )}
                  </div>
                </div>
                <p className="featured-card-desc">{project.description}</p>
                <div className="tag-list">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Side Projects */}
      <section className="section">
        <h2 className="section-label">Side Projects</h2>
        <div className="project-list">
          {sideProjects.map((project) => (
            <a
              key={project.title}
              href={project.href || undefined}
              target={project.href ? "_blank" : undefined}
              rel={project.href ? "noopener noreferrer" : undefined}
              className={`project-list-item ${project.href ? "is-link" : ""}`}
            >
              <div className="project-list-content">
                <h3 className="project-list-title">
                  {project.title}
                  {project.href && <ExternalLinkIcon size={14} className="project-list-icon" />}
                </h3>
                <p className="project-list-desc">{project.description}</p>
              </div>
              <div className="tag-list-inline">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag-sm">{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
