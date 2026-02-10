import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.slug
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())} - Ryan Yogan`,
      },
    ],
  }),
});

function BlogPostPage() {
  const { slug } = Route.useParams();

  // Placeholder content - will be fetched from D1
  const post = {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    date: "Apr 1, 2025",
    content: `
      <p>This is a placeholder for the blog post content. The actual content will be stored as markdown in the D1 database and rendered here.</p>
      
      <h2>Coming Soon</h2>
      
      <p>This blog system will include:</p>
      
      <ul>
        <li>Markdown support with syntax highlighting</li>
        <li>Code snippets with copy functionality</li>
        <li>Embedded videos and images</li>
        <li>Table of contents navigation</li>
      </ul>
      
      <p>Stay tuned!</p>
    `,
  };

  return (
    <div className="w-full max-w-[--max-width] mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-1 text-[14px] text-[--color-muted] hover:text-[--color-foreground] transition-colors mb-8"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      {/* Header */}
      <header className="mb-12">
        <time className="text-[13px] text-[--color-subtle]">{post.date}</time>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] mt-2">
          {post.title}
        </h1>
      </header>

      {/* Content */}
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-[--color-border]">
        <p className="text-[14px] text-[--color-muted]">
          Thanks for reading. If you have thoughts,{" "}
          <a
            href="https://twitter.com/ryanyogan"
            target="_blank"
            rel="noopener noreferrer"
            className="link-accent"
          >
            let me know on Twitter
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
