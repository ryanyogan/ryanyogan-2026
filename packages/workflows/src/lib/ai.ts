/**
 * AI helpers for content generation
 * Uses Anthropic Claude Sonnet for high-quality blog post generation
 */

import Anthropic from "@anthropic-ai/sdk";
import { type ProjectAnalysis } from "./prompts";

// Claude Sonnet - great balance of quality and cost
const CLAUDE_MODEL = "claude-sonnet-4-20250514";

/**
 * Analyze a project using Claude - thorough analysis of ALL files
 */
export async function analyzeProject(
  anthropicKey: string,
  repoName: string,
  allFiles: Record<string, string>,
  repoMetadata: {
    description: string | null;
    language: string | null;
    topics: string[];
    stars: number;
    forks: number;
  }
): Promise<ProjectAnalysis> {
  const client = new Anthropic({ apiKey: anthropicKey });

  // Build a comprehensive view of ALL files
  const fileContents = Object.entries(allFiles)
    .map(([path, content]) => {
      // Truncate very large files but keep most content
      const truncated = content.length > 50000 
        ? content.slice(0, 50000) + "\n\n[... truncated ...]" 
        : content;
      return `### File: ${path}\n\`\`\`\n${truncated}\n\`\`\``;
    })
    .join("\n\n");

  const prompt = `You are a senior software architect analyzing a GitHub repository in extreme detail. Your goal is to understand EVERYTHING about this project - its purpose, architecture, every technical decision, and what makes it interesting.

## Repository: ${repoName}

### Metadata
- Description: ${repoMetadata.description || "None"}
- Primary Language: ${repoMetadata.language || "Unknown"}
- Topics: ${repoMetadata.topics.join(", ") || "None"}
- Stars: ${repoMetadata.stars}
- Forks: ${repoMetadata.forks}

## ALL SOURCE FILES

${fileContents}

---

## Your Task

Analyze this repository EXHAUSTIVELY. Look at every file, understand the architecture, the patterns used, the technologies, the interesting implementation details.

Provide a JSON response with this structure:

{
  "title": "A compelling, specific title that captures the essence of this project",
  "description": "A rich 2-3 sentence description that would make developers want to read more",
  "techStack": ["Every technology, framework, library used - be comprehensive"],
  "mainPurpose": "A detailed explanation of what problem this solves and why it matters (2-3 sentences)",
  "keyFeatures": ["List 5-10 key features or capabilities, be specific"],
  "architecture": "A detailed explanation of the system architecture, how components interact, what patterns are used (3-4 sentences)",
  "codeHighlights": ["5-10 specific, interesting implementation details with file references - things that would be educational to discuss"],
  "technicalDecisions": ["Key architectural or technical decisions made and why they matter"],
  "challengesAndSolutions": ["Interesting problems solved in this codebase"],
  "bestPractices": ["Good practices demonstrated in the code"],
  "potentialImprovements": ["Areas that could be enhanced or extended"]
}

Be EXTREMELY thorough. This analysis will be used to write a comprehensive technical blog post. The more detail and insight you provide, the better the blog post will be.

Respond ONLY with valid JSON. No markdown wrapping, no explanation.`;

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  // Extract text content
  const textContent = response.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in Claude response");
  }

  // Parse JSON response
  let jsonText = textContent.text.trim();
  
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
    console.error("[AI] Failed to parse Claude analysis:", jsonText.slice(0, 500));
    throw new Error(`Failed to parse Claude analysis: ${error}`);
  }
}

/**
 * Generate an exhaustive blog post using Claude
 */
