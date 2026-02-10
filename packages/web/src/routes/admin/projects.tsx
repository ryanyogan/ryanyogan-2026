import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProjectIcon, ExternalLinkIcon, GitHubIcon } from "~/components/ui/icons";
import { Modal } from "~/components/ui/modal";
import { Input, Textarea, Checkbox, FormRow, FormActions } from "~/components/ui/form-field";
import { getProjects } from "~/lib/server/db";

interface ProjectFormData {
  name: string;
  slug: string;
  description: string;
  url: string;
  githubUrl: string;
  language: string;
  featured: boolean;
}

const emptyProject: ProjectFormData = {
  name: "",
  slug: "",
  description: "",
  url: "",
  githubUrl: "",
  language: "",
  featured: false,
};

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjects,
  loader: async () => {
    const projects = await getProjects();
    return { projects };
  },
});

function AdminProjects() {
  const { projects } = Route.useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectFormData | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(emptyProject);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData(emptyProject);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: typeof projects[0]) => {
    setEditingProject({
      name: project.name,
      slug: project.slug,
      description: project.description,
      url: project.url || "",
      githubUrl: project.githubUrl || "",
      language: project.language || "",
      featured: project.featured || false,
    });
    setFormData({
      name: project.name,
      slug: project.slug,
      description: project.description,
      url: project.url || "",
      githubUrl: project.githubUrl || "",
      language: project.language || "",
      featured: project.featured || false,
    });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData(emptyProject);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Call createProject or updateProject server function
    // For now, just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log(editingProject ? "Update project:" : "Create project:", formData);
    
    setIsSubmitting(false);
    handleClose();
    // TODO: router.invalidate() to refresh data
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    // TODO: Call deleteProject server function
    console.log("Delete project:", projectId);
    // TODO: router.invalidate() to refresh data
  };

  const updateField = <K extends keyof ProjectFormData>(field: K, value: ProjectFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    updateField("name", name);
    if (!editingProject) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      updateField("slug", slug);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="admin-page-header-content">
          <h1 className="admin-page-title">Projects</h1>
          <p className="admin-page-description">
            Manage your portfolio projects.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <ProjectIcon size={16} />
          Add Project
        </button>
      </header>

      {projects.length === 0 ? (
        <div className="admin-table-container">
          <div className="admin-empty">
            <div className="admin-empty-icon">
              <ProjectIcon size={32} />
            </div>
            <p className="admin-empty-title">No projects yet</p>
            <p className="admin-empty-description">
              Add your first project to get started.
            </p>
          </div>
        </div>
      ) : (
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
                      <button
                        className="admin-table-action"
                        onClick={() => handleOpenEdit(project)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-table-action admin-table-action-danger"
                        onClick={() => handleDelete(project.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingProject ? "Edit Project" : "Add Project"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <FormRow>
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="My Awesome Project"
              required
            />
            <Input
              label="Slug"
              value={formData.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="my-awesome-project"
              required
              hint="URL-friendly identifier"
            />
          </FormRow>

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="A brief description of your project..."
            required
          />

          <FormRow>
            <Input
              label="Website URL"
              type="url"
              value={formData.url}
              onChange={(e) => updateField("url", e.target.value)}
              placeholder="https://example.com"
            />
            <Input
              label="GitHub URL"
              type="url"
              value={formData.githubUrl}
              onChange={(e) => updateField("githubUrl", e.target.value)}
              placeholder="https://github.com/user/repo"
            />
          </FormRow>

          <Input
            label="Language"
            value={formData.language}
            onChange={(e) => updateField("language", e.target.value)}
            placeholder="TypeScript"
          />

          <Checkbox
            label="Featured on homepage"
            checked={formData.featured}
            onChange={(e) => updateField("featured", e.target.checked)}
          />

          <FormActions>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${isSubmitting ? "btn-loading" : ""}`}
              disabled={isSubmitting}
            >
              {editingProject ? "Save Changes" : "Add Project"}
            </button>
          </FormActions>
        </form>
      </Modal>
    </div>
  );
}
