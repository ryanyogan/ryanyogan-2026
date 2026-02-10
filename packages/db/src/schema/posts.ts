import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable(
  "posts",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(), // Markdown content
    contentHtml: text("content_html"), // Pre-rendered HTML
    publishedAt: integer("published_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
    authorId: text("author_id").notNull(),
    featured: integer("featured", { mode: "boolean" }).default(false),
    readTime: integer("read_time").default(0),
    views: integer("views").default(0),
    status: text("status", { enum: ["draft", "published", "archived"] })
      .notNull()
      .default("draft"),
  },
  (table) => [
    index("posts_slug_idx").on(table.slug),
    index("posts_status_idx").on(table.status),
    index("posts_published_at_idx").on(table.publishedAt),
    index("posts_featured_idx").on(table.featured),
  ]
);

export const tags = sqliteTable(
  "tags",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    color: text("color"), // Hex color for UI
  },
  (table) => [index("tags_slug_idx").on(table.slug)]
);

export const postTags = sqliteTable(
  "post_tags",
  {
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("post_tags_post_idx").on(table.postId),
    index("post_tags_tag_idx").on(table.tagId),
  ]
);

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type PostTag = typeof postTags.$inferSelect;
