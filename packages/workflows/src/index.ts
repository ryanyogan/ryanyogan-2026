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

    return Response.json({ error: "Not found" }, { status: 404 });
  },
};
