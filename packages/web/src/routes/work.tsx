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

function WorkPage() {
  return (
    <PageLayout>
      <h1 style={{ marginBottom: "2rem" }}>work</h1>

      <div className="work-list">
        <div className="work-item">
          <span className="work-period">2019 - 2024</span>
          <div className="work-content">
            <h3>Procore Technologies</h3>
            <p className="work-role">Staff Engineer / Engineering Manager</p>
            <p className="work-description">
              Led platform engineering for construction management software serving
              thousands of enterprise customers. Built and scaled a team of 15 engineers.
              Drove major architectural improvements including API redesign and real-time
              collaboration features. Contributed to successful IPO preparation.
            </p>
          </div>
        </div>

        <div className="work-item">
          <span className="work-period">2015 - 2019</span>
          <div className="work-content">
            <h3>Peak6 Investments</h3>
            <p className="work-role">Senior Engineer</p>
            <p className="work-description">
              Built low-latency trading systems for high-frequency trading operations.
              Worked on order management systems, risk calculations, and market data
              infrastructure. Gained deep experience in performance-critical systems
              where milliseconds matter.
            </p>
          </div>
        </div>

        <div className="work-item">
          <span className="work-period">2012 - 2015</span>
          <div className="work-content">
            <h3>Startup (Acquired)</h3>
            <p className="work-role">Founding Engineer / Tech Lead</p>
            <p className="work-description">
              First engineering hire. Built the entire technical foundation from scratch.
              Grew the team from 1 to 12 engineers. Led the technical due diligence
              process during acquisition.
            </p>
          </div>
        </div>

        <div className="work-item">
          <span className="work-period">2010 - 2012</span>
          <div className="work-content">
            <h3>Various Startups</h3>
            <p className="work-role">Senior Engineer</p>
            <p className="work-description">
              Early-stage startup experience across multiple companies. Full-stack
              development, technical architecture, and team building. Learned the
              importance of shipping fast and iterating based on user feedback.
            </p>
          </div>
        </div>

        <div className="work-item">
          <span className="work-period">2004 - 2010</span>
          <div className="work-content">
            <h3>Enterprise Software</h3>
            <p className="work-role">Software Engineer</p>
            <p className="work-description">
              Started my career building enterprise applications. Learned fundamentals
              of software engineering, working with large codebases, and collaborating
              on distributed teams.
            </p>
          </div>
        </div>
      </div>

      <section className="section" style={{ marginTop: "3rem" }}>
        <h2 className="section-title">skills</h2>
        <p style={{ color: "var(--color-muted)", lineHeight: 1.7 }}>
          <strong style={{ color: "var(--color-foreground)" }}>Languages:</strong> TypeScript, 
          Rust, Go, Python, Ruby, Elixir
        </p>
        <p style={{ color: "var(--color-muted)", lineHeight: 1.7 }}>
          <strong style={{ color: "var(--color-foreground)" }}>Infrastructure:</strong> AWS, 
          Cloudflare, Kubernetes, Docker, Terraform
        </p>
        <p style={{ color: "var(--color-muted)", lineHeight: 1.7 }}>
          <strong style={{ color: "var(--color-foreground)" }}>Interests:</strong> Embedded 
          systems, robotics, AI/ML, real-time systems
        </p>
      </section>
    </PageLayout>
  );
}
