/**
 * Post Generation Workflow
 *
 * A durable Cloudflare Workflow that generates blog posts for projects.
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
      `[PostGenerationWorkflow] Starting for ${projectsToProcess.length} projects`
    );

    for (const project of projectsToProcess) {
      console.log(`[PostGenerationWorkflow] Processing: ${project.name}`);

      try {
        // Step 1: Fetch GitHub data
        const githubData = await step.do(
          `fetch-github-${project.slug}`,
          {
            retries: { limit: 3, delay: "5 seconds", backoff: "exponential" },
            timeout: "1 minute",
          },
          async () => {
            console.log(`[Step] Fetching GitHub data for ${project.slug}`);
            const github = new GitHubClient(this.env.GITHUB_TOKEN);
            const parsed = parseGitHubUrl(project.github);

            if (!parsed) {
              throw new Error(`Invalid GitHub URL: ${project.github}`);
            }

            const [repo, readme, files] = await Promise.all([
              github.getRepo(parsed.owner, parsed.repo),
              github.getReadme(parsed.owner, parsed.repo),
              github.getKeyFiles(parsed.owner, parsed.repo),
            ]);

            console.log(
              `[Step] Fetched: ${repo.name}, README: ${readme.length} chars, Files: ${Object.keys(files).length}`
            );

            return { repo, readme, files };
          }
        );

        // Step 2: Analyze project with AI
        const analysis = await step.do(
          `analyze-${project.slug}`,
          {
            retries: { limit: 2, delay: "10 seconds" },
            timeout: "2 minutes",
          },
          async () => {
            console.log(`[Step] Analyzing project ${project.slug} with AI`);
            const result = await analyzeProject(
              this.env.AI,
              githubData.repo.name,
              githubData.readme,
              githubData.files
            );
            console.log(`[Step] Analysis complete: ${result.title}`);
            return result;
          }
        );

        // Step 3: Generate blog content
        const mdxContent = await step.do(
          `generate-content-${project.slug}`,
          {
            retries: { limit: 2, delay: "15 seconds" },
            timeout: "5 minutes",
          },
          async () => {
            console.log(`[Step] Generating blog content for ${project.slug}`);
            const content = await generateBlogContent(
              this.env.AI,
              analysis,
              project.github,
              githubData.readme,
              githubData.files
            );

            // Add frontmatter
            const date = new Date().toISOString().split("T")[0];
            const frontmatter = `---
title: "${analysis.title.replace(/"/g, '\\"')}"
date: "${date}"
description: "${analysis.description.replace(/"/g, '\\"')}"
featured: true
---

`;
            console.log(
              `[Step] Generated content: ${content.length} chars`
            );
            return frontmatter + content;
          }
        );

        // Step 4: Create PR
        const pr = await step.do(
          `create-pr-${project.slug}`,
          {
            retries: { limit: 3, delay: "5 seconds" },
            timeout: "1 minute",
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
                message: `Add blog post: ${project.name}`,
                content: mdxContent,
                branch: branchName,
              }
            );

            // Create PR
            const prResult = await github.createPullRequest(
              this.env.REPO_OWNER,
              this.env.REPO_NAME,
              {
                title: `[Auto] Add blog post for ${project.name}`,
                body: `## Auto-generated blog post

This PR was automatically generated by the post generation workflow.

**Project:** ${project.name}  
**GitHub:** ${project.github}  
**Generated:** ${new Date().toISOString()}

### Please review:
- [ ] Content accuracy
- [ ] Code examples are correct
- [ ] Tone and style match other posts
- [ ] No sensitive information included

---
*Generated by PostGenerationWorkflow*`,
                head: branchName,
                base: "master",
              }
            );

            console.log(`[Step] Created PR: ${prResult.html_url}`);
            return prResult;
          }
        );

        // Step 5: Seed Vectorize
        await step.do(
          `seed-vectorize-${project.slug}`,
          {
            retries: { limit: 2, delay: "5 seconds" },
            timeout: "30 seconds",
          },
          async () => {
            console.log(`[Step] Seeding Vectorize for ${project.slug}`);
            const embedding = await generateEmbedding(
              this.env.AI,
              `${analysis.title}. ${analysis.description}`
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
          `[PostGenerationWorkflow] Successfully processed ${project.slug}`
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(
          `[PostGenerationWorkflow] Error processing ${project.slug}:`,
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
                  body: `## Post Generation Failed

The automatic post generation workflow failed for this project.

**Project:** ${project.name}  
**Slug:** ${project.slug}  
**GitHub:** ${project.github}  
**Timestamp:** ${new Date().toISOString()}

### Error
\`\`\`
${errorMessage}
\`\`\`

### Next Steps
1. Check the workflow logs for more details
2. Fix any issues with the project data
3. Re-run the workflow or manually create the post

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
          // Failed to create issue, just log the original error
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
