/**
 * Search utilities for content search
 * Uses simple text matching for fast, reliable search
 */

import { type SearchableContent } from "./content";

export type SearchResult = {
  id: string;
  type: "post" | "project";
  title: string;
  description: string;
  url: string;
  score: number;
};

/**
 * Text-based search with scoring
 */
export function searchWithTextMatching(
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

    // Word boundary matches
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

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
