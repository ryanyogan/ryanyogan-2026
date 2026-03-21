import { createFileRoute } from "@tanstack/react-router";
import {
  VideoPlayer,
  TranscriptPanel,
  LessonNavigation,
  JustWatchBadge,
  CourseSidebar,
  MinimalHeader,
} from "~/components/tutorials";
import {
  generateMeta,
  generateLinks,
  SITE_URL,
  getBreadcrumbSchema,
  serializeJsonLd,
} from "~/lib/seo";

export const Route = createFileRoute("/tutorials/$courseSlug/$lessonSlug")({
  component: LessonPage,
  loader: async ({ params }) => {
    // TODO: Fetch from database
    const lesson = getMockLesson(params.courseSlug, params.lessonSlug);
    if (!lesson) {
      throw new Error("Lesson not found");
    }
    return { lesson };
  },
  head: ({ loaderData }) => {
    const lesson = loaderData?.lesson;
    const title = lesson?.title ?? "Lesson";
    const courseTitle = lesson?.courseTitle ?? "Course";

    return {
      meta: generateMeta({
        title: `${title} - ${courseTitle}`,
        description: lesson?.description ?? "",
        path: `/tutorials/${lesson?.courseSlug ?? ""}/${lesson?.slug ?? ""}`,
        ogImage: lesson?.thumbnailUrl ?? `${SITE_URL}/og/tutorials.png`,
      }),
      links: generateLinks(`/tutorials/${lesson?.courseSlug ?? ""}/${lesson?.slug ?? ""}`),
      scripts: [
        {
          type: "application/ld+json",
          children: serializeJsonLd([
            getBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Tutorials", url: "/tutorials" },
              { name: courseTitle, url: `/tutorials/${lesson?.courseSlug ?? ""}` },
              {
                name: title,
                url: `/tutorials/${lesson?.courseSlug ?? ""}/${lesson?.slug ?? ""}`,
              },
            ]),
          ]),
        },
      ],
    };
  },
});

interface MockLesson {
  slug: string;
  title: string;
  description: string;
  courseSlug: string;
  courseTitle: string;
  sectionTitle: string;
  youtubeVideoId: string | null;
  thumbnailUrl: string | null;
  requiresCoding: boolean;
  transcript: string | null;
  previousLesson: { slug: string; title: string } | null;
  nextLesson: { slug: string; title: string } | null;
  sections: Array<{
    id: string;
    title: string;
    lessons: Array<{
      id: string;
      slug: string;
      title: string;
      durationSeconds: number | null;
    }>;
  }>;
}

function LessonPage() {
  const { lesson } = Route.useLoaderData();

  return (
    <div className="lesson-layout">
      <MinimalHeader
        courseTitle={lesson.courseTitle}
        courseSlug={lesson.courseSlug}
      />
      
      <div className="lesson-layout-body">
        <CourseSidebar
          courseSlug={lesson.courseSlug}
          courseTitle={lesson.courseTitle}
          sections={lesson.sections as never}
          unorganizedLessons={[]}
          currentLessonSlug={lesson.slug}
        />

        <main className="lesson-main">
          <div className="lesson-content">
            <header className="lesson-header">
              <div className="lesson-title-row">
                <h1 className="lesson-title">{lesson.title}</h1>
                {!lesson.requiresCoding && <JustWatchBadge />}
              </div>
              <p className="lesson-section">{lesson.sectionTitle}</p>
            </header>

            {lesson.youtubeVideoId && (
              <VideoPlayer videoId={lesson.youtubeVideoId} title={lesson.title} />
            )}

            {lesson.transcript && (
              <TranscriptPanel content={lesson.transcript} />
            )}

            <LessonNavigation
              courseSlug={lesson.courseSlug}
              previousLesson={lesson.previousLesson}
              nextLesson={lesson.nextLesson}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

// Temporary mock data
function getMockLesson(courseSlug: string, lessonSlug: string): MockLesson | null {
  if (courseSlug !== "phoenix-liveview-fundamentals") {
    return null;
  }

  const lessons: Record<string, MockLesson> = {
    introduction: {
      slug: "introduction",
      title: "Introduction to LiveView",
      description: "An overview of Phoenix LiveView and what we'll build in this course.",
      courseSlug: "phoenix-liveview-fundamentals",
      courseTitle: "Phoenix LiveView Fundamentals",
      sectionTitle: "Getting Started",
      youtubeVideoId: "dQw4w9WgXcQ", // Placeholder
      thumbnailUrl: null,
      requiresCoding: false,
      transcript:
        "Welcome to Phoenix LiveView Fundamentals. In this course, we'll learn how to build real-time web applications without writing JavaScript...",
      previousLesson: null,
      nextLesson: { slug: "setup", title: "Project Setup" },
      sections: [
        {
          id: "1",
          title: "Getting Started",
          lessons: [
            { id: "l1", slug: "introduction", title: "Introduction to LiveView", durationSeconds: 420 },
            { id: "l2", slug: "setup", title: "Project Setup", durationSeconds: 600 },
          ],
        },
        {
          id: "2",
          title: "Building Components",
          lessons: [
            { id: "l3", slug: "live-components", title: "Live Components", durationSeconds: 900 },
            { id: "l4", slug: "function-components", title: "Function Components", durationSeconds: 720 },
          ],
        },
      ],
    },
    setup: {
      slug: "setup",
      title: "Project Setup",
      description: "Setting up your Phoenix project with LiveView.",
      courseSlug: "phoenix-liveview-fundamentals",
      courseTitle: "Phoenix LiveView Fundamentals",
      sectionTitle: "Getting Started",
      youtubeVideoId: "dQw4w9WgXcQ",
      thumbnailUrl: null,
      requiresCoding: true,
      transcript: "Let's set up our Phoenix project. First, make sure you have Elixir installed...",
      previousLesson: { slug: "introduction", title: "Introduction to LiveView" },
      nextLesson: { slug: "live-components", title: "Live Components" },
      sections: [
        {
          id: "1",
          title: "Getting Started",
          lessons: [
            { id: "l1", slug: "introduction", title: "Introduction to LiveView", durationSeconds: 420 },
            { id: "l2", slug: "setup", title: "Project Setup", durationSeconds: 600 },
          ],
        },
        {
          id: "2",
          title: "Building Components",
          lessons: [
            { id: "l3", slug: "live-components", title: "Live Components", durationSeconds: 900 },
            { id: "l4", slug: "function-components", title: "Function Components", durationSeconds: 720 },
          ],
        },
      ],
    },
  };

  return lessons[lessonSlug] ?? null;
}
