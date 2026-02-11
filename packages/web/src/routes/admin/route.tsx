import { createFileRoute, Outlet, Link, redirect } from "@tanstack/react-router";
import {
  HomeIcon,
  ProjectIcon,
  UserIcon,
  TerminalIcon,
} from "~/components/ui/icons";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  beforeLoad: async () => {
    // Disable admin in production
    if (import.meta.env.PROD) {
      throw redirect({ to: "/" });
    }
  },
});

// Note: Posts are now managed via MDX files in content/writing/
// See /writing for blog posts - no admin UI needed
const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: HomeIcon },
  { label: "Projects", href: "/admin/projects", icon: ProjectIcon },
  { label: "Experience", href: "/admin/experience", icon: UserIcon },
  { label: "AI Content", href: "/admin/content", icon: TerminalIcon },
];

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-logo">
            <span className="admin-logo-mark">R</span>
            <span className="admin-logo-text">Admin</span>
          </Link>
        </div>
        
        <nav className="admin-nav">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="admin-nav-link"
              activeProps={{ className: "admin-nav-link is-active" }}
              activeOptions={{ exact: link.href === "/admin" }}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-link">
            <span>← Back to site</span>
          </Link>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
