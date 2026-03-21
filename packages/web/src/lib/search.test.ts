import { describe, it, expect } from "vitest";
import { searchWithTextMatching, type SearchResult } from "./search";
import type { SearchableContent } from "./content";

const mockContent: SearchableContent[] = [
  {
    id: "post-typescript-tips",
    type: "post",
    title: "TypeScript Tips and Tricks",
    description: "Advanced TypeScript patterns for better code",
    content: "Learn about generics, conditional types, and more",
    url: "/writing/typescript-tips",
  },
  {
    id: "post-react-hooks",
    type: "post",
    title: "React Hooks Deep Dive",
    description: "Understanding React hooks from the ground up",
    content: "useEffect, useState, useCallback explained",
    url: "/writing/react-hooks",
  },
  {
    id: "project-my-app",
    type: "project",
    title: "My Awesome App",
    description: "A TypeScript React application with modern tooling",
    content: "Built with TypeScript, React, and Vite",
    url: "https://github.com/test/my-app",
  },
  {
    id: "project-rust-cli",
    type: "project",
    title: "Rust CLI Tool",
    description: "A command line tool written in Rust",
    content: "Fast and efficient CLI for developers",
    url: "https://github.com/test/rust-cli",
  },
];

describe("searchWithTextMatching", () => {
  it("returns empty array for empty query", () => {
    const results = searchWithTextMatching("", mockContent);
    expect(results).toEqual([]);
  });

  it("returns empty array when no matches found", () => {
    const results = searchWithTextMatching("nonexistent xyz", mockContent);
    expect(results).toEqual([]);
  });

  it("finds exact title matches with highest score", () => {
    const results = searchWithTextMatching("TypeScript Tips", mockContent);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.id).toBe("post-typescript-tips");
  });

  it("matches partial title", () => {
    const results = searchWithTextMatching("React", mockContent);
    expect(results.length).toBeGreaterThan(0);
    // React Hooks should be in results
    const reactResult = results.find((r) => r.id === "post-react-hooks");
    expect(reactResult).toBeDefined();
  });

  it("matches content in description", () => {
    const results = searchWithTextMatching("modern tooling", mockContent);
    expect(results.length).toBeGreaterThan(0);
    const projectResult = results.find((r) => r.id === "project-my-app");
    expect(projectResult).toBeDefined();
  });

  it("scores exact title match higher than description match", () => {
    // "TypeScript" appears in both post title and project description
    const results = searchWithTextMatching("TypeScript", mockContent);
    expect(results.length).toBeGreaterThanOrEqual(2);

    // First result should be the one with TypeScript in title
    const topResult = results[0];
    expect(topResult?.title).toContain("TypeScript");
  });

  it("handles multiple search terms", () => {
    const results = searchWithTextMatching("React hooks", mockContent);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.id).toBe("post-react-hooks");
  });

  it("is case insensitive", () => {
    const lowerResults = searchWithTextMatching("typescript", mockContent);
    const upperResults = searchWithTextMatching("TYPESCRIPT", mockContent);
    const mixedResults = searchWithTextMatching("TypeScript", mockContent);

    expect(lowerResults.length).toBe(upperResults.length);
    expect(lowerResults.length).toBe(mixedResults.length);
  });

  it("limits results to 10 items", () => {
    // Create content with many matches
    const manyItems: SearchableContent[] = Array.from({ length: 20 }, (_, i) => ({
      id: `item-${i}`,
      type: "post" as const,
      title: `Test Item ${i}`,
      description: "Test description",
      content: "Test content",
      url: `/test/${i}`,
    }));

    const results = searchWithTextMatching("Test", manyItems);
    expect(results.length).toBeLessThanOrEqual(10);
  });

  it("returns results sorted by score descending", () => {
    const results = searchWithTextMatching("TypeScript", mockContent);

    for (let i = 0; i < results.length - 1; i++) {
      const current = results[i];
      const next = results[i + 1];
      if (current && next) {
        expect(current.score).toBeGreaterThanOrEqual(next.score);
      }
    }
  });

  it("includes correct result properties", () => {
    const results = searchWithTextMatching("Rust", mockContent);
    expect(results.length).toBeGreaterThan(0);

    const result = results[0];
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("type");
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("description");
    expect(result).toHaveProperty("url");
    expect(result).toHaveProperty("score");
  });

  it("distinguishes between post and project types", () => {
    const results = searchWithTextMatching("TypeScript React", mockContent);

    const posts = results.filter((r) => r.type === "post");
    const projects = results.filter((r) => r.type === "project");

    // Should find both posts and projects
    expect(posts.length).toBeGreaterThan(0);
    expect(projects.length).toBeGreaterThan(0);
  });

  it("handles special regex characters in query", () => {
    // These characters should not break the regex
    const results = searchWithTextMatching("test [brackets]", mockContent);
    // Should not throw and return results (even if empty)
    expect(Array.isArray(results)).toBe(true);
  });
});
