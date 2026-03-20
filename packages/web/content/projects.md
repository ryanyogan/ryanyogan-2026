---
projects:
  - slug: fizzy-do-mcp
    name: Fizzy Do MCP
    tagline: AI-native task management via MCP
    github: https://github.com/ryanyogan/fizzy-do-mcp
    url: https://fizzy.yogan.dev
    npm: https://www.npmjs.com/package/fizzy-do-mcp
    openSource: true
    featured: true
    readme: |
      # Fizzy Do MCP

      **AI-Native Task Management with Model Context Protocol**

      Connect your AI assistant to [Fizzy](https://fizzy.do) for intelligent, context-aware project management.

      ## What is Fizzy Do MCP?

      Fizzy Do MCP is a **free, open-source** [Model Context Protocol](https://modelcontextprotocol.io) server that enables AI assistants to interact with [Fizzy](https://fizzy.do), Basecamp's task management tool.

      - Read boards, cards, and project context
      - Create, update, and organize tasks through conversation
      - Move cards through workflows, add comments, and track progress
      - AI-powered project management tools for standups and reporting

      ## Quick Start

      Run the interactive setup wizard:

      ```bash
      npx fizzy-do-mcp configure
      ```

      The wizard detects your installed editors and configures them automatically.

      **Manual configuration:**

      ```json
      {
        "mcpServers": {
          "fizzy": {
            "command": "npx",
            "args": ["-y", "fizzy-do-mcp"],
            "env": {
              "FIZZY_TOKEN": "your-fizzy-api-token"
            }
          }
        }
      }
      ```

      ## Supported Editors

      - Claude Desktop
      - Claude Code
      - Cursor
      - Windsurf
      - Continue
      - OpenCode

      ## Available Tools

      Fizzy Do MCP provides **70+ tools** across these categories:

      - **Boards** — List, create, update, delete, publish/unpublish boards
      - **Cards** — Full card lifecycle - create, update, close, reopen, triage, postpone
      - **Comments** — Add, edit, delete comments on cards
      - **Columns** — Manage board columns for workflow stages
      - **Tags & Users** — List tags, list and lookup users
      - **Reactions** — Add emoji reactions to cards and comments
      - **Steps** — Checklist items within cards
      - **Notifications** — Read and manage notifications
      - **Webhooks** — Configure webhook integrations
      - **Project Manager** — AI-powered tools for standups, progress tracking, and sessions

      ## CLI Commands

      ```bash
      npx fizzy-do-mcp configure   # Interactive setup wizard
      npx fizzy-do-mcp whoami      # Check current identity
      npx fizzy-do-mcp status      # View configuration status
      npx fizzy-do-mcp logout      # Clear stored credentials
      npx fizzy-do-mcp             # Run as MCP server
      ```

      ## Development

      This project uses [Vite+](https://github.com/nicepkg/vp) (`vp`) as the unified toolchain.

      ```bash
      git clone https://github.com/ryanyogan/fizzy-do-mcp.git
      cd fizzy-do-mcp
      vp install
      vp check    # Format, lint, typecheck
      vp test     # Run tests
      vp build    # Build all packages
      ```

      ## Requirements

      - Node.js 20+
      - Fizzy Account
      - API Token from Fizzy account settings
      - MCP-Compatible Editor

      ## License

      MIT
    description: Open-source MCP server connecting AI assistants to Fizzy (Basecamp's task management). Features 70+ tools for boards, cards, comments, workflows, and AI-powered project management.
    tech:
      - TypeScript
      - MCP
      - Vite+
      - Node.js

  - slug: yogan_hockey
    name: Yogan Hockey
    tagline: Real-time NHL stats with Phoenix LiveView
    github: https://github.com/ryanyogan/yogan_hockey
    url: https://yogan-hockey.fly.dev
    openSource: true
    featured: true
    description: Real-time NHL stats dashboard built with Phoenix LiveView. Features live scores, player tracking, and ETS-powered caching for sub-second updates.
    tech:
      - Elixir
      - Phoenix LiveView
      - Gen Servers
      - ETS
      - Fly.io

  - slug: ryanyogan-com
    name: ryanyogan.com
    tagline: This site, TanStack Start on Cloudflare
    github: https://github.com/ryanyogan/ryanyogan-2026
    openSource: true
    featured: true
    description: This website. Built with TanStack Start, deployed on Cloudflare Workers with D1, R2, and Workers AI for RAG-powered search.
    tech:
      - TanStack Start
      - Cloudflare Workers
      - D1
      - Vectorize

  - slug: puck-pro
    name: Puck Pro
    tagline: AI hockey training with pose detection
    github: https://github.com/ryanyogan/puck_pro
    openSource: true
    featured: true
    description: AI-powered hockey training app with real-time pose detection. Uses MediaPipe in the browser at 30fps to analyze shots, track form, and provide Claude-powered coaching feedback. Eventually projecting onto the ice for live training.
    tech:
      - Elixir
      - Phoenix LiveView
      - MediaPipe
      - Claude Vision
      - Cloudflare R2

  - slug: ice-yeti
    name: Ice Yeti Training
    tagline: Connect skaters with trainers
    github: https://github.com/ryanyogan/ice-yeti
    url: https://slax.fly.dev
    openSource: true
    featured: true
    description: Hockey training platform connecting skaters with trainers. Features real-time chat, session booking, training programs, and virtual sessions. Built with Phoenix LiveView and PubSub for live updates.
    tech:
      - Elixir
      - Phoenix LiveView
      - PostgreSQL
      - PubSub
      - Fly.io

  - slug: ai-code-review
    name: AI Code Review Bot
    tagline: LLM-powered PR reviews
    github: https://github.com/ryanyogan/ai-code-review
    openSource: true
    featured: false
    description: GitHub Action that uses LLMs to review pull requests, suggest improvements, and catch common issues.
    tech:
      - TypeScript
      - OpenAI
      - GitHub Actions

  - slug: dotfiles
    name: Dotfiles
    tagline: Neovim, tmux, zsh config
    github: https://github.com/ryanyogan/dotfiles
    openSource: true
    featured: false
    description: My personal development environment configuration. Neovim, tmux, zsh, and more.
    tech:
      - Lua
      - Nix
      - Zsh
---
