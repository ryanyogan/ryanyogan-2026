import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import { getPostBySlug, formatDate } from "~/lib/content";
import { lazy, Suspense } from "react";

// Import MDX files - Vite will handle these at build time
const mdxModules = import.meta.glob("../../content/writing/*.mdx");

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
    return {
      meta: [
        { title: post ? `${post.title} - Ryan Yogan` : "Writing - Ryan Yogan" },
        { property: "og:title", content: post?.title || "Writing" },
        { name: "description", content: post?.description || "" },
      ],
    };
  },
});

function WritingPost() {
  const { post } = Route.useLoaderData();
  
  // Dynamically load the MDX component
  const MDXContent = lazy(async () => {
    const modulePath = `../../content/writing/${post.slug}.mdx`;
    const loader = mdxModules[modulePath];
    if (!loader) {
      throw new Error(`MDX file not found: ${post.slug}`);
    }
    const module = await loader() as { default: React.ComponentType };
    return { default: module.default };
  });

  return (
    <PageLayout>
      <Link to="/writing" className="post-back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        back to writing
      </Link>

      <article>
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <p className="post-meta">{formatDate(post.date)}</p>
        </header>

        <div className="prose">
          <Suspense fallback={<p>Loading...</p>}>
            <MDXContent />
          </Suspense>
        </div>
      </article>
    </PageLayout>
  );
}
