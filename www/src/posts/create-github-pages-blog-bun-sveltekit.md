---
title: Create a GitHub Pages Blog with Bun and SvelteKit
date: '2025-12-23'
tags:
  - sveltekit
  - bun
  - github-pages
  - tutorial
---

# Create a GitHub Pages Blog with Bun and SvelteKit

In this guide, we'll create a fast, modern blog using SvelteKit, Bun, and GitHub Pages. This combination gives you an excellent developer experience with lightning-fast builds and deployments.

## Prerequisites

- A GitHub account
- Bun installed on your machine
- Basic knowledge of JavaScript/TypeScript

## Step 1: Create a SvelteKit Project

Start by creating a new SvelteKit project:

```bash
bun create svelte@latest my-blog
```

Select the following options:
- Which Svelte app template: **Skeleton project**
- Add type checking: **Yes, using TypeScript**
- Select additional options: **None**

Navigate to the project directory:

```bash
cd my-blog
```

## Step 2: Install the Static Adapter

To deploy to GitHub Pages, we need the static adapter. Install it with Bun:

```bash
bun add -D @sveltejs/adapter-static
```

## Step 3: Configure SvelteKit

Update your `svelte.config.js` to use the static adapter:

```javascript
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH ?? '/your-repo-name'
		}
	}
};

export default config;
```

The `BASE_PATH` setting is crucial for GitHub Pages. If your repository is named `my-blog`, your site will be served from `https://username.github.io/my-blog/` instead of the root domain.

## Step 4: Enable Prerendering

Add the `prerender` option to your root layout (`src/routes/+layout.ts`):

```typescript
export const prerender = true;
```

This tells SvelteKit to pre-render all pages as static HTML, which is required for GitHub Pages.

## Step 5: Create GitHub Actions Workflow

Create a GitHub Actions workflow at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Build
        env:
          BASE_PATH: '/${{ github.event.repository.name }}'
        run: bun run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: build

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

This workflow:
- Sets up Bun using the official `setup-bun` action
- Installs dependencies and builds your site
- Uploads the build artifacts
- Deploys to GitHub Pages

## Step 6: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Build and deployment**, set:
   - **Source**: GitHub Actions
4. GitHub will use your workflow file to deploy automatically

## Step 7: Add Blog Content

Create a simple blog structure. Here's an example page at `src/routes/+page.svelte`:

```svelte
<script lang="ts">
  import { posts } from '$lib/posts';
</script>

<h1>My Blog</h1>

<ul>
  {#each posts as post}
    <li>
      <a href="/posts/{post.slug}">{post.title}</a>
    </li>
  {/each}
</ul>
```

## Step 8: Push and Deploy

Commit your changes and push to GitHub:

```bash
git add .
git commit -m "Initial blog setup"
git push origin main
```

GitHub Actions will automatically build and deploy your site. Once complete, your blog will be available at `https://your-username.github.io/your-repo-name/`.

## Project Structure

Here's the reference project structure for this blog setup:

```
www/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── app.html
│   ├── app.d.ts
│   ├── lib/
│   │   ├── assets/
│   │   │   └── favicon.svg
│   │   ├── index.ts
│   │   └── posts.ts
│   ├── posts/
│   │   ├── create-github-pages-blog-bun-sveltekit.md
│   │   └── first-post.md
│   └── routes/
│       ├── +layout.svelte
│       ├── +layout.ts
│       ├── +page.server.ts
│       ├── +page.svelte
│       └── posts/
│           └── [slug]/
│               ├── +page.svelte
│               └── +page.ts
├── static/
│   ├── .nojekyll
│   └── robots.txt
├── .gitignore
├── .npmrc
├── bun.lock
├── package.json
├── svelte.config.js
├── tsconfig.json
└── vite.config.ts
```

Key files:
- `svelte.config.js`: SvelteKit configuration with static adapter
- `.github/workflows/deploy.yml`: GitHub Actions workflow for deployment
- `src/routes/+layout.ts`: Enables prerendering
- `static/.nojekyll`: Prevents Jekyll from interfering with GitHub Pages

## Benefits of This Setup

- **Fast builds**: Bun is significantly faster than npm or yarn
- **Type safety**: TypeScript provides excellent DX
- **Modern stack**: SvelteKit offers a great developer experience
- **Free hosting**: GitHub Pages is completely free for public repositories
- **Automatic deployments**: Push to main, and your site updates automatically

## Next Steps

From here, you can:
- Add Markdown support for blog posts using mdsvex
- Style your blog with Tailwind CSS or other styling solutions
- Add search functionality
- Configure custom domains
- Add analytics

Happy blogging!
