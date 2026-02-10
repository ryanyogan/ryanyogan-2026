import { createServerFn } from "@tanstack/react-start";
import {
  fallbackPosts,
  fallbackProjects,
  fallbackExperiences,
  fallbackSkills,
} from "../fallback-data";

// ============================================================================
// Server Functions
// ============================================================================
// These server functions currently return fallback data.
// Once Cloudflare D1 bindings are properly configured via middleware,
// they will query the actual database.
// ============================================================================

// ============================================================================
// Posts
// ============================================================================

export const getPosts = createServerFn({ method: "GET" }).handler(async () => {
  // TODO: Query from D1 when middleware is set up
  return fallbackPosts;
});

export const getFeaturedPosts = createServerFn({ method: "GET" }).handler(async () => {
  // TODO: Query from D1 when middleware is set up
  return fallbackPosts.filter((p) => p.featured).slice(0, 3);
});

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data }) => {
    // TODO: Query from D1 when middleware is set up
    return fallbackPosts.find((p) => p.slug === data) || null;
  });

// ============================================================================
// Projects
// ============================================================================

export const getProjects = createServerFn({ method: "GET" }).handler(async () => {
  // TODO: Query from D1 when middleware is set up
  return fallbackProjects;
});

export const getFeaturedProjects = createServerFn({ method: "GET" }).handler(async () => {
  // TODO: Query from D1 when middleware is set up
  return fallbackProjects.filter((p) => p.featured);
});

// ============================================================================
// Experiences
// ============================================================================

export const getExperiences = createServerFn({ method: "GET" }).handler(async () => {
  // TODO: Query from D1 when middleware is set up
  return fallbackExperiences;
});

// ============================================================================
// Skills
// ============================================================================

export const getSkills = createServerFn({ method: "GET" }).handler(async () => {
  // TODO: Query from D1 when middleware is set up
  return fallbackSkills;
});

export const getFeaturedSkills = createServerFn({ method: "GET" }).handler(async () => {
  // TODO: Query from D1 when middleware is set up
  return fallbackSkills.filter((s) => s.featured);
});

// ============================================================================
// GitHub Activity
// ============================================================================

export const getRecentGithubActivity = createServerFn({ method: "GET" }).handler(async () => {
  // TODO: Query from D1 when middleware is set up
  return [];
});

// ============================================================================
// AI Content
// ============================================================================

export const getPendingContent = createServerFn({ method: "GET" }).handler(async () => {
  // TODO: Query from D1 when middleware is set up
  return [];
});

// ============================================================================
// Site Stats
// ============================================================================

export const getSiteStats = createServerFn({ method: "GET" }).handler(async () => {
  // TODO: Query from D1 when middleware is set up
  return null;
});
