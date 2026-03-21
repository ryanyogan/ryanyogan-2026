import { SOCIAL_LINKS, CONTACT } from "~/lib/constants";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            LinkedIn
          </a>
          <a
            href={SOCIAL_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Twitter
          </a>
          <a
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            YouTube
          </a>
          <a href={`mailto:${CONTACT.email}`} className="footer-link">
            Email
          </a>
        </div>
        <span className="footer-copy">{new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
