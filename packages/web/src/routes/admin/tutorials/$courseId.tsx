import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  VideoIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "~/components/ui/icons";
import { Modal } from "~/components/ui/modal";
import { Input, Textarea, Select, Checkbox, FormRow, FormActions } from "~/components/ui/form-field";
import { formatDuration, parseYouTubeUrl } from "~/lib/youtube";

interface LessonFormData {
  title: string;
  slug: string;
  description: string;
  contentType: "video" | "text" | "hybrid";
  youtubeVideoId: string;
  requiresCoding: boolean;
  status: "draft" | "published";
}

const emptyLesson: LessonFormData = {
  title: "",
  slug: "",
  description: "",
  contentType: "video",
  youtubeVideoId: "",
  requiresCoding: true,
  status: "draft",
};

interface MockLesson {
  id: string;
  slug: string;
  title: string;
  contentType: "video" | "text" | "hybrid";
  durationSeconds: number | null;
  orderIndex: number;
  status: "draft" | "published";
  requiresCoding: boolean;
}

interface MockCourse {
  id: string;
  slug: string;
  title: string;
}

interface MockSection {
  id: string;
  title: string;
  orderIndex: number;
  lessons: MockLesson[];
}

export const Route = createFileRoute("/admin/tutorials/$courseId")({
  component: AdminLessons,
  loader: async ({ params }) => {
    // TODO: Fetch from database
    const course = getMockCourse(params.courseId);
    const sections = getMockSections(params.courseId);
    const unorganizedLessons = getMockUnorganizedLessons(params.courseId);
    return { course, sections, unorganizedLessons };
  },
});

