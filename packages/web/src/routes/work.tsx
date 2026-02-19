import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import { DocumentIcon } from "~/components/ui/icons";

export const Route = createFileRoute("/work")({
  component: WorkPage,
  head: () => ({
    meta: [
      { title: "Work - Ryan Yogan" },
      { property: "og:title", content: "Work - Ryan Yogan" },
      {
        name: "description",
        content:
          "Engineering executive with 20 years of experience building and scaling high-performing teams through IPO and beyond.",
      },
    ],
  }),
});

type Position = {
  title: string;
  type?: string;
  period: string;
  location?: string;
  description?: string;
  highlights?: string[];
  skills?: string[];
};

type WorkExperience = {
  company: string;
  positions: Position[];
};

const workHistory: WorkExperience[] = [
  {
    company: "Avant",
    positions: [
      {
        title: "Principal Architect & Engineering Lead",
        type: "Full-time",
        period: "Jun 2025 - Jan 2026",
        location: "Chicago, Illinois",
        description:
          "Led front-end architecture transformation at this fintech company, mentoring engineers daily while driving technical excellence across the organization.",
        highlights: [
          "Re-architected front-end strategy across the organization with 200k+ line refactors",
          "Built internal AI-powered UI generation tools (similar to v0.dev/bolt.new)",
          "Led architecture review board and technical design reviews for major initiatives",
          "Established engineering standards and best practices documentation adopted org-wide",
          "Created testing tutorials, React guides, and performance guidelines",
          "Drove accessibility (A11y) compliance initiatives across the platform",
          "Partnered with Product and Design leadership on quarterly roadmap planning",
          "Built animations and interactive experiences using Three.js and modern CSS techniques",
          "Initiated automated design system generating components from Figma designs",
          "Mentored engineers daily on JavaScript fundamentals, event-driven systems, React, and Next.js",
        ],
        skills: [
          "Technical Leadership",
          "Architecture",
          "A11y",
          "Design Systems",
          "Three.js",
          "Mentorship",
        ],
      },
    ],
  },
  {
    company: "Stealth AI Startup",
    positions: [
      {
        title: "Co-Founder & CTO",
        type: "Full-time",
        period: "Jan 2024 - Jun 2025",
        location: "New York",
        description:
          "Co-founded and led engineering for an AI-powered procurement automation platform for the construction industry. Built the engineering organization from the ground up.",
        highlights: [
          "Built and led engineering team of 8, establishing hiring plans and organizational structure",
          "Managed engineering budget and headcount planning aligned to runway",
          "Created VC pitch decks, analyzed runway, and presented technical strategy to investors",
          "Architected full platform: e-commerce backend (TypeScript), front-end (Next.js), internal services (Elixir)",
          "Developed internal LLM models and custom vector stores for procurement automation",
          "Built agentic AI systems for document parsing and supplier matching",
          "Established vendor relationships and technology partnerships",
          "Defined SLAs, incident response processes, and on-call rotations",
          "Built engineering onboarding program for new hires",
          "Ran weekly 1:1s, performance reviews, and compensation planning",
          "Owned technical strategy, roadmap, and alignment with business objectives",
        ],
        skills: [
          "Executive Leadership",
          "Investor Relations",
          "Team Building",
          "LLM/AI",
          "Vector Databases",
          "Agentic AI",
        ],
      },
    ],
  },
  {
    company: "HG Insights",
    positions: [
      {
        title: "Senior Engineering Manager",
        type: "Full-time",
        period: "Aug 2021 - Sep 2022",
        location: "Santa Barbara, California",
        description:
          "Led the data pipeline team through a major architectural transformation while rebuilding team culture and establishing career development frameworks.",
        highlights: [
          "Managed team of 7 engineers across UI and backend services",
          "Managed engineering budget for the data pipeline team",
          "Inherited a team without prior management. Built career ladders and development plans for each individual",
          "Established OKRs that translated to individual KPIs for career trajectory alignment",
          "Partnered with Product leadership on quarterly planning and roadmap prioritization",
          "Migrated Scala/Airflow batch system to streaming architecture, eliminating 24+ hours of manual intervention",
          "Collaborated with SRE on incident management, on-call documentation, and runbooks",
          "Created psychological safety for engineers to discuss careers and prevent burnout",
          "Restructured one large team into smaller, more effective units",
          "Participated in executive leadership meetings representing engineering perspectives",
          "Created onboarding documentation and engineering processes for new team members",
          "Secured raises and promotions, transforming team from 'revolving door' to stable, engaged unit",
        ],
        skills: [
          "People Development",
          "Team Restructuring",
          "OKR Design",
          "Data Pipelines",
          "SRE Partnership",
        ],
      },
    ],
  },
  {
    company: "Procore Technologies",
    positions: [
      {
        title: "Senior Engineering Manager",
        type: "Full-time",
        period: "Oct 2016 - Jul 2021",
        location: "Carpinteria, California",
        description:
          "Led engineering through hypergrowth and successful IPO. Scaled the UI organization from 8 to 65 engineers while building the frameworks, culture, and people development systems that enabled sustainable growth.",
        highlights: [
          "Managed 8-14 direct reports including engineering managers (skip-level leadership)",
          "Managed $2M+ annual engineering budget with headcount planning and resource allocation",
          "Scaled UI engineering org from 8 to 65 engineers across 5-8 teams",
          "Partnered with CFO/Finance on IPO engineering metrics and investor reporting",
          "Established engineering OKRs aligned to company objectives, cascading to team and individual KPIs",
          "Interviewed 700+ candidates and personally hired 50+ engineers",
          "Created the Technical Lead Manager role, defining a new career path at Procore",
          "Major driver of the Procore Developer Academy, which grew into its own building and created a knowledge-first culture",
          "Led vendor evaluations and contract negotiations for UI tooling and enterprise software",
          "Participated in board-level technical discussions during IPO preparation",
          "Coined 'Empathy Driven Development', reducing enterprise feedback loops from weeks to hours",
          "Built internal tooling enabling real-time customer support with auditable, verified data access",
          "Created incident management processes in partnership with SRE leadership",
          "Implemented RUM and APM dashboards (Datadog, New Relic) providing org-wide visibility into application health",
          "Established SLAs for enterprise customers and on-call rotation processes",
          "Led org-wide performance initiative reducing page load times from 11s to 2s",
          "Contributed to web-based CAD/BIM drawing tool with complex 2D/3D in-browser rendering",
          "Saved largest enterprise client through on-site engagement and evangelized learnings company-wide",
          "Built relationships with key enterprise stakeholders globally",
          "Developed career ladders aligned to business goals, team goals, and individual aspirations",
          "Promoted engineers from junior IC to Principal Architect",
        ],
        skills: [
          "Organizational Scaling",
          "IPO Preparation",
          "Budget Management",
          "People Development",
          "Observability",
          "Enterprise Engagement",
        ],
      },
    ],
  },
  {
    company: "Montway Auto Transport",
    positions: [
      {
        title: "Director of Engineering",
        period: "Nov 2015 - May 2016",
        location: "Chicago, Illinois",
        description:
          "Led digital transformation of auto transport logistics, managing 11 engineers to modernize an industry reliant on manual processes.",
        highlights: [
          "Managed team of 11 engineers focused on disrupting transportation industry with technology",
          "Managed department budget and resource allocation for engineering initiatives",
          "Established engineering roadmap aligned to business objectives and revenue targets",
          "Partnered with Operations and Sales leadership on technology initiatives",
          "Led vendor selection for mobile development tools and logistics platforms",
          "Built mobile applications replacing manual Bills of Lading (BOLs)",
          "Implemented driver and shipment tracking with computer vision for 360-degree vehicle imaging",
          "Created first-of-its-kind smart pricing system accurate within dollars (vs. industry norm of bait-and-switch)",
        ],
        skills: [
          "Digital Transformation",
          "Budget Management",
          "Mobile Development",
          "Computer Vision",
          "Vendor Management",
        ],
      },
    ],
  },
  {
    company: "Sonian",
    positions: [
      {
        title: "VP of Research and Development",
        period: "Apr 2014 - Nov 2015",
        location: "Boston, Massachusetts",
        description:
          "Promoted from Operations Engineer to VP in 4 months based on proactive leadership and technical innovation. Led dual-track research and product teams.",
        highlights: [
          "Led team of 4 engineers owning Clojure backend and insights dashboards",
          "Managed R&D budget and resource allocation for research initiatives",
          "Presented research findings and technical strategy to executive team",
          "Established technology evaluation frameworks for emerging cloud technologies",
          "Built direct partnership with AWS as Lambda early access program participant",
          "Pioneered early AWS Lambda adoption, reducing infrastructure costs by 40%+",
          "Led dual-track: delivered production products while driving cloud infrastructure research",
          "Modernized stack from Angular 1.x to ClojureScript/React (Om), one of first orgs to adopt",
          "Implemented immutable infrastructure with Ansible (later Terraform)",
        ],
        skills: [
          "R&D Leadership",
          "Budget Management",
          "AWS Partnership",
          "Clojure",
          "Cost Optimization",
        ],
      },
      {
        title: "Operations Engineer",
        period: "Dec 2013 - Apr 2014",
        location: "Boston, Massachusetts",
        description:
          "Drove continuous improvement through timeboxed research spikes with defined outcomes, leading to rapid promotion to VP.",
      },
    ],
  },
  {
    company: "Yogan Dot Dev",
    positions: [
      {
        title: "Founder & Principal Consultant",
        type: "Consulting",
        period: "Oct 2019 - Present",
        location: "Austin, Texas · Remote",
        description:
          "Independent consulting practice working with enterprise clients on complex technical challenges: Elixir/Erlang systems, advanced React patterns, legacy code modernization, and performance optimization.",
        skills: ["Elixir", "React", "Legacy Modernization", "Performance"],
      },
    ],
  },
  {
    company: "PEAK6 Investments",
    positions: [
      {
        title: "Sr. Software Engineer",
        period: "Nov 2009 - Sep 2011",
        location: "Chicago, Illinois",
        description:
          "Built reactive interfaces for high-frequency trading platforms where milliseconds matter. Introduced Backbone.js (later Ember.js) to the organization.",
        skills: [
          "Ruby on Rails",
          "JavaScript",
          "C++",
          "High-Frequency Trading",
        ],
      },
    ],
  },
  {
    company: "BradsDeals.com",
    positions: [
      {
        title: "Sr. Software Engineer",
        period: "Feb 2012 - Mar 2013",
        location: "Chicago, Illinois",
        description:
          "Led migration from Cold Fusion to Ruby on Rails. Built Black Friday game experiences and prepared systems for traffic surges at scale.",
        skills: ["Ruby on Rails", "JavaScript", "Legacy Migration", "Scale"],
      },
    ],
  },
  {
    company: "Broward Center for the Performing Arts",
    positions: [
      {
        title: "Sr. Systems Analyst",
        period: "May 2006 - Oct 2009",
        location: "Fort Lauderdale, Florida",
        description:
          "Managed infrastructure for South Florida's premier performing arts venue: 200+ machines, data centers, networks, and VoIP. First box office to implement thin clients. Kept the lights on for Broadway productions including Lion King, Wicked, and Phantom of the Opera.",
        skills: ["Infrastructure", "Data Centers", "Networking", "Operations"],
      },
    ],
  },
];

