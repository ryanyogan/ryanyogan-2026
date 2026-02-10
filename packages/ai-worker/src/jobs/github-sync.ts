import { eq } from "drizzle-orm";
import type { Database } from "@ryanyogan/db";
import { projects, githubActivity } from "@ryanyogan/db/schema";
import { generateId, slugify } from "@ryanyogan/shared";
import type { Env } from "../index";

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  pushed_at: string;
  created_at: string;
  private: boolean;
}

interface GithubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  payload: Record<string, unknown>;
  created_at: string;
}

export async function syncGithubActivity(db: Database, env: Env): Promise<void> {
  console.log("[GitHub Sync] Starting sync...");

  const username = env.GITHUB_USERNAME || "ryanyogan";
  const token = env.GITHUB_TOKEN;

  if (!token) {
    console.error("[GitHub Sync] No GitHub token configured");
    return;
  }

  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ryanyogan.com-ai-worker",
  };

  try {
    // Fetch repositories
    await syncRepositories(db, username, headers);

    // Fetch recent activity
    await syncRecentActivity(db, username, headers);

    console.log("[GitHub Sync] Sync completed successfully");
  } catch (error) {
    console.error("[GitHub Sync] Error:", error);
    throw error;
  }
}

async function syncRepositories(
  db: Database,
  username: string,
  headers: Record<string, string>
): Promise<void> {
  console.log("[GitHub Sync] Fetching repositories...");

  // Fetch public repos
  const publicRepos = await fetchAllPages<GithubRepo>(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
    headers
  );

  // Fetch private repos (requires appropriate token scope)
  const privateRepos = await fetchAllPages<GithubRepo>(
    `https://api.github.com/user/repos?per_page=100&visibility=private&sort=pushed`,
    headers
  ).catch(() => [] as GithubRepo[]); // Fail silently if no access

  const allRepos = [...publicRepos, ...privateRepos];
  console.log(`[GitHub Sync] Found ${allRepos.length} repositories`);

  const now = new Date();

  for (const repo of allRepos) {
    const slug = slugify(repo.name);

    // Check if project exists
    const existing = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, slug))
      .limit(1);

    const projectData = {
      name: repo.name,
      slug,
      description: repo.description || `Repository: ${repo.name}`,
      url: repo.homepage || null,
      githubUrl: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      topics: repo.topics,
      lastActivityAt: new Date(repo.pushed_at),
      updatedAt: now,
    };

    if (existing.length > 0) {
      // Update existing
      await db
        .update(projects)
        .set(projectData)
        .where(eq(projects.slug, slug));
    } else {
      // Insert new
      await db.insert(projects).values({
        id: generateId(),
        ...projectData,
        createdAt: new Date(repo.created_at),
        featured: false,
      });
    }
  }
}

async function syncRecentActivity(
  db: Database,
  username: string,
  headers: Record<string, string>
): Promise<void> {
  console.log("[GitHub Sync] Fetching recent activity...");

  const response = await fetch(
    `https://api.github.com/users/${username}/events?per_page=100`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const events = (await response.json()) as GithubEvent[];
  console.log(`[GitHub Sync] Found ${events.length} recent events`);

  for (const event of events) {
    // Check if event already exists
    const existing = await db
      .select()
      .from(githubActivity)
      .where(eq(githubActivity.id, event.id))
      .limit(1);

    if (existing.length > 0) continue;

    const description = formatEventDescription(event);

    await db.insert(githubActivity).values({
      id: event.id,
      eventType: event.type,
      repoName: event.repo.name,
      repoUrl: `https://github.com/${event.repo.name}`,
      description,
      timestamp: new Date(event.created_at),
      metadata: event.payload,
    });
  }
}

function formatEventDescription(event: GithubEvent): string {
  const repo = event.repo.name.split("/")[1] || event.repo.name;

  switch (event.type) {
    case "PushEvent":
      const commits = (event.payload.commits as Array<{ message: string }>) || [];
      const commitCount = commits.length;
      return `Pushed ${commitCount} commit${commitCount !== 1 ? "s" : ""} to ${repo}`;

    case "CreateEvent":
      const refType = event.payload.ref_type as string;
      return `Created ${refType} in ${repo}`;

    case "PullRequestEvent":
      const prAction = event.payload.action as string;
      return `${prAction} pull request in ${repo}`;

    case "IssuesEvent":
      const issueAction = event.payload.action as string;
      return `${issueAction} issue in ${repo}`;

    case "WatchEvent":
      return `Starred ${repo}`;

    case "ForkEvent":
      return `Forked ${repo}`;

    default:
      return `${event.type.replace("Event", "")} in ${repo}`;
  }
}

async function fetchAllPages<T>(
  url: string,
  headers: Record<string, string>
): Promise<T[]> {
  const results: T[] = [];
  let nextUrl: string | null = url;

  while (nextUrl) {
    const response = await fetch(nextUrl, { headers });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = (await response.json()) as T[];
    results.push(...data);

    // Check for next page
    const linkHeader = response.headers.get("Link");
    nextUrl = linkHeader?.match(/<([^>]+)>;\s*rel="next"/)?.[1] || null;
  }

  return results;
}
