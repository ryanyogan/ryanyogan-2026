import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import { getFeaturedProjects, getAllPosts, type ProjectMeta, type PostMeta } from "~/lib/content";

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
      {/* About */}
      <section className="section">
        <h2 className="section-title">About</h2>
        <div className="bio">
          <p>
            I'm an engineering leader with <strong>20 years</strong> of experience building 
            teams and products. I've worked at{" "}
            <a href="https://procore.com" target="_blank" rel="noopener noreferrer" className="text-link">
              Procore
            </a>{" "}
            (pre-IPO) and{" "}
            <a href="https://peak6.com" target="_blank" rel="noopener noreferrer" className="text-link">
              Peak6
            </a>{" "}
            (high-frequency trading), and built engineering teams from 0 to 40+ people at 
            various startups. See my{" "}
            <Link to="/work" className="text-link">
              full work history
            </Link>.
          </p>
          <p>
            I'm passionate about <strong>embedded systems</strong>, <strong>AI</strong>, 
            and <strong>robotics</strong> - building software that controls hardware. 
            When I'm not coding, you'll find me playing hockey or working on side projects.
          </p>
          <p>
            Based in <strong>Chicago, IL</strong>. Currently open to new opportunities.
          </p>
        </div>
      </section>

      {/* Writing */}
      <section className="section">
        <h2 className="section-title">Writing</h2>
        <div className="writing-list">
          {posts.map((post) => (
            <Link 
              key={post.slug}
              to="/writing/$slug" 
              params={{ slug: post.slug }} 
              className="writing-item"
            >
              <span className="writing-title">{post.title}</span>
              <span className="writing-date">{new Date(post.date).getFullYear()}</span>
            </Link>
          ))}
        </div>
        <Link to="/writing" className="section-link">
          all writing
        </Link>
      </section>

      {/* Projects */}
      <section className="section">
        <h2 className="section-title">Projects</h2>
        <div className="projects-list">
          {projects.slice(0, 3).map((project) => {
            const href = project.url || project.githubUrl;
            const isExternal = href?.startsWith("http");

            const content = (
              <div className="project-item-content">
                <span className="project-name">{project.name}</span>
                <span className="project-description">{project.description}</span>
                <span className="project-tech-inline">{project.tech.join(", ")}</span>
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
