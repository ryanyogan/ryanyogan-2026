/**
 * API endpoint to trigger the post generation workflow.
 * Called by GitHub Actions when projects.md is modified.
 */

import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

interface ProjectToProcess {
  slug: string;
  name: string;
  github: string;
  description: string;
  tech: string[];
}

interface TriggerRequest {
  projectsToProcess: ProjectToProcess[];
}

// Type for service binding (calls another worker via fetch)
interface ServiceBinding {
  fetch: (request: Request) => Promise<Response>;
}

// Type for our environment bindings
interface Env {
  POST_GENERATION_WORKFLOW?: ServiceBinding;
  ADMIN_TOKEN?: string;
}

export const Route = createFileRoute("/api/trigger-workflow")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const cfEnv = env as Env;
        
        // Auth check
        const authHeader = request.headers.get("Authorization");
        const expectedToken = cfEnv.ADMIN_TOKEN || process.env.ADMIN_TOKEN;

        if (!expectedToken) {
          console.error("[TriggerWorkflow] ADMIN_TOKEN not configured");
          return Response.json(
            { error: "Server misconfigured" },
            { status: 500 }
          );
        }

        if (authHeader !== `Bearer ${expectedToken}`) {
          console.warn("[TriggerWorkflow] Unauthorized request");
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse request body
        let body: TriggerRequest;
        try {
          body = await request.json();
        } catch {
          return Response.json(
            { error: "Invalid request body" },
            { status: 400 }
          );
        }

        const { projectsToProcess } = body;

        if (!projectsToProcess || projectsToProcess.length === 0) {
          return Response.json({
            message: "No projects to process",
            triggered: false,
          });
        }

        // Trigger the workflow via service binding
        try {
          const workflowService = cfEnv.POST_GENERATION_WORKFLOW;

          if (!workflowService) {
            console.error("[TriggerWorkflow] Workflow service binding not configured");
            return Response.json(
              { error: "Workflow service binding not configured" },
              { status: 500 }
            );
          }

          // Call the workflow worker's /trigger endpoint via service binding
          const triggerResponse = await workflowService.fetch(
            new Request("https://internal/trigger", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ projectsToProcess }),
            })
          );

          const result = await triggerResponse.json();

          if (!triggerResponse.ok) {
            console.error("[TriggerWorkflow] Workflow service returned error:", result);
            return Response.json(result, { status: triggerResponse.status });
          }

          console.log(
            `[TriggerWorkflow] Started workflow for ${projectsToProcess.length} projects:`,
            projectsToProcess.map((p) => p.slug).join(", ")
          );

          return Response.json(result);
        } catch (error) {
          console.error("[TriggerWorkflow] Failed to start workflow:", error);
          return Response.json(
            {
              error: "Failed to start workflow",
              details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
