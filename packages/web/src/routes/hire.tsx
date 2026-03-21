import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import { CONTACT, SOCIAL_LINKS } from "~/lib/constants";
import {
  generateMeta,
  generateLinks,
  SITE_URL,
  getProfilePageSchema,
  getBreadcrumbSchema,
  serializeJsonLd,
} from "~/lib/seo";

const HIRE_DESCRIPTION =
  "Available for consulting, contract work, and full-time opportunities. Specializing in Cloudflare, AI/LLMs, MCP development, and engineering leadership.";

export const Route = createFileRoute("/hire")({
  component: HirePage,
  head: () => ({
    meta: generateMeta({
      title: "Hire Me",
      description: HIRE_DESCRIPTION,
      path: "/hire",
      ogImage: `${SITE_URL}/og/hire.png`,
      keywords: [
        "Ryan Yogan",
        "hire",
        "consulting",
        "Cloudflare",
        "AI",
        "LLM",
        "MCP",
        "engineering leader",
        "full-stack developer",
      ],
    }),
    links: generateLinks("/hire"),
    scripts: [
      {
        type: "application/ld+json",
        children: serializeJsonLd([
          getProfilePageSchema(),
          getBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Hire", url: "/hire" },
          ]),
        ]),
      },
    ],
  }),
});

const SPECIALTIES = [
  {
    title: "Enterprise Cloudflare",
    description:
      "Workers, D1, R2, Durable Objects, Pages. Edge-first architecture at global scale. This very site runs on it.",
    link: "/projects/ryanyogan-com",
    linkText: "See this site",
  },
  {
    title: "AI & LLMs",
    description:
      "Fine-tuning, RAG systems, vector databases, agentic AI. Building intelligent systems that actually ship.",
    link: "/projects/level-up",
    linkText: "See Level Up",
  },
  {
    title: "MCP Development",
    description:
      "Model Context Protocol servers for AI assistants. Custom tooling for Claude, GPT, and beyond.",
    link: "/projects/nexus-mcp",
    linkText: "See Nexus MCP",
  },
  {
    title: "Full-Stack Development",
    description:
      "React, TypeScript, Elixir/Phoenix, Node.js. From database schema to pixel-perfect UI.",
    link: "/projects/yogan_hockey",
    linkText: "See Yogan Hockey",
  },
  {
    title: "Engineering Leadership",
    description:
      "Scaled teams 8 to 65 through IPO. 700+ interviews, 50+ hires. OKRs, career ladders, culture.",
    link: "/work",
    linkText: "See work history",
  },
  {
    title: "Embedded & Hardware",
    description:
      "Rust, C++, robotics, IoT. Software that controls the physical world. Currently building AI hockey training.",
    link: "/projects/puck-pro",
    linkText: "See Puck Pro",
  },
];

const FEATURED_PROJECTS = [
  {
    slug: "nexus-mcp",
    name: "Nexus MCP",
    tagline: "AI documentation hub and memory system",
  },
  {
    slug: "level-up",
    name: "Level Up",
    tagline: "AI-powered job application assistant",
  },
  {
    slug: "fizzy-do-mcp",
    name: "Fizzy Do MCP",
    tagline: "AI-native task management via MCP",
  },
];

function HirePage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="hire-hero">
        <h1 className="hire-title">Let's build something together</h1>
        <p className="hire-subtitle">
          Available for consulting, contract work, and full-time opportunities.
          I bring 20 years of shipping code and building teams.
        </p>
        <div className="hire-cta-group">
          <a
            href={CONTACT.calendar}
            target="_blank"
            rel="noopener noreferrer"
            className="hire-cta hire-cta-primary"
          >
            <CalendarIcon />
            Book a call
          </a>
          <a href={`mailto:${CONTACT.email}`} className="hire-cta hire-cta-secondary">
            <EmailIcon />
            Email me
          </a>
        </div>
      </section>

      {/* What I Do */}
      <section className="section">
        <h2 className="section-header">What I do</h2>
        <div className="hire-specialties">
          {SPECIALTIES.map((specialty) => (
            <div key={specialty.title} className="specialty-card">
              <h3 className="specialty-title">{specialty.title}</h3>
              <p className="specialty-description">{specialty.description}</p>
              <Link to={specialty.link as "/"} className="specialty-link">
                {specialty.linkText} <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Work With Me */}
      <section className="section">
        <h2 className="section-header">Why work with me</h2>
        <div className="hire-reasons">
          <div className="reason-item">
            <span className="reason-highlight">20 years</span>
            <span className="reason-text">
              shipping production code at companies like Procore, HG Insights, PEAK6
            </span>
          </div>
          <div className="reason-item">
            <span className="reason-highlight">IPO experience</span>
            <span className="reason-text">
              scaled Procore's UI org from 8 to 65 engineers through successful public offering
            </span>
          </div>
          <div className="reason-item">
            <span className="reason-highlight">Startup to Enterprise</span>
            <span className="reason-text">
              CTO to IC - I can architect systems, lead teams, or write the code myself
            </span>
          </div>
          <div className="reason-item">
            <span className="reason-highlight">I ship</span>
            <span className="reason-text">
              this site, 6 active projects, open source contributions - I build things that work
            </span>
          </div>
          <div className="reason-item">
            <span className="reason-highlight">I teach</span>
            <span className="reason-text">
              built Procore's Developer Academy, created training programs, love mentoring
            </span>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section">
        <h2 className="section-header">Featured projects</h2>
        <div className="hire-projects">
          {FEATURED_PROJECTS.map((project) => (
            <Link
              key={project.slug}
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="hire-project-card"
            >
              <span className="hire-project-name">{project.name}</span>
              <span className="hire-project-tagline">{project.tagline}</span>
            </Link>
          ))}
        </div>
        <Link to="/projects" className="section-link">
          all projects
        </Link>
      </section>

      {/* Connect Section */}
      <section className="hire-connect">
        <h2 className="section-header">Let's connect</h2>

        <div className="hire-connect-cards">
          <a
            href={`mailto:${CONTACT.email}`}
            className="hire-connect-card hire-connect-email"
          >
            <EmailIcon />
            <div className="hire-connect-card-content">
              <span className="hire-connect-label">Email me</span>
              <span className="hire-connect-value">{CONTACT.email}</span>
            </div>
          </a>

          <a
            href={CONTACT.calendar}
            target="_blank"
            rel="noopener noreferrer"
            className="hire-connect-card hire-connect-calendar"
          >
            <CalendarIcon />
            <div className="hire-connect-card-content">
              <span className="hire-connect-label">Book a call</span>
              <span className="hire-connect-value">30 minutes on Cal.com</span>
            </div>
          </a>
        </div>

        <div className="hire-social-links">
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hire-social-link"
          >
            <GitHubIcon />
            GitHub
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hire-social-link"
          >
            <LinkedInIcon />
            LinkedIn
          </a>
          <a
            href={SOCIAL_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="hire-social-link"
          >
            <TwitterIcon />
            Twitter
          </a>
          <a
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="hire-social-link"
          >
            <YouTubeIcon />
            YouTube
          </a>
        </div>

        <Link to="/work" className="hire-resume-link">
          View my full work history <span aria-hidden="true">→</span>
        </Link>
      </section>
    </PageLayout>
  );
}

// Icons
function EmailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
