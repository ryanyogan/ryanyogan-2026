import { createFileRoute } from "@tanstack/react-router";
import { getAllSearchableContent } from "~/lib/content";
import { searchWithTextMatching, type SearchResult } from "~/lib/search";

export type SearchResponse = {
  results: SearchResult[];
  query: string;
  usedVectorize: boolean;
};

export const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const query = url.searchParams.get("q")?.trim() || "";

        if (!query || query.length < 2) {
          return Response.json({
            results: [],
            query,
            usedVectorize: false,
          } satisfies SearchResponse);
        }

        // Get all searchable content
        const allContent = getAllSearchableContent();

        // Use text-based search
        // TODO: Add Vectorize support for semantic search once bindings are accessible
        const results = searchWithTextMatching(query, allContent);

        return Response.json({
          results,
          query,
          usedVectorize: false,
        } satisfies SearchResponse);
      },
    },
  },
});
