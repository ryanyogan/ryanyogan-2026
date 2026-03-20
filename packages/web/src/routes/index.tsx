import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import {
  getFeaturedProjects,
  getAllPosts,
  type ProjectMeta,
  type PostMeta,
} from "~/lib/content";
import {
  generateMeta,
  generateLinks,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
  getPersonSchema,
  getWebsiteSchema,
  serializeJsonLd,
} from "~/lib/seo";

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: async () => {
    const projects = getFeaturedProjects();
    const posts = getAllPosts().slice(0, 3); // Top 3 most recent
    return { projects, posts };
  },
  head: () => ({
    meta: generateMeta({
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      path: "/",
      ogImage: `${SITE_URL}/og/home.png`,
      keywords: [
        "Ryan Yogan",
        "engineering leader",
        "software engineer",
        "Chicago",
        "React",
        "TypeScript",
        "Elixir",
        "team building",
      ],
    }),
    links: generateLinks("/"),
    scripts: [
      {
        type: "application/ld+json",
        children: serializeJsonLd([getPersonSchema(), getWebsiteSchema()]),
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
      {/* Bio - three-tier typography hierarchy */}
      <section className="bio-section">
        <p className="bio-tagline">
          Engineering leader with <strong>20 years</strong> of experience
          building teams and products.{" "}
          <Link to="/work" className="text-link">
            Work history <span aria-hidden="true">→</span>
          </Link>
        </p>
        <p className="bio-description">
          I'm passionate about building <strong>AI</strong>,{" "}
          <strong>embedded systems</strong>, and <strong>robotics</strong> —
          building software that controls hardware.
        </p>
        <p className="bio-aside">
          When I'm not coding, you'll find me watching our boy play hockey,
          pretending like I can still skate, out in the snow with my better
          half, working on robotics with our other kiddo, or half-finishing
          side projects.
        </p>
        <button
          className="keyboard-hint"
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              bubbles: true,
            });
            window.dispatchEvent(event);
          }}
          aria-label="Open command palette"
        >
          <kbd>⌘</kbd><kbd>K</kbd> <span className="keyboard-hint-text">to search</span>
        </button>
      </section>

      {/* Writing */}
      <section className="section">
        <Link to="/writing" className="section-header-link">
          <h2 className="section-header">Writing</h2>
        </Link>
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
        <Link to="/projects" className="section-header-link">
          <h2 className="section-header">Projects</h2>
        </Link>
        <div className="projects-list-home">
          {projects.slice(0, 3).map((project) => (
            <Link
              key={project.slug}
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="project-item-home"
            >
              <span className="project-name">{project.name}</span>
              <span className="project-tagline">{project.tagline}</span>
            </Link>
          ))}
        </div>
        <Link to="/projects" className="section-link">
          all projects
        </Link>
      </section>
    </PageLayout>
  );
}
