/**
 * AI helpers for content generation
 * Uses Cloudflare Workers AI (Llama 3.3 70B)
 * Future: Will support Anthropic Claude when API key is provided
 */

import { getAnalysisPrompt, getBlogPostPrompt, type ProjectAnalysis } from "./prompts";

// Models
const ANALYSIS_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const GENERATION_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const EMBEDDING_MODEL = "@cf/baai/bge-base-en-v1.5";

/**
 * Analyze a project using AI
 */
export async function analyzeProject(
  ai: Ai,
  repoName: string,
  readme: string,
  keyFiles: Record<string, string>
): Promise<ProjectAnalysis> {
  const prompt = getAnalysisPrompt(repoName, readme, keyFiles);

  const response = await ai.run(ANALYSIS_MODEL, {
    messages: [
      {
        role: "system",
        content:
          "You are a technical analyst. Analyze the provided repository and respond with valid JSON only. No markdown, no explanation, just the JSON object.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 2000,
  });

  const responseText = (response as { response: string }).response;

  // Try to parse JSON, handling potential markdown wrapping
  let jsonText = responseText.trim();
  
  // Remove markdown code block if present
  if (jsonText.startsWith("```json")) {
    jsonText = jsonText.slice(7);
  } else if (jsonText.startsWith("```")) {
    jsonText = jsonText.slice(3);
  }
  if (jsonText.endsWith("```")) {
    jsonText = jsonText.slice(0, -3);
  }
  jsonText = jsonText.trim();

  try {
    return JSON.parse(jsonText) as ProjectAnalysis;
  } catch (error) {
    console.error("[AI] Failed to parse analysis JSON:", jsonText);
    throw new Error(`Failed to parse AI analysis response: ${error}`);
  }
}

/**
 * Generate blog post content using AI
 */
export async function generateBlogContent(
  ai: Ai,
  analysis: ProjectAnalysis,
  repoUrl: string,
  readme: string,
  keyFiles: Record<string, string>
): Promise<string> {
  const prompt = getBlogPostPrompt(analysis, repoUrl, readme, keyFiles);

  const response = await ai.run(GENERATION_MODEL, {
    messages: [
      {
        role: "system",
        content: `You are Ryan Yogan, a senior engineering leader with 20 years of experience. You're writing a technical blog post about one of your projects.

Write in first person ("I built this because..."). Be technical but accessible. Share genuine insights and lessons learned.

Your writing style:
- Conversational but professional
- Include code examples with explanations
- Share the "why" behind technical decisions
- Be honest about tradeoffs and challenges
- End with next steps or call to action

Do NOT include frontmatter or title - start directly with your opening paragraph.`,
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 4000,
  });

  return (response as { response: string }).response;
}

/**
 * Generate embedding for content
 */
export async function generateEmbedding(
  ai: Ai,
  text: string
): Promise<number[]> {
  const response = await ai.run(EMBEDDING_MODEL, {
    text: [text],
  });

  const data = (response as { data: number[][] }).data;
  if (!data || !data[0]) {
    throw new Error("Failed to generate embedding");
  }

  return data[0];
}
