import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import { getPostBySlug, formatDate } from "~/lib/content";
import { mdxComponents } from "~/components/ui/mdx-components";
import {
  generateMeta,
  generateLinks,
  SITE_URL,
  getBlogPostSchema,
  getBreadcrumbSchema,
  serializeJsonLd,
} from "~/lib/seo";

// Dynamically import all MDX files at build time using Vite's glob import
// This automatically picks up any new MDX files without manual imports
const mdxModules = import.meta.glob("../../../content/writing/*.mdx", {
  eager: true,
}) as Record<
  string,
  { default: React.ComponentType<{ components?: Record<string, React.ComponentType<unknown>> }> }
>;

// Create slug -> component map from the glob imports
const mdxPosts: Record<
  string,
  React.ComponentType<{ components?: Record<string, React.ComponentType<unknown>> }>
> = {};

for (const [path, module] of Object.entries(mdxModules)) {
  const slug = path.split("/").pop()?.replace(".mdx", "") || "";
  mdxPosts[slug] = module.default;
}

export const Route = createFileRoute("/writing/$slug")({
  component: WritingPost,
  loader: async ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) {
      throw notFound();
    }
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;

    if (!post) {
      return {
        meta: [{ title: "Writing - Ryan Yogan" }],
      };
    }

    return {
      meta: generateMeta({
        title: post.title,
        description: post.description,
        path: `/writing/${post.slug}`,
        ogImage: `${SITE_URL}/og/writing/${post.slug}.png`,
        type: "article",
        publishedTime: new Date(post.date).toISOString(),
        author: post.author,
        keywords: [
          "Ryan Yogan",
          "blog",
          ...post.title
            .toLowerCase()
            .split(" ")
            .filter((w) => w.length > 3),
        ],
      }),
      links: generateLinks(`/writing/${post.slug}`),
      scripts: [
        {
          type: "application/ld+json",
          children: serializeJsonLd([
            getBlogPostSchema({
              title: post.title,
              description: post.description,
              slug: post.slug,
              date: post.date,
              author: post.author,
            }),
            getBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Writing", url: "/writing" },
              { name: post.title, url: `/writing/${post.slug}` },
            ]),
          ]),
        },
      ],
    };
  },
});

function WritingPost() {
  const { post } = Route.useLoaderData();

  const MDXContent = mdxPosts[post.slug];

  if (!MDXContent) {
    return (
      <PageLayout>
        <div>Post content not found for: {post.slug}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Link to="/writing" className="post-back">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        back to writing
      </Link>

      <article>
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <p className="post-meta">
            {formatDate(post.date)}
            {post.author && (
              <span className="post-author-badge" data-author={post.author}>
                {post.author === "human" && "Written by human"}
                {post.author === "ai" && "Written by AI"}
                {post.author === "hybrid" && "Human + AI"}
              </span>
            )}
          </p>
        </header>

        <div className="prose">
          <MDXContent components={mdxComponents} />
        </div>
      </article>
    </PageLayout>
  );
}
