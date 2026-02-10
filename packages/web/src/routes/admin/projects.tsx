import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProjectIcon, ExternalLinkIcon, GitHubIcon } from "~/components/ui/icons";

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjects,
});

function AdminProjects() {
  // TODO: Fetch from database
  const [projects] = useState([
    {
      id: "1",
      name: "Yogan Hockey",
      slug: "yogan-hockey",
      featured: true,
      stars: 24,
      url: "https://yogan-hockey.fly.dev",
      githubUrl: "https://github.com/ryanyogan/yogan-hockey",
    },
    {
      id: "2",
      name: "10.yogan.dev",
      slug: "10-yogan-dev",
      featured: true,
      stars: 12,
      url: "https://10.yogan.dev",
      githubUrl: "https://github.com/ryanyogan/10-year",
    },
    {
      id: "3",
      name: "ryanyogan.com",
      slug: "ryanyogan-com",
      featured: false,
      stars: 5,
      url: "https://ryanyogan.com",
      githubUrl: "https://github.com/ryanyogan/ryanyogan.com",
    },
  ]);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="admin-page-header-content">
          <h1 className="admin-page-title">Projects</h1>
          <p className="admin-page-description">
            Manage your portfolio projects.
          </p>
        </div>
        <button className="btn btn-primary">
          <ProjectIcon size={16} />
          Add Project
        </button>
      </header>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Featured</th>
              <th>Stars</th>
              <th>Links</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <div className="admin-table-title">{project.name}</div>
                  <div className="admin-table-subtitle">/{project.slug}</div>
                </td>
                <td>
                  <span
                    className={`admin-status-badge ${project.featured ? "status-published" : "status-draft"}`}
                  >
                    {project.featured ? "Featured" : "Hidden"}
                  </span>
                </td>
                <td className="admin-table-number">{project.stars}</td>
                <td>
                  <div className="admin-table-links">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-table-link"
                      >
                        <ExternalLinkIcon size={14} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-table-link"
                      >
                        <GitHubIcon size={14} />
                      </a>
                    )}
                  </div>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <button className="admin-table-action">Edit</button>
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
