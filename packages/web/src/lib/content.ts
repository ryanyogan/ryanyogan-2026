// Content metadata for MDX posts
// Since Cloudflare Workers can't read the filesystem,
// we define metadata here and import MDX files directly in routes

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
}

export const posts: PostMeta[] = [
  {
    slug: "building-teams",
    title: "Building engineering teams from scratch",
    date: "2024-01-15",
    description: "Lessons learned from scaling engineering organizations from 0 to 40+ engineers.",
  },
  {
    slug: "embedded-rust",
    title: "Getting started with embedded Rust",
    date: "2024-02-20",
    description: "A practical guide to writing Rust for microcontrollers and embedded systems.",
  },
  {
    slug: "ai-hardware",
    title: "AI at the edge: when software meets hardware",
    date: "2024-03-10",
    description: "Exploring the intersection of machine learning and embedded systems.",
  },
  {
    slug: "startup-lessons",
    title: "Lessons from startup life",
    date: "2024-04-05",
    description: "What I learned from building products at early-stage startups.",
  },
];

export function getAllPosts(): PostMeta[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): PostMeta | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
