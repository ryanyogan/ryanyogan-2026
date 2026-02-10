import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const contactSubmissions = sqliteTable(
  "contact_submissions",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: text("status", {
      enum: ["new", "read", "responded", "archived"],
    })
      .notNull()
      .default("new"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    respondedAt: integer("responded_at", { mode: "timestamp" }),
  },
  (table) => [
    index("contact_status_idx").on(table.status),
    index("contact_created_at_idx").on(table.createdAt),
  ]
);

export const newsletterSubscribers = sqliteTable(
  "newsletter_subscribers",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),
    subscribedAt: integer("subscribed_at", { mode: "timestamp" }).notNull(),
    unsubscribedAt: integer("unsubscribed_at", { mode: "timestamp" }),
    status: text("status", {
      enum: ["active", "unsubscribed", "bounced"],
    })
      .notNull()
      .default("active"),
  },
  (table) => [
    index("newsletter_email_idx").on(table.email),
    index("newsletter_status_idx").on(table.status),
  ]
);

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
