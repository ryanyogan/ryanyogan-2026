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

// Type for workflow binding
interface WorkflowBinding {
  create: (options: { params: unknown }) => Promise<{ id: string }>;
}

// Type for our environment bindings
interface Env {
  POST_GENERATION_WORKFLOW?: WorkflowBinding;
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
          const workflow = cfEnv.POST_GENERATION_WORKFLOW;

          if (!workflow) {
            console.error("[TriggerWorkflow] Workflow binding not configured");
            return Response.json(
              { error: "Workflow binding not configured" },
              { status: 500 }
            );
          }

          // Create workflow instance
          const instance = await workflow.create({
            params: { projectsToProcess },
          });

          console.log(
            `[TriggerWorkflow] Started workflow ${instance.id} for ${projectsToProcess.length} projects:`,
            projectsToProcess.map((p) => p.slug).join(", ")
          );

          return Response.json({
            message: "Workflow started",
            triggered: true,
            instanceId: instance.id,
            projectCount: projectsToProcess.length,
            projects: projectsToProcess.map((p) => p.slug),
          });
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
