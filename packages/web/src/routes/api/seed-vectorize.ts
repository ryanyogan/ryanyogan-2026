/**
 * API endpoint to trigger Vectorize re-seeding with full content chunking.
 * Called by GitHub Actions after content changes.
 */

import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { seedVectorize, type Env } from "~/lib/search";

// Extended Env type with ADMIN_TOKEN
interface EnvWithAdmin extends Env {
  ADMIN_TOKEN?: string;
}

export const Route = createFileRoute("/api/seed-vectorize")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const cfEnv = env as EnvWithAdmin;

        // Auth check
        const authHeader = request.headers.get("Authorization");
        const expectedToken = cfEnv.ADMIN_TOKEN || process.env.ADMIN_TOKEN;

        if (!expectedToken) {
          console.error("[SeedVectorize] ADMIN_TOKEN not configured");
          return Response.json(
            { error: "Server misconfigured" },
            { status: 500 }
          );
        }

        if (authHeader !== `Bearer ${expectedToken}`) {
          console.warn("[SeedVectorize] Unauthorized request");
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check bindings
        if (!cfEnv.AI || !cfEnv.VECTORIZE) {
          console.error(
            "[SeedVectorize] AI or VECTORIZE bindings not available"
          );
          return Response.json(
            { error: "Vectorize bindings not available" },
            { status: 500 }
          );
        }

        try {
          console.log("[SeedVectorize] Starting vectorize seeding...");
          const result = await seedVectorize(cfEnv);
          console.log(
            `[SeedVectorize] Successfully seeded ${result.seeded} vectors`
          );

          return Response.json({
            success: true,
            message: `Successfully seeded ${result.seeded} vectors`,
            ...result,
          });
        } catch (error) {
          console.error("[SeedVectorize] Failed to seed:", error);
          return Response.json(
            {
              error: "Failed to seed vectorize",
              details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
