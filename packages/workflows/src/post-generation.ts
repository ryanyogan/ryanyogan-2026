/**
 * Post Generation Workflow
 *
 * A durable Cloudflare Workflow that generates EXHAUSTIVE blog posts for projects.
 * Uses Claude Sonnet for high-quality, thorough content generation.
 * Triggered by GitHub Actions when projects.md is modified.
 */

import {
  WorkflowEntrypoint,
  WorkflowStep,
  WorkflowEvent,
} from "cloudflare:workers";
import { GitHubClient, parseGitHubUrl } from "./lib/github";
import {
  analyzeProject,
  generateBlogContent,
  generateEmbedding,
} from "./lib/ai";

interface Env {
  AI: Ai;
  VECTORIZE: VectorizeIndex;
  GITHUB_TOKEN: string;
  ANTHROPIC_API_KEY: string;
  REPO_OWNER: string;
  REPO_NAME: string;
}

export interface ProjectToProcess {
  slug: string;
  name: string;
  github: string;
  description: string;
  tech: string[];
}

interface WorkflowParams {
  projectsToProcess: ProjectToProcess[];
}

interface WorkflowResult {
  results: Array<{
    slug: string;
    status: "success" | "error";
    prUrl?: string;
    issueUrl?: string;
    error?: string;
  }>;
}

export class PostGenerationWorkflow extends WorkflowEntrypoint<
  Env,
  WorkflowParams
