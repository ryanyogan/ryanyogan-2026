import { Link } from "@tanstack/react-router";
import { formatDuration } from "~/lib/youtube";

interface CourseCardProps {
  slug: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes?: number | null;
  lessonCount: number;
}

const difficultyLabels = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const;

const difficultyColors = {
  beginner: "course-badge-beginner",
  intermediate: "course-badge-intermediate",
  advanced: "course-badge-advanced",
} as const;

export function CourseCard({
  slug,
  title,
  description,
  thumbnailUrl,
  difficulty,
  estimatedMinutes,
  lessonCount,
}: CourseCardProps) {
  return (
    <Link to="/tutorials/$courseSlug" params={{ courseSlug: slug }} className="course-card">
      {thumbnailUrl && (
        <div className="course-card-thumbnail">
          <img src={thumbnailUrl} alt="" loading="lazy" />
        </div>
      )}
      <div className="course-card-content">
        <div className="course-card-header">
          <span className={`course-badge ${difficultyColors[difficulty]}`}>
            {difficultyLabels[difficulty]}
          </span>
          {estimatedMinutes && (
            <span className="course-duration">
              {formatDuration(estimatedMinutes * 60)}
            </span>
          )}
        </div>
        <h3 className="course-card-title">{title}</h3>
        {description && <p className="course-card-description">{description}</p>}
        <div className="course-card-meta">
          <span className="course-lesson-count">
            {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
          </span>
        </div>
      </div>
    </Link>
  );
}
