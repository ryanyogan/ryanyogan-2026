/**
 * SEO utilities and structured data helpers for the website.
 *
 * This module provides:
 * - Constants for site metadata
 * - Helper functions to generate meta tags
 * - JSON-LD structured data generators
 */

// =============================================================================
// Site Constants
// =============================================================================

export const SITE_URL = "https://ryanyogan.com";
export const SITE_NAME = "Ryan Yogan";
export const SITE_DESCRIPTION =
  "Engineering leader with 20 years of experience building teams and products. Based in Chicago.";
export const TWITTER_HANDLE = "@ryanyogan";
export const AUTHOR_NAME = "Ryan Yogan";

// =============================================================================
// Meta Tag Helpers
// =============================================================================

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
}

/**
 * Generate complete meta tags array for a page
 */
export function generateMeta(page: PageMeta) {
  const fullTitle =
    page.title === SITE_NAME ? SITE_NAME : `${page.title} - ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${page.path}`;
  const ogImage = page.ogImage || `${SITE_URL}/og/default.png`;
  const type = page.type || "website";

  const meta = [
    // Basic
    { title: fullTitle },
    { name: "description", content: page.description },

    // Open Graph
    { property: "og:title", content: page.title },
    { property: "og:description", content: page.description },
    { property: "og:url", content: canonicalUrl },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:type", content: type },
    { property: "og:image", content: ogImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: page.title },
    { property: "og:locale", content: "en_US" },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: TWITTER_HANDLE },
    { name: "twitter:creator", content: TWITTER_HANDLE },
    { name: "twitter:title", content: page.title },
    { name: "twitter:description", content: page.description },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:image:alt", content: page.title },
  ];

  // Article-specific meta tags
  if (type === "article") {
    if (page.publishedTime) {
      meta.push({ property: "article:published_time", content: page.publishedTime });
    }
    if (page.modifiedTime) {
      meta.push({ property: "article:modified_time", content: page.modifiedTime });
    }
    if (page.author) {
      meta.push({ property: "article:author", content: page.author });
    }
  }

  // Keywords
  if (page.keywords && page.keywords.length > 0) {
    meta.push({ name: "keywords", content: page.keywords.join(", ") });
  }

  return meta;
}

/**
 * Generate link tags for a page (canonical, etc.)
 */
export function generateLinks(path: string) {
  const canonicalUrl = `${SITE_URL}${path}`;

  return [{ rel: "canonical", href: canonicalUrl }];
}

// =============================================================================
// JSON-LD Structured Data
// =============================================================================

/**
 * Person schema for the site owner
 */
export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/android-chrome-512x512.png`,
    sameAs: [
      "https://twitter.com/ryanyogan",
      "https://github.com/ryanyogan",
      "https://linkedin.com/in/ryanyogan",
    ],
    jobTitle: "Engineering Leader",
    worksFor: {
      "@type": "Organization",
      name: "Independent",
    },
    description: SITE_DESCRIPTION,
    knowsAbout: [
      "Software Engineering",
      "Engineering Leadership",
      "React",
      "TypeScript",
      "Elixir",
      "Phoenix",
      "AI/ML",
      "Team Building",
    ],
  };
}

/**
 * Website schema
 */
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Blog schema for the writing section
 */
export function getBlogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE_NAME} - Writing`,
    url: `${SITE_URL}/writing`,
    description: "Thoughts on engineering, leadership, and building things.",
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
  };
}

/**
 * BlogPosting schema for individual blog posts
 */
export function getBlogPostSchema(post: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author?: "human" | "ai" | "hybrid";
}) {
  const authorName =
    post.author === "ai"
      ? "AI Assistant"
      : post.author === "hybrid"
        ? `${AUTHOR_NAME} & AI`
        : AUTHOR_NAME;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}/writing/${post.slug}`,
    image: `${SITE_URL}/og/writing/${post.slug}.png`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: authorName,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/android-chrome-512x512.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/writing/${post.slug}`,
    },
  };
}

/**
 * ProfilePage schema for the work/resume page
 */
export function getProfilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
      image: `${SITE_URL}/android-chrome-512x512.png`,
      description: SITE_DESCRIPTION,
      sameAs: [
        "https://twitter.com/ryanyogan",
        "https://github.com/ryanyogan",
        "https://linkedin.com/in/ryanyogan",
      ],
      hasOccupation: [
        {
          "@type": "Occupation",
          name: "Principal Architect & Engineering Lead",
          occupationalCategory: "15-1252.00",
          description:
            "Led front-end architecture transformation at fintech company",
          occupationLocation: {
            "@type": "City",
            name: "Chicago, Illinois",
          },
        },
        {
          "@type": "Occupation",
          name: "Co-Founder & CTO",
          occupationalCategory: "11-3021.00",
          description:
            "Co-founded and led engineering for an AI-powered procurement automation platform",
          occupationLocation: {
            "@type": "City",
            name: "New York",
          },
        },
      ],
      alumniOf: [
        {
          "@type": "Organization",
          name: "Procore Technologies",
          url: "https://procore.com",
        },
        {
          "@type": "Organization",
          name: "Peak6 Investments",
          url: "https://peak6.com",
        },
      ],
      knowsAbout: [
        "TypeScript",
        "JavaScript",
        "Elixir",
        "GoLang",
        "Rust",
        "React",
        "Phoenix LiveView",
        "AI/ML",
        "Engineering Leadership",
        "Team Building",
      ],
    },
  };
}

/**
 * CollectionPage schema for the projects page
 */
export function getProjectsPageSchema(
  projects: Array<{ name: string; description: string; url?: string; github?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects - Ryan Yogan",
    url: `${SITE_URL}/projects`,
    description: "Open source projects and things I've built.",
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareSourceCode",
          name: project.name,
          description: project.description,
          url: project.url || project.github || `${SITE_URL}/projects`,
          codeRepository: project.github,
          author: {
            "@type": "Person",
            name: AUTHOR_NAME,
          },
        },
      })),
    },
  };
}

/**
 * BreadcrumbList schema helper
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * SoftwareSourceCode schema for individual project pages
 */
export function getProjectSchema(project: {
  name: string;
  tagline: string;
  description: string;
  slug: string;
  tech: string[];
  url?: string;
  github?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.name,
    description: project.description,
    url: `${SITE_URL}/projects/${project.slug}`,
    codeRepository: project.github,
    programmingLanguage: project.tech,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
  };
}

/**
 * Serialize JSON-LD to a script tag string for injection into head
 */
export function serializeJsonLd(schema: object | object[]): string {
  const data = Array.isArray(schema) ? schema : [schema];
  return JSON.stringify(data.length === 1 ? data[0] : data);
}