function AdminLessons() {
  const { course, sections, unorganizedLessons } = Route.useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonFormData | null>(null);
  const [formData, setFormData] = useState<LessonFormData>(emptyLesson);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!course) {
    return (
      <div className="admin-page">
        <div className="admin-empty">
          <p className="admin-empty-title">Course not found</p>
          <Link to="/admin/tutorials" className="btn btn-secondary">
            Back to Tutorials
          </Link>
        </div>
      </div>
    );
  }

  const handleOpenCreate = () => {
    setEditingLesson(null);
    setFormData(emptyLesson);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lesson: MockLesson) => {
    const data: LessonFormData = {
      title: lesson.title,
      slug: lesson.slug,
      description: "",
      contentType: lesson.contentType,
      youtubeVideoId: "",
      requiresCoding: lesson.requiresCoding,
      status: lesson.status,
    };
    setEditingLesson(data);
    setFormData(data);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingLesson(null);
    setFormData(emptyLesson);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Call createLesson or updateLesson server function
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
    handleClose();
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) {
      return;
    }
    void lessonId;
    // TODO: Call deleteLesson server function
  };

  const handleMoveUp = async (lessonId: string) => {
    void lessonId;
    // TODO: Reorder lesson
  };

  const handleMoveDown = async (lessonId: string) => {
    void lessonId;
    // TODO: Reorder lesson
  };

  const updateField = <K extends keyof LessonFormData>(field: K, value: LessonFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    updateField("title", title);
    if (!editingLesson) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      updateField("slug", slug);
    }
  };

  // Parse YouTube URL to extract video ID
  const handleYouTubeChange = (input: string) => {
    const parsed = parseYouTubeUrl(input);
    if (parsed?.type === "video") {
      updateField("youtubeVideoId", parsed.id);
    } else {
      updateField("youtubeVideoId", input);
    }
  };

  const allLessons = [...sections.flatMap((s) => s.lessons), ...unorganizedLessons];

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="admin-page-header-content">
          <Link to="/admin/tutorials" className="admin-back-link">
            <ChevronLeftIcon size={16} />
            Back to Tutorials
          </Link>
          <h1 className="admin-page-title">{course.title}</h1>
          <p className="admin-page-description">
            Manage lessons for this course. Drag to reorder.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <PlusIcon size={16} />
          Add Lesson
        </button>
      </header>

      {allLessons.length === 0 ? (
        <div className="admin-table-container">
          <div className="admin-empty">
            <div className="admin-empty-icon">
              <VideoIcon size={32} />
            </div>
            <p className="admin-empty-title">No lessons yet</p>
            <p className="admin-empty-description">Add your first lesson to get started.</p>
          </div>
        </div>
      ) : (
        <div className="admin-table-container">
          {sections.map((section) => (
            <div key={section.id} className="admin-section">
              <h3 className="admin-section-title">{section.title}</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>Order</th>
                    <th>Lesson</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {section.lessons.map((lesson, index) => (
                    <tr key={lesson.id}>
                      <td>
                        <div className="admin-order-buttons">
                          <button
                            className="admin-order-btn"
                            onClick={() => handleMoveUp(lesson.id)}
                            disabled={index === 0}
                          >
                            <ChevronUpIcon size={14} />
                          </button>
                          <button
                            className="admin-order-btn"
                            onClick={() => handleMoveDown(lesson.id)}
                            disabled={index === section.lessons.length - 1}
                          >
                            <ChevronDownIcon size={14} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="admin-table-title">{lesson.title}</div>
                        <div className="admin-table-subtitle">/{lesson.slug}</div>
                      </td>
                      <td>
                        <span className="admin-type-badge">{lesson.contentType}</span>
                      </td>
                      <td className="admin-table-number">
                        {lesson.durationSeconds ? formatDuration(lesson.durationSeconds) : "-"}
                      </td>
                      <td>
                        <span
                          className={`admin-status-badge ${lesson.status === "published" ? "status-published" : "status-draft"}`}
                        >
                          {lesson.status}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <button
                            className="admin-table-action"
                            onClick={() => handleOpenEdit(lesson)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-table-action admin-table-action-danger"
                            onClick={() => handleDelete(lesson.id)}
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
          ))}

          {unorganizedLessons.length > 0 && (
            <div className="admin-section">
              <h3 className="admin-section-title">Unorganized Lessons</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>Order</th>
                    <th>Lesson</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {unorganizedLessons.map((lesson, index) => (
                    <tr key={lesson.id}>
                      <td>
                        <div className="admin-order-buttons">
                          <button
                            className="admin-order-btn"
                            onClick={() => handleMoveUp(lesson.id)}
                            disabled={index === 0}
                          >
                            <ChevronUpIcon size={14} />
                          </button>
                          <button
                            className="admin-order-btn"
                            onClick={() => handleMoveDown(lesson.id)}
                            disabled={index === unorganizedLessons.length - 1}
                          >
                            <ChevronDownIcon size={14} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="admin-table-title">{lesson.title}</div>
                        <div className="admin-table-subtitle">/{lesson.slug}</div>
                      </td>
                      <td>
                        <span className="admin-type-badge">{lesson.contentType}</span>
                      </td>
                      <td className="admin-table-number">
                        {lesson.durationSeconds ? formatDuration(lesson.durationSeconds) : "-"}
                      </td>
                      <td>
                        <span
                          className={`admin-status-badge ${lesson.status === "published" ? "status-published" : "status-draft"}`}
                        >
                          {lesson.status}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <button
                            className="admin-table-action"
                            onClick={() => handleOpenEdit(lesson)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-table-action admin-table-action-danger"
                            onClick={() => handleDelete(lesson.id)}
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
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingLesson ? "Edit Lesson" : "Add Lesson"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <FormRow>
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Introduction to LiveView"
              required
            />
            <Input
              label="Slug"
              value={formData.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="introduction-to-liveview"
              required
              hint="URL-friendly identifier"
            />
          </FormRow>

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="What students will learn in this lesson..."
          />

          <FormRow>
            <Select
              label="Content Type"
              value={formData.contentType}
              onChange={(e) =>
                updateField("contentType", e.target.value as LessonFormData["contentType"])
              }
            >
              <option value="video">Video</option>
              <option value="text">Text</option>
              <option value="hybrid">Hybrid (Video + Text)</option>
            </Select>
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => updateField("status", e.target.value as LessonFormData["status"])}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </FormRow>

          {(formData.contentType === "video" || formData.contentType === "hybrid") && (
            <Input
              label="YouTube Video URL or ID"
              value={formData.youtubeVideoId}
              onChange={(e) => handleYouTubeChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or video ID"
              hint="Paste a YouTube URL and the video ID will be extracted"
            />
          )}

          <Checkbox
            label="Requires coding (show code editor)"
            checked={formData.requiresCoding}
            onChange={(e) => updateField("requiresCoding", e.target.checked)}
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
              {editingLesson ? "Save Changes" : "Add Lesson"}
            </button>
          </FormActions>
        </form>
      </Modal>
    </div>
  );
}

// Temporary mock data
function getMockCourse(courseId: string): MockCourse | null {
  const courses: Record<string, MockCourse> = {
    "1": {
      id: "1",
      slug: "phoenix-liveview-fundamentals",
      title: "Phoenix LiveView Fundamentals",
    },
    "2": {
      id: "2",
      slug: "building-a-chat-app-with-elixir",
      title: "Building a Chat App with Elixir",
    },
  };
  return courses[courseId] ?? null;
}

function getMockSections(courseId: string): MockSection[] {
  if (courseId !== "1") return [];

  return [
    {
      id: "s1",
      title: "Getting Started",
      orderIndex: 0,
      lessons: [
        {
          id: "l1",
          slug: "introduction",
          title: "Introduction to LiveView",
          contentType: "video",
          durationSeconds: 420,
          orderIndex: 0,
          status: "published",
          requiresCoding: false,
        },
        {
          id: "l2",
          slug: "setup",
          title: "Project Setup",
          contentType: "video",
          durationSeconds: 600,
          orderIndex: 1,
          status: "published",
          requiresCoding: true,
        },
      ],
    },
    {
      id: "s2",
      title: "Building Components",
      orderIndex: 1,
      lessons: [
        {
          id: "l3",
          slug: "live-components",
          title: "Live Components",
          contentType: "video",
          durationSeconds: 900,
          orderIndex: 0,
          status: "draft",
          requiresCoding: true,
        },
      ],
    },
  ];
}

function getMockUnorganizedLessons(courseId: string): MockLesson[] {
  if (courseId !== "2") return [];

  return [
    {
      id: "l10",
      slug: "intro",
      title: "Course Introduction",
      contentType: "video",
      durationSeconds: 300,
      orderIndex: 0,
      status: "draft",
      requiresCoding: false,
    },
  ];
}
