import { createFileRoute } from "@tanstack/react-router";
import {
  getAllSearchableContent,
  type SearchableContent,
} from "~/lib/content";

export type SearchResult = {
  id: string;
  type: "post" | "project";
  title: string;
  description: string;
  url: string;
  score: number;
};

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

        // Try to use Vectorize for semantic search if available
        // For now, we fall back to simple text matching
        // TODO: Add Vectorize support once bindings are accessible

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

/**
 * Simple text-based search as fallback when Vectorize isn't available
 */
function searchWithTextMatching(
  query: string,
  content: SearchableContent[]
): SearchResult[] {
  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(/\s+/).filter(Boolean);

  const scored = content.map((item) => {
    const titleLower = item.title.toLowerCase();
    const descLower = item.description.toLowerCase();
    const combined = `${titleLower} ${descLower}`;

    let score = 0;

    // Exact title match (highest priority)
    if (titleLower.includes(queryLower)) {
      score += 100;
    }

    // Title starts with query
    if (titleLower.startsWith(queryLower)) {
      score += 50;
    }

    // Each term match in title
    for (const term of queryTerms) {
      if (titleLower.includes(term)) {
        score += 20;
      }
      if (descLower.includes(term)) {
        score += 10;
      }
    }

    // Word boundary matches (whole word matches)
    const wordRegex = new RegExp(`\\b${queryLower}\\b`, "i");
    if (wordRegex.test(combined)) {
      score += 30;
    }

    return {
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      url: item.url,
      score,
    };
  });

  // Filter out zero scores and sort by score descending
  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
