// Content metadata for MDX posts and projects
// Since Cloudflare Workers can't read the filesystem,
// we define metadata here and import MDX files directly in routes

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  featured?: boolean;
}

export const posts: PostMeta[] = [
  {
    slug: "project-yogan-hockey",
    title: "Building Yogan Hockey: Real-time NHL Stats with Phoenix LiveView",
    date: "2026-02-07",
    description: "How I built a real-time NHL stats dashboard that outperforms traditional SSR frameworks using Phoenix LiveView, ETS caching, and GenServers.",
    featured: true,
  },
  {
    slug: "building-teams",
    title: "Building engineering teams from scratch",
    date: "2024-01-15",
    description: "Lessons learned from scaling engineering organizations from 0 to 40+ engineers.",
    featured: true,
  },
  {
    slug: "embedded-rust",
    title: "Getting started with embedded Rust",
    date: "2024-02-20",
    description: "A practical guide to writing Rust for microcontrollers and embedded systems.",
    featured: true,
  },
  {
    slug: "ai-hardware",
    title: "AI at the edge: when software meets hardware",
    date: "2024-03-10",
    description: "Exploring the intersection of machine learning and embedded systems.",
    featured: true,
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

/**
 * Check if a blog post exists for a given project slug.
 * Convention: blog posts about projects are named "project-{projectSlug}"
 */
export function getProjectPost(projectSlug: string): PostMeta | undefined {
  return posts.find((p) => p.slug === `project-${projectSlug}`);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// =============================================================================
// Project Metadata (static, for when DB is unavailable or for featured display)
// =============================================================================

export interface ProjectMeta {
  slug: string;
  name: string;
  description: string;
  tech: string[];
  url?: string;
  githubUrl?: string;
  featured: boolean;
}

export const projects: ProjectMeta[] = [
  {
    slug: "yogan_hockey",
    name: "Yogan Hockey",
    description: "Real-time NHL stats dashboard built with Phoenix LiveView. Features live scores, player tracking, and ETS-powered caching for sub-second updates.",
    tech: ["Elixir", "Phoenix LiveView", "ETS", "Fly.io"],
    url: "https://yogan-hockey.fly.dev",
    githubUrl: "https://github.com/ryanyogan/yogan_hockey",
    featured: true,
  },
  {
    slug: "ryanyogan-com",
    name: "ryanyogan.com",
    description: "This website. Built with TanStack Start, deployed on Cloudflare Workers with D1, R2, and Workers AI for RAG-powered search.",
    tech: ["TanStack Start", "Cloudflare Workers", "D1", "Vectorize"],
    githubUrl: "https://github.com/ryanyogan/ryanyogan.com",
    featured: true,
  },
  {
    slug: "embedded-weather",
    name: "Embedded Weather Station",
    description: "ESP32-based weather station with Rust firmware. Collects temperature, humidity, and pressure data, streams to a cloud dashboard.",
    tech: ["Rust", "ESP32", "Embassy", "MQTT"],
    githubUrl: "https://github.com/ryanyogan/weather-station",
    featured: true,
  },
  {
    slug: "ai-code-review",
    name: "AI Code Review Bot",
    description: "GitHub Action that uses LLMs to review pull requests, suggest improvements, and catch common issues.",
    tech: ["TypeScript", "OpenAI", "GitHub Actions"],
    githubUrl: "https://github.com/ryanyogan/ai-code-review",
    featured: false,
  },
  {
    slug: "dotfiles",
    name: "Dotfiles",
    description: "My personal development environment configuration. Neovim, tmux, zsh, and more.",
    tech: ["Lua", "Nix", "Zsh"],
    githubUrl: "https://github.com/ryanyogan/dotfiles",
    featured: false,
  },
];

export function getAllProjects(): ProjectMeta[] {
  return projects;
}

export function getFeaturedProjects(): ProjectMeta[] {
  return projects.filter((p) => p.featured);
}

export function getOtherProjects(): ProjectMeta[] {
  return projects.filter((p) => !p.featured);
}

export function getProjectBySlug(slug: string): ProjectMeta | undefined {
  return projects.find((p) => p.slug === slug);
}

// =============================================================================
// Searchable Content (for RAG/Vectorize)
// =============================================================================

export interface SearchableContent {
  id: string;
  type: "post" | "project";
  title: string;
  description: string;
  content?: string; // Full content for embedding
  url: string;
}

export function getAllSearchableContent(): SearchableContent[] {
  const postContent: SearchableContent[] = posts.map((post) => ({
    id: `post-${post.slug}`,
    type: "post",
    title: post.title,
    description: post.description,
    url: `/writing/${post.slug}`,
  }));

  const projectContent: SearchableContent[] = projects.map((project) => ({
    id: `project-${project.slug}`,
    type: "project",
    title: project.name,
    description: `${project.description} Technologies: ${project.tech.join(", ")}`,
    url: project.url || project.githubUrl || `/projects`,
  }));

  return [...postContent, ...projectContent];
}