const summaryParagraphs = [
  `Engineering executive with 20 years of experience building and scaling high-performing teams. Led organizations through hypergrowth and IPO at Procore, scaling the UI engineering org from 8 to 65 engineers while managing $2M+ budgets and partnering with Finance on investor reporting.`,
  `Managed engineering managers and established career frameworks that developed junior engineers into Principal Architects. Drove the Procore Developer Academy  initiative and coined "Empathy Driven Development", a customer-centric approach that reduced enterprise feedback loops from weeks to hours and directly contributed to retaining the company's largest client.`,
  `Most recently served as Co-Founder & CTO of an AI startup, building the engineering organization from the ground up while presenting to investors and managing runway. I hire well (700+ interviews, 50+ hires), develop people intentionally, and believe the best engineering cultures are built on trust, psychological safety, and continuous learning.`,
];

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
            <strong>Organizational Growth:</strong> Scaled teams from 8 to 65+
            engineers · Managed engineering managers · IPO preparation · $2M+
            budget ownership
          </p>
          <p>
            <strong>People Development:</strong> Career ladder design · Created
            Technical Lead Manager role · Promoted ICs to Principal Architect ·
            Founded Developer Academy
          </p>
          <p>
            <strong>Hiring:</strong> 700+ interviews · 50+ hires · Hiring
            process design · Employer branding
          </p>
          <p>
            <strong>Strategic:</strong> OKR/KPI design · Roadmap planning ·
            Executive communication · Investor presentations · Vendor management
          </p>
          <p>
            <strong>Operations:</strong> Incident management · SRE partnership ·
            On-call processes · Observability (RUM/APM dashboards)
          </p>
          <p>
            <strong>Culture:</strong> Psychological safety · Empathy Driven
            Development · Knowledge-first culture · Team restructuring
          </p>
        </div>
      </section>

      <section className="skills-section section">
        <h2 className="section-title">Technical</h2>
        <div className="skills-list">
          <p>
            <strong>Languages:</strong> TypeScript, JavaScript, Elixir, GoLang,
            Rust, C++, Ruby, Python
          </p>
          <p>
            <strong>Frontend:</strong> React, Mobile (React Native/iOS/Android),
            CSS, Figma, Design Systems, Three.js, A11y, Edge Performance
          </p>
          <p>
            <strong>Backend:</strong> Node.js, Phoenix, Rails, Event-Driven
            Architecture, CQRS
          </p>
          <p>
            <strong>Infrastructure:</strong> Cloud Ops, AWS/GCP/Azure,
            Cloudflare, Kubernetes, Docker, CI/CD
          </p>
          <p>
            <strong>AI/ML:</strong> LLM Integration & Fine-tuning, Vector
            Databases, Computer Vision, Agentic Development (MCP, Custom Agents)
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
                    {position.type && (
                      <span className="work-position-type">
                        {position.type}
                      </span>
                    )}
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
