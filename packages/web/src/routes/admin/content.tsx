import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckIcon, CloseIcon } from "~/components/ui/icons";

export const Route = createFileRoute("/admin/content")({
  component: AdminContent,
});

function AdminContent() {
  // TODO: Fetch from database
  const [content] = useState([
    {
      id: "1",
      type: "weekly_digest",
      content: "This week you pushed 23 commits across 4 repositories...",
      status: "pending",
      createdAt: "2025-02-10T09:00:00Z",
    },
    {
      id: "2",
      type: "project_summary",
      content: "Yogan Hockey received 5 new stars this week...",
      status: "pending",
      createdAt: "2025-02-09T12:00:00Z",
    },
    {
      id: "3",
      type: "about_update",
      content: "Based on your recent activity, consider updating your bio...",
      status: "approved",
      createdAt: "2025-02-08T15:00:00Z",
    },
  ]);

  const formatType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="admin-page-header-content">
          <h1 className="admin-page-title">AI Content</h1>
          <p className="admin-page-description">
            Review and approve AI-generated content before it goes live.
          </p>
        </div>
      </header>

      <div className="admin-content-list">
        {content.map((item) => (
          <div key={item.id} className="admin-content-card">
            <div className="admin-content-header">
              <span className="admin-content-type">{formatType(item.type)}</span>
              <span
                className={`admin-status-badge status-${item.status === "pending" ? "draft" : "published"}`}
              >
                {item.status}
              </span>
            </div>
            <div className="admin-content-body">
              <p>{item.content}</p>
            </div>
            <div className="admin-content-footer">
              <span className="admin-content-date">{formatDate(item.createdAt)}</span>
              {item.status === "pending" && (
                <div className="admin-content-actions">
                  <button className="admin-content-action approve">
                    <CheckIcon size={16} />
                    Approve
                  </button>
                  <button className="admin-content-action reject">
                    <CloseIcon size={16} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
