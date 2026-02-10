/**
 * GitHub API client for fetching repository data and creating PRs/issues
 */

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
}

export interface GitHubContent {
  name: string;
  path: string;
  type: "file" | "dir";
  content?: string;
  encoding?: string;
}

export interface GitHubReadme {
  content: string;
  encoding: string;
}

export class GitHubClient {
  private token: string;
  private baseUrl = "https://api.github.com";

  constructor(token: string) {
    this.token = token;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `token ${this.token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "ryanyogan-workflows",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Get repository information
   */
  async getRepo(owner: string, repo: string): Promise<GitHubRepo> {
    return this.fetch<GitHubRepo>(`/repos/${owner}/${repo}`);
  }

  /**
   * Get repository contents (list files in a directory)
   */
  async getContents(
    owner: string,
    repo: string,
    path = ""
  ): Promise<GitHubContent[]> {
    const result = await this.fetch<GitHubContent | GitHubContent[]>(
      `/repos/${owner}/${repo}/contents/${path}`
    );
    return Array.isArray(result) ? result : [result];
  }

  /**
   * Get a file's content (decoded from base64)
   */
  async getFileContent(
    owner: string,
    repo: string,
    path: string
  ): Promise<string> {
    const content = await this.fetch<GitHubContent>(
      `/repos/${owner}/${repo}/contents/${path}`
    );

    if (content.content && content.encoding === "base64") {
      return atob(content.content.replace(/\n/g, ""));
    }

    throw new Error(`Unable to decode file content for ${path}`);
  }

  /**
   * Get repository README
   */
  async getReadme(owner: string, repo: string): Promise<string> {
    try {
      const readme = await this.fetch<GitHubReadme>(
        `/repos/${owner}/${repo}/readme`
      );

      if (readme.content && readme.encoding === "base64") {
        return atob(readme.content.replace(/\n/g, ""));
      }

      return "";
    } catch {
      return "";
    }
  }

  /**
   * Get key files from a repository for analysis
   */
  async getKeyFiles(
    owner: string,
    repo: string
  ): Promise<Record<string, string>> {
    const keyFiles: Record<string, string> = {};

    const filesToFetch = [
      "README.md",
      "readme.md",
      "package.json",
      "mix.exs",
      "Cargo.toml",
      "go.mod",
      "requirements.txt",
      "pyproject.toml",
    ];

    try {
      const contents = await this.getContents(owner, repo);
      const fileNames = contents.filter((c) => c.type === "file").map((c) => c.name);

      for (const file of filesToFetch) {
        if (fileNames.includes(file)) {
          try {
            keyFiles[file] = await this.getFileContent(owner, repo, file);
          } catch {
            // Skip files that can't be fetched
          }
        }
      }
    } catch {
      // Repository might be empty or have issues
    }

    return keyFiles;
  }

  /**
   * Create a new branch
   */
  async createBranch(
    owner: string,
    repo: string,
    branchName: string,
    fromBranch: string
  ): Promise<void> {
    // Get the SHA of the source branch
    const refResponse = await this.fetch<{ object: { sha: string } }>(
      `/repos/${owner}/${repo}/git/ref/heads/${fromBranch}`
    );
    const sha = refResponse.object.sha;

    // Create the new branch
    const response = await fetch(
      `${this.baseUrl}/repos/${owner}/${repo}/git/refs`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${this.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "ryanyogan-workflows",
        },
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha,
        }),
      }
    );

    if (!response.ok && response.status !== 422) {
      // 422 means branch already exists, which is fine
      const error = await response.text();
      throw new Error(`Failed to create branch: ${response.status} - ${error}`);
    }
  }

  /**
   * Create or update a file in a repository
   */
  async createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    options: {
      message: string;
      content: string;
      branch?: string;
      sha?: string;
    }
  ): Promise<{ commit: { sha: string } }> {
    const response = await fetch(
      `${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${this.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "ryanyogan-workflows",
        },
        body: JSON.stringify({
          message: options.message,
          content: btoa(options.content),
          branch: options.branch,
          sha: options.sha,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Failed to create/update file: ${response.status} - ${error}`
      );
    }

    return response.json();
  }

  /**
   * Create a pull request
   */
  async createPullRequest(
    owner: string,
    repo: string,
    options: {
      title: string;
      body: string;
      head: string;
      base: string;
    }
  ): Promise<{ html_url: string; number: number }> {
    const response = await fetch(
      `${this.baseUrl}/repos/${owner}/${repo}/pulls`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${this.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "ryanyogan-workflows",
        },
        body: JSON.stringify(options),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create PR: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Create a GitHub issue
   */
  async createIssue(
    owner: string,
    repo: string,
    options: {
      title: string;
      body: string;
      labels?: string[];
    }
  ): Promise<{ html_url: string; number: number }> {
    const response = await fetch(
      `${this.baseUrl}/repos/${owner}/${repo}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${this.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "ryanyogan-workflows",
        },
        body: JSON.stringify(options),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create issue: ${response.status} - ${error}`);
    }

    return response.json();
  }
}

/**
 * Parse a GitHub URL to extract owner and repo
 */
export function parseGitHubUrl(
  url: string
): { owner: string; repo: string } | null {
  const patterns = [
    /github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/,
    /^([^/]+)\/([^/]+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  }

  return null;
}
