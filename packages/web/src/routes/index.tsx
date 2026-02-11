import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import {
  getFeaturedProjects,
  getAllPosts,
  type ProjectMeta,
  type PostMeta,
} from "~/lib/content";

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: async () => {
    const projects = getFeaturedProjects();
    const posts = getAllPosts().slice(0, 3); // Top 3 most recent
    return { projects, posts };
  },
  head: () => ({
    meta: [
      { title: "Ryan Yogan" },
      { property: "og:title", content: "Ryan Yogan" },
      {
        name: "description",
        content:
          "Engineering leader with 20 years of experience building teams and products. Based in Chicago.",
      },
    ],
  }),
});

function HomePage() {
  const { projects, posts } = Route.useLoaderData() as {
    projects: ProjectMeta[];
    posts: PostMeta[];
  };

  return (
    <PageLayout>
      {/* Bio - no header, close to nav */}
      <section className="bio-section">
        <div className="bio">
          <p>
            Engineering leader with <strong>20 years</strong> of experience
            building teams and products. I've worked at orgs such as{" "}
            <a
              href="https://procore.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Procore
            </a>{" "}
            (pre-IPO SaaS) to{" "}
            <a
              href="https://peak6.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Peak6
            </a>{" "}
            (high-frequency trading) and just about every type of org
            in-between. I've created engineering teams from 0 to 40+ people
            spanning a wide variety of technolgical domains. See my{" "}
            <Link to="/work" className="text-link">
              full work history
            </Link>
            .
          </p>
          <p>
            I'm passionate about building <strong>AI</strong>,{" "}
            <strong>embedded systems</strong>, and <strong>robotics</strong> -
            building software that controls hardware. When I'm not coding,
            you'll find me watching our boy play hockey, pretending like I can
            still skate, out in the snow with my better half, working on
            robotics with our other kiddo, or half-finishing side projects.
          </p>
        </div>
        <p className="keyboard-hint">
          <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd> to search
        </p>
      </section>

      {/* Writing */}
      <section className="section">
        <h2 className="section-header">Writing</h2>
        <div className="writing-list">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to="/writing/$slug"
              params={{ slug: post.slug }}
              className="writing-item"
            >
              <span className="writing-title">{post.title}</span>
              <span className="writing-date">
                {new Date(post.date).getFullYear()}
              </span>
            </Link>
          ))}
        </div>
        <Link to="/writing" className="section-link">
          all writing
        </Link>
      </section>

      {/* Projects */}
      <section className="section">
        <h2 className="section-header">Projects</h2>
        <div className="projects-list">
          {projects.slice(0, 3).map((project) => {
            const href = project.url || project.github;
            const isExternal = href?.startsWith("http");

            const content = (
              <div className="project-item-content">
                <div className="project-item-header">
                  <span className="project-name">{project.name}</span>
                  <span className="project-tech-inline">
                    {project.tech.join(", ")}
                  </span>
                </div>
                <span className="project-description-truncated">
                  {project.description}
                </span>
              </div>
            );

            if (href) {
              return (
                <a
                  key={project.slug}
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="project-item"
                >
                  {content}
                </a>
              );
            }

            return (
              <div key={project.slug} className="project-item">
                {content}
              </div>
            );
          })}
        </div>
        <Link to="/projects" className="section-link">
          all projects
        </Link>
      </section>
    </PageLayout>
  );
}
