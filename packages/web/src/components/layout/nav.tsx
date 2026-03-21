import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { SearchIcon, MenuIcon, CloseIcon } from "~/components/ui/icons";

const NAV_LINKS = [
  { to: "/writing", label: "Writing" },
  { to: "/projects", label: "Projects" },
  { to: "/tutorials", label: "Tutorials" },
  { to: "/work", label: "Work" },
  { to: "/hire", label: "Hire" },
] as const;

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

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`mobile-menu ${open ? "mobile-menu--open" : ""}`}
      aria-hidden={!open}
    >
      <div className="mobile-menu-backdrop" onClick={onClose} />
      <div className="mobile-menu-panel">
        <button
          className="mobile-menu-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <CloseIcon size={24} />
        </button>
        <nav className="mobile-menu-nav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="mobile-menu-link"
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="nav">
        {/* Row 1: Logo + Actions */}
        <div className="nav-header">
          <Link to="/" className="nav-name">
            Ryan Yogan
          </Link>
          <div className="nav-actions">
            <SearchButton />
            <ThemeToggle />
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon size={20} />
            </button>
          </div>
        </div>

        {/* Row 2: Nav Links (desktop only) */}
        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="nav-link">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
