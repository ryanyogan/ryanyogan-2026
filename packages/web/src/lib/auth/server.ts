import { betterAuth } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@ryanyogan/db/schema";

// Type for Cloudflare bindings
export interface CloudflareEnv {
  DB: D1Database;
  CACHE: KVNamespace;
  R2: R2Bucket;
  AI: Ai;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
}

/**
 * Creates the Better Auth instance
 * Handles both CLI schema generation and runtime scenarios
 */
function createAuth(env?: CloudflareEnv, cf?: IncomingRequestCfProperties) {
  // Use actual DB for runtime, mock for CLI
  const db = env ? drizzle(env.DB, { schema }) : ({} as any);

  return betterAuth({
    ...withCloudflare(
      {
        autoDetectIpAddress: true,
        geolocationTracking: true,
        cf: cf || {},
        d1: env
          ? {
              db,
              options: {
                usePlural: true,
                debugLogs: process.env.NODE_ENV !== "production",
              },
            }
          : undefined,
        kv: env?.CACHE,
      },
      {
        appName: "ryanyogan.com",
        baseURL: env?.BETTER_AUTH_URL || "http://localhost:5173",
        secret: env?.BETTER_AUTH_SECRET || "dev-secret-change-in-production",
        
        // GitHub OAuth for admin access
        socialProviders: {
          github: {
            clientId: env?.GITHUB_CLIENT_ID || "",
            clientSecret: env?.GITHUB_CLIENT_SECRET || "",
          },
        },

        // Session configuration
        session: {
          expiresIn: 60 * 60 * 24 * 7, // 7 days
          updateAge: 60 * 60 * 24, // Update session every day
        },

        // Rate limiting via KV
        rateLimit: {
          enabled: true,
          window: 60,
          max: 100,
          customRules: {
            "/sign-in/social": {
              window: 60,
              max: 10,
            },
          },
        },

        // User configuration
        user: {
          additionalFields: {
            role: {
              type: "string",
              defaultValue: "user",
            },
          },
        },
      }
    ),
    // Database adapter for CLI schema generation
    ...(env
      ? {}
      : {
          database: drizzleAdapter({} as D1Database, {
            provider: "sqlite",
            usePlural: true,
          }),
        }),
  });
}

// Export for CLI schema generation
export const auth = createAuth();

// Export for runtime usage
export { createAuth };

// Helper type
export type Auth = ReturnType<typeof createAuth>;
