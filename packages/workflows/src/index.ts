/**
 * Cloudflare Workflows Worker
 *
 * Exports the PostGenerationWorkflow and provides HTTP endpoints
 * for health checks and manual workflow triggers.
 */

// Export the workflow class - Cloudflare picks this up from wrangler.jsonc
export { PostGenerationWorkflow } from "./post-generation";
export type { ProjectToProcess } from "./post-generation";

interface Env {
  POST_GENERATION: Workflow;
  GITHUB_TOKEN: string;
}

export default {
  /**
   * HTTP handler for health checks and debugging
   */
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/health") {
      return Response.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        workflow: "post-generation-workflow",
      });
    }

    // List workflow instances (for debugging)
    if (url.pathname === "/instances" && request.method === "GET") {
      try {
        const instances = await env.POST_GENERATION.list();
        return Response.json({
          instances: instances.instances.map((i) => ({
            id: i.id,
            status: i.status,
          })),
        });
      } catch (error) {
        return Response.json(
          { error: "Failed to list instances" },
          { status: 500 }
        );
      }
    }

    // Get specific instance status
    if (url.pathname.startsWith("/instances/") && request.method === "GET") {
      const instanceId = url.pathname.replace("/instances/", "");
      try {
        const instance = await env.POST_GENERATION.get(instanceId);
        const status = await instance.status();
        return Response.json(status);
      } catch (error) {
        return Response.json({ error: "Instance not found" }, { status: 404 });
      }
    }

    // Trigger workflow - called via service binding from web worker
    if (url.pathname === "/trigger" && request.method === "POST") {
      try {
        const body = await request.json() as { projectsToProcess: Array<{ slug: string; name: string; github: string; description: string; tech: string[] }> };
        const { projectsToProcess } = body;

        if (!projectsToProcess || projectsToProcess.length === 0) {
          return Response.json({
            message: "No projects to process",
            triggered: false,
          });
        }

        // Create workflow instance
        const instance = await env.POST_GENERATION.create({
          params: { projectsToProcess },
        });

        console.log(
          `[Workflow] Started instance ${instance.id} for ${projectsToProcess.length} projects:`,
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
        console.error("[Workflow] Failed to start:", error);
        return Response.json(
          {
            error: "Failed to start workflow",
            details: error instanceof Error ? error.message : String(error),
          },
          { status: 500 }
        );
      }
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  },
};
