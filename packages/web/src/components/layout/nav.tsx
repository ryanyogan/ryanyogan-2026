import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "~/components/ui/theme-toggle";

const navLinks = [
  { label: "work", href: "/work" },
  { label: "writing", href: "/writing" },
  { label: "projects", href: "/projects" },
] as const;

export function Nav() {
  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="nav-name">
          ryan yogan
        </Link>
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="nav-link"
              activeProps={{ className: "nav-link text-[--color-foreground]" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="nav-right">
        <ThemeToggle />
      </div>
    </nav>
  );
}
