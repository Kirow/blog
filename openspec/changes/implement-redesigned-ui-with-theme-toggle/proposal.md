# Change: Implement Redesigned UI with Theme Toggle

## Why
The current blog UI needs a complete redesign to match the modern, professional design from Figma. Additionally, users should have the ability to toggle between light and dark themes, switch between English and Ukrainian languages, and the site should adapt responsively to different screen sizes (desktop, tablet, mobile).

## What Changes
- Implement new UI design based on Figma specifications for desktop (dark/light), mobile (dark/light), and mobile side menu
- Add theme toggle functionality (LIGHT/DARK modes)
- Add language toggle functionality (EN/UA)
- Implement responsive layout that adapts to mobile, tablet, and desktop viewports
- Use shadcn-svelte component library for styled components
- Use mdsvex for enhanced markdown rendering in blog posts
- Refactor existing layout and components to use the new design system

## Impact
- Affected specs: `blog-core`, `search`, `deployment` (will be modified)
- New specs: `ui-design`, `internationalization`, `layout` (will be added)
- Affected code: All UI components in `www/src/routes/` and `www/src/lib/`
