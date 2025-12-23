# Design: Static Blog Architecture

## Context
The goal is to build a personal static blog hosted on GitHub Pages. The content is authored in Markdown. The site needs to be fast and support client-side search.

## Goals / Non-Goals
- **Goals**:
  - Fast loading times (SSG).
  - SEO friendly.
  - Easy content authoring (Markdown).
  - Automated deployment.
- **Non-Goals**:
  - Server-side rendering (SSR) at runtime.
  - Database integration (in this phase).
  - User authentication (in this phase).

## Decisions
- **Framework**: SvelteKit with `@sveltejs/adapter-static`.
  - *Rationale*: Provides excellent DX, performance, and SSG capabilities.
- **Markdown Processing**: `mdsvex`.
  - *Rationale*: Seamless integration with SvelteKit, allowing Svelte components inside Markdown if needed.
- **Search Strategy**: Simple client-side filtering.
  - *Rationale*: Full-text search is overkill for the initial phase. Filtering by title and tags covers the primary use cases and keeps the implementation simple and lightweight.
- **Runtime**: Bun.
  - *Rationale*: Faster package installation and script execution.
- **Hosting**: GitHub Pages.
  - *Rationale*: Free, reliable static hosting integrated with the source repository.

## Risks / Trade-offs
- **Build Time**: As the number of posts grows, SSG build time increases.
  - *Mitigation*: SvelteKit is generally fast. Incremental builds or caching can be explored later if needed.

## Migration Plan
- N/A (New project).
