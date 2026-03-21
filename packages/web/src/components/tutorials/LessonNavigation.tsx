import { Link } from "@tanstack/react-router";
import { ChevronLeftIcon, ChevronRightIcon } from "~/components/ui/icons";

interface LessonNavigationProps {
  courseSlug: string;
  previousLesson?: {
    slug: string;
    title: string;
  } | null;
  nextLesson?: {
    slug: string;
    title: string;
  } | null;
}

export function LessonNavigation({
  courseSlug,
  previousLesson,
  nextLesson,
}: LessonNavigationProps) {
  return (
    <nav className="lesson-navigation">
      {previousLesson ? (
        <Link
          to="/tutorials/$courseSlug/$lessonSlug"
          params={{ courseSlug, lessonSlug: previousLesson.slug }}
          className="lesson-nav-link lesson-nav-prev"
        >
          <ChevronLeftIcon size={16} />
          <span className="lesson-nav-label">Previous</span>
          <span className="lesson-nav-title">{previousLesson.title}</span>
        </Link>
      ) : (
        <div className="lesson-nav-placeholder" />
      )}

      {nextLesson ? (
        <Link
          to="/tutorials/$courseSlug/$lessonSlug"
          params={{ courseSlug, lessonSlug: nextLesson.slug }}
          className="lesson-nav-link lesson-nav-next"
        >
          <span className="lesson-nav-label">Next</span>
          <span className="lesson-nav-title">{nextLesson.title}</span>
          <ChevronRightIcon size={16} />
        </Link>
      ) : (
        <div className="lesson-nav-placeholder" />
      )}
    </nav>
  );
}
