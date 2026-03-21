# Site Overhaul Specification

## Executive Summary

Comprehensive overhaul of ryanyogan.com to improve UI consistency, code quality, testing, and add a tutorial/LMS system with YouTube integration.

**Branch:** `feat/site-overhaul`  
**Total Tasks:** 40  
**Estimated Duration:** 2-3 weeks  

---

## Current Tech Stack

- **Framework:** TanStack Start (v1.159.0) - Full-stack React meta-framework
- **React:** v19
- **TypeScript:** v5.7 (strict mode)
- **Build:** Vite 8
- **Deployment:** Cloudflare Workers
- **Database:** Cloudflare D1 (SQLite) with Drizzle ORM
- **Storage:** Cloudflare R2
- **Styling:** Tailwind CSS 4 + Custom CSS Design System (~2800 lines)
- **Content:** MDX for blog posts, YAML for project metadata
- **Auth:** Better Auth with GitHub OAuth
- **Fonts:** Inter Variable, Space Grotesk Variable, JetBrains Mono

---

## Phase 1: Testing Infrastructure

### Goals
- Set up Vitest with TanStack Router support
- Achieve ~60% coverage on critical lib functions

### Dependencies to Add
```json
{
  "devDependencies": {
    "vitest": "^4.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/dom": "^10.0.0",
    "@vitest/coverage-v8": "^4.0.0",
    "happy-dom": "^20.0.0"
  }
}
```

### Files to Create
- `packages/web/vitest.config.ts` - Vitest configuration
- `packages/web/test/setup.ts` - Global test setup
- `packages/web/test/mocks/virtual-content.ts` - Mock for virtual:content module
- `packages/web/test/utils/router.ts` - TanStack Router test helpers

### Critical Paths to Test
| File | Functions | Priority |
|------|-----------|----------|
| `lib/content.ts` | `getAllPosts`, `getFeaturedProjects`, `getPostBySlug` | High |
| `lib/search.ts` | `searchWithTextMatching`, scoring algorithm | High |
| `lib/seo.ts` | `generateMeta`, JSON-LD schema generation | Medium |
| `@ryanyogan/shared` | `formatDate`, `slugify`, `truncate` | Medium |

---

## Phase 2: Code Cleanup

### Unused Code to Remove
| File | Reason |
|------|--------|
| `components/ui/status-badge.tsx` | Never imported |
| `components/ui/project-card.tsx` | `ProjectCard`, `ProjectsCarousel` unused |
| `hooks/use-gsap.ts` | All hooks unused (`useFadeUp`, `useTextReveal`, etc.) |

### Duplications to Fix
1. **Search function** - Duplicate in `routes/api/search.ts:56-108`, import from `lib/search.ts`
2. **Date formatting** - 5 implementations, consolidate to `@ryanyogan/shared/formatDate`
3. **Social links** - Hardcoded in 4 places, create `lib/constants.ts`
4. **Email addresses** - `ryan@ryanyogan.com` vs `ryan.yogan@hey.com`

### Large Files to Refactor
| File | Lines | Action |
|------|-------|--------|
| `work.tsx` | 471 | Extract `workHistory` to `data/work-history.ts` |
| `projects/$slug.tsx` | 212 | Extract `renderMarkdown` to `lib/markdown.ts` |
| `command-palette.tsx` | 362 | Extract `useDebounce` to `hooks/useDebounce.ts` |

### Constants to Centralize (`lib/constants.ts`)
```typescript
export const SITE = {
  name: "Ryan Yogan",
  description: "Engineering leader...",
  url: "https://ryanyogan.com",
  email: "ryan@ryanyogan.com",
} as const;

export const SOCIAL_LINKS = {
  github: "https://github.com/ryanyogan",
  twitter: "https://twitter.com/ryanyogan",
  linkedin: "https://linkedin.com/in/ryanyogan",
  youtube: "https://www.youtube.com/@RyanYogan",
} as const;
```

---

## Phase 3: Design System Overhaul

### New CSS Tokens to Add

```css
@theme {
  /* Spacing Scale (4px base) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.5rem;    /* 24px */
  --space-6: 2rem;      /* 32px */
  --space-7: 3rem;      /* 48px */
  --space-8: 4rem;      /* 64px */
  --space-9: 6rem;      /* 96px */

  /* Typography Scale */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;

  /* Line Heights */
  --leading-tight: 1.1;
  --leading-snug: 1.3;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Layout Widths */
  --max-width-narrow: 560px;
  --max-width: 720px;
  --max-width-wide: 960px;
  --max-width-full: 1200px;

  /* Borders */
  --border-width: 1px;
  --border-radius-sm: 4px;
  --border-radius: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  --border-radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

### Full-Height Pages Fix
```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height for mobile */
}

