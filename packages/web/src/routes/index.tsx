import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GitHubIcon,
  TwitterIcon,
  LinkedInIcon,
  ExternalLinkIcon,
  ChevronRightIcon,
  MailIcon,
} from "~/components/ui/icons";
import { useFadeUp } from "~/hooks/use-gsap";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Ryan Yogan" },
      { property: "og:title", content: "Ryan Yogan" },
      {
        name: "description",
        content:
          "Software engineer and engineering leader. Building at the intersection of AI and the physical world.",
      },
    ],
  }),
});

function HomePage() {
  const heroRef = useFadeUp({ y: 30, duration: 0.8 });
  const writingRef = useFadeUp({ y: 30, duration: 0.8 });
  const projectsRef = useFadeUp({ y: 30, duration: 0.8 });
  const workRef = useFadeUp({ y: 30, duration: 0.8 });

  const featuredWriting = [
    {
      title: "The Rule of Three",
      description: "Comparing React Router v7, TanStack Start, and Next.js for modern web apps",
      href: "/blog/the-rule-of-three",
      date: "Feb 2025",
    },
    {
      title: "Why I Still Choose Prisma",
      description: "My honest take on ORMs, type safety, and developer experience in 2025",
      href: "/blog/prisma-in-2025",
      date: "Jan 2025",
    },
    {
      title: "Scaling Engineering Teams",
      description: "Hard lessons from growing teams from zero to forty engineers",
      href: "/blog/scaling-teams",
      date: "Dec 2024",
    },
  ];

  const featuredProjects = [
    {
      title: "Yogan Hockey",
      description: "Real-time NHL stats with Phoenix LiveView. Faster than Next.js using ETS for ISR.",
      href: "https://yogan-hockey.fly.dev",
      tags: ["Elixir", "Phoenix", "LiveView"],
    },
    {
      title: "10.yogan.dev",
      description: "Westworld-themed Valentine's experience with immersive visual design.",
      href: "https://10.yogan.dev",
      tags: ["React", "GSAP", "WebGL"],
    },
    {
      title: "Ice Yeti",
      description: "Hockey social network connecting players, coaches, and fans.",
      href: "https://slax.yogan.dev",
      tags: ["Elixir", "Phoenix", "LiveView"],
    },
    {
      title: "This Site",
      description: "AI-powered personal site with TanStack Start on Cloudflare Workers.",
      href: "https://github.com/ryanyogan/ryanyogan.com",
      tags: ["TanStack", "Cloudflare", "AI"],
    },
  ];

  const workHistory = [
    {
      company: "Shopify",
      role: "Staff Engineer",
      period: "2019 - 2024",
      logo: "https://cdn.shopify.com/s/files/1/0070/7032/files/shopify-favicon.png",
    },
    {
      company: "Netflix",
      role: "Senior Engineer",
      period: "2016 - 2019",
      logo: "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico",
    },
    {
      company: "Various Startups",
      role: "Engineering Lead",
      period: "2008 - 2016",
      description: "0 → 40 engineers, multiple acquisitions",
    },
  ];

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section ref={heroRef} className="hero" data-animate>
        <div className="hero-header">
          <img
            src="https://github.com/ryanyogan.png"
            alt="Ryan Yogan"
            className="hero-avatar"
            width={72}
            height={72}
          />
          <div className="hero-status">
            <span className="hero-status-dot" />
            <span className="hero-status-text">Open to opportunities</span>
          </div>
        </div>

        <h1 className="hero-title">
          Software engineer building at the intersection of{" "}
          <span className="hero-highlight">AI and the physical world</span>
        </h1>

        <p className="hero-description">
          15+ years shipping products at Shopify and Netflix. Scaling teams from zero to acquisition. 
          Passionate about embedded systems, robotics, and making software control hardware.
        </p>

        <div className="hero-actions">
          <a href="mailto:ryan@ryanyogan.com" className="btn btn-primary">
            <MailIcon size={16} />
            Get in touch
          </a>
          <div className="hero-socials">
            <a href="https://github.com/ryanyogan" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="GitHub">
              <GitHubIcon size={18} />
            </a>
            <a href="https://twitter.com/ryanyogan" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="Twitter">
              <TwitterIcon size={18} />
            </a>
            <a href="https://linkedin.com/in/ryanyogan" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="LinkedIn">
              <LinkedInIcon size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Writing Section */}
      <section ref={writingRef} className="section" data-animate>
        <div className="section-header">
          <h2 className="section-title">Writing</h2>
          <Link to="/blog" className="section-link">
            View all <ChevronRightIcon size={14} />
          </Link>
        </div>

        <div className="card-list">
          {featuredWriting.map((post) => (
            <Link key={post.href} to={post.href} className="card card-hover">
              <div className="card-content">
                <h3 className="card-title">{post.title}</h3>
                <p className="card-description">{post.description}</p>
              </div>
              <span className="card-meta">{post.date}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="section" data-animate>
        <div className="section-header">
          <h2 className="section-title">Projects</h2>
          <Link to="/projects" className="section-link">
            View all <ChevronRightIcon size={14} />
          </Link>
        </div>
        
        <div className="grid-2">
          {featuredProjects.map((project) => (
            <a
              key={project.title}
              href={project.href}
              target={project.href.startsWith("http") ? "_blank" : undefined}
              rel={project.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="project-card"
            >
              <div className="project-card-header">
                <h3 className="project-card-title">{project.title}</h3>
                {project.href.startsWith("http") && (
                  <ExternalLinkIcon size={14} className="project-card-icon" />
                )}
              </div>
              <p className="project-card-desc">{project.description}</p>
              <div className="tag-list">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Work Section */}
      <section ref={workRef} className="section" data-animate>
        <div className="section-header">
          <h2 className="section-title">Experience</h2>
          <Link to="/about" className="section-link">
            Full resume <ChevronRightIcon size={14} />
          </Link>
        </div>
        
        <div className="work-grid">
          {workHistory.map((job) => (
            <div key={job.company} className="work-card">
              <div className="work-card-logo">
                {job.logo ? (
                  <img src={job.logo} alt={job.company} width={32} height={32} />
                ) : (
                  <div className="work-card-logo-placeholder" />
                )}
              </div>
              <div className="work-card-content">
                <div className="work-card-company">{job.company}</div>
                <div className="work-card-role">{job.role}</div>
                {job.description && (
                  <div className="work-card-description">{job.description}</div>
                )}
              </div>
              <div className="work-card-period">{job.period}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
