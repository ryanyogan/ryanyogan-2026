// Common types used across the application

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  contentHtml?: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  featured: boolean;
  readTime: number;
  views: number;
  status: PostStatus;
}

export type PostStatus = "draft" | "published" | "archived";

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
}

export interface PostTag {
  postId: string;
  tagId: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string | null;
  url: string | null;
  githubUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date | null;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
  linkedinUrl: string | null;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 1-100
  yearsExperience: number;
  featured: boolean;
}

export type SkillCategory =
  | "language"
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "leadership"
  | "other";

export interface AIGeneratedContent {
  id: string;
  type: AIContentType;
  content: string;
  metadata: Record<string, unknown>;
  status: AIContentStatus;
  createdAt: Date;
  approvedAt: Date | null;
  approvedBy: string | null;
}

export type AIContentType =
  | "weekly_digest"
  | "about_update"
  | "project_summary"
  | "resume_update"
  | "stats_update";

export type AIContentStatus = "pending" | "approved" | "rejected";

export interface GithubActivity {
  id: string;
  eventType: string;
  repoName: string;
  repoUrl: string;
  description: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
  respondedAt: Date | null;
}

export type ContactStatus = "new" | "read" | "responded" | "archived";

export interface SiteStats {
  id: string;
  type: string;
  value: number;
  label: string;
  description: string | null;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SearchParams extends PaginationParams {
  query?: string;
  tags?: string[];
  status?: string;
}
