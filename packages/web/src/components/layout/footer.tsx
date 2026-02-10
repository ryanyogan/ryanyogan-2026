export function Footer() {
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
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/ryanyogan"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            LinkedIn
          </a>
          <a
            href="https://twitter.com/ryanyogan"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Twitter
          </a>
          <a href="mailto:ryan@ryanyogan.com" className="footer-link">
            Email
          </a>
        </div>
        <span className="footer-copy">{new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
