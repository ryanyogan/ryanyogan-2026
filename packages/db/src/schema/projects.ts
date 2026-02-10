import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable(
  "projects",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    longDescription: text("long_description"),
    url: text("url"),
    githubUrl: text("github_url"),
    imageUrl: text("image_url"),
    featured: integer("featured", { mode: "boolean" }).default(false),
    stars: integer("stars").default(0),
    forks: integer("forks").default(0),
    language: text("language"),
    topics: text("topics", { mode: "json" }).$type<string[]>().default([]),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
    lastActivityAt: integer("last_activity_at", { mode: "timestamp" }),
  },
  (table) => [
    index("projects_slug_idx").on(table.slug),
    index("projects_featured_idx").on(table.featured),
    index("projects_stars_idx").on(table.stars),
  ]
);

export const githubActivity = sqliteTable(
  "github_activity",
  {
    id: text("id").primaryKey(),
    eventType: text("event_type").notNull(),
    repoName: text("repo_name").notNull(),
    repoUrl: text("repo_url").notNull(),
    description: text("description").notNull(),
    timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
    metadata: text("metadata", { mode: "json" })
      .$type<Record<string, unknown>>()
      .default({}),
  },
  (table) => [
    index("github_activity_timestamp_idx").on(table.timestamp),
    index("github_activity_repo_idx").on(table.repoName),
  ]
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type GithubActivity = typeof githubActivity.$inferSelect;
export type NewGithubActivity = typeof githubActivity.$inferInsert;
