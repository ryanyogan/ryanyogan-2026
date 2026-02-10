import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DocumentIcon, ExternalLinkIcon } from "~/components/ui/icons";

export const Route = createFileRoute("/admin/posts")({
  component: AdminPosts,
});

function AdminPosts() {
  // TODO: Fetch from database
  const [posts] = useState([
    {
      id: "1",
      title: "The Rule of Three",
      slug: "the-rule-of-three",
      status: "published",
      publishedAt: "2025-02-01",
      views: 342,
    },
    {
      id: "2",
      title: "Why I Still Choose Prisma",
      slug: "prisma-in-2025",
      status: "published",
      publishedAt: "2025-01-15",
      views: 256,
    },
    {
      id: "3",
      title: "Scaling Engineering Teams",
      slug: "scaling-teams",
      status: "draft",
      publishedAt: null,
      views: 0,
    },
  ]);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="admin-page-header-content">
          <h1 className="admin-page-title">Posts</h1>
          <p className="admin-page-description">
            Manage your blog posts and articles.
          </p>
        </div>
        <button className="btn btn-primary">
          <DocumentIcon size={16} />
          New Post
        </button>
      </header>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Published</th>
              <th>Views</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <div className="admin-table-title">{post.title}</div>
                  <div className="admin-table-subtitle">/{post.slug}</div>
                </td>
                <td>
                  <span className={`admin-status-badge status-${post.status}`}>
                    {post.status}
                  </span>
                </td>
                <td className="admin-table-date">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="admin-table-number">{post.views}</td>
                <td>
                  <div className="admin-table-actions">
                    <button className="admin-table-action">Edit</button>
                    <Link
                      to="/writing/$slug"
                      params={{ slug: post.slug }}
                      className="admin-table-action"
                      target="_blank"
                    >
                      <ExternalLinkIcon size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
