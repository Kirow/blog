# Project Context

## Purpose
A personal static blog with the following goals:
- Publish blog posts authored in Markdown with frontmatter metadata (title, date, tags)
- Support embedded tags for categorization
- Provide fast client-side search functionality
- Deploy to GitHub Pages
- **Phase 2**: Add Firebase integration for login, chat messages, and favorites

## Tech Stack
- **Framework**: SvelteKit with static adapter ([adapter-static](https://svelte.dev/docs/kit/adapter-static))
- **Language**: TypeScript (strict mode)
- **Runtime**: Bun (preferred over npm/node) - [Bun docs](https://bun.com/docs/guides/runtime/cicd)
- **Hosting**: GitHub Pages (static deployment)
- **Future**: Firebase (authentication, Firestore for chat/favorites)

## Project Conventions

### Code Style
- TypeScript with strict mode enabled
- ESNext target and module system
- Use `verbatimModuleSyntax` for explicit import/export types
- Prefer explicit types over inference for function signatures
- Use camelCase for variables/functions, PascalCase for components/types

### Architecture Patterns
- Static site generation (SSG) - no server-side rendering at runtime
- Markdown files as content source with frontmatter for metadata
- Component-based UI with Svelte
- Client-side search (no backend search service)

### Testing Strategy
[TODO: Define testing approach - consider Vitest for unit tests, Playwright for E2E]

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

## External Dependencies
- **GitHub Pages**: Static hosting and deployment
- **Firebase** (Phase 2):
  - Authentication for user login
  - Firestore for chat messages and user favorites
