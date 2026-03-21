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

function HirePage() {
  return (
    <PageLayout>
      {/* Hero */}
      <header className="hire-header">
        <h1 className="hire-title">Let's build something together</h1>
        <p className="hire-lead">
          I'm available for consulting, contract work, and full-time roles.
          With 20 years of experience shipping code and leading teams, I can help you build what's next.
        </p>
      </header>

      {/* Primary CTA */}
      <section className="hire-contact-primary">
        <a
          href={CONTACT.calendar}
          target="_blank"
          rel="noopener noreferrer"
          className="hire-btn-primary"
        >
          Book a call
        </a>
        <span className="hire-contact-or">or</span>
        <a href={`mailto:${CONTACT.email}`} className="hire-email-link">
          {CONTACT.email}
        </a>
      </section>

      {/* What I Do */}
      <section className="hire-section">
        <h2 className="hire-section-title">What I do</h2>
        <div className="hire-services">
          <div className="hire-service">
            <h3>Enterprise Cloudflare</h3>
            <p>Workers, D1, R2, Durable Objects. Edge-first architecture at global scale.</p>
          </div>
          <div className="hire-service">
            <h3>AI & LLMs</h3>
            <p>Fine-tuning, RAG systems, vector databases, agentic AI development.</p>
          </div>
          <div className="hire-service">
            <h3>MCP Development</h3>
            <p>Model Context Protocol servers. Custom AI tooling for Claude, GPT, and beyond.</p>
          </div>
          <div className="hire-service">
            <h3>Full-Stack</h3>
            <p>React, TypeScript, Elixir/Phoenix, Node.js. Database to pixels.</p>
          </div>
          <div className="hire-service">
            <h3>Engineering Leadership</h3>
            <p>Scaled teams through IPO. Hiring, culture, career development.</p>
          </div>
          <div className="hire-service">
            <h3>Embedded Systems</h3>
            <p>Rust, C++, robotics, IoT. Software that controls hardware.</p>
          </div>
        </div>
      </section>

      {/* Experience Highlights */}
      <section className="hire-section">
        <h2 className="hire-section-title">Experience</h2>
        <ul className="hire-highlights">
          <li><strong>20 years</strong> shipping production code</li>
          <li><strong>IPO experience</strong> at Procore (scaled team 8 to 65 engineers)</li>
          <li><strong>700+ interviews</strong> conducted, 50+ engineers hired</li>
          <li><strong>CTO to IC</strong> - I can lead or write the code myself</li>
          <li><strong>Active builder</strong> - 6 public projects, open source contributor</li>
        </ul>
        <Link to="/work" className="hire-link">
          View full work history
        </Link>
      </section>

      {/* Recent Work */}
      <section className="hire-section">
        <h2 className="hire-section-title">Recent projects</h2>
        <div className="hire-projects">
          <Link to="/projects/$slug" params={{ slug: "nexus-mcp" }} className="hire-project">
            <strong>Nexus MCP</strong>
            <span>AI documentation hub and memory system</span>
          </Link>
          <Link to="/projects/$slug" params={{ slug: "level-up" }} className="hire-project">
            <strong>Level Up</strong>
            <span>AI-powered job application assistant</span>
          </Link>
          <Link to="/projects/$slug" params={{ slug: "fizzy-do-mcp" }} className="hire-project">
            <strong>Fizzy Do MCP</strong>
            <span>AI-native task management via MCP</span>
          </Link>
        </div>
        <Link to="/projects" className="hire-link">
          View all projects
        </Link>
      </section>

      {/* Connect */}
      <section className="hire-section hire-section-connect">
        <h2 className="hire-section-title">Get in touch</h2>
        <div className="hire-connect-grid">
          <a
            href={CONTACT.calendar}
            target="_blank"
            rel="noopener noreferrer"
            className="hire-connect-item"
          >
            <span className="hire-connect-label">Book a call</span>
            <span className="hire-connect-value">cal.com/ryanyogan</span>
          </a>
          <a href={`mailto:${CONTACT.email}`} className="hire-connect-item">
            <span className="hire-connect-label">Email</span>
            <span className="hire-connect-value">{CONTACT.email}</span>
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hire-connect-item"
          >
            <span className="hire-connect-label">LinkedIn</span>
            <span className="hire-connect-value">in/ryanyogan</span>
          </a>
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hire-connect-item"
          >
            <span className="hire-connect-label">GitHub</span>
            <span className="hire-connect-value">ryanyogan</span>
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
