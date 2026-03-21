import { Link } from "@tanstack/react-router";
import { CheckIcon, PlayCircleIcon } from "~/components/ui/icons";
import { formatDuration } from "~/lib/youtube";

interface LessonItemProps {
  courseSlug: string;
  slug: string;
  title: string;
  durationSeconds?: number | null;
  isCompleted?: boolean;
  isActive?: boolean;
}

export function LessonItem({
  courseSlug,
  slug,
  title,
  durationSeconds,
  isCompleted = false,
  isActive = false,
}: LessonItemProps) {
  return (
    <Link
      to="/tutorials/$courseSlug/$lessonSlug"
      params={{ courseSlug, lessonSlug: slug }}
      className={`lesson-item ${isActive ? "lesson-item-active" : ""}`}
    >
      <span className="lesson-item-indicator">
        {isCompleted ? (
          <CheckIcon size={14} className="lesson-item-check" />
        ) : (
          <PlayCircleIcon size={14} className="lesson-item-play" />
        )}
      </span>
      <span className="lesson-item-title">{title}</span>
      {durationSeconds && (
        <span className="lesson-item-duration">{formatDuration(durationSeconds)}</span>
      )}
    </Link>
  );
}
