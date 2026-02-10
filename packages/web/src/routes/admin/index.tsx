import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  // TODO: Fetch real stats from database
  const stats = [
    { label: "Posts", value: 4, change: "+2 this month" },
    { label: "Projects", value: 6, change: "3 featured" },
    { label: "Page Views", value: "1.2k", change: "+12% vs last week" },
    { label: "AI Content", value: 3, change: "pending review" },
  ];

  const recentActivity = [
    { type: "post", action: "Published", title: "The Rule of Three", time: "2 hours ago" },
    { type: "ai", action: "Generated", title: "Weekly digest", time: "Yesterday" },
    { type: "project", action: "Updated", title: "Yogan Hockey", time: "3 days ago" },
  ];

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-description">
          Overview of your site's content and activity.
        </p>
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

      {/* Recent Activity */}
      <section className="admin-section">
        <h2 className="admin-section-title">Recent Activity</h2>
        <div className="admin-activity-list">
          {recentActivity.map((activity, i) => (
            <div key={i} className="admin-activity-item">
              <div className="admin-activity-dot" data-type={activity.type} />
              <div className="admin-activity-content">
                <span className="admin-activity-action">{activity.action}</span>
                <span className="admin-activity-title">{activity.title}</span>
              </div>
              <div className="admin-activity-time">{activity.time}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="admin-section">
        <h2 className="admin-section-title">Quick Actions</h2>
        <div className="admin-actions-grid">
          <button className="admin-action-btn">
            New Post
          </button>
          <button className="admin-action-btn">
            Add Project
          </button>
          <button className="admin-action-btn">
            Review AI Content
          </button>
          <button className="admin-action-btn">
            Sync GitHub
          </button>
        </div>
      </section>
    </div>
  );
}
