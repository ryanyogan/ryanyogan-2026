import { createFileRoute } from "@tanstack/react-router";
import { GitHubClient, parseGitHubUrl } from "~/lib/github";
import {
  getAnalysisPrompt,
  generateFrontmatter,
  generateSlug,
  generateTitle,
  type ProjectAnalysis,
} from "~/lib/ai-prompts";

// GitHub token from environment
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

export type GeneratePostRequest = {
  githubUrl: string;
  projectName?: string;
};

export type GeneratePostResponse = {
  success: boolean;
  slug?: string;
  title?: string;
  content?: string;
  error?: string;
  analysis?: ProjectAnalysis;
};

export const Route = createFileRoute("/api/generate-post")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body: GeneratePostRequest = await request.json();
          const { githubUrl, projectName } = body;

          if (!githubUrl) {
            return Response.json(
              { success: false, error: "GitHub URL is required" },
              { status: 400 }
            );
          }

          // Parse GitHub URL
          const parsed = parseGitHubUrl(githubUrl);
          if (!parsed) {
            return Response.json(
              { success: false, error: "Invalid GitHub URL" },
              { status: 400 }
            );
          }

          const { owner, repo } = parsed;

          // Initialize GitHub client
          if (!GITHUB_TOKEN) {
            return Response.json(
              { success: false, error: "GitHub token not configured" },
              { status: 500 }
            );
          }

          const github = new GitHubClient(GITHUB_TOKEN);

          // Fetch repository data
          console.log(`Fetching data for ${owner}/${repo}...`);

          const [repoData, readme, keyFiles] = await Promise.all([
            github.getRepo(owner, repo),
            github.getReadme(owner, repo),
            github.getKeyFiles(owner, repo),
          ]);

          console.log(`Fetched repo: ${repoData.name}`);
          console.log(`README length: ${readme.length}`);
          console.log(`Key files: ${Object.keys(keyFiles).join(", ")}`);

          // For now, return the gathered data
          // In a full implementation, we would:
          // 1. Call Workers AI to analyze the project
          // 2. Call Workers AI to generate the blog post
          // 3. Store in Vectorize for search
          // 4. Create a GitHub PR with the new MDX file

          // Generate analysis prompt (for debugging/testing)
          const analysisPrompt = getAnalysisPrompt(
            repoData.name,
            readme,
            keyFiles
          );

          // Mock analysis for now (would come from AI)
          const mockAnalysis: ProjectAnalysis = {
            name: projectName || repoData.name,
            description: repoData.description || "A project",
            techStack: repoData.language ? [repoData.language] : ["Unknown"],
            mainPurpose: repoData.description || "Building something cool",
            keyFeatures:
              repoData.topics.length > 0 ? repoData.topics : ["Feature 1"],
            architecture: "To be analyzed by AI",
            codeHighlights: ["To be analyzed by AI"],
          };

          const slug = generateSlug(mockAnalysis.name);
          const title = generateTitle(mockAnalysis);
          const description = mockAnalysis.description;

          // Generate mock content (would come from AI)
          const frontmatter = generateFrontmatter(title, slug, description);
          const mockContent = `${frontmatter}
This is a placeholder for AI-generated content about ${mockAnalysis.name}.

## Overview

${mockAnalysis.description}

## Tech Stack

${mockAnalysis.techStack.map((t) => `- ${t}`).join("\n")}

## Features

${mockAnalysis.keyFeatures.map((f) => `- ${f}`).join("\n")}

---

*Check out the code on [GitHub](${githubUrl}).*
`;

          return Response.json({
            success: true,
            slug,
            title,
            content: mockContent,
            analysis: mockAnalysis,
            // Include raw data for debugging
            _debug: {
              repoName: repoData.name,
              readmeLength: readme.length,
              keyFilesCount: Object.keys(keyFiles).length,
              analysisPromptLength: analysisPrompt.length,
            },
          } as GeneratePostResponse & { _debug: unknown });
        } catch (error) {
          console.error("Error generating post:", error);
          return Response.json(
            {
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
