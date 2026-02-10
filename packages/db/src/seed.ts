/**
 * Database seed script for ryanyogan.com
 * Run with: npx tsx src/seed.ts
 * 
 * Note: This requires the D1 database to be created and the environment
 * variables to be set. For local development, you can use wrangler d1 execute.
 */

import { nanoid } from "nanoid";

// Seed data for experiences
export const experiencesSeed = [
  {
    id: nanoid(),
    company: "Shopify",
    title: "Staff Engineer",
    location: "Remote",
    startDate: new Date("2019-06-01"),
    endDate: new Date("2024-03-01"),
    current: false,
    description: "Led merchant platform initiatives. Built real-time inventory systems serving millions of merchants. Grew and mentored engineering teams.",
    highlights: [
      "Architected real-time inventory sync system handling 10M+ events/day",
      "Led team of 8 engineers building merchant dashboard",
      "Reduced checkout latency by 40% through system optimizations",
      "Mentored 12 engineers across multiple teams",
    ],
    technologies: ["Ruby", "Rails", "React", "GraphQL", "Kafka", "Redis"],
    order: 1,
  },
  {
    id: nanoid(),
    company: "Netflix",
    title: "Senior Software Engineer",
    location: "Los Gatos, CA",
    startDate: new Date("2016-01-01"),
    endDate: new Date("2019-06-01"),
    current: false,
    description: "Data infrastructure and streaming pipelines. Recommendation systems handling billions of events. Cross-functional collaboration at scale.",
    highlights: [
      "Built data pipelines processing 500B+ events daily",
      "Contributed to recommendation engine improvements",
      "Developed internal tooling used by 200+ engineers",
    ],
    technologies: ["Java", "Scala", "Python", "Spark", "Kafka", "Cassandra"],
    order: 2,
  },
  {
    id: nanoid(),
    company: "Various Startups",
    title: "Founding Engineer → Engineering Lead",
    location: "San Francisco, CA",
    startDate: new Date("2008-01-01"),
    endDate: new Date("2016-01-01"),
    current: false,
    description: "Three successful acquisitions. Built products from zero to scale. Grew teams from 5 to 40+ engineers. Full-stack development across web and mobile.",
    highlights: [
      "Led engineering through 3 successful acquisitions",
      "Grew engineering team from 5 to 40+ engineers",
      "Built products from 0 to 1M+ users",
    ],
    technologies: ["JavaScript", "Python", "Ruby", "PostgreSQL", "AWS"],
    order: 3,
  },
];

