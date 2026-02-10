import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UserIcon } from "~/components/ui/icons";
import { Modal } from "~/components/ui/modal";
import { Input, Textarea, Checkbox, FormRow, FormActions } from "~/components/ui/form-field";
import { getExperiences } from "~/lib/server/db";

interface ExperienceFormData {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

const emptyExperience: ExperienceFormData = {
  company: "",
  title: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
};

export const Route = createFileRoute("/admin/experience")({
  component: AdminExperience,
  loader: async () => {
    const experiences = await getExperiences();
    return { experiences };
  },
});

function AdminExperience() {
  const { experiences } = Route.useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceFormData | null>(null);
  const [formData, setFormData] = useState<ExperienceFormData>(emptyExperience);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const toInputDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().split("T")[0];
  };

  const handleOpenCreate = () => {
    setEditingExperience(null);
    setFormData(emptyExperience);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: typeof experiences[0]) => {
    const data: ExperienceFormData = {
      company: exp.company,
      title: exp.title,
      location: exp.location || "",
      startDate: toInputDate(exp.startDate),
      endDate: exp.endDate ? toInputDate(exp.endDate) : "",
      current: exp.current || false,
      description: exp.description || "",
    };
    setEditingExperience(data);
    setFormData(data);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
    setFormData(emptyExperience);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Call createExperience or updateExperience server function
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log(editingExperience ? "Update experience:" : "Create experience:", formData);
    
    setIsSubmitting(false);
    handleClose();
    // TODO: router.invalidate() to refresh data
  };

  const handleDelete = async (experienceId: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    // TODO: Call deleteExperience server function
    console.log("Delete experience:", experienceId);
    // TODO: router.invalidate() to refresh data
  };

  const updateField = <K extends keyof ExperienceFormData>(field: K, value: ExperienceFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <UserIcon size={16} />
          Add Experience
        </button>
      </header>

      {experiences.length === 0 ? (
        <div className="admin-table-container">
          <div className="admin-empty">
            <div className="admin-empty-icon">
              <UserIcon size={32} />
            </div>
            <p className="admin-empty-title">No experience yet</p>
            <p className="admin-empty-description">
              Add your first work experience to get started.
            </p>
          </div>
        </div>
      ) : (
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
                    {exp.location && (
                      <div className="admin-table-subtitle">{exp.location}</div>
                    )}
                  </td>
                  <td>
                    <div className="admin-table-subtitle">{exp.title}</div>
                  </td>
                  <td className="admin-table-date">
                    {formatDate(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        className="admin-table-action"
                        onClick={() => handleOpenEdit(exp)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-table-action admin-table-action-danger"
                        onClick={() => handleDelete(exp.id)}
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
        title={editingExperience ? "Edit Experience" : "Add Experience"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <FormRow>
            <Input
              label="Company"
              value={formData.company}
              onChange={(e) => updateField("company", e.target.value)}
              placeholder="Acme Corp"
              required
            />
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Senior Engineer"
              required
            />
          </FormRow>

          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="Chicago, IL"
          />

          <FormRow>
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
              disabled={formData.current}
            />
          </FormRow>

          <Checkbox
            label="I currently work here"
            checked={formData.current}
            onChange={(e) => {
              updateField("current", e.target.checked);
              if (e.target.checked) {
                updateField("endDate", "");
              }
            }}
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Describe your role and accomplishments..."
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
              {editingExperience ? "Save Changes" : "Add Experience"}
            </button>
          </FormActions>
        </form>
      </Modal>
    </div>
  );
}
