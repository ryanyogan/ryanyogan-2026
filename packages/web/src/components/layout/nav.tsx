import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { SearchIcon } from "~/components/ui/icons";

function SearchButton() {
  return (
    <button
      onClick={() => {
        const event = new KeyboardEvent("keydown", {
          key: "k",
          metaKey: true,
          bubbles: true,
        });
        window.dispatchEvent(event);
      }}
      className="nav-icon-button"
      aria-label="Search"
    >
      <SearchIcon size={16} />
    </button>
  );
}

export function Nav() {
  return (
    <nav className="nav">
      <Link to="/" className="nav-name">
        Ryan Yogan
      </Link>
      <div className="nav-actions">
        <SearchButton />
        <ThemeToggle />
      </div>
    </nav>
  );
}
