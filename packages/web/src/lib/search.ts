/**
 * Search utilities for RAG-powered content search
 * Uses Cloudflare Vectorize for semantic search with content chunking
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
 * Chunking configuration
 * ~300-400 tokens per chunk with 15% overlap for context continuity
 */
const CHUNK_SIZE_CHARS = 1500;
const CHUNK_OVERLAP_CHARS = 200;

/**
 * Split content into chunks for embedding
 * Tries to break at natural boundaries (paragraphs, then sentences)
 */
function chunkContent(text: string): string[] {
  const chunks: string[] = [];

  // If text is short enough, return as single chunk
  if (text.length <= CHUNK_SIZE_CHARS) {
    return [text.trim()].filter((c) => c.length > 0);
  }

  let start = 0;
  while (start < text.length) {
    let end = start + CHUNK_SIZE_CHARS;

    if (end < text.length) {
      // Try to break at paragraph boundary
      const paragraphBreak = text.lastIndexOf("\n\n", end);
      if (paragraphBreak > start + CHUNK_SIZE_CHARS * 0.5) {
        end = paragraphBreak;
      } else {
        // Fall back to sentence boundary
        const sentenceBreak = text.lastIndexOf(". ", end);
        if (sentenceBreak > start + CHUNK_SIZE_CHARS * 0.5) {
          end = sentenceBreak + 1;
        }
      }
    }

    chunks.push(text.slice(start, Math.min(end, text.length)).trim());
    start = Math.max(end - CHUNK_OVERLAP_CHARS, start + 1);

    // Safety check to prevent infinite loop
    if (start >= text.length) break;
  }

  return chunks.filter((c) => c.length > 0);
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
 * Chunks long content for better semantic search coverage
 */
export async function seedVectorize(env: Env): Promise<{ seeded: number }> {
  const content = getAllSearchableContent();
  const vectors: VectorizeVector[] = [];

  for (const item of content) {
    // Combine title, description, and full content
    const fullText = `${item.title}\n\n${item.description}\n\n${item.content}`;

    // Chunk the content
    const chunks = chunkContent(fullText);

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await generateEmbedding(env.AI, chunks[i]);

      vectors.push({
        id: `${item.id}-chunk-${i}`,
        values: embedding,
        metadata: {
          type: item.type,
          title: item.title,
          description: item.description,
          url: item.url,
          chunkIndex: i,
          totalChunks: chunks.length,
        },
      });
    }
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
 * Deduplicates results from multiple chunks of the same content
 */
export async function searchWithVectorize(
  env: Env,
  query: string,
  topK: number = 10
): Promise<SearchResult[]> {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(env.AI, query);

  // Query Vectorize - get extra results to account for deduplication
  const matches = await env.VECTORIZE.query(queryEmbedding, {
    topK: topK * 3,
    returnMetadata: "all",
  });

  // Deduplicate by base ID (remove -chunk-N suffix), keep highest score
  const seen = new Map<string, SearchResult>();

  for (const match of matches.matches) {
    const baseId = match.id.replace(/-chunk-\d+$/, "");

    if (!seen.has(baseId) || match.score > seen.get(baseId)!.score) {
      seen.set(baseId, {
        id: baseId,
        type: (match.metadata?.type as "post" | "project") || "post",
        title: (match.metadata?.title as string) || "",
        description: (match.metadata?.description as string) || "",
        url: (match.metadata?.url as string) || "",
        score: match.score,
      });
    }
  }

  return Array.from(seen.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
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
