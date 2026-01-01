# Blog (WIP)

This is a work-in-progress (under construction) static blog, published via GitHub Pages at [https://kirow.github.io/blog/](https://kirow.github.io/blog/).

## Experimental Workflow

- **AI-driven development:** Uses an experimental workflow with AI assistants for planning, coding, and documentation.
- **OpenSpec & MCP servers:** Specifications and change proposals are managed in the `openspec/` directory, following the OpenSpec process. MCP servers support collaborative workflows.
- **Different editor:** Developed with a non-traditional, AI-integrated editor environment.

## Project Structure

```
blog/
├── www/         # SvelteKit app (source, routes, posts, static assets)
│   ├── src/
│   │   ├── lib/           # Shared components and utilities
│   │   ├── posts/         # Markdown blog posts
│   │   └── routes/        # SvelteKit routes and layouts
│   ├── static/            # Static assets (robots.txt, .nojekyll, etc.)
│   └── package.json       # Dependencies and scripts
├── openspec/    # Specs and change proposals (OpenSpec format)
├── drafts/      # Drafts and experimental docs
├── .github/     # GitHub Actions workflows (deployment)
└── AGENTS.md    # AI assistant instructions
```

## Tech Stack

- **Framework:** SvelteKit 2 (static adapter)
- **UI:** Svelte 5 (runes, snippets, new reactivity)
- **Styling:** Tailwind CSS v4
- **Markdown:** mdsvex for .md/.svx posts
- **Language:** TypeScript (strict mode)
- **Build/Runtime:** Bun (preferred over npm/node)
- **Hosting:** GitHub Pages (static, base path `/blog`)

## Publishing

- Built and deployed automatically via GitHub Actions.
- Live at: [https://kirow.github.io/blog/](https://kirow.github.io/blog/)

---

Stay tuned for updates as the project evolves!
