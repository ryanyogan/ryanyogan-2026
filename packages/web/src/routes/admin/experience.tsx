import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UserIcon } from "~/components/ui/icons";

export const Route = createFileRoute("/admin/experience")({
  component: AdminExperience,
});

function AdminExperience() {
  // TODO: Fetch from database
  const [experiences] = useState([
    {
      id: "1",
      company: "Shopify",
      title: "Staff Engineer",
      startDate: "2019-06-01",
      endDate: "2024-03-01",
      current: false,
    },
    {
      id: "2",
      company: "Netflix",
      title: "Senior Software Engineer",
      startDate: "2016-01-01",
      endDate: "2019-06-01",
      current: false,
    },
    {
      id: "3",
      company: "Various Startups",
      title: "Engineering Lead",
      startDate: "2008-01-01",
      endDate: "2016-01-01",
      current: false,
    },
  ]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="admin-page-header-content">
          <h1 className="admin-page-title">Experience</h1>
          <p className="admin-page-description">
            Manage your work history and experience.
          </p>
        </div>
        <button className="btn btn-primary">
          <UserIcon size={16} />
          Add Experience
        </button>
      </header>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Period</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp) => (
              <tr key={exp.id}>
                <td>
                  <div className="admin-table-title">{exp.company}</div>
                </td>
                <td>
                  <div className="admin-table-subtitle">{exp.title}</div>
                </td>
                <td className="admin-table-date">
                  {formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}
                </td>
                <td>
                  <div className="admin-table-actions">
                    <button className="admin-table-action">Edit</button>
                    <button className="admin-table-action admin-table-action-danger">
                      Delete
                    </button>
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
