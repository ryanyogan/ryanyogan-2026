import { eq, isNull, or, lt } from "drizzle-orm";
import type { Database } from "@ryanyogan/db";
import { posts, projects, vectorEmbeddings } from "@ryanyogan/db/schema";
import { generateId } from "@ryanyogan/shared";
import type { Env } from "../index";

const CHUNK_SIZE = 500; // Characters per chunk
const EMBEDDING_MODEL = "@cf/baai/bge-base-en-v1.5";

export async function syncVectorEmbeddings(db: Database, env: Env): Promise<void> {
  console.log("[Vector Sync] Starting sync...");

  try {
    // Sync published posts
    await syncPostEmbeddings(db, env);

    // Sync projects
    await syncProjectEmbeddings(db, env);

    console.log("[Vector Sync] Sync completed");
  } catch (error) {
    console.error("[Vector Sync] Error:", error);
    throw error;
  }
}

async function syncPostEmbeddings(db: Database, env: Env): Promise<void> {
  console.log("[Vector Sync] Syncing post embeddings...");

  // Get published posts that need embedding
  const postsToEmbed = await db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .limit(50);

  for (const post of postsToEmbed) {
    // Check if embeddings exist and are current
    const existingEmbeddings = await db
      .select()
      .from(vectorEmbeddings)
      .where(eq(vectorEmbeddings.sourceId, post.id));

    // Skip if embeddings exist and post hasn't been updated
    const latestEmbedding = existingEmbeddings[0];
    if (latestEmbedding && latestEmbedding.updatedAt >= post.updatedAt) {
      continue;
    }

    console.log(`[Vector Sync] Processing post: ${post.title}`);

    // Create text to embed
    const textToEmbed = `
Title: ${post.title}
${post.excerpt}

${post.content}
    `.trim();

    // Chunk the content
    const chunks = chunkText(textToEmbed, CHUNK_SIZE);

    // Delete old embeddings
    if (existingEmbeddings.length > 0) {
      // Delete from Vectorize
      for (const emb of existingEmbeddings) {
        if (emb.vectorId) {
          try {
            await env.VECTORIZE.deleteByIds([emb.vectorId]);
          } catch (e) {
            console.warn(`Failed to delete vector ${emb.vectorId}:`, e);
          }
        }
      }

      // Delete from DB
      await db
        .delete(vectorEmbeddings)
        .where(eq(vectorEmbeddings.sourceId, post.id));
    }

    // Create new embeddings
    const now = new Date();

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (!chunk) continue;

      // Generate embedding using Workers AI
      const embeddingResponse = await env.AI.run(EMBEDDING_MODEL, {
        text: chunk,
      });

      const embedding = embeddingResponse.data?.[0];
      if (!embedding) {
        console.warn(`[Vector Sync] No embedding returned for chunk ${i}`);
        continue;
      }

      // Generate vector ID
      const vectorId = `post_${post.id}_${i}`;

      // Insert into Vectorize
      await env.VECTORIZE.insert([
        {
          id: vectorId,
          values: embedding,
          metadata: {
            sourceType: "post",
            sourceId: post.id,
            title: post.title,
            slug: post.slug,
            chunkIndex: i,
          },
        },
      ]);

      // Store reference in D1
      await db.insert(vectorEmbeddings).values({
        id: generateId(),
        sourceType: "post",
        sourceId: post.id,
        chunk,
        chunkIndex: i,
        vectorId,
        createdAt: now,
        updatedAt: now,
      });
    }

    console.log(`[Vector Sync] Created ${chunks.length} embeddings for post: ${post.title}`);
  }
}

async function syncProjectEmbeddings(db: Database, env: Env): Promise<void> {
  console.log("[Vector Sync] Syncing project embeddings...");

  const projectsToEmbed = await db
    .select()
    .from(projects)
    .limit(100);

  for (const project of projectsToEmbed) {
    // Check existing embeddings
    const existingEmbeddings = await db
      .select()
      .from(vectorEmbeddings)
      .where(eq(vectorEmbeddings.sourceId, project.id));

    const latestEmbedding = existingEmbeddings[0];
    if (latestEmbedding && latestEmbedding.updatedAt >= project.updatedAt) {
      continue;
    }

    console.log(`[Vector Sync] Processing project: ${project.name}`);

    const textToEmbed = `
Project: ${project.name}
${project.description}
${project.longDescription || ""}
Technologies: ${project.topics?.join(", ") || project.language || ""}
    `.trim();

    // For projects, we usually don't need chunking
    const embeddingResponse = await env.AI.run(EMBEDDING_MODEL, {
      text: textToEmbed,
    });

    const embedding = embeddingResponse.data?.[0];
    if (!embedding) {
      console.warn(`[Vector Sync] No embedding returned for project: ${project.name}`);
      continue;
    }

    const vectorId = `project_${project.id}_0`;
    const now = new Date();

    // Delete old if exists
    if (existingEmbeddings.length > 0) {
      for (const emb of existingEmbeddings) {
        if (emb.vectorId) {
          try {
            await env.VECTORIZE.deleteByIds([emb.vectorId]);
          } catch (e) {
            console.warn(`Failed to delete vector:`, e);
          }
        }
      }
      await db
        .delete(vectorEmbeddings)
        .where(eq(vectorEmbeddings.sourceId, project.id));
    }

    // Insert new
    await env.VECTORIZE.insert([
      {
        id: vectorId,
        values: embedding,
        metadata: {
          sourceType: "project",
          sourceId: project.id,
          name: project.name,
          slug: project.slug,
        },
      },
    ]);

    await db.insert(vectorEmbeddings).values({
      id: generateId(),
      sourceType: "project",
      sourceId: project.id,
      chunk: textToEmbed,
      chunkIndex: 0,
      vectorId,
      createdAt: now,
      updatedAt: now,
    });
  }
}

function chunkText(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = "";

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? " " : "") + sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
