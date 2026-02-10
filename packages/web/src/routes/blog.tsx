import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "~/components/ui/icons";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Writing - Ryan Yogan" },
      {
        name: "description",
        content: "Thoughts on engineering, architecture, and building software.",
      },
      { property: "og:title", content: "Writing - Ryan Yogan" },
    ],
  }),
});

function BlogPage() {
  const posts = [
    {
      slug: "the-rule-of-three",
      title: "The Rule of Three",
      description: "Comparing React Router v7, TanStack Start, and Next.js. What I learned building the same app three times.",
      date: "2025-02-01",
      readTime: "8 min",
    },
    {
      slug: "prisma-in-2025",
      title: "Why I Still Choose Prisma",
      description: "Despite the alternatives, Prisma remains my go-to ORM. Here's why type safety and DX still win.",
      date: "2025-01-15",
      readTime: "6 min",
    },
    {
      slug: "scaling-teams",
      title: "Scaling Engineering Teams",
      description: "Lessons from growing an engineering organization from 5 to 40+ people. What worked, what didn't.",
      date: "2024-12-20",
      readTime: "12 min",
    },
    {
      slug: "ai-coding-assistants",
      title: "Living with AI Coding Assistants",
      description: "How I use Cursor, Claude, and Copilot in my daily workflow. The good, the bad, and the surprising.",
      date: "2024-11-10",
      readTime: "10 min",
    },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Writing</h1>
        <p className="page-description">
          Thoughts on engineering, architecture, leadership, and the craft of building software.
        </p>
      </header>

      <div className="posts-list">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="post-card"
          >
            <div className="post-card-content">
              <h2 className="post-card-title">{post.title}</h2>
              <p className="post-card-excerpt">{post.description}</p>
              <div className="post-card-meta">
                <time>{formatDate(post.date)}</time>
                <span className="post-card-separator">·</span>
                <span>{post.readTime} read</span>
              </div>
            </div>
            <ChevronRightIcon size={18} className="post-card-arrow" />
          </Link>
        ))}
      </div>
    </div>
  );
}
