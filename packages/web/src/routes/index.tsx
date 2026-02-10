import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Ryan Yogan" },
      { property: "og:title", content: "Ryan Yogan" },
      {
        name: "description",
        content:
          "Engineering leader with 20 years of experience building teams and products. Based in Chicago.",
      },
    ],
  }),
});

function HomePage() {
  return (
    <PageLayout>
      {/* Bio */}
      <section className="bio">
        <p>
          I'm an engineering leader with <strong>20 years</strong> of experience building 
          teams and products. I've worked at{" "}
          <a href="https://procore.com" target="_blank" rel="noopener noreferrer" className="text-link">
            Procore
          </a>{" "}
          (pre-IPO) and{" "}
          <a href="https://peak6.com" target="_blank" rel="noopener noreferrer" className="text-link">
            Peak6
          </a>{" "}
          (high-frequency trading), and built engineering teams from 0 to 40+ people at 
          various startups.
        </p>
        <p>
          I'm passionate about <strong>embedded systems</strong>, <strong>AI</strong>, 
          and <strong>robotics</strong> - building software that controls hardware. 
          When I'm not coding, you'll find me playing hockey or working on side projects.
        </p>
        <p>
          Based in <strong>Chicago, IL</strong>. Currently open to new opportunities.
        </p>
        <div className="social-links">
          <a
            href="https://github.com/ryanyogan"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            github
          </a>
          <a
            href="https://twitter.com/ryanyogan"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            twitter
          </a>
          <a
            href="https://linkedin.com/in/ryanyogan"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            linkedin
          </a>
          <a href="mailto:ryan@ryanyogan.com" className="social-link">
            email
          </a>
        </div>
      </section>

      {/* Recent Writing */}
      <section className="section">
        <h2 className="section-title">writing</h2>
        <div className="writing-list">
          <Link to="/writing/$slug" params={{ slug: "building-teams" }} className="writing-item">
            <span className="writing-title">Building engineering teams from scratch</span>
            <span className="writing-date">2024</span>
          </Link>
          <Link to="/writing/$slug" params={{ slug: "embedded-rust" }} className="writing-item">
            <span className="writing-title">Getting started with embedded Rust</span>
            <span className="writing-date">2024</span>
          </Link>
          <Link to="/writing/$slug" params={{ slug: "ai-hardware" }} className="writing-item">
            <span className="writing-title">AI at the edge: when software meets hardware</span>
            <span className="writing-date">2024</span>
          </Link>
        </div>
        <Link to="/writing" className="link" style={{ marginTop: "1rem", display: "inline-block" }}>
          all writing
        </Link>
      </section>

      {/* Work */}
      <section className="section">
        <h2 className="section-title">work</h2>
        <div className="work-list">
          <div className="work-item">
            <span className="work-period">2019 - 2024</span>
            <div className="work-content">
              <h3>Procore Technologies</h3>
              <p className="work-role">Staff Engineer / Engineering Manager</p>
            </div>
          </div>
          <div className="work-item">
            <span className="work-period">2015 - 2019</span>
            <div className="work-content">
              <h3>Peak6 Investments</h3>
              <p className="work-role">Senior Engineer</p>
            </div>
          </div>
          <div className="work-item">
            <span className="work-period">2010 - 2015</span>
            <div className="work-content">
              <h3>Various Startups</h3>
              <p className="work-role">Founding Engineer / Tech Lead</p>
            </div>
          </div>
        </div>
        <Link to="/work" className="link" style={{ marginTop: "1rem", display: "inline-block" }}>
          full work history
        </Link>
      </section>
    </PageLayout>
  );
}
