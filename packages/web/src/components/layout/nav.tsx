import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "~/components/ui/theme-toggle";

export function Nav() {
  return (
    <nav className="nav">
      <Link to="/" className="nav-name">
        Ryan Yogan
      </Link>
      <ThemeToggle />
    </nav>
  );
}
