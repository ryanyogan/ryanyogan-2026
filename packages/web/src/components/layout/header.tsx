import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "~/components/ui";
import { CommandKHint } from "~/components/ui/command-palette";
import { SearchIcon } from "~/components/ui/icons";

const navItems = [
  { label: "writing", href: "/blog" },
  { label: "projects", href: "/projects" },
  { label: "about", href: "/about" },
] as const;

export function Header() {
  return (
    <header className="header">
      <nav className="header-inner">
        <Link to="/" className="header-logo" aria-label="Home">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="6" fill="currentColor" fillOpacity="0.1"/>
            <path d="M8 9.5C8 8.67157 8.67157 8 9.5 8H12.5C14.9853 8 17 10.0147 17 12.5C17 14.0163 16.2487 15.3529 15.1 16.15L18.5 20H15.5L12.5 16.5H11V20H8V9.5ZM11 14H12.5C13.3284 14 14 13.3284 14 12.5C14 11.6716 13.3284 11 12.5 11H11V14Z" fill="currentColor"/>
            <circle cx="20" cy="9" r="2" fill="var(--color-accent)"/>
          </svg>
        </Link>

        <div className="header-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="header-link"
              activeProps={{ className: "header-link is-active" }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="header-actions">
          <button
            onClick={() => {
              const event = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
              window.dispatchEvent(event);
            }}
            className="header-search"
            aria-label="Search"
          >
            <SearchIcon size={15} />
            <span className="header-search-text">Search</span>
            <kbd className="header-search-kbd">
              <span>⌘</span>K
            </kbd>
          </button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
