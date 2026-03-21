// Mock for virtual:content module used in tests

export interface ProjectMeta {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  github?: string;
  url?: string;
  status: "active" | "archived" | "development";
  featured: boolean;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
}

export const projects: ProjectMeta[] = [
  {
    slug: "test-project",
    name: "Test Project",
    tagline: "A test project for testing",
    description: "This is a test project description",
    tech: ["TypeScript", "React", "Vitest"],
    github: "https://github.com/test/test-project",
    status: "active",
    featured: true,
  },
  {
    slug: "another-project",
    name: "Another Project",
    tagline: "Another test project",
    description: "Another test project description",
    tech: ["Rust", "WebAssembly"],
    github: "https://github.com/test/another-project",
    status: "archived",
    featured: false,
  },
];

export const posts: PostMeta[] = [
  {
    slug: "test-post",
    title: "Test Post",
    date: "2024-01-15",
    description: "A test blog post",
    tags: ["testing", "vitest"],
  },
  {
    slug: "another-post",
    title: "Another Post",
    date: "2024-01-10",
    description: "Another test blog post",
    tags: ["react", "typescript"],
  },
];
