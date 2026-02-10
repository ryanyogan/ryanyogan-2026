import { desc, gte } from "drizzle-orm";
import type { Database } from "@ryanyogan/db";
import { githubActivity, aiGeneratedContent, posts } from "@ryanyogan/db/schema";
import { generateId } from "@ryanyogan/shared";
import type { Env } from "../index";

export async function generateWeeklyDigest(db: Database, env: Env): Promise<void> {
  console.log("[Weekly Digest] Starting generation...");

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  try {
    // Gather data from the past week
    const recentActivity = await db
      .select()
      .from(githubActivity)
      .where(gte(githubActivity.timestamp, oneWeekAgo))
      .orderBy(desc(githubActivity.timestamp))
      .limit(50);

    const recentPosts = await db
      .select()
      .from(posts)
      .where(gte(posts.publishedAt, oneWeekAgo))
      .orderBy(desc(posts.publishedAt))
      .limit(10);

    // Prepare context for AI
    const activitySummary = recentActivity
      .map((a) => `- ${a.description} (${a.repoName})`)
      .join("\n");

    const postsSummary = recentPosts
      .map((p) => `- "${p.title}": ${p.excerpt}`)
      .join("\n");

    // Generate digest using Workers AI
    const prompt = `You are Ryan Yogan, an Engineering Leader and Software Developer. Write a personal, engaging weekly digest summarizing your work this week.

## Recent GitHub Activity:
${activitySummary || "No recent activity"}

## Published Blog Posts:
${postsSummary || "No new posts this week"}

Write a brief, personal update (2-3 paragraphs) in first person. Be authentic, mention specific projects or topics you worked on, and share any insights or learnings. Keep it conversational but professional.

Format the output as markdown.`;

    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      prompt,
      max_tokens: 1000,
    });

    const content = typeof response === "string" 
      ? response 
      : (response as { response?: string }).response || "";

    if (!content) {
      console.error("[Weekly Digest] AI returned empty content");
      return;
    }

    // Store the generated content for review
    await db.insert(aiGeneratedContent).values({
      id: generateId(),
      type: "weekly_digest",
      content,
      metadata: {
        activityCount: recentActivity.length,
        postsCount: recentPosts.length,
        weekStarting: oneWeekAgo.toISOString(),
      },
      status: "pending", // Requires approval before publishing
      createdAt: new Date(),
    });

    console.log("[Weekly Digest] Generated and saved for review");
  } catch (error) {
    console.error("[Weekly Digest] Error:", error);
    throw error;
  }
}
