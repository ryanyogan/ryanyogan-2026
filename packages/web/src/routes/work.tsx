import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";

export const Route = createFileRoute("/work")({
  component: WorkPage,
  head: () => ({
    meta: [
      { title: "Work - Ryan Yogan" },
      { property: "og:title", content: "Work - Ryan Yogan" },
      {
        name: "description",
        content:
          "20 years of engineering experience at Procore, Peak6, and various startups.",
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
        title: "Principal Engineer",
        type: "Full-time",
        period: "Jun 2025 - Jan 2026",
        location: "Chicago, Illinois · Hybrid",
      },
    ],
  },
  {
    company: "Yogan Dot Dev",
    positions: [
      {
        title: "Founder & Lead Engineer",
        type: "Full-time",
        period: "Oct 2019 - Jan 2026",
        location: "Austin, Texas · Remote",
        description:
          "I work with a wide range of clients—from small independent businesses to large enterprise organizations—designing and building systems that scale. My work spans the entire stack: from elegant, performant user interfaces on the web to backend services, infrastructure, and even low-level and embedded systems.\n\nMy core passion is crafting thoughtful UI/UX experiences. I specialize in TypeScript and React, with deep experience in Next.js, Remix, and TanStack. I've built aviation software for flight planning, procedures, and checklists; SaaS platforms using modern web frameworks; and backend systems in GoLang and Zig.",
        skills: ["TypeScript", "React", "Next.js", "GoLang", "Elixir", "Rust", "Systems Design"],
      },
    ],
  },
  {
    company: "Stealth AI Startup",
    positions: [
      {
        title: "Engineering Team Lead",
        type: "Full-time",
        period: "Jan 2024 - Jun 2025",
        location: "New York · Hybrid",
        description:
          "Led end-to-end architecture: Built e-commerce backend (TypeScript), front-end (Next.js), and internal services in Elixir and TypeScript. Developed internal LLM models for procurement automation and document parsing. Owned core infrastructure: CI/CD, database design, cloud deployment, and developer tooling. Drove engineering strategy and collaborated with founders to align product vision with technical execution.",
        skills: ["TypeScript", "Next.js", "Elixir", "LLM", "Infrastructure", "Team Leadership"],
      },
    ],
  },
  {
    company: "HG Insights",
    positions: [
      {
        title: "Senior Software Engineering Manager",
        type: "Full-time",
        period: "Aug 2021 - Sep 2022",
        location: "Santa Barbara, California",
        skills: ["Web Applications", "Scala", "Team Leadership"],
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
          "Led platform engineering for cloud-based construction management software serving thousands of enterprise customers. Built and scaled engineering teams. Contributed to successful IPO preparation. Procore earned a spot on the Deloitte Technology Fast 500 list during my tenure.",
        skills: ["Ruby on Rails", "Web Applications", "Team Leadership", "Platform Engineering"],
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
        skills: ["Leadership", "Engineering Management"],
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
        skills: ["Leadership", "R&D"],
      },
      {
        title: "Operations Engineer",
        period: "Dec 2013 - May 2014",
        location: "Boston, Massachusetts",
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
          "Full-Stack engineer with a focus on middleware layers (Rails, Django, Struts) and JavaScript frameworks. Worked on reactive interfaces for high-frequency trading platforms where milliseconds matter.",
        skills: ["Rails", "JavaScript", "High-Frequency Trading", "Middleware"],
      },
    ],
  },
  {
    company: "linkedFA",
    positions: [
      {
        title: "Software Engineer",
        period: "2008 - 2010",
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
      },
    ],
  },
];

function WorkPage() {
  return (
    <PageLayout>
      <h1 className="page-title">Work</h1>

      <div className="work-list">
        {workHistory.map((experience) => (
          <div key={experience.company} className="work-item">
            <div className="work-company">
              <h2 className="work-company-name">{experience.company}</h2>
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
                    <h3 className="work-position-title">{position.title}</h3>
                    {position.type && (
                      <span className="work-position-type">{position.type}</span>
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

      <section className="skills-section section">
        <h2 className="section-title">Core Skills</h2>
        <div className="skills-list">
          <p>
            <strong>Languages:</strong> TypeScript, JavaScript, Elixir, GoLang, Rust, C++, Ruby, Python
          </p>
          <p>
            <strong>Frontend:</strong> React, Next.js, Remix, TanStack, React Native, CSS/Tailwind
          </p>
          <p>
            <strong>Backend:</strong> Node.js, Phoenix, Rails, Event-Driven Architecture, CQRS
          </p>
          <p>
            <strong>Infrastructure:</strong> AWS, Cloudflare, Kubernetes, Docker, CI/CD
          </p>
          <p>
            <strong>Interests:</strong> Embedded systems, robotics, AI/ML, real-time systems
          </p>
        </div>
      </section>
    </PageLayout>
  );
}

function calculateTotalTenure(positions: Position[]): string {
  // Simple display - just show the range
  const periods = positions.map((p) => p.period);
  const firstStart = periods[periods.length - 1].split(" - ")[0];
  const lastEnd = periods[0].split(" - ")[1];
  return `${firstStart} - ${lastEnd}`;
}
