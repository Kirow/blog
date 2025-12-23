## 1. Project Setup
- [x] 1.1 Initialize SvelteKit project with Bun.
- [x] 1.2 Install and configure `@sveltejs/adapter-static`.
- [x] 1.3 Configure `svelte.config.js` for SSG (prerendering).

## 2. Blog Core Implementation
- [x] 2.1 Install and configure `mdsvex` for Markdown support.
- [x] 2.2 Create a sample blog post in `www/src/posts/` (or similar) with frontmatter.
- [x] 2.3 Implement a utility to fetch and parse all blog posts.
- [x] 2.4 Create the blog index page (`/`) to list posts.
- [x] 2.5 Create the blog post layout/page (`/blog/[slug]`).
- [x] 2.6 Implement tag filtering support.

## 3. Search Implementation
- [x] 3.1 Implement a search input component.
- [x] 3.2 Add logic to filter the post list by title and tags based on input.
- [x] 3.3 Integrate the search/filter component into the blog index page.

## 4. Deployment
- [x] 4.1 Implement local build and preview scripts (`bun run build`, `bun run preview`) to verify the static build locally.
- [x] 4.2 Create a GitHub Actions workflow (`.github/workflows/deploy.yml`) to build and deploy to GitHub Pages.
- [x] 4.3 Verify deployment on GitHub Pages.
