import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import { LessonItem, SectionGroup } from "~/components/tutorials";
import {
  generateMeta,
  generateLinks,
  SITE_URL,
  getBreadcrumbSchema,
  serializeJsonLd,
} from "~/lib/seo";
import { formatDuration } from "~/lib/youtube";

export const Route = createFileRoute("/tutorials/$courseSlug/")({
  component: CourseOverviewPage,
  loader: async ({ params }) => {
    // TODO: Fetch from database
    const course = getMockCourse(params.courseSlug);
    if (!course) {
      throw new Error("Course not found");
    }
    return { course };
  },
  head: ({ loaderData }) => {
    const course = loaderData?.course;
    const title = course?.title ?? "Course";
    const description = course?.description ?? "";

    return {
      meta: generateMeta({
        title,
        description,
        path: `/tutorials/${course?.slug ?? ""}`,
        ogImage: course?.thumbnailUrl ?? `${SITE_URL}/og/tutorials.png`,
      }),
      links: generateLinks(`/tutorials/${course?.slug ?? ""}`),
      scripts: [
        {
          type: "application/ld+json",
          children: serializeJsonLd([
            getBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Tutorials", url: "/tutorials" },
              { name: title, url: `/tutorials/${course?.slug ?? ""}` },
            ]),
          ]),
        },
      ],
    };
  },
});

interface MockSection {
  id: string;
  title: string;
  lessons: MockLesson[];
}

interface MockLesson {
  id: string;
  slug: string;
  title: string;
  durationSeconds: number;
  requiresCoding: boolean;
}

interface MockCourse {
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  sections: MockSection[];
  totalDurationSeconds: number;
  lessonCount: number;
}

function CourseOverviewPage() {
  const { course } = Route.useLoaderData();

  return (
    <PageLayout>
      <header className="course-header">
        <Link to="/tutorials" className="breadcrumb-link">
          Tutorials
        </Link>
        <h1 className="course-title">{course.title}</h1>
        <p className="course-description">{course.description}</p>

        <div className="course-meta">
          <span className={`course-badge course-badge-${course.difficulty}`}>
            {course.difficulty}
          </span>
          <span className="course-stats">
            {course.lessonCount} lessons &middot; {formatDuration(course.totalDurationSeconds)}
          </span>
        </div>
      </header>

      <div className="course-content">
        {course.sections.map((section) => (
          <SectionGroup key={section.id} title={section.title}>
            {section.lessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                courseSlug={course.slug}
                slug={lesson.slug}
                title={lesson.title}
                durationSeconds={lesson.durationSeconds}
              />
            ))}
          </SectionGroup>
        ))}
      </div>

      {course.sections[0]?.lessons[0] && (
        <div className="course-cta">
          <Link
            to="/tutorials/$courseSlug/$lessonSlug"
            params={{
              courseSlug: course.slug,
              lessonSlug: course.sections[0].lessons[0].slug,
            }}
            className="btn btn-primary"
          >
            Start Course
          </Link>
        </div>
      )}
    </PageLayout>
  );
}

// Temporary mock data
function getMockCourse(slug: string): MockCourse | null {
  const courses: Record<string, MockCourse> = {
    "phoenix-liveview-fundamentals": {
      slug: "phoenix-liveview-fundamentals",
      title: "Phoenix LiveView Fundamentals",
      description:
        "Learn to build real-time web applications with Phoenix LiveView. We'll cover state management, events, and building interactive UIs without JavaScript.",
      thumbnailUrl: null,
      difficulty: "beginner",
      totalDurationSeconds: 10800,
      lessonCount: 12,
      sections: [
        {
          id: "1",
          title: "Getting Started",
          lessons: [
            {
              id: "l1",
              slug: "introduction",
              title: "Introduction to LiveView",
              durationSeconds: 420,
              requiresCoding: false,
            },
            {
              id: "l2",
              slug: "setup",
              title: "Project Setup",
              durationSeconds: 600,
              requiresCoding: true,
            },
          ],
        },
        {
          id: "2",
          title: "Building Components",
          lessons: [
            {
              id: "l3",
              slug: "live-components",
              title: "Live Components",
              durationSeconds: 900,
              requiresCoding: true,
            },
            {
              id: "l4",
              slug: "function-components",
              title: "Function Components",
              durationSeconds: 720,
              requiresCoding: true,
            },
          ],
        },
      ],
    },
  };

  return courses[slug] ?? null;
}
