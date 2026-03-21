import type { Section, Lesson } from "@ryanyogan/db";
import { SectionGroup } from "./SectionGroup";
import { LessonItem } from "./LessonItem";

interface CourseSidebarProps {
  courseSlug: string;
  courseTitle: string;
  sections: Array<Section & { lessons: Lesson[] }>;
  unorganizedLessons: Lesson[];
  currentLessonSlug?: string;
  completedLessonIds?: Set<string>;
}

export function CourseSidebar({
  courseSlug,
  courseTitle,
  sections,
  unorganizedLessons,
  currentLessonSlug,
  completedLessonIds = new Set(),
}: CourseSidebarProps) {
  return (
    <aside className="course-sidebar">
      <div className="course-sidebar-header">
        <h2 className="course-sidebar-title">{courseTitle}</h2>
      </div>

      <nav className="course-sidebar-nav">
        {/* Sections with their lessons */}
        {sections.map((section) => (
          <SectionGroup key={section.id} title={section.title}>
            {section.lessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                courseSlug={courseSlug}
                slug={lesson.slug}
                title={lesson.title}
                durationSeconds={lesson.durationSeconds}
                isCompleted={completedLessonIds.has(lesson.id)}
                isActive={lesson.slug === currentLessonSlug}
              />
            ))}
          </SectionGroup>
        ))}

        {/* Lessons without a section */}
        {unorganizedLessons.length > 0 && (
          <SectionGroup title="Other Lessons">
            {unorganizedLessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                courseSlug={courseSlug}
                slug={lesson.slug}
                title={lesson.title}
                durationSeconds={lesson.durationSeconds}
                isCompleted={completedLessonIds.has(lesson.id)}
                isActive={lesson.slug === currentLessonSlug}
              />
            ))}
          </SectionGroup>
        )}
      </nav>
    </aside>
  );
}
