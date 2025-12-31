<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## Tech Stack

This project uses:
- **Svelte 5** - Uses runes (`$state`, `$derived`, `$effect`), snippets, and the new reactivity model. Do NOT use Svelte 4 patterns (no `$:` reactive statements, no `export let` for props - use `$props()` instead)
- **SvelteKit 2** - File-based routing, static site generation via adapter-static
- **Tailwind CSS v4** - Utility-first CSS framework
- **TypeScript** - Strict mode enabled
- **Bun** - Package manager and runtime (see rules below)

## Project Structure

The SvelteKit application is located in `www/` subdirectory:
- Run commands from `blog/www/` directory
- `package.json` is at `blog/www/package.json`
- Source code is at `blog/www/src/`

## Rules

Always open `@/.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc` when the request:
- Mentions installing package dependencies
- Mentions using Node.js, npm, pnpm, yarn, or Vite
- Mentions Bun or Bun-specific features

## Svelte 5 Patterns

Prefer these Svelte 5 patterns:

```svelte
// Props (NOT `export let`)
let { propName, anotherProp = 'default' } = $props();

// State
let count = $state(0);

// Derived values (NOT `$:`)
let doubled = $derived(count * 2);

// Effects (NOT `$:` with side effects)
$effect(() => {
  console.log('count changed:', count);
});
```

## Tailwind CSS v4

- Use **dashes** for decimal spacing: `px-4-25` not `px-4.25`
- Custom tokens defined in `www/src/routes/layout.css` (`--spacing-*`)
- Use `w-sidebar-right` instead of arbitrary widths like `w-70`
- **Never hardcode colors.** Use theme tokens from `www/src/routes/layout.css`.
