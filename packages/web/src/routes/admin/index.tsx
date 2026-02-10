import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getProjects, getExperiences } from "~/lib/server/db";
import { getAllPosts } from "~/lib/content";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
  loader: async () => {
    const [projects, experiences] = await Promise.all([
      getProjects(),
      getExperiences(),
    ]);
    // Posts are now static MDX files
    const posts = getAllPosts();
    return { posts, projects, experiences };
  },
});

function AdminDashboard() {
  const { posts, projects, experiences } = Route.useLoaderData();
  const navigate = useNavigate();

  const stats = [
    { 
      label: "Posts (MDX)", 
      value: posts.length, 
      change: `${posts.filter(p => p.featured).length} featured` 
    },
    { 
      label: "Projects", 
      value: projects.length, 
      change: `${projects.filter(p => p.featured).length} featured` 
    },
    { 
      label: "Experience", 
      value: experiences.length, 
      change: `${experiences.length} roles` 
    },
  ];

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-description">
            Overview of your site's content and activity.
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-stat-card">
            <div className="admin-stat-label">{stat.label}</div>
            <div className="admin-stat-value">{stat.value}</div>
            <div className="admin-stat-change">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* MDX Posts Info */}
      <section className="admin-section">
        <h2 className="admin-section-title">Blog Posts</h2>
        <div className="admin-activity-list">
          <div className="admin-activity-item">
            <div className="admin-activity-dot" data-type="post" />
            <div className="admin-activity-content">
              <span className="admin-activity-title">
                Posts are managed via MDX files in <code>content/writing/</code>
              </span>
            </div>
          </div>
          {posts.slice(0, 3).map((post) => (
            <div key={post.slug} className="admin-activity-item">
              <div className="admin-activity-dot" data-type="post" />
              <div className="admin-activity-content">
                <span className="admin-activity-action">{post.slug}.mdx</span>
                <span className="admin-activity-title">{post.title}</span>
              </div>
              <div className="admin-activity-time">
                {new Date(post.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="admin-section">
        <h2 className="admin-section-title">Quick Actions</h2>
        <div className="admin-actions-grid">
          <button 
            className="admin-action-btn"
            onClick={() => navigate({ to: "/admin/projects" })}
          >
            Manage Projects
          </button>
          <button 
            className="admin-action-btn"
            onClick={() => navigate({ to: "/admin/experience" })}
          >
            Manage Experience
          </button>
          <button 
            className="admin-action-btn"
            onClick={() => navigate({ to: "/admin/content" })}
          >
            AI Content
          </button>
          <button 
            className="admin-action-btn"
            onClick={() => window.open("https://github.com/ryanyogan", "_blank")}
          >
            GitHub Profile
          </button>
        </div>
      </section>
    </div>
  );
}
