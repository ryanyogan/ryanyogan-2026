import { eq, sql, count } from "drizzle-orm";
import type { Database } from "@ryanyogan/db";
import { posts, projects, siteStats } from "@ryanyogan/db/schema";
import { generateId } from "@ryanyogan/shared";
import type { Env } from "../index";

export async function updateSiteStats(db: Database, env: Env): Promise<void> {
  console.log("[Stats Update] Starting update...");

  const now = new Date();

  try {
    // Calculate stats
    const statsToUpdate = [
      {
        type: "total_posts",
        label: "Blog Posts",
        description: "Total published blog posts",
        getValue: async () => {
          const result = await db
            .select({ count: count() })
            .from(posts)
            .where(eq(posts.status, "published"));
          return result[0]?.count || 0;
        },
      },
      {
        type: "total_projects",
        label: "Projects",
        description: "Total projects tracked",
        getValue: async () => {
          const result = await db.select({ count: count() }).from(projects);
          return result[0]?.count || 0;
        },
      },
      {
        type: "total_views",
        label: "Total Views",
        description: "Total blog post views",
        getValue: async () => {
          const result = await db
            .select({ total: sql<number>`sum(${posts.views})` })
            .from(posts);
          return result[0]?.total || 0;
        },
      },
      {
        type: "total_stars",
        label: "GitHub Stars",
        description: "Total stars across all projects",
        getValue: async () => {
          const result = await db
            .select({ total: sql<number>`sum(${projects.stars})` })
            .from(projects);
          return result[0]?.total || 0;
        },
      },
      {
        type: "years_experience",
        label: "Years Experience",
        description: "Years of professional experience",
        getValue: async () => 15, // Static for now
      },
    ];

    for (const stat of statsToUpdate) {
      const value = await stat.getValue();

      // Check if stat exists
      const existing = await db
        .select()
        .from(siteStats)
        .where(eq(siteStats.type, stat.type))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(siteStats)
          .set({
            value,
            updatedAt: now,
          })
          .where(eq(siteStats.type, stat.type));
      } else {
        await db.insert(siteStats).values({
          id: generateId(),
          type: stat.type,
          value,
          label: stat.label,
          description: stat.description,
          updatedAt: now,
        });
      }
    }

    // Cache stats in KV for fast access
    const allStats = await db.select().from(siteStats);
    await env.CACHE.put(
      "site_stats",
      JSON.stringify(allStats),
      { expirationTtl: 86400 } // 24 hours
    );

    console.log("[Stats Update] Updated", statsToUpdate.length, "stats");
  } catch (error) {
    console.error("[Stats Update] Error:", error);
    throw error;
  }
}
