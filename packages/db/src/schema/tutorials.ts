import { sqliteTable, text, integer, index, unique } from "drizzle-orm/sqlite-core";

/**
 * Courses - A collection of lessons organized into sections
 * Example: "Building a Real-Time Chat with Elixir"
 */
export const courses = sqliteTable(
  "courses",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description"),
    thumbnailUrl: text("thumbnail_url"),
    youtubePlaylistId: text("youtube_playlist_id"),
    status: text("status", { enum: ["draft", "published", "archived"] })
      .notNull()
      .default("draft"),
    difficulty: text("difficulty", { enum: ["beginner", "intermediate", "advanced"] })
      .notNull()
      .default("beginner"),
    estimatedMinutes: integer("estimated_minutes"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("courses_slug_idx").on(table.slug),
    index("courses_status_idx").on(table.status),
  ]
);

/**
 * Sections - Organizational units within a course
 * Example: "Getting Started", "Building the Core", "Deployment"
 */
export const sections = sqliteTable(
  "sections",
  {
    id: text("id").primaryKey(),
    courseId: text("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    orderIndex: integer("order_index").notNull(),
  },
  (table) => [
    index("sections_course_idx").on(table.courseId),
    index("sections_order_idx").on(table.courseId, table.orderIndex),
  ]
);

/**
 * Lessons - Individual tutorial units with video/text content
 * Example: "Setting Up Phoenix LiveView"
 */
export const lessons = sqliteTable(
  "lessons",
  {
    id: text("id").primaryKey(),
    courseId: text("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    sectionId: text("section_id").references(() => sections.id, { onDelete: "set null" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    contentType: text("content_type", { enum: ["video", "text", "hybrid"] })
      .notNull()
      .default("video"),
    youtubeVideoId: text("youtube_video_id"),
    durationSeconds: integer("duration_seconds"),
    orderIndex: integer("order_index").notNull(),
    status: text("status", { enum: ["draft", "published", "archived"] })
      .notNull()
      .default("draft"),
    requiresCoding: integer("requires_coding", { mode: "boolean" }).default(true),
    textContent: text("text_content"), // Markdown for text/hybrid lessons
    codeStarterUrl: text("code_starter_url"), // Link to starter code
    codeSolutionUrl: text("code_solution_url"), // Link to solution code
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("lessons_course_idx").on(table.courseId),
    index("lessons_section_idx").on(table.sectionId),
    index("lessons_order_idx").on(table.courseId, table.orderIndex),
    index("lessons_status_idx").on(table.status),
    unique("lessons_course_slug_unique").on(table.courseId, table.slug),
  ]
);

/**
 * Transcripts - Video transcripts for search and accessibility
 * Segments stored as JSON for timestamp-based navigation
 */
export const transcripts = sqliteTable(
  "transcripts",
  {
    id: text("id").primaryKey(),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    language: text("language").notNull().default("en"),
    content: text("content").notNull(), // Full transcript text
    segments: text("segments"), // JSON: [{start: number, end: number, text: string}]
    source: text("source", { enum: ["youtube", "whisper", "manual"] })
      .notNull()
      .default("youtube"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("transcripts_lesson_idx").on(table.lessonId),
    unique("transcripts_lesson_lang_unique").on(table.lessonId, table.language),
  ]
);

/**
 * Course Tags - For categorization and filtering
 * Example: "Elixir", "Phoenix", "LiveView", "Real-Time"
 */
export const courseTags = sqliteTable(
  "course_tags",
  {
    courseId: text("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    tagId: text("tag_id").notNull(), // References tags table from posts.ts
  },
  (table) => [
    index("course_tags_course_idx").on(table.courseId),
    index("course_tags_tag_idx").on(table.tagId),
  ]
);

/**
 * User Progress - Track lesson completion and course progress
 */
export const userProgress = sqliteTable(
  "user_progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    completed: integer("completed", { mode: "boolean" }).default(false),
    completedAt: integer("completed_at", { mode: "timestamp" }),
    watchTimeSeconds: integer("watch_time_seconds").default(0),
    lastPosition: integer("last_position").default(0), // Resume position in seconds
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("user_progress_user_idx").on(table.userId),
    index("user_progress_lesson_idx").on(table.lessonId),
    unique("user_progress_user_lesson_unique").on(table.userId, table.lessonId),
  ]
);

// Type exports
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type Section = typeof sections.$inferSelect;
export type NewSection = typeof sections.$inferInsert;
export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;
export type Transcript = typeof transcripts.$inferSelect;
export type NewTranscript = typeof transcripts.$inferInsert;
export type CourseTag = typeof courseTags.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;

// Segment type for transcript timestamps
export interface TranscriptSegment {
  start: number; // Start time in seconds
  end: number; // End time in seconds
  text: string;
}
