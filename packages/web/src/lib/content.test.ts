import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllPosts,
  getPostBySlug,
  getProjectPost,
  formatDate,
  getAllProjects,
  getFeaturedProjects,
  getOtherProjects,
  getProjectBySlug,
  getAllSearchableContent,
} from "./content";

// The virtual:content module is mocked via vitest.config.ts alias

describe("content", () => {
  describe("getAllPosts", () => {
    it("returns posts sorted by date descending (newest first)", () => {
      const posts = getAllPosts();
      expect(posts.length).toBeGreaterThan(0);

      // Verify sorted by date descending
      for (let i = 0; i < posts.length - 1; i++) {
        const current = posts[i];
        const next = posts[i + 1];
        if (current && next) {
          const currentDate = new Date(current.date).getTime();
          const nextDate = new Date(next.date).getTime();
          expect(currentDate).toBeGreaterThanOrEqual(nextDate);
        }
      }
    });
  });

  describe("getPostBySlug", () => {
    it("returns a post when slug matches", () => {
      const post = getPostBySlug("test-post");
      expect(post).toBeDefined();
      expect(post?.slug).toBe("test-post");
      expect(post?.title).toBe("Test Post");
    });

    it("returns undefined for non-existent slug", () => {
      const post = getPostBySlug("non-existent-post");
      expect(post).toBeUndefined();
    });
  });

  describe("getProjectPost", () => {
    it("finds a blog post for a project by convention (project-{slug})", () => {
      // Our mock doesn't have this pattern, so it should return undefined
      const post = getProjectPost("test-project");
      expect(post).toBeUndefined();
    });
  });

  describe("formatDate", () => {
    it("formats a date string to human-readable format", () => {
      const formatted = formatDate("2024-01-15");
      // Account for timezone differences - date should contain year and month
      expect(formatted).toMatch(/January \d{1,2}, 2024/);
    });

    it("handles different date formats", () => {
      const formatted = formatDate("2024-12-25");
      expect(formatted).toMatch(/December \d{1,2}, 2024/);
    });

    it("returns consistent locale format", () => {
      const formatted = formatDate("2024-06-01");
      // Should be in "Month Day, Year" format
      expect(formatted).toMatch(/^\w+ \d{1,2}, \d{4}$/);
    });
  });

  describe("getAllProjects", () => {
    it("returns all projects", () => {
      const projects = getAllProjects();
      expect(projects.length).toBe(2);
    });
  });

  describe("getFeaturedProjects", () => {
    it("returns only featured projects", () => {
      const featured = getFeaturedProjects();
      expect(featured.length).toBe(1);
      const first = featured[0];
      expect(first).toBeDefined();
      expect(first?.slug).toBe("test-project");
      expect(first?.featured).toBe(true);
    });
  });

  describe("getOtherProjects", () => {
    it("returns only non-featured projects", () => {
      const other = getOtherProjects();
      expect(other.length).toBe(1);
      const first = other[0];
      expect(first).toBeDefined();
      expect(first?.slug).toBe("another-project");
      expect(first?.featured).toBe(false);
    });
  });

  describe("getProjectBySlug", () => {
    it("returns a project when slug matches", () => {
      const project = getProjectBySlug("test-project");
      expect(project).toBeDefined();
      expect(project?.name).toBe("Test Project");
    });

    it("returns undefined for non-existent slug", () => {
      const project = getProjectBySlug("non-existent");
      expect(project).toBeUndefined();
    });
  });

  describe("getAllSearchableContent", () => {
    it("returns combined posts and projects as searchable content", () => {
      const content = getAllSearchableContent();
      expect(content.length).toBe(4); // 2 posts + 2 projects

      const postContent = content.filter((c) => c.type === "post");
      const projectContent = content.filter((c) => c.type === "project");

      expect(postContent.length).toBe(2);
      expect(projectContent.length).toBe(2);
    });

    it("formats post content correctly", () => {
      const content = getAllSearchableContent();
      const post = content.find((c) => c.id === "post-test-post");

      expect(post).toBeDefined();
      expect(post?.title).toBe("Test Post");
      expect(post?.url).toBe("/writing/test-post");
    });

    it("formats project content correctly", () => {
      const content = getAllSearchableContent();
      const project = content.find((c) => c.id === "project-test-project");

      expect(project).toBeDefined();
      expect(project?.title).toBe("Test Project");
      expect(project?.content).toContain("TypeScript");
    });
  });
});
