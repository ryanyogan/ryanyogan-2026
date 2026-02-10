import { createFileRoute } from "@tanstack/react-router";
import { getAllSearchableContent } from "~/lib/content";

/**
 * POST /api/seed-search
 *
 * Seeds the Vectorize index with all searchable content.
 * This should be called once after deployment or when content changes.
 *
 * Requires the request to come from localhost or have a valid admin token.
 */
export const Route = createFileRoute("/api/seed-search")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Simple security check - only allow from localhost in dev
        // In production, you'd want to add proper auth
        const url = new URL(request.url);
        const isLocal =
          url.hostname === "localhost" || url.hostname === "127.0.0.1";

        // Get authorization header for non-local requests
        const authHeader = request.headers.get("Authorization");
        const expectedToken = process.env.ADMIN_TOKEN;

        if (!isLocal && authHeader !== `Bearer ${expectedToken}`) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
          const content = getAllSearchableContent();

          // For now, just return what would be seeded
          // The actual seeding happens when we have access to bindings
          // via the getRequestContext() from TanStack Start

          return Response.json({
            success: true,
            message: "Content ready for seeding",
            contentCount: content.length,
            items: content.map((c) => ({
              id: c.id,
              type: c.type,
              title: c.title,
            })),
          });
        } catch (error) {
          console.error("Error preparing seed:", error);
          return Response.json(
            { error: "Failed to prepare seed data" },
            { status: 500 }
          );
        }
      },
    },
  },
});
