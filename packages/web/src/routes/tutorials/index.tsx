import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "~/components/layout";
import { CourseCard } from "~/components/tutorials";
import {
  generateMeta,
  generateLinks,
  SITE_URL,
  getBreadcrumbSchema,
  serializeJsonLd,
} from "~/lib/seo";

const TUTORIALS_DESCRIPTION =
  "Video tutorials on Elixir, Phoenix, React, and building production applications.";

export const Route = createFileRoute("/tutorials/")({
  component: TutorialsPage,
  loader: async () => {
    // TODO: Fetch from database
    // For now, return placeholder data
    const courses = getMockCourses();
    return { courses };
  },
  head: () => ({
    meta: generateMeta({
      title: "Tutorials",
      description: TUTORIALS_DESCRIPTION,
      path: "/tutorials",
      ogImage: `${SITE_URL}/og/tutorials.png`,
      keywords: [
        "Ryan Yogan",
        "tutorials",
        "video courses",
        "Elixir",
        "Phoenix",
        "LiveView",
        "React",
        "TypeScript",
      ],
    }),
    links: generateLinks("/tutorials"),
    scripts: [
      {
        type: "application/ld+json",
        children: serializeJsonLd([
          getBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Tutorials", url: "/tutorials" },
          ]),
        ]),
      },
    ],
  }),
});

interface MockCourse {
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  lessonCount: number;
}

function TutorialsPage() {
  const { courses } = Route.useLoaderData();

  return (
    <PageLayout>
      <header className="section-header-with-description">
        <h2 className="section-header">Tutorials</h2>
        <p className="page-description">{TUTORIALS_DESCRIPTION}</p>
      </header>

      {courses.length === 0 ? (
        <div className="empty-state">
          <p>No tutorials yet. Check back soon!</p>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard
              key={course.slug}
              slug={course.slug}
              title={course.title}
              description={course.description}
              thumbnailUrl={course.thumbnailUrl}
              difficulty={course.difficulty}
              estimatedMinutes={course.estimatedMinutes}
              lessonCount={course.lessonCount}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

// Temporary mock data - will be replaced with database queries
function getMockCourses(): MockCourse[] {
  return [
    {
      slug: "phoenix-liveview-fundamentals",
      title: "Phoenix LiveView Fundamentals",
      description:
        "Learn to build real-time web applications with Phoenix LiveView. We'll cover state management, events, and building interactive UIs without JavaScript.",
      thumbnailUrl: null,
      difficulty: "beginner",
      estimatedMinutes: 180,
      lessonCount: 12,
    },
    {
      slug: "building-a-chat-app-with-elixir",
      title: "Building a Chat App with Elixir",
      description:
        "From zero to production: build a real-time chat application using Elixir, Phoenix Channels, and LiveView. Includes deployment to Fly.io.",
      thumbnailUrl: null,
      difficulty: "intermediate",
      estimatedMinutes: 240,
      lessonCount: 16,
    },
  ];
}
