/**
 * Search utilities for RAG-powered content search
 * Uses Cloudflare Vectorize for semantic search
 */

import { getAllSearchableContent, type SearchableContent } from "./content";

export type SearchResult = {
  id: string;
  type: "post" | "project";
  title: string;
  description: string;
  url: string;
  score: number;
};

/**
 * Cloudflare bindings type (available in Worker context)
 */
export interface Env {
  AI: Ai;
  VECTORIZE: VectorizeIndex;
}

/**
 * Generate embeddings for text using Workers AI
 */
export async function generateEmbedding(
  ai: Ai,
  text: string
): Promise<number[]> {
  const response = await ai.run("@cf/baai/bge-base-en-v1.5", {
    text: [text],
  });

  // The response has a data array with embeddings
  return (response as { data: number[][] }).data[0];
}

/**
 * Seed Vectorize with all searchable content
 * Call this once to populate the index
 */
export async function seedVectorize(env: Env): Promise<{ seeded: number }> {
  const content = getAllSearchableContent();
  const vectors: VectorizeVector[] = [];

  for (const item of content) {
    const text = `${item.title}. ${item.description}`;
    const embedding = await generateEmbedding(env.AI, text);

    vectors.push({
      id: item.id,
      values: embedding,
      metadata: {
        type: item.type,
        title: item.title,
        description: item.description,
        url: item.url,
      },
    });
  }

  // Upsert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    await env.VECTORIZE.upsert(batch);
  }

  return { seeded: vectors.length };
}

/**
 * Search content using Vectorize semantic search
 */
export async function searchWithVectorize(
  env: Env,
  query: string,
  topK: number = 10
): Promise<SearchResult[]> {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(env.AI, query);

  // Query Vectorize
  const matches = await env.VECTORIZE.query(queryEmbedding, {
    topK,
    returnMetadata: "all",
  });

  // Map to SearchResult format
  return matches.matches.map((match) => ({
    id: match.id,
    type: (match.metadata?.type as "post" | "project") || "post",
    title: (match.metadata?.title as string) || "",
    description: (match.metadata?.description as string) || "",
    url: (match.metadata?.url as string) || "",
    score: match.score,
  }));
}

/**
 * Fallback text-based search when Vectorize isn't available
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
