import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const experiences = sqliteTable(
  "experiences",
  {
    id: text("id").primaryKey(),
    company: text("company").notNull(),
    title: text("title").notNull(),
    location: text("location"),
    startDate: integer("start_date", { mode: "timestamp" }).notNull(),
    endDate: integer("end_date", { mode: "timestamp" }),
    current: integer("current", { mode: "boolean" }).default(false),
    description: text("description").notNull(),
    highlights: text("highlights", { mode: "json" }).$type<string[]>().default([]),
    technologies: text("technologies", { mode: "json" }).$type<string[]>().default([]),
    linkedinUrl: text("linkedin_url"),
    order: integer("order").default(0),
  },
  (table) => [
    index("experiences_order_idx").on(table.order),
    index("experiences_current_idx").on(table.current),
  ]
);

export const skills = sqliteTable(
  "skills",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
    category: text("category", {
      enum: ["language", "frontend", "backend", "database", "devops", "leadership", "other"],
    }).notNull(),
    proficiency: integer("proficiency").default(50), // 1-100
    yearsExperience: integer("years_experience").default(0),
    featured: integer("featured", { mode: "boolean" }).default(false),
  },
  (table) => [
    index("skills_category_idx").on(table.category),
    index("skills_featured_idx").on(table.featured),
  ]
);

export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
