import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const siteStats = sqliteTable(
  "site_stats",
  {
    id: text("id").primaryKey(),
    type: text("type").notNull().unique(),
    value: integer("value").notNull().default(0),
    label: text("label").notNull(),
    description: text("description"),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [index("site_stats_type_idx").on(table.type)]
);

export const vectorEmbeddings = sqliteTable(
  "vector_embeddings",
  {
    id: text("id").primaryKey(),
    sourceType: text("source_type", {
      enum: ["post", "project", "about", "experience"],
    }).notNull(),
    sourceId: text("source_id").notNull(),
    chunk: text("chunk").notNull(),
    chunkIndex: integer("chunk_index").notNull(),
    vectorId: text("vector_id"), // ID in Vectorize
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("embeddings_source_idx").on(table.sourceType, table.sourceId),
    index("embeddings_vector_idx").on(table.vectorId),
  ]
);

export type SiteStat = typeof siteStats.$inferSelect;
export type NewSiteStat = typeof siteStats.$inferInsert;
export type VectorEmbedding = typeof vectorEmbeddings.$inferSelect;
export type NewVectorEmbedding = typeof vectorEmbeddings.$inferInsert;