> {
  async run(
    event: WorkflowEvent<WorkflowParams>,
    step: WorkflowStep
  ): Promise<WorkflowResult> {
    const { projectsToProcess } = event.payload;
    const results: WorkflowResult["results"] = [];

    console.log(
      `[PostGenerationWorkflow] Starting EXHAUSTIVE post generation for ${projectsToProcess.length} projects`
    );

    for (const project of projectsToProcess) {
      console.log(`[PostGenerationWorkflow] Processing: ${project.name}`);

      try {
        // Step 1: Fetch ALL GitHub data - comprehensive repository analysis
        const githubData = await step.do(
          `fetch-github-${project.slug}`,
          {
            retries: { limit: 3, delay: "10 seconds", backoff: "exponential" },
            timeout: "5 minutes", // Longer timeout for fetching all files
          },
          async () => {
            console.log(`[Step] Fetching ALL files from ${project.slug}...`);
            const github = new GitHubClient(this.env.GITHUB_TOKEN);
            const parsed = parseGitHubUrl(project.github);

            if (!parsed) {
              throw new Error(`Invalid GitHub URL: ${project.github}`);
            }

            // Fetch repo metadata
            const repo = await github.getRepo(parsed.owner, parsed.repo);
            
            // Fetch ALL source files (up to 100 files)
            const allFiles = await github.getAllFiles(parsed.owner, parsed.repo, 100, 100000);

            console.log(
              `[Step] Fetched ${Object.keys(allFiles).length} files from ${repo.name}`
            );
            console.log(`[Step] Files: ${Object.keys(allFiles).join(", ")}`);

            return { 
              repo, 
              allFiles,
              metadata: {
                description: repo.description,
                language: repo.language,
                topics: repo.topics,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
              }
            };
          }
        );

        // Step 2: Deep analysis with Claude Sonnet
        const analysis = await step.do(
          `analyze-${project.slug}`,
          {
            retries: { limit: 2, delay: "30 seconds" },
            timeout: "5 minutes", // Claude analysis can take time
          },
          async () => {
            console.log(`[Step] Deep analysis of ${project.slug} with Claude Sonnet...`);
            
            const result = await analyzeProject(
              this.env.ANTHROPIC_API_KEY,
              githubData.repo.name,
              githubData.allFiles,
              githubData.metadata
            );
            
            console.log(`[Step] Analysis complete: "${result.title}"`);
            console.log(`[Step] Tech stack: ${result.techStack.join(", ")}`);
            console.log(`[Step] Key features: ${result.keyFeatures.length}`);
            console.log(`[Step] Code highlights: ${result.codeHighlights.length}`);
            
            return result;
          }
        );

        // Step 3: Generate EXHAUSTIVE blog content with Claude
        const mdxContent = await step.do(
          `generate-content-${project.slug}`,
          {
            retries: { limit: 2, delay: "30 seconds" },
            timeout: "10 minutes", // Allow plenty of time for thorough content
          },
          async () => {
            console.log(`[Step] Generating EXHAUSTIVE blog post for ${project.slug}...`);
            
            const content = await generateBlogContent(
              this.env.ANTHROPIC_API_KEY,
              analysis,
              project.github,
              githubData.allFiles
            );

            // Add frontmatter
            const date = new Date().toISOString().split("T")[0];
            const frontmatter = `---
title: "${analysis.title.replace(/"/g, '\\"')}"
date: "${date}"
description: "${analysis.description.replace(/"/g, '\\"')}"
featured: true
github: "${project.github}"
tech:
${analysis.techStack.map(t => `  - "${t}"`).join("\n")}
---

`;
            console.log(
              `[Step] Generated exhaustive content: ${content.length} chars (~${Math.round(content.split(/\s+/).length)} words)`
            );
            return frontmatter + content;
          }
        );

        // Step 4: Create PR with the comprehensive blog post
        const pr = await step.do(
          `create-pr-${project.slug}`,
          {
            retries: { limit: 3, delay: "5 seconds" },
            timeout: "2 minutes",
          },
          async () => {
            console.log(`[Step] Creating PR for ${project.slug}`);
            const github = new GitHubClient(this.env.GITHUB_TOKEN);
            const slug = `project-${project.slug}`;
            const branchName = `auto-post/${slug}`;
            const filePath = `packages/web/content/writing/${slug}.mdx`;

            // Create branch from master
            await github.createBranch(
              this.env.REPO_OWNER,
              this.env.REPO_NAME,
              branchName,
              "master"
            );

            // Create file
            await github.createOrUpdateFile(
              this.env.REPO_OWNER,
              this.env.REPO_NAME,
              filePath,
              {
                message: `Add comprehensive blog post: ${project.name}`,
                content: mdxContent,
                branch: branchName,
              }
            );

            // Create PR
            const wordCount = mdxContent.split(/\s+/).length;
            const prResult = await github.createPullRequest(
              this.env.REPO_OWNER,
              this.env.REPO_NAME,
              {
                title: `[Auto] Deep-dive blog post: ${project.name}`,
                body: `## 🤖 AI-Generated Comprehensive Blog Post

This PR contains an **exhaustive technical deep-dive** into the ${project.name} project, automatically generated using Claude Sonnet.

### 📊 Stats
- **Word Count:** ~${wordCount} words
- **Files Analyzed:** ${Object.keys(githubData.allFiles).length}
- **Generated:** ${new Date().toISOString()}

### 📁 Project
- **Name:** ${project.name}
- **GitHub:** ${project.github}
- **Tech Stack:** ${analysis.techStack.join(", ")}

### 🔍 What Was Analyzed
\`\`\`
${Object.keys(githubData.allFiles).slice(0, 20).join("\n")}
${Object.keys(githubData.allFiles).length > 20 ? `... and ${Object.keys(githubData.allFiles).length - 20} more files` : ""}
\`\`\`

### ✅ Review Checklist
- [ ] Content is accurate and reflects the actual codebase
- [ ] Code examples are correct and well-explained
- [ ] Technical decisions and tradeoffs are properly described
- [ ] No sensitive information (API keys, secrets) is included
- [ ] Tone matches Ryan's writing style
- [ ] Links work correctly

---
*Generated by PostGenerationWorkflow using Claude Sonnet*`,
                head: branchName,
                base: "master",
              }
            );

            console.log(`[Step] Created PR: ${prResult.html_url}`);
            return prResult;
          }
        );

        // Step 5: Seed Vectorize with embeddings
        await step.do(
          `seed-vectorize-${project.slug}`,
          {
            retries: { limit: 2, delay: "5 seconds" },
            timeout: "30 seconds",
          },
          async () => {
            console.log(`[Step] Seeding Vectorize for ${project.slug}`);
            
            // Create a rich text for embedding
            const embeddingText = `
              ${analysis.title}. 
              ${analysis.description}. 
              ${analysis.mainPurpose}. 
              Technologies: ${analysis.techStack.join(", ")}. 
              Features: ${analysis.keyFeatures.join(", ")}.
            `.trim();
            
            const embedding = await generateEmbedding(
              this.env.AI,
              embeddingText
            );

            await this.env.VECTORIZE.upsert([
              {
                id: `post-project-${project.slug}`,
                values: embedding,
                metadata: {
                  type: "post",
                  title: analysis.title,
                  slug: `project-${project.slug}`,
                  url: `/writing/project-${project.slug}`,
                  tech: analysis.techStack.join(", "),
                },
              },
            ]);
            console.log(`[Step] Vectorize seeded for ${project.slug}`);
          }
        );

        results.push({
          slug: project.slug,
          status: "success",
          prUrl: pr.html_url,
        });

        console.log(
          `[PostGenerationWorkflow] ✅ Successfully processed ${project.slug}`
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(
          `[PostGenerationWorkflow] ❌ Error processing ${project.slug}:`,
          errorMessage
        );

        // Create GitHub issue for the error
        try {
          const issue = await step.do(
            `create-issue-${project.slug}`,
            { retries: { limit: 2 } },
            async () => {
              console.log(
                `[Step] Creating error issue for ${project.slug}`
              );
              const github = new GitHubClient(this.env.GITHUB_TOKEN);
              return github.createIssue(
                this.env.REPO_OWNER,
                this.env.REPO_NAME,
                {
                  title: `[Auto Post Generation] Failed for ${project.name}`,
                  body: `## ❌ Post Generation Failed

The automatic post generation workflow failed for this project.

**Project:** ${project.name}  
**Slug:** ${project.slug}  
**GitHub:** ${project.github}  
**Timestamp:** ${new Date().toISOString()}

### Error
\`\`\`
${errorMessage}
\`\`\`

### Possible Causes
- Repository might be private or inaccessible
- GitHub API rate limiting
- Anthropic API issues
- Repository has unusual structure

### Next Steps
1. Check the workflow logs in Cloudflare dashboard
2. Verify the GitHub token has access to the repository
3. Check Anthropic API key is valid
4. Re-run the workflow or manually create the post

---
*This issue was automatically created by PostGenerationWorkflow*`,
                  labels: ["auto-generated", "bug"],
                }
              );
            }
          );

          results.push({
            slug: project.slug,
            status: "error",
            error: errorMessage,
            issueUrl: issue.html_url,
          });
        } catch (issueError) {
          console.error(
            `[PostGenerationWorkflow] Failed to create issue:`,
            issueError
          );
          results.push({
            slug: project.slug,
            status: "error",
            error: errorMessage,
          });
        }
      }
    }

    console.log(
      `[PostGenerationWorkflow] Completed. Results: ${JSON.stringify(results)}`
    );
    return { results };
  }
}
