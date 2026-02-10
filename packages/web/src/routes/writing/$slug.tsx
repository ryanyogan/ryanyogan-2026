import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import { getPostBySlug, formatDate } from "~/lib/content";
import { mdxComponents } from "~/components/ui/mdx-components";

// Import MDX files directly - they're prerendered at build time
import BuildingTeams from "../../../content/writing/building-teams.mdx";
import EmbeddedRust from "../../../content/writing/embedded-rust.mdx";
import AiHardware from "../../../content/writing/ai-hardware.mdx";
import StartupLessons from "../../../content/writing/startup-lessons.mdx";
import ProjectYoganHockey from "../../../content/writing/project-yogan-hockey.mdx";

// Map slugs to MDX components
const mdxPosts: Record<string, React.ComponentType<{ components?: Record<string, React.ComponentType> }>> = {
  "building-teams": BuildingTeams,
  "embedded-rust": EmbeddedRust,
  "ai-hardware": AiHardware,
  "startup-lessons": StartupLessons,
  "project-yogan-hockey": ProjectYoganHockey,
};

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
          <MDXContent components={mdxComponents} />
        </div>
      </article>
    </PageLayout>
  );
}
