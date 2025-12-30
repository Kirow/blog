# Project Context

## Purpose
A personal static blog with the following goals:
- Publish blog posts authored in Markdown with frontmatter metadata (title, date, tags)
- Support embedded tags for categorization
- Provide fast client-side search functionality
- Deploy to GitHub Pages
- **Phase 2**: Add Firebase integration for login, chat messages, and favorites

## Tech Stack
- **Framework**: SvelteKit 2 with static adapter ([adapter-static](https://svelte.dev/docs/kit/adapter-static))
- **UI Library**: Svelte 5 (uses runes, snippets, and new reactivity model)
- **Styling**: Tailwind CSS v4
- **Markdown**: mdsvex for .md/.svx file processing
- **Language**: TypeScript 5 (strict mode)
- **Build Tool**: Vite 7 (via @sveltejs/vite-plugin-svelte)
- **Runtime**: Bun (preferred over npm/node) - [Bun docs](https://bun.sh/docs)
- **Hosting**: GitHub Pages (static deployment, base path: `/blog`)
- **Future**: Firebase (authentication, Firestore for chat/favorites)

## Project Structure
```
blog/
├── www/                    # SvelteKit application
│   ├── src/
│   │   ├── lib/           # Shared components and utilities
│   │   ├── posts/         # Markdown blog posts
│   │   └── routes/        # SvelteKit routes
│   ├── static/            # Static assets
│   ├── build/             # Production build output
│   └── package.json       # Dependencies
├── openspec/              # Specifications and change proposals
└── AGENTS.md              # AI assistant instructions
```

## Project Conventions

### Code Style
- TypeScript with strict mode enabled
- ESNext target and module system
- Use `verbatimModuleSyntax` for explicit import/export types
- Prefer explicit types over inference for function signatures
- Use camelCase for variables/functions, PascalCase for components/types

### Svelte 5 Patterns
Use Svelte 5 runes and patterns (NOT Svelte 4 syntax):
- `$props()` for component props (NOT `export let`)
- `$state()` for reactive state
- `$derived()` for computed values (NOT `$:` reactive statements)
- `$effect()` for side effects (NOT `$:` with side effects)
- Snippets for reusable template blocks

### Architecture Patterns
- Static site generation (SSG) - no server-side rendering at runtime
- Markdown files as content source with frontmatter for metadata
- Component-based UI with Svelte
- Client-side search (no backend search service)

### Testing Strategy
[TODO: Define testing approach - consider bun:test for unit tests, Playwright for E2E]

### Git Workflow
- Deploy to GitHub Pages via GitHub Actions
- Use Bun in CI/CD pipelines

## Domain Context
- **Posts**: Markdown files with YAML frontmatter containing `title`, `date`, and `tags`
- **Tags**: Used for categorization and filtering; embedded within posts
- **Search**: Client-side full-text search across post content and metadata

## Important Constraints
- Must be fully static (no Node.js server at runtime)
- Use Bun instead of npm for package management and scripts
- GitHub Pages hosting limitations (static files only, no server functions)
- Base path is `/blog` in production (empty in development)

## External Dependencies
- **GitHub Pages**: Static hosting and deployment
- **Firebase** (Phase 2):
  - Authentication for user login
  - Firestore for chat messages and user favorites