.page-content {
  flex: 1;
}
```

### Responsive Breakpoints
| Name | Width | Current | Action |
|------|-------|---------|--------|
| sm | 480px | Yes | Keep |
| md | 640px | Yes | Keep |
| lg | 768px | No | Add |
| xl | 1024px | No | Add |
| 2xl | 1280px | No | Add |

### Container Variants
```css
.container { --container-max: var(--max-width); }
.container-narrow { --container-max: var(--max-width-narrow); }
.container-wide { --container-max: var(--max-width-wide); }
.container-full { --container-max: var(--max-width-full); }
```

---

## Phase 4: Database Schema (Tutorials)

### New Tables (Drizzle ORM + D1)

```typescript
// packages/db/src/schema/tutorials.ts

export const courses = sqliteTable("courses", {
  id: text("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  youtubePlaylistId: text("youtube_playlist_id"),
  status: text("status", { enum: ["draft", "published"] }).default("draft"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const sections = sqliteTable("sections", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  orderIndex: integer("order_index").notNull(),
});

export const lessons = sqliteTable("lessons", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => courses.id),
  sectionId: text("section_id").references(() => sections.id),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  contentType: text("content_type", { enum: ["video", "text", "hybrid"] }).notNull(),
  youtubeVideoId: text("youtube_video_id"),
  durationSeconds: integer("duration_seconds"),
  orderIndex: integer("order_index").notNull(),
  status: text("status", { enum: ["draft", "published"] }).default("draft"),
  requiresCoding: integer("requires_coding", { mode: "boolean" }).default(true),
  textContent: text("text_content"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  uniqueSlug: unique().on(table.courseId, table.slug),
}));

export const transcripts = sqliteTable("transcripts", {
  id: text("id").primaryKey(),
  lessonId: text("lesson_id").notNull().references(() => lessons.id),
  language: text("language").default("en"),
  content: text("content").notNull(),
  segments: text("segments"), // JSON: [{start, end, text}]
  source: text("source", { enum: ["youtube", "whisper", "manual"] }).default("youtube"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const lessonViews = sqliteTable("lesson_views", {
  id: text("id").primaryKey(),
  lessonId: text("lesson_id").notNull().references(() => lessons.id),
  viewedAt: text("viewed_at").default(sql`CURRENT_TIMESTAMP`),
});
```

---

## Phase 5: YouTube API Integration

### YouTube Channel
- URL: https://www.youtube.com/@RyanYogan
- API Key required (store in Cloudflare secrets)

### API Functions (`lib/youtube.ts`)
```typescript
interface YouTubeVideoDetails {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  durationSeconds: number;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
}

export async function getVideoDetails(videoId: string, apiKey: string): Promise<YouTubeVideoDetails>;
export async function getVideoStats(videoId: string, apiKey: string): Promise<{ viewCount: number; likeCount: number }>;
export function parseYouTubeUrl(url: string): { type: 'video' | 'playlist'; id: string } | null;
export function parseDuration(isoDuration: string): number; // PT4M13S -> 253
export function formatDuration(seconds: number): string; // 253 -> "4:13"
```

### Transcript Storage
- Transcripts stored in D1 (not fetched live)
- Source: YouTube Captions API or manual upload
- Format: Full text + timestamped segments (JSON)

---

## Phase 6: Tutorial Components

### Component Structure
```
components/tutorials/
├── CourseSidebar.tsx       # Left nav with sections/lessons
├── SectionGroup.tsx        # Section header + lesson list
├── LessonItem.tsx          # Individual lesson in sidebar
├── LessonProgress.tsx      # Checkmark/circle indicator
├── VideoPlayer.tsx         # YouTube embed with controls
├── TranscriptPanel.tsx     # Collapsible transcript
├── LessonNavigation.tsx    # Prev/Next buttons
├── JustWatchBadge.tsx      # "No coding required" pill
├── ResourcesList.tsx       # Links to GitHub, docs
├── CourseCard.tsx          # Card for course listing
└── LessonLayout.tsx        # Full lesson page layout
```

### Layout Reference (Backpine-inspired)
```
┌─────────────────────────────────────────────────────────────────────┐
│ Nav                                                                  │
├──────────────────┬──────────────────────────────────────────────────┤
│                  │                                                   │
│  Course Title    │  Lesson Title          ┌─────────────┐           │
│                  │  Section Name          │ JUST WATCH  │           │
│  ───────────────│                         └─────────────┘           │
│                  │  ┌────────────────────────────────────┐          │
│  SECTION 1       │  │      YouTube Video Player          │          │
│  ✓ Lesson (4:15) │  │                                    │          │
│  ○ Lesson (7:31) │  └────────────────────────────────────┘          │
│  ○ Lesson (5:50) │                                                   │
│                  │  ┌────────────────────────────────────┐          │
│  SECTION 2       │  │ Transcript (collapsible)           │          │
│  ○ Lesson        │  └────────────────────────────────────┘          │
│  ○ Lesson        │                                                   │
│                  │  ┌──────────┐  ┌─────────────────────┐           │
│  ───────────────│  │ Previous │  │        Next →       │           │
│  👤 Ryan Yogan   │  └──────────┘  └─────────────────────┘           │
│                  │                                                   │
│                  │  Resources                                        │
│                  │  • GitHub Repository                              │
└──────────────────┴──────────────────────────────────────────────────┤
│ Footer                                                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 7: Tutorial Routes

### Route Structure
```
routes/tutorials/
├── index.tsx                    # /tutorials - All courses
├── route.tsx                    # Layout wrapper
└── $courseSlug/
    ├── index.tsx                # /tutorials/[course] - Course overview
    └── $lessonSlug.tsx          # /tutorials/[course]/[lesson] - Lesson page
```

### Route Loaders
```typescript
// /tutorials - List all published courses
loader: () => getCourses({ status: "published" })

// /tutorials/$courseSlug - Course with lessons
loader: ({ params }) => getCourseWithLessons(params.courseSlug)

// /tutorials/$courseSlug/$lessonSlug - Full lesson data
loader: ({ params }) => getLesson(params.courseSlug, params.lessonSlug)
```

---

## Phase 8: Admin Interface

### Authentication
- Enable Better Auth in production
- Restrict to admin email: `ryan@ryanyogan.com`

### Admin Routes
```
routes/admin/
├── tutorials/
│   ├── index.tsx        # Course list + create
│   ├── $courseId.tsx    # Edit course, manage sections/lessons
│   └── lessons/
│       └── $lessonId.tsx  # Edit lesson, manage transcript
```

### Features
- Course CRUD (title, slug, description, thumbnail, YouTube playlist)
- Section management (add, reorder, delete)
- Lesson CRUD with:
  - YouTube URL input (auto-fetch video details)
  - Text content editor for text/hybrid lessons
  - Transcript fetch/edit
  - Drag-and-drop reordering
- Publish/unpublish courses and lessons

---

## Files to Create

| Action | File | Description |
|--------|------|-------------|
| Create | `packages/web/vitest.config.ts` | Vitest configuration |
| Create | `packages/web/test/setup.ts` | Test setup file |
| Create | `packages/web/test/mocks/virtual-content.ts` | Virtual module mock |
| Create | `packages/web/test/utils/router.ts` | Router test helpers |
| Create | `packages/web/src/lib/constants.ts` | Social links, email, site metadata |
| Create | `packages/web/src/lib/markdown.ts` | Extract markdown renderer |
| Create | `packages/web/src/lib/youtube.ts` | YouTube API integration |
| Create | `packages/web/src/hooks/useDebounce.ts` | Extracted debounce hook |
| Create | `packages/web/src/data/work-history.ts` | Work experience data |
| Create | `packages/db/src/schema/tutorials.ts` | Tutorial database schema |
| Create | `packages/web/src/components/tutorials/*` | All tutorial components |
| Create | `packages/web/src/routes/tutorials/*` | Tutorial routes |
| Modify | `packages/web/src/styles/app.css` | Add design tokens |
| Modify | `packages/web/package.json` | Add test script |
| Modify | `packages/db/src/schema/index.ts` | Export tutorial schema |
| Delete | `packages/web/src/components/ui/status-badge.tsx` | Unused |
| Delete | `packages/web/src/components/ui/project-card.tsx` | Unused |
| Delete | `packages/web/src/hooks/use-gsap.ts` | Unused animations |

---

## Environment Variables Required

```bash
# YouTube API (for video stats, transcripts)
YOUTUBE_API_KEY=your_api_key_here
```

---

## Task Checklist

### Phase 1: Testing
- [ ] Set up Vitest with TanStack Router support
- [ ] Write tests for lib/content.ts
- [ ] Write tests for lib/search.ts
- [ ] Write tests for lib/seo.ts
- [ ] Write tests for @ryanyogan/shared

### Phase 2: Code Cleanup
- [ ] Remove unused components
- [ ] Fix search duplication
- [ ] Create lib/constants.ts
- [ ] Consolidate date formatting
- [ ] Extract work history data
- [ ] Extract markdown renderer
- [ ] Extract useDebounce hook

### Phase 3: Design System
- [ ] Add spacing tokens
- [ ] Add typography tokens
- [ ] Add max-width variants
- [ ] Fix full-height pages
- [ ] Add responsive breakpoints
- [ ] Remove duplicate Container component
- [ ] Split app.css into modules (optional)

### Phase 4: Database
- [ ] Create tutorial schema
- [ ] Run migrations
- [ ] Create YouTube API lib
- [ ] Create transcript handling

### Phase 5: Tutorial Components
- [ ] CourseSidebar
- [ ] LessonProgress
- [ ] VideoPlayer
- [ ] TranscriptPanel
- [ ] LessonNavigation
- [ ] JustWatchBadge

### Phase 6: Tutorial Routes
- [ ] /tutorials index
- [ ] /tutorials/$courseSlug
- [ ] /tutorials/$courseSlug/$lessonSlug

### Phase 7: Admin
- [ ] Enable auth in production
- [ ] Course management
- [ ] Lesson CRUD
- [ ] YouTube import

### Phase 8: Polish
- [ ] Consistent borders/spacing
- [ ] Full viewport height everywhere
- [ ] Responsive testing
