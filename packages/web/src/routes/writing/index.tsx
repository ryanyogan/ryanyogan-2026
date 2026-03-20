import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import { getAllPosts } from "~/lib/content";
import {
  generateMeta,
  generateLinks,
  SITE_URL,
  getBlogSchema,
  getBreadcrumbSchema,
  serializeJsonLd,
} from "~/lib/seo";

const WRITING_DESCRIPTION = "Thoughts on engineering, leadership, and building things.";

export const Route = createFileRoute("/writing/")({
  component: WritingPage,
  head: () => ({
    meta: generateMeta({
      title: "Writing",
      description: WRITING_DESCRIPTION,
      path: "/writing",
      ogImage: `${SITE_URL}/og/writing.png`,
      keywords: [
        "Ryan Yogan",
        "blog",
        "writing",
        "engineering",
        "leadership",
        "software development",
        "tech",
      ],
    }),
    links: generateLinks("/writing"),
    scripts: [
      {
        type: "application/ld+json",
        children: serializeJsonLd([
          getBlogSchema(),
          getBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Writing", url: "/writing" },
          ]),
        ]),
      },
    ],
  }),
});

function WritingPage() {
  const posts = getAllPosts();

  return (
    <PageLayout>
      <header className="section-header-with-description">
        <h2 className="section-header">Writing</h2>
        <p className="page-description">
          Thoughts on engineering, leadership, and building things.
        </p>
      </header>

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
