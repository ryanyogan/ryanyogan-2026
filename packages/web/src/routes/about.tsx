import { createFileRoute } from "@tanstack/react-router";
import { MailIcon, LinkedInIcon, TwitterIcon, GitHubIcon } from "~/components/ui/icons";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About - Ryan Yogan" },
      {
        name: "description",
        content: "Software engineer and engineering leader with 15+ years of experience.",
      },
      { property: "og:title", content: "About - Ryan Yogan" },
    ],
  }),
});

function AboutPage() {
  const skills = [
    { category: "Languages", items: ["TypeScript", "Elixir", "Go", "Ruby", "Rust"] },
    { category: "Frontend", items: ["React", "TanStack", "Next.js", "Phoenix LiveView"] },
    { category: "Backend", items: ["Node.js", "Phoenix", "Rails", "GraphQL"] },
    { category: "Infrastructure", items: ["Cloudflare", "AWS", "Docker", "Kubernetes"] },
    { category: "Interests", items: ["Embedded Systems", "Robotics", "AI/ML", "Audio"] },
  ];

  const experience = [
    {
      company: "Shopify",
      role: "Staff Engineer",
      period: "2019 - 2024",
      description: "Led merchant platform initiatives. Built real-time inventory systems serving millions of merchants. Grew and mentored engineering teams.",
    },
    {
      company: "Netflix",
      role: "Senior Software Engineer",
      period: "2016 - 2019",
      description: "Data infrastructure and streaming pipelines. Recommendation systems handling billions of events. Cross-functional collaboration at scale.",
    },
    {
      company: "Startups (Various)",
      role: "Founding Engineer → Engineering Lead",
      period: "2008 - 2016",
      description: "Three successful acquisitions. Built products from zero to scale. Grew teams from 5 to 40+ engineers. Full-stack development across web and mobile.",
    },
  ];

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="about-intro">
          <img
            src="https://github.com/ryanyogan.png"
            alt="Ryan Yogan"
            className="about-avatar"
            width={120}
            height={120}
          />
          <div className="about-intro-content">
            <h1 className="page-title">About</h1>
            <p className="about-tagline">
              Engineering leader building software that controls the physical world. 
              Based in Chicago.
            </p>
          </div>
        </div>
      </header>

      <div className="about-content">
        <section className="about-section">
          <p className="about-text">
            I'm a software engineer and engineering leader with over 15 years of experience 
            building products at scale. I've worked across the full stack from distributed 
            systems to user interfaces, always focused on shipping software that matters.
          </p>
          <p className="about-text">
            Currently exploring roles at the intersection of AI and embedded systems. 
            I'm passionate about software that controls hardware—robotics, IoT, aviation, 
            audio equipment. The physical world is the next frontier.
          </p>
        </section>

        <section className="section">
          <h2 className="section-label">Experience</h2>
          <div className="experience-list">
            {experience.map((job) => (
              <div key={job.company} className="experience-item">
                <div className="experience-header">
                  <div>
                    <h3 className="experience-company">{job.company}</h3>
                    <div className="experience-role">{job.role}</div>
                  </div>
                  <span className="experience-period">{job.period}</span>
                </div>
                <p className="experience-description">{job.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-label">Skills & Interests</h2>
          <div className="skills-grid">
            {skills.map((group) => (
              <div key={group.category} className="skill-group">
                <h3 className="skill-category">{group.category}</h3>
                <div className="skill-items">
                  {group.items.map((item) => (
                    <span key={item} className="skill-item">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-label">Get in Touch</h2>
          <p className="about-text" style={{ marginBottom: "1.5rem" }}>
            I'm always interested in meeting new people and discussing interesting problems. 
            Currently open to engineering leadership roles and consulting opportunities.
          </p>
          <div className="contact-links">
            <a href="mailto:ryan@ryanyogan.com" className="contact-link">
              <MailIcon size={18} />
              <span>ryan@ryanyogan.com</span>
            </a>
            <a href="https://github.com/ryanyogan" target="_blank" rel="noopener noreferrer" className="contact-link">
              <GitHubIcon size={18} />
              <span>GitHub</span>
            </a>
            <a href="https://twitter.com/ryanyogan" target="_blank" rel="noopener noreferrer" className="contact-link">
              <TwitterIcon size={18} />
              <span>Twitter</span>
            </a>
            <a href="https://linkedin.com/in/ryanyogan" target="_blank" rel="noopener noreferrer" className="contact-link">
              <LinkedInIcon size={18} />
              <span>LinkedIn</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
