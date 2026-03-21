import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "~/components/ui/theme-toggle";

interface MinimalHeaderProps {
  courseTitle?: string;
  courseSlug?: string;
}

export function MinimalHeader({ courseTitle, courseSlug }: MinimalHeaderProps) {
  return (
    <header className="minimal-header">
      <div className="minimal-header-content">
        <Link to="/" className="minimal-header-logo">
          Ryan Yogan
        </Link>
        
        <nav className="minimal-header-nav">
          {courseTitle && courseSlug && (
            <>
              <Link to="/tutorials" className="minimal-header-link">
                Tutorials
              </Link>
              <span className="minimal-header-separator">/</span>
              <Link
                to="/tutorials/$courseSlug"
                params={{ courseSlug }}
                className="minimal-header-link minimal-header-link-active"
              >
                {courseTitle}
              </Link>
            </>
          )}
        </nav>

        <div className="minimal-header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
