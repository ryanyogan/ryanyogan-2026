/**
 * AI prompt templates for blog post generation
 */

export interface ProjectAnalysis {
  title: string;
  description: string;
  techStack: string[];
  mainPurpose: string;
  keyFeatures: string[];
  architecture: string;
  codeHighlights: string[];
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
${readme.slice(0, 4000)}

## Key Files
${filesContext}

---

Provide a JSON response with the following structure:
{
  "title": "A compelling title for a blog post about this project",
  "description": "One sentence description for SEO/preview",
  "techStack": ["Technology 1", "Technology 2"],
  "mainPurpose": "What problem does this solve? (one sentence)",
  "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"],
  "architecture": "Brief description of the system architecture",
  "codeHighlights": ["Interesting implementation detail 1", "Interesting implementation detail 2"]
}

Focus on:
- The core technologies used
- What makes this project interesting or unique
- Technical patterns or architectures worth discussing
- Code examples that would be educational

Respond ONLY with valid JSON. No markdown, no explanation.`;
}

/**
 * Prompt to generate a blog post from project analysis
 */
export function getBlogPostPrompt(
  analysis: ProjectAnalysis,
  repoUrl: string,
  readme: string,
  keyFiles: Record<string, string>
): string {
  const codeExamples = Object.entries(keyFiles)
    .filter(([name]) => !name.toLowerCase().includes("readme"))
    .map(([name, content]) => `### ${name}\n\`\`\`\n${content.slice(0, 1500)}\n\`\`\``)
    .join("\n\n");

  return `Write a technical blog post about this project. The post should be educational, engaging, and include code examples.

## Project Information
- Title: ${analysis.title}
- Description: ${analysis.description}
- Tech Stack: ${analysis.techStack.join(", ")}
- Main Purpose: ${analysis.mainPurpose}
- Key Features: ${analysis.keyFeatures.join(", ")}
- Architecture: ${analysis.architecture}
- Code Highlights: ${analysis.codeHighlights.join("; ")}
- Repository: ${repoUrl}

## README Content
${readme.slice(0, 2000)}

## Code Examples Available
${codeExamples}

---

Write a blog post in MDX format following these guidelines:

1. **Length**: 1500-2500 words
2. **Tone**: Technical but accessible, first-person perspective (you ARE Ryan Yogan writing about your project)
3. **Structure**:
   - Hook/intro explaining why you built this
   - Problem statement
   - Architecture overview
   - Key technical decisions with code examples
   - Lessons learned
   - What's next
4. **Code Examples**: Include 3-5 relevant code snippets with explanations
5. **No Frontmatter**: Do NOT include YAML frontmatter - just the content starting with your intro paragraph
6. **Links**: Link to the GitHub repo and any relevant resources
7. **Author Voice**: Write as if you (Ryan) built this project - use "I" and share personal insights

Important:
- Start directly with the content (no frontmatter, no title header)
- Use ## for major sections
- Use ### for subsections
- Include code blocks with proper language tags
- End with a call to action or invitation to check out the code

Respond with ONLY the MDX content, no explanations or meta-commentary.`;
}
