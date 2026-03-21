import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { TutorialIcon, VideoIcon, PlusIcon, ExternalLinkIcon } from "~/components/ui/icons";
import { Modal } from "~/components/ui/modal";
import { Input, Textarea, Select, FormRow, FormActions } from "~/components/ui/form-field";
import { formatDuration } from "~/lib/youtube";

interface CourseFormData {
  title: string;
  slug: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  youtubePlaylistId: string;
  status: "draft" | "published";
}

const emptyCourse: CourseFormData = {
  title: "",
  slug: "",
  description: "",
  difficulty: "beginner",
  youtubePlaylistId: "",
  status: "draft",
};

interface MockCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  status: "draft" | "published";
  lessonCount: number;
  totalDurationSeconds: number;
}

export const Route = createFileRoute("/admin/tutorials/")({
  component: AdminTutorials,
  loader: async () => {
    // TODO: Fetch from database
    const courses = getMockCourses();
    return { courses };
  },
});

function AdminTutorials() {
  const { courses } = Route.useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseFormData | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(emptyCourse);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData(emptyCourse);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: MockCourse) => {
    const data: CourseFormData = {
      title: course.title,
      slug: course.slug,
      description: course.description,
      difficulty: course.difficulty,
      youtubePlaylistId: "",
      status: course.status,
    };
    setEditingCourse(data);
    setFormData(data);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setFormData(emptyCourse);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Call createCourse or updateCourse server function
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
    handleClose();
    // TODO: router.invalidate() to refresh data
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course? All lessons will be deleted too.")) {
      return;
    }

    // TODO: Call deleteCourse server function
    void courseId;
  };

  const updateField = <K extends keyof CourseFormData>(field: K, value: CourseFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    updateField("title", title);
    if (!editingCourse) {
      const slug = title
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
          <h1 className="admin-page-title">Tutorials</h1>
          <p className="admin-page-description">Manage your video courses and lessons.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <PlusIcon size={16} />
          Add Course
        </button>
      </header>

      {courses.length === 0 ? (
        <div className="admin-table-container">
          <div className="admin-empty">
            <div className="admin-empty-icon">
              <TutorialIcon size={32} />
            </div>
            <p className="admin-empty-title">No courses yet</p>
            <p className="admin-empty-description">Create your first course to get started.</p>
          </div>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Difficulty</th>
                <th>Lessons</th>
                <th>Duration</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>
                    <div className="admin-table-title">{course.title}</div>
                    <div className="admin-table-subtitle">/{course.slug}</div>
                  </td>
                  <td>
                    <span className={`course-badge course-badge-${course.difficulty}`}>
                      {course.difficulty}
                    </span>
                  </td>
                  <td className="admin-table-number">{course.lessonCount}</td>
                  <td className="admin-table-number">
                    {formatDuration(course.totalDurationSeconds)}
                  </td>
                  <td>
                    <span
                      className={`admin-status-badge ${course.status === "published" ? "status-published" : "status-draft"}`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <Link
                        to="/admin/tutorials/$courseId"
                        params={{ courseId: course.id }}
                        className="admin-table-action"
                      >
                        <VideoIcon size={14} />
                        Lessons
                      </Link>
                      <a
                        href={`/tutorials/${course.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-table-action"
                      >
                        <ExternalLinkIcon size={14} />
                      </a>
                      <button
                        className="admin-table-action"
                        onClick={() => handleOpenEdit(course)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-table-action admin-table-action-danger"
                        onClick={() => handleDelete(course.id)}
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
        title={editingCourse ? "Edit Course" : "Add Course"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <FormRow>
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Phoenix LiveView Fundamentals"
              required
            />
            <Input
              label="Slug"
              value={formData.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="phoenix-liveview-fundamentals"
              required
              hint="URL-friendly identifier"
            />
          </FormRow>

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="A brief description of what students will learn..."
            required
          />

          <FormRow>
            <Select
              label="Difficulty"
              value={formData.difficulty}
              onChange={(e) =>
                updateField("difficulty", e.target.value as CourseFormData["difficulty"])
              }
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => updateField("status", e.target.value as CourseFormData["status"])}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </FormRow>

          <Input
            label="YouTube Playlist ID"
            value={formData.youtubePlaylistId}
            onChange={(e) => updateField("youtubePlaylistId", e.target.value)}
            placeholder="PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf"
            hint="Optional: Import lessons from a YouTube playlist"
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
              {editingCourse ? "Save Changes" : "Create Course"}
            </button>
          </FormActions>
        </form>
      </Modal>
    </div>
  );
}

// Temporary mock data
function getMockCourses(): MockCourse[] {
  return [
    {
      id: "1",
      slug: "phoenix-liveview-fundamentals",
      title: "Phoenix LiveView Fundamentals",
      description: "Learn to build real-time web applications with Phoenix LiveView.",
      difficulty: "beginner",
      status: "published",
      lessonCount: 12,
      totalDurationSeconds: 10800,
    },
    {
      id: "2",
      slug: "building-a-chat-app-with-elixir",
      title: "Building a Chat App with Elixir",
      description: "From zero to production: build a real-time chat application.",
      difficulty: "intermediate",
      status: "draft",
      lessonCount: 16,
      totalDurationSeconds: 14400,
    },
  ];
}
