import type { ReactNode } from "react";
import { Nav } from "./nav";

interface PageLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function PageLayout({ children, showNav = true }: PageLayoutProps) {
  return (
    <div className="page">
      <div className="container">
        {showNav && <Nav />}
        {children}
        <Footer />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a
            href="https://github.com/ryanyogan"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            github
          </a>
          <a
            href="https://linkedin.com/in/ryanyogan"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            linkedin
          </a>
          <a
            href="https://twitter.com/ryanyogan"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            twitter
          </a>
          <a href="mailto:ryan@ryanyogan.com" className="footer-link">
            email
          </a>
        </div>
        <span>{new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