// Seed data for projects
export const projectsSeed = [
  {
    id: nanoid(),
    name: "Yogan Hockey",
    slug: "yogan-hockey",
    description: "Real-time NHL stats app built with Phoenix LiveView. Uses ETS for incremental static regeneration, outperforming Next.js in speed tests.",
    longDescription: "A comprehensive NHL statistics application featuring real-time game updates, player stats, and team standings. Built to demonstrate the power of Elixir and Phoenix LiveView for real-time web applications.",
    url: "https://yogan-hockey.fly.dev",
    githubUrl: "https://github.com/ryanyogan/yogan-hockey",
    featured: true,
    stars: 24,
    forks: 3,
    language: "Elixir",
    topics: ["elixir", "phoenix", "liveview", "nhl", "sports"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2025-02-01"),
  },
  {
    id: nanoid(),
    name: "10.yogan.dev",
    slug: "10-yogan-dev",
    description: "Westworld-themed Valentine's Day experience with immersive animations, custom cursors, and cinematic transitions.",
    longDescription: "A creative web experience celebrating 10 years with stunning visual design inspired by HBO's Westworld. Features custom cursor interactions, parallax scrolling, and GSAP-powered animations.",
    url: "https://10.yogan.dev",
    githubUrl: "https://github.com/ryanyogan/10-year",
    featured: true,
    stars: 12,
    forks: 1,
    language: "TypeScript",
    topics: ["react", "gsap", "animation", "design", "creative"],
    createdAt: new Date("2024-02-14"),
    updatedAt: new Date("2024-02-14"),
  },
  {
    id: nanoid(),
    name: "Ice Yeti",
    slug: "ice-yeti",
    description: "Hockey social network for players, coaches, and fans. Team management, game scheduling, and stats tracking.",
    longDescription: "A full-featured social platform for the hockey community. Includes team management, game scheduling, player statistics, and social features for connecting players and fans.",
    url: "https://slax.yogan.dev",
    githubUrl: null,
    featured: true,
    stars: 0,
    forks: 0,
    language: "Elixir",
    topics: ["elixir", "phoenix", "liveview", "hockey", "social"],
    createdAt: new Date("2023-09-01"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    id: nanoid(),
    name: "ryanyogan.com",
    slug: "ryanyogan-com",
    description: "AI-powered personal website with TanStack Start on Cloudflare Workers.",
    longDescription: "This site! Built with TanStack Start, Cloudflare Workers, D1, and Workers AI. Features AI-generated content, automatic GitHub sync, and a custom CMS.",
    url: "https://ryanyogan.com",
    githubUrl: "https://github.com/ryanyogan/ryanyogan.com",
    featured: false,
    stars: 5,
    forks: 0,
    language: "TypeScript",
    topics: ["tanstack", "cloudflare", "ai", "react", "personal-site"],
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-10"),
  },
  {
    id: nanoid(),
    name: "Embedded Training System",
    slug: "embedded-training",
    description: "Ice training equipment with embedded sensors. Hardware meets software for athlete performance tracking.",
    longDescription: "Custom embedded system for ice hockey training equipment. Combines Rust firmware with sensor integration for real-time performance tracking and analysis.",
    url: null,
    githubUrl: null,
    featured: false,
    stars: 0,
    forks: 0,
    language: "Rust",
    topics: ["embedded", "rust", "iot", "hardware", "sports"],
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2025-01-01"),
  },
];

// Seed data for skills
export const skillsSeed = [
  // Languages
  { id: nanoid(), name: "TypeScript", category: "language" as const, proficiency: 95, yearsExperience: 8, featured: true },
  { id: nanoid(), name: "Elixir", category: "language" as const, proficiency: 85, yearsExperience: 4, featured: true },
  { id: nanoid(), name: "Go", category: "language" as const, proficiency: 75, yearsExperience: 5, featured: true },
  { id: nanoid(), name: "Ruby", category: "language" as const, proficiency: 90, yearsExperience: 12, featured: false },
  { id: nanoid(), name: "Rust", category: "language" as const, proficiency: 60, yearsExperience: 2, featured: true },
  { id: nanoid(), name: "Python", category: "language" as const, proficiency: 80, yearsExperience: 10, featured: false },
  
  // Frontend
  { id: nanoid(), name: "React", category: "frontend" as const, proficiency: 95, yearsExperience: 8, featured: true },
  { id: nanoid(), name: "TanStack", category: "frontend" as const, proficiency: 85, yearsExperience: 2, featured: true },
  { id: nanoid(), name: "Next.js", category: "frontend" as const, proficiency: 90, yearsExperience: 5, featured: false },
  { id: nanoid(), name: "Phoenix LiveView", category: "frontend" as const, proficiency: 85, yearsExperience: 3, featured: true },
  
  // Backend
  { id: nanoid(), name: "Node.js", category: "backend" as const, proficiency: 90, yearsExperience: 10, featured: true },
  { id: nanoid(), name: "Phoenix", category: "backend" as const, proficiency: 85, yearsExperience: 4, featured: true },
  { id: nanoid(), name: "Rails", category: "backend" as const, proficiency: 90, yearsExperience: 12, featured: false },
  { id: nanoid(), name: "GraphQL", category: "backend" as const, proficiency: 85, yearsExperience: 6, featured: true },
  
  // Database
  { id: nanoid(), name: "PostgreSQL", category: "database" as const, proficiency: 90, yearsExperience: 12, featured: true },
  { id: nanoid(), name: "Redis", category: "database" as const, proficiency: 85, yearsExperience: 8, featured: false },
  { id: nanoid(), name: "SQLite/D1", category: "database" as const, proficiency: 80, yearsExperience: 3, featured: true },
  
  // DevOps
  { id: nanoid(), name: "Cloudflare", category: "devops" as const, proficiency: 85, yearsExperience: 3, featured: true },
  { id: nanoid(), name: "AWS", category: "devops" as const, proficiency: 80, yearsExperience: 10, featured: false },
  { id: nanoid(), name: "Docker", category: "devops" as const, proficiency: 85, yearsExperience: 8, featured: false },
  { id: nanoid(), name: "Kubernetes", category: "devops" as const, proficiency: 70, yearsExperience: 5, featured: false },
  
  // Leadership
  { id: nanoid(), name: "Team Building", category: "leadership" as const, proficiency: 90, yearsExperience: 10, featured: true },
  { id: nanoid(), name: "Architecture", category: "leadership" as const, proficiency: 90, yearsExperience: 12, featured: true },
  { id: nanoid(), name: "Mentoring", category: "leadership" as const, proficiency: 85, yearsExperience: 8, featured: false },
];

// Seed data for posts
export const postsSeed = [
  {
    id: nanoid(),
    slug: "the-rule-of-three",
    title: "The Rule of Three",
    excerpt: "Comparing React Router v7, TanStack Start, and Next.js. What I learned building the same app three times.",
    content: `# The Rule of Three

When evaluating new frameworks, I like to build the same application three different ways. It's the only way to truly understand the trade-offs.

## The Contenders

1. **React Router v7** - The new Remix-powered version
2. **TanStack Start** - The rising full-stack React framework  
3. **Next.js 15** - The incumbent

## What I Built

A simple blog with:
- Server-side rendering
- Data fetching
- Form submissions
- Authentication

## Key Findings

### React Router v7
Feels like Remix with better ergonomics. The loader/action pattern is clean and predictable.

### TanStack Start
The most flexible option. Great DX with TypeScript. The router is phenomenal.

### Next.js 15
Still the most mature. App Router has improved significantly.

## Conclusion

Each has its place. For new projects in 2025, I'd reach for TanStack Start.
`,
    publishedAt: new Date("2025-02-01"),
    createdAt: new Date("2025-01-28"),
    updatedAt: new Date("2025-02-01"),
    authorId: "ryan",
    featured: true,
    readTime: 8,
    views: 342,
    status: "published" as const,
  },
  {
    id: nanoid(),
    slug: "prisma-in-2025",
    title: "Why I Still Choose Prisma",
    excerpt: "Despite the alternatives, Prisma remains my go-to ORM. Here's why type safety and DX still win.",
    content: `# Why I Still Choose Prisma

Every few months, someone asks me why I still use Prisma when Drizzle exists.

## The Case for Prisma

1. **Schema-first design** - I think in data models, not in TypeScript
2. **Migrations that work** - Prisma Migrate is battle-tested
3. **Studio** - The GUI is genuinely useful
4. **Ecosystem** - Prisma Pulse, Accelerate, and more

## When I'd Choose Drizzle

- Edge runtime requirements
- Maximum type inference
- SQL-first teams

## Conclusion

Both are excellent. Prisma's DX still edges it out for me.
`,
    publishedAt: new Date("2025-01-15"),
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-15"),
    authorId: "ryan",
    featured: true,
    readTime: 6,
    views: 256,
    status: "published" as const,
  },
  {
    id: nanoid(),
    slug: "scaling-teams",
    title: "Scaling Engineering Teams",
    excerpt: "Lessons from growing an engineering organization from 5 to 40+ people. What worked, what didn't.",
    content: `# Scaling Engineering Teams

Growing a team from 5 to 40 engineers taught me hard lessons.

## What Worked

1. **Hire for culture add, not culture fit**
2. **Document everything early**
3. **Invest in developer experience**
4. **Regular 1:1s are non-negotiable**

## What Didn't Work

1. **Hiring too fast** - Quality suffered
2. **Ignoring technical debt** - It compounds
3. **Too many meetings** - Protect maker time

## The 5-15-40 Transitions

Each growth stage required different approaches:

- **5 engineers**: Everyone does everything
- **15 engineers**: Specialize into teams
- **40 engineers**: Need proper management layers

## Key Takeaway

Scaling is about systems, not heroics.
`,
    publishedAt: new Date("2024-12-20"),
    createdAt: new Date("2024-12-15"),
    updatedAt: new Date("2024-12-20"),
    authorId: "ryan",
    featured: true,
    readTime: 12,
    views: 189,
    status: "published" as const,
  },
  {
    id: nanoid(),
    slug: "ai-coding-assistants",
    title: "Living with AI Coding Assistants",
    excerpt: "How I use Cursor, Claude, and Copilot in my daily workflow. The good, the bad, and the surprising.",
    content: `# Living with AI Coding Assistants

AI has fundamentally changed how I write code.

## My Current Stack

- **Cursor** - Primary editor
- **Claude** - Complex reasoning
- **Copilot** - Quick completions

## What Works

1. **Boilerplate elimination** - Tests, types, docs
2. **Learning new codebases** - Ask questions
3. **Refactoring** - Pattern application

## What Doesn't

1. **Novel architecture** - AI suggests conventional approaches
2. **Performance optimization** - Still needs human intuition
3. **Security review** - Never fully trust AI here

## Surprising Benefits

The biggest win isn't code generation—it's rubber duck debugging at scale.

## Conclusion

AI makes good developers great. It doesn't make non-developers into developers.
`,
    publishedAt: new Date("2024-11-10"),
    createdAt: new Date("2024-11-05"),
    updatedAt: new Date("2024-11-10"),
    authorId: "ryan",
    featured: false,
    readTime: 10,
    views: 423,
    status: "published" as const,
  },
];

// Seed data for site stats
export const siteStatsSeed = [
  { id: nanoid(), type: "total_posts", value: 4, label: "Total Posts", description: "Published blog posts", updatedAt: new Date() },
  { id: nanoid(), type: "total_projects", value: 5, label: "Projects", description: "Featured projects", updatedAt: new Date() },
  { id: nanoid(), type: "github_stars", value: 41, label: "GitHub Stars", description: "Across all repositories", updatedAt: new Date() },
  { id: nanoid(), type: "years_experience", value: 15, label: "Years Experience", description: "Professional software development", updatedAt: new Date() },
];

console.log("Seed data ready for export.");
console.log("Experiences:", experiencesSeed.length);
console.log("Projects:", projectsSeed.length);
console.log("Skills:", skillsSeed.length);
console.log("Posts:", postsSeed.length);
console.log("Site Stats:", siteStatsSeed.length);
