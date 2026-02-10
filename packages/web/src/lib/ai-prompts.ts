/**
 * AI prompt templates for blog post generation
 */

export interface ProjectAnalysis {
  name: string;
  description: string;
  techStack: string[];
  mainPurpose: string;
  keyFeatures: string[];
  architecture: string;
  codeHighlights: string[];
}

export interface GeneratedBlogPost {
  title: string;
  slug: string;
  description: string;
  content: string;
  date: string;
}

/**
 * Prompt to analyze a GitHub repository
 */
export function getAnalysisPrompt(
  repoName: string,
  readme: string,
  keyFiles: Record<string, string>
): string {
  const filesContext = Object.entries(keyFiles)
    .map(([name, content]) => `### ${name}\n\`\`\`\n${content.slice(0, 2000)}\n\`\`\``)
    .join("\n\n");

  return `Analyze this GitHub repository and extract key information for writing a technical blog post.

Repository: ${repoName}

## README
${readme.slice(0, 3000)}

## Key Files
${filesContext}

---

Provide a JSON response with the following structure:
{
  "name": "Project name",
  "description": "One-line description",
  "techStack": ["Technology 1", "Technology 2"],
  "mainPurpose": "What problem does this solve?",
  "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"],
  "architecture": "Brief description of the system architecture",
  "codeHighlights": ["Interesting implementation detail 1", "Interesting implementation detail 2"]
}

Focus on:
- The core technologies used
- What makes this project interesting or unique
- Technical patterns or architectures worth discussing
- Code examples that would be educational

Respond ONLY with valid JSON.`;
}

/**
 * Prompt to generate a blog post from project analysis
 */
export function getBlogPostPrompt(
  analysis: ProjectAnalysis,
  repoUrl: string,
  additionalCode: string = ""
): string {
  return `Write a technical blog post about this project. The post should be educational, engaging, and include code examples.

## Project Information
- Name: ${analysis.name}
- Description: ${analysis.description}
- Tech Stack: ${analysis.techStack.join(", ")}
- Main Purpose: ${analysis.mainPurpose}
- Key Features: ${analysis.keyFeatures.join(", ")}
- Architecture: ${analysis.architecture}
- Code Highlights: ${analysis.codeHighlights.join("; ")}
- Repository: ${repoUrl}

${additionalCode ? `## Code Examples\n${additionalCode}` : ""}

---

Write a blog post in MDX format following these guidelines:

1. **Length**: 1500-2500 words
2. **Tone**: Technical but accessible, first-person perspective
3. **Structure**:
   - Hook/intro explaining why you built this
   - Problem statement
   - Architecture overview (include ASCII diagram if relevant)
   - Key technical decisions with code examples
   - Lessons learned
   - What's next

4. **Code Examples**: Include 3-5 relevant code snippets with explanations
5. **No Frontmatter**: Do NOT include YAML frontmatter - just the content
6. **Links**: Link to the GitHub repo and any relevant resources
7. **Author Voice**: Write as if you (Ryan) built this project

Important: 
- Start directly with the content (no frontmatter)
- Use ## for major sections
- Use ### for subsections
- Include code blocks with proper language tags
- End with a call to action or invitation to check out the code

Respond with ONLY the MDX content, no explanations or meta-commentary.`;
}

/**
 * Generate frontmatter for a blog post
 */
export function generateFrontmatter(
  title: string,
  slug: string,
  description: string
): string {
  const date = new Date().toISOString().split("T")[0];
  
  return `---
title: "${title}"
date: "${date}"
description: "${description}"
---

`;
}

/**
 * Generate a slug from a project name
 */
export function generateSlug(projectName: string): string {
  return `project-${projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

/**
 * Generate a blog post title from project analysis
 */
export function generateTitle(analysis: ProjectAnalysis): string {
  const mainTech = analysis.techStack[0] || "Code";
  return `Building ${analysis.name}: ${analysis.mainPurpose.slice(0, 50)}`;
}
