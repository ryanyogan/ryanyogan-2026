import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import { getAllPosts } from "~/lib/content";

export const Route = createFileRoute("/writing/")({
  component: WritingPage,
  head: () => ({
    meta: [
      { title: "Writing - Ryan Yogan" },
      { property: "og:title", content: "Writing - Ryan Yogan" },
      {
        name: "description",
        content: "Thoughts on engineering, leadership, and building things.",
      },
    ],
  }),
});

function WritingPage() {
  const posts = getAllPosts();

  return (
    <PageLayout>
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
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
