import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import {
  generateMeta,
  generateLinks,
  SITE_URL,
  getProfilePageSchema,
  getBreadcrumbSchema,
  serializeJsonLd,
} from "~/lib/seo";
import {
  workHistory,
  summaryParagraphs,
  type Position,
} from "~/data/work-history";

const WORK_DESCRIPTION =
  "Engineering executive with 20 years of experience building and scaling high-performing teams through IPO and beyond.";

export const Route = createFileRoute("/work")({
  component: WorkPage,
  head: () => ({
    meta: generateMeta({
      title: "Work Experience",
      description: WORK_DESCRIPTION,
      path: "/work",
      ogImage: `${SITE_URL}/og/work.png`,
      keywords: [
        "Ryan Yogan",
        "work experience",
        "engineering leader",
        "resume",
        "Procore",
        "CTO",
        "engineering manager",
        "IPO",
      ],
    }),
    links: generateLinks("/work"),
    scripts: [
      {
        type: "application/ld+json",
        children: serializeJsonLd([
          getProfilePageSchema(),
          getBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Work", url: "/work" },
          ]),
        ]),
      },
    ],
  }),
});

function WorkPage() {
  return (
    <PageLayout>
      <div className="work-header">
        <h1 className="page-title">Work</h1>
      </div>

      <section className="summary-section section">
        {summaryParagraphs.map((paragraph, index) => (
          <p key={index} className="work-summary">
            {paragraph}
          </p>
        ))}
      </section>

      <section className="leadership-section section">
        <h2 className="section-title">Leadership</h2>
        <div className="skills-list">
          <p>
            <strong>Organizational Growth:</strong> Scaled teams from 8 to 65+ engineers - Managed
            engineering managers - IPO preparation - $2M+ budget ownership
          </p>
          <p>
            <strong>People Development:</strong> Career ladder design - Created Technical Lead
            Manager role - Promoted ICs to Principal Architect - Founded Developer Academy
          </p>
          <p>
            <strong>Hiring:</strong> 700+ interviews - 50+ hires - Hiring process design - Employer
            branding
          </p>
          <p>
            <strong>Strategic:</strong> OKR/KPI design - Roadmap planning - Executive communication
            - Investor presentations - Vendor management
          </p>
          <p>
            <strong>Operations:</strong> Incident management - SRE partnership - On-call processes -
            Observability (RUM/APM dashboards)
          </p>
          <p>
            <strong>Culture:</strong> Psychological safety - Empathy Driven Development -
            Knowledge-first culture - Team restructuring
          </p>
        </div>
      </section>

      <section className="skills-section section">
        <h2 className="section-title">Technical</h2>
        <div className="skills-list">
          <p>
            <strong>Languages:</strong> TypeScript, JavaScript, Elixir, GoLang, Rust, C++, Ruby,
            Python
          </p>
          <p>
            <strong>Frontend:</strong> React, Mobile (React Native/iOS/Android), CSS, Figma, Design
            Systems, Three.js, A11y, Edge Performance
          </p>
          <p>
            <strong>Backend:</strong> Node.js, Phoenix, Rails, Event-Driven Architecture, CQRS
          </p>
          <p>
            <strong>Infrastructure:</strong> Cloud Ops, AWS/GCP/Azure, Cloudflare, Kubernetes,
            Docker, CI/CD
          </p>
          <p>
            <strong>AI/ML:</strong> LLM Integration & Fine-tuning, Vector Databases, Computer
            Vision, Agentic Development (MCP, Custom Agents)
          </p>
        </div>
      </section>

      <h2 className="section-title">Experience</h2>

      <div className="work-list">
        {workHistory.map((experience) => (
          <div key={experience.company} className="work-item">
            <div className="work-company">
              <h3 className="work-company-name">{experience.company}</h3>
              {experience.positions.length > 1 && (
                <span className="work-company-tenure">
                  {calculateTotalTenure(experience.positions)}
                </span>
              )}
            </div>
            <div className="work-positions">
              {experience.positions.map((position, index) => (
                <div
                  key={`${position.title}-${index}`}
                  className={`work-position ${experience.positions.length > 1 ? "work-position-multi" : ""}`}
                >
                  <div className="work-position-header">
                    <h4 className="work-position-title">{position.title}</h4>
                    {position.type && <span className="work-position-type">{position.type}</span>}
                  </div>
                  <div className="work-position-meta">
                    <span className="work-period">{position.period}</span>
                    {position.location && (
                      <span className="work-location">{position.location}</span>
                    )}
                  </div>
                  {position.description && (
                    <p className="work-description">{position.description}</p>
                  )}
                  {position.highlights && position.highlights.length > 0 && (
                    <ul className="work-highlights">
                      {position.highlights.map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                  {position.skills && position.skills.length > 0 && (
                    <div className="work-skills">
                      {position.skills.map((skill) => (
                        <span key={skill} className="work-skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

function calculateTotalTenure(positions: Position[]): string {
  const periods = positions.map((p) => p.period);
  const firstStart = periods[periods.length - 1]?.split(" - ")[0] ?? "";
  const lastEnd = periods[0]?.split(" - ")[1] ?? "";
  return `${firstStart} - ${lastEnd}`;
}
