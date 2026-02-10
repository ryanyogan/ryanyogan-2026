import { createDb, type Database } from "@ryanyogan/db";
import { syncGithubActivity } from "./jobs/github-sync";
import { generateWeeklyDigest } from "./jobs/weekly-digest";
import { updateSiteStats } from "./jobs/stats-update";
import { syncVectorEmbeddings } from "./jobs/vector-sync";

export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  VECTORIZE: VectorizeIndex;
  AI: Ai;
  GITHUB_TOKEN: string;
  GITHUB_USERNAME: string;
  ENVIRONMENT: string;
}

export default {
  /**
   * Cron trigger handler - runs scheduled jobs
   */
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    const db = createDb(env.DB);
    const cron = controller.cron;

    console.log(`[AI Worker] Running scheduled job: ${cron}`);

    try {
      switch (cron) {
        // Weekly digest - Monday at 9 AM UTC
        case "0 9 * * 1":
          ctx.waitUntil(generateWeeklyDigest(db, env));
          break;

        // GitHub activity sync - every 6 hours
        case "0 */6 * * *":
          ctx.waitUntil(syncGithubActivity(db, env));
          ctx.waitUntil(syncVectorEmbeddings(db, env));
          break;

        // Stats update - daily at midnight
        case "0 0 * * *":
          ctx.waitUntil(updateSiteStats(db, env));
          break;

        default:
          console.log(`[AI Worker] Unknown cron pattern: ${cron}`);
      }
    } catch (error) {
      console.error(`[AI Worker] Error in scheduled job:`, error);
      throw error;
    }
  },

  /**
   * HTTP handler for manual triggers and health checks
   */
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const db = createDb(env.DB);

    // Health check
    if (url.pathname === "/health") {
      return Response.json({ status: "ok", timestamp: new Date().toISOString() });
    }

    // Manual job triggers (protected by API key in production)
    if (url.pathname.startsWith("/jobs/")) {
      const authHeader = request.headers.get("Authorization");
      const expectedToken = env.GITHUB_TOKEN; // Reuse for simplicity

      if (env.ENVIRONMENT === "production" && authHeader !== `Bearer ${expectedToken}`) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const job = url.pathname.replace("/jobs/", "");

      try {
        switch (job) {
          case "github-sync":
            await syncGithubActivity(db, env);
            return Response.json({ success: true, job: "github-sync" });

          case "weekly-digest":
            await generateWeeklyDigest(db, env);
            return Response.json({ success: true, job: "weekly-digest" });

          case "stats-update":
            await updateSiteStats(db, env);
            return Response.json({ success: true, job: "stats-update" });

          case "vector-sync":
            await syncVectorEmbeddings(db, env);
            return Response.json({ success: true, job: "vector-sync" });

          default:
            return Response.json({ error: "Unknown job" }, { status: 404 });
        }
      } catch (error) {
        console.error(`[AI Worker] Error running job ${job}:`, error);
        return Response.json(
          { error: "Job failed", details: String(error) },
          { status: 500 }
        );
      }
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  },
};
