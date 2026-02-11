# ryanyogan.com

A modern personal website built with TanStack Start, Tailwind CSS v4, and deployed on Cloudflare.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) - Utility-first CSS
- **Animations**: [GSAP](https://gsap.com) - Professional-grade animations
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) - SQLite at the edge
- **ORM**: [Drizzle](https://orm.drizzle.team/) - TypeScript ORM
- **Vector DB**: [Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/) - Semantic search
- **AI**: [Workers AI](https://developers.cloudflare.com/workers-ai/) - AI at the edge
- **Hosting**: [Cloudflare Workers](https://workers.cloudflare.com/) - Edge computing

## Project Structure

```
ryanyogan.com/
├── packages/
│   ├── web/                 # TanStack Start app (main website)
│   ├── db/                  # Drizzle schemas and migrations
│   ├── ai-worker/           # Cloudflare Worker for AI/cron jobs
│   ├── shared/              # Shared types and utilities
│   └── config/              # Shared configurations
├── turbo.json               # Turborepo configuration
└── pnpm-workspace.yaml      # pnpm workspace config
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Cloudflare account
- Wrangler CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/ryanyogan/ryanyogan.com.git
cd ryanyogan.com

# Install dependencies
pnpm install

# Set up environment variables
cp packages/web/.dev.vars.example packages/web/.dev.vars
# Edit .dev.vars with your values
```

### Development

```bash
# Start development server
pnpm dev

# Run type checking
pnpm typecheck

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Database Setup

```bash
# Create D1 database
wrangler d1 create ryanyogan-db

# Generate migrations
pnpm db:generate

# Apply migrations (local)
wrangler d1 execute ryanyogan-db --local --file=packages/db/migrations/0001_initial.sql

# Apply migrations (production)
wrangler d1 execute ryanyogan-db --remote --file=packages/db/migrations/0001_initial.sql
```

### Deployment

```bash
# Deploy web app
pnpm --filter @ryanyogan/web deploy

# Deploy AI worker
pnpm --filter @ryanyogan/ai-worker deploy
```

## Features

### Current

- [x] Responsive design with light/dark mode
- [x] GSAP scroll animations
- [x] Blog with markdown support
- [x] Project showcase
- [x] Contact form
- [x] SEO optimized

### Planned

- [ ] AI-powered weekly digests
- [ ] GitHub activity integration
- [ ] RAG-powered search
- [ ] Dynamic AI resume
- [ ] Newsletter subscriptions
- [ ] Admin dashboard

## Environment Variables

### Web App (`packages/web/.dev.vars`)

```
ENVIRONMENT=development
```

### AI Worker (`packages/ai-worker/.dev.vars`)

```
GITHUB_TOKEN=your_github_token
GITHUB_USERNAME=ryanyogan
ENVIRONMENT=development
```
