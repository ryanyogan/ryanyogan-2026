import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import { getFeaturedProjects, getAllPosts, type ProjectMeta, type PostMeta } from "~/lib/content";
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

interface FeaturedCourse {
  slug: string;
  title: string;
  description: string;
  lessonCount: number;
}

// TODO: Replace with database query
function getFeaturedCourse(): FeaturedCourse | null {
  return {
    slug: "phoenix-liveview-fundamentals",
    title: "Phoenix LiveView Fundamentals",
    description: "Learn to build real-time web applications with Phoenix LiveView.",
    lessonCount: 12,
  };
}

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: async () => {
    const projects = getFeaturedProjects().slice(0, 3);
    const posts = getAllPosts().slice(0, 3);
    const featuredCourse = getFeaturedCourse();
    return { projects, posts, featuredCourse };
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
  const { projects, posts, featuredCourse } = Route.useLoaderData() as {
    projects: ProjectMeta[];
    posts: PostMeta[];
    featuredCourse: FeaturedCourse | null;
  };

  return (
    <PageLayout>
      {/* Bio - three-tier typography hierarchy */}
      <section className="bio-section">
        <p className="bio-tagline">
          Engineering leader with <strong>20 years</strong> of experience building teams and
          products.{" "}
          <Link to="/work" className="text-link">
            Work history <span aria-hidden="true">→</span>
          </Link>
        </p>
        <p className="bio-description">
          I'm passionate about building <strong>AI</strong>, <strong>embedded systems</strong>, and{" "}
          <strong>robotics</strong> — building software that controls hardware.{" "}
          <Link to="/hire" className="text-link">
            Hire me <span aria-hidden="true">→</span>
          </Link>
        </p>
        <p className="bio-aside">
          When I'm not coding, you'll find me watching our boy play hockey, pretending like I can
          still skate, out in the snow with my better half, working on robotics with our other
          kiddo, or half-finishing side projects.
        </p>
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
              <span className="writing-date">{new Date(post.date).getFullYear()}</span>
            </Link>
          ))}
        </div>
        <Link to="/writing" className="section-link">
          all writing
        </Link>
      </section>

      {/* Tutorials - Featured course */}
      {featuredCourse && (
        <section className="section">
          <Link to="/tutorials" className="section-header-link">
            <h2 className="section-header">Tutorials</h2>
          </Link>
          <Link
            to="/tutorials/$courseSlug"
            params={{ courseSlug: featuredCourse.slug }}
            className="featured-course"
          >
            <div className="featured-course-content">
              <span className="featured-course-badge">Featured Course</span>
              <h3 className="featured-course-title">{featuredCourse.title}</h3>
              <p className="featured-course-description">{featuredCourse.description}</p>
              <span className="featured-course-meta">
                {featuredCourse.lessonCount} lessons
              </span>
            </div>
          </Link>
          <Link to="/tutorials" className="section-link">
            all tutorials
          </Link>
        </section>
      )}

      {/* Projects */}
      <section className="section">
        <Link to="/projects" className="section-header-link">
          <h2 className="section-header">Projects</h2>
        </Link>
        <div className="projects-list-home">
          {projects.map((project) => {
            const techDisplay = project.tech.slice(0, 3).join(" · ");
            const hasMore = project.tech.length > 3;
            return (
              <Link
                key={project.slug}
                to="/projects/$slug"
                params={{ slug: project.slug }}
                className="project-item-home"
              >
                <div className="project-item-header">
                  <span className="project-name">{project.name}</span>
                  <span className="project-tech-home">
                    {techDisplay}
                    {hasMore && " ..."}
                  </span>
                </div>
                <span className="project-tagline">{project.tagline}</span>
              </Link>
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
