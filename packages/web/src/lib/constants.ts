/**
 * Site-wide constants for consistent use across the application.
 * Centralizes social links, contact info, and site metadata.
 */

// =============================================================================
// Site Metadata
// =============================================================================

export const SITE = {
  name: "Ryan Yogan",
  url: "https://ryanyogan.com",
  description:
    "Engineering leader with 20 years of experience building teams and products. Based in Chicago.",
  author: "Ryan Yogan",
  twitterHandle: "@ryanyogan",
} as const;

// =============================================================================
// Contact Information
// =============================================================================

export const CONTACT = {
  email: "ryan.yogan@hey.com",
  calendar: "https://cal.com/ryanyogan",
  location: "Chicago, IL",
} as const;

// =============================================================================
// Social Links
// =============================================================================

export const SOCIAL_LINKS = {
  github: "https://github.com/ryanyogan",
  twitter: "https://twitter.com/ryanyogan",
  linkedin: "https://linkedin.com/in/ryanyogan",
  youtube: "https://www.youtube.com/@RyanYogan",
} as const;

// =============================================================================
// Navigation Links (used in footer, command palette, etc.)
// =============================================================================

export const NAV_LINKS = {
  internal: [
    { label: "Home", href: "/" },
    { label: "Writing", href: "/writing" },
    { label: "Projects", href: "/projects" },
    { label: "Work", href: "/work" },
    { label: "Tutorials", href: "/tutorials" },
    { label: "Hire", href: "/hire" },
  ],
  external: [
    { label: "GitHub", href: SOCIAL_LINKS.github },
    { label: "Twitter", href: SOCIAL_LINKS.twitter },
    { label: "LinkedIn", href: SOCIAL_LINKS.linkedin },
    { label: "YouTube", href: SOCIAL_LINKS.youtube },
  ],
} as const;

// =============================================================================
// Content Types
// =============================================================================

export const CONTENT_TYPES = {
  video: "video",
  text: "text",
  hybrid: "hybrid",
} as const;

export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];

// =============================================================================
// YouTube Configuration
// =============================================================================

export const YOUTUBE = {
  channelUrl: "https://www.youtube.com/@RyanYogan",
  embedBaseUrl: "https://www.youtube-nocookie.com/embed",
  apiBaseUrl: "https://www.googleapis.com/youtube/v3",
} as const;