export async function generateBlogContent(
  anthropicKey: string,
  analysis: ProjectAnalysis,
  repoUrl: string,
  allFiles: Record<string, string>
): Promise<string> {
  const client = new Anthropic({ apiKey: anthropicKey });

  // Include ALL code files for reference
  const fileContents = Object.entries(allFiles)
    .map(([path, content]) => {
      const truncated = content.length > 30000 
        ? content.slice(0, 30000) + "\n\n[... truncated ...]" 
        : content;
      return `### File: ${path}\n\`\`\`\n${truncated}\n\`\`\``;
    })
    .join("\n\n");

  const analysisJson = JSON.stringify(analysis, null, 2);

  const prompt = `You are Ryan Yogan, a senior engineering leader with 20+ years of experience. You're writing an EXHAUSTIVE technical blog post about one of your projects. This is not a quick overview - this is a deep-dive technical article that leaves nothing unexplained.

## Project Analysis
${analysisJson}

## Repository URL
${repoUrl}

## COMPLETE SOURCE CODE
${fileContents}

---

## Your Task

Write a COMPREHENSIVE, EXHAUSTIVE technical blog post about this project. This should be a definitive guide that:

1. **Explains the WHY** - Why did you build this? What problem were you solving? What motivated the technical choices?

2. **Deep Architecture Dive** - Explain the entire system architecture. How do all the pieces fit together? Draw connections between files and components.

3. **Code Walkthrough** - Include MANY code examples (10+ if the project warrants it). Don't just show code - explain it line by line when it's interesting. Reference actual files from the codebase.

4. **Technical Decisions** - For every major technical decision, explain:
   - What you chose
   - Why you chose it
   - What alternatives you considered
   - Tradeoffs you made

5. **Lessons Learned** - What did you learn building this? What would you do differently? What surprised you?

6. **Implementation Details** - Dive into the interesting implementation details. Show the clever solutions, the elegant patterns, the hard-won knowledge.

## Writing Guidelines

- **Length**: 3000-6000 words. This is a THOROUGH post. Don't skimp.
- **Voice**: First person ("I built...", "I chose..."). You ARE Ryan Yogan.
- **Tone**: Technical but accessible. Assume the reader is a developer but explain your reasoning.
- **Code Examples**: Use proper syntax highlighting. Explain what the code does and WHY.
- **Structure**: Use clear headers (##, ###) to organize the post.

## Format Requirements

- Start DIRECTLY with an engaging opening paragraph. NO frontmatter, NO title.
- Use ## for major sections, ### for subsections
- Code blocks with proper language tags (\`\`\`typescript, \`\`\`elixir, etc.)
- Link to the GitHub repo: ${repoUrl}
- End with a call to action

## Section Suggestions

1. **Opening Hook** - Why this project exists, what got you excited
2. **The Problem** - What you were trying to solve
3. **Architecture Overview** - High-level system design
4. **Tech Stack Deep Dive** - Why each technology was chosen
5. **Core Implementation** - The heart of the codebase, with code examples
6. **Interesting Patterns** - Design patterns, clever solutions
7. **Challenges & Solutions** - Problems you encountered and how you solved them
8. **Performance Considerations** - If relevant
9. **Testing Strategy** - If tests are present
10. **Deployment & Operations** - If relevant
11. **Lessons Learned** - What you'd do differently
12. **What's Next** - Future plans
13. **Conclusion & Call to Action**

Write the blog post now. Be thorough. Be educational. Be engaging. Show your expertise.`;

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 8192, // Allow for a very long post
    messages: [{ role: "user", content: prompt }],
  });

  const textContent = response.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in Claude response");
  }

  return textContent.text;
}

/**
 * Generate embedding for content using Workers AI
 * (Still use Cloudflare for embeddings - it's fast and cheap)
 */
export async function generateEmbedding(
  ai: Ai,
  text: string
): Promise<number[]> {
  const EMBEDDING_MODEL = "@cf/baai/bge-base-en-v1.5";
  
  const response = await ai.run(EMBEDDING_MODEL, {
    text: [text],
  });

  const data = (response as { data: number[][] }).data;
  if (!data || !data[0]) {
    throw new Error("Failed to generate embedding");
  }

  return data[0];
}
