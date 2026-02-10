import { createServerFn } from "@tanstack/react-start";
import { drizzle } from "drizzle-orm/d1";
import { eq, desc } from "drizzle-orm";
import * as schema from "@ryanyogan/db/schema";
import { nanoid } from "nanoid";

// TODO: This needs middleware to access Cloudflare bindings
// For now, we'll use fallback implementations

// ============================================================================
// Posts CRUD
// ============================================================================

export const getAllPosts = createServerFn({ method: "GET" }).handler(async () => {
  // TODO: Query from D1 when middleware is set up
  return [];
});

export const createPost = createServerFn({ method: "POST" })
  .inputValidator((data: Omit<schema.NewPost, "id" | "createdAt" | "updatedAt">) => data)
  .handler(async ({ data }) => {
    // TODO: Insert to D1 when middleware is set up
    const now = new Date();
    const post = {
      ...data,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    };
    return post;
  });

export const updatePost = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string } & Partial<schema.NewPost>) => data)
  .handler(async ({ data }) => {
    // TODO: Update D1 when middleware is set up
    return { success: true };
  });

export const deletePost = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    // TODO: Delete from D1 when middleware is set up
    return { success: true };
  });

// ============================================================================
// Projects CRUD
// ============================================================================

export const getAllProjects = createServerFn({ method: "GET" }).handler(async () => {
  // TODO: Query from D1 when middleware is set up
  return [];
});

export const createProject = createServerFn({ method: "POST" })
  .inputValidator((data: Omit<schema.NewProject, "id" | "createdAt" | "updatedAt">) => data)
  .handler(async ({ data }) => {
    // TODO: Insert to D1 when middleware is set up
    const now = new Date();
    const project = {
      ...data,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    };
    return project;
  });

export const updateProject = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string } & Partial<schema.NewProject>) => data)
  .handler(async ({ data }) => {
    // TODO: Update D1 when middleware is set up
    return { success: true };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    // TODO: Delete from D1 when middleware is set up
    return { success: true };
  });

// ============================================================================
// Experiences CRUD
// ============================================================================

export const getAllExperiences = createServerFn({ method: "GET" }).handler(async () => {
  // TODO: Query from D1 when middleware is set up
  return [];
});

export const createExperience = createServerFn({ method: "POST" })
  .inputValidator((data: Omit<schema.NewExperience, "id">) => data)
  .handler(async ({ data }) => {
    // TODO: Insert to D1 when middleware is set up
    const experience = {
      ...data,
      id: nanoid(),
    };
    return experience;
  });

export const updateExperience = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string } & Partial<schema.NewExperience>) => data)
  .handler(async ({ data }) => {
    // TODO: Update D1 when middleware is set up
    return { success: true };
  });

export const deleteExperience = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    // TODO: Delete from D1 when middleware is set up
    return { success: true };
  });

// ============================================================================
// AI Content Management
// ============================================================================

export const getAllAIContent = createServerFn({ method: "GET" }).handler(async () => {
  // TODO: Query from D1 when middleware is set up
  return [];
});

export const approveAIContent = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; approvedBy: string }) => data)
  .handler(async ({ data }) => {
    // TODO: Update D1 when middleware is set up
    return { success: true };
  });

export const rejectAIContent = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    // TODO: Update D1 when middleware is set up
    return { success: true };
  });

// ============================================================================
// Skills CRUD
// ============================================================================

export const getAllSkills = createServerFn({ method: "GET" }).handler(async () => {
  // TODO: Query from D1 when middleware is set up
  return [];
});

export const createSkill = createServerFn({ method: "POST" })
  .inputValidator((data: Omit<schema.NewSkill, "id">) => data)
  .handler(async ({ data }) => {
    // TODO: Insert to D1 when middleware is set up
    const skill = {
      ...data,
      id: nanoid(),
    };
    return skill;
  });

export const updateSkill = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string } & Partial<schema.NewSkill>) => data)
  .handler(async ({ data }) => {
    // TODO: Update D1 when middleware is set up
    return { success: true };
  });

export const deleteSkill = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    // TODO: Delete from D1 when middleware is set up
    return { success: true };
  });
