## Context
The blog currently uses basic SvelteKit components with simple styling. Users have requested:
1. A modern, professional design based on Figma specifications
2. Light/dark theme toggle
3. English/Ukrainian language support
4. Responsive layout for all screen sizes

This change introduces a complete UI overhaul using shadcn-svelte (based on Tailwind CSS and Radix UI primitives) and mdsvex for enhanced markdown rendering.

## Goals / Non-Goals
**Goals:**
- Implement the exact design from Figma for all viewport sizes
- Provide seamless theme switching (LIGHT/DARK)
- Support EN/UA language switching
- Ensure mobile-first responsive design
- Use shadcn-svelte components for consistent styling
- Use mdsvex for rich markdown rendering
- Maintain existing blog functionality

**Non-Goals:**
- Backward compatibility with old design (complete replacement)
- CMS integration beyond current Markdown-based approach
- Dynamic routing beyond SvelteKit's static adapter
- Server-side functionality (keep static site generation)

## Decisions

### 1. Component Library: shadcn-svelte
**Decision:** Use shadcn-svelte for all UI components.

**Rationale:**
- Built specifically for Svelte/SvelteKit
- Uses Tailwind CSS for styling (consistent, maintainable)
- Based on Radix UI primitives (excellent accessibility)
- Components are copied to the project (full control, no runtime dependencies)
- Provides a complete design system out of the box

**Alternatives considered:**
- Tailwind-only from scratch: More control but requires building all components
- Skeleton UI: Similar approach but shadcn-svelte has better Radix integration
- Headless UI: Not Svelte-native

### 2. Markdown Rendering: mdsvex
**Decision:** Use mdsvex for blog post rendering.

**Rationale:**
- Svelte-specific preprocessor for Markdown
- Supports Svelte components within Markdown
- Compatible with existing `.md` files
- Allows custom layouts and components
- Excellent documentation and community support

**Alternatives considered:**
- Pure Markdown parsing: No Svelte component support
- MDX: Not Svelte-native

### 3. Theme Management
**Decision:** Use CSS variables with theme provider.

**Rationale:**
- shadcn-svelte uses CSS variables for theming
- Zero-runtime JavaScript for theme switching
- Easy to customize via Tailwind configuration
- Dark mode via `data-theme` attribute on `html` element

**Implementation:**
- Store theme preference in localStorage
- Default to system preference on first visit
- Theme context provider for app-wide access

### 4. Internationalization
**Decision:** Use built-in i18n stores and simple translation files for UI only.

**Rationale:**
- Lightweight solution (only EN/UA needed)
- No complex routing changes required
- Blog posts stored as separate markdown files per language (e.g., `post.en.md`, `post.ua.md`)
- Easy to maintain with simple JSON/TS translation files for UI strings
- Language preference stored in localStorage

**Alternatives considered:**
- sveltekit-i18n: Overkill for our needs
- @sveltejs/adapter-static for i18n routing: Complex, unnecessary for two languages

### 5. Responsive Design
**Decision:** Mobile-first approach with Tailwind breakpoints.

**Rationale:**
- Tailwind provides built-in breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- Ensures mobile users get the best experience first
- Progressive enhancement for larger screens
- Matches the Figma design specifications

**Breakpoints:**
- Mobile: < 640px (default)
- Tablet: 640px - 1024px (`md:`)
- Desktop: > 1024px (`lg:`)

## Risks / Trade-offs

### Risk 1: Design Fidelity
**Risk:** Figma design may not translate perfectly to Tailwind CSS/shadcn-svelte.

**Mitigation:**
- Use Tailwind's arbitrary values for exact spacing/colors
- Custom CSS variables for specific design tokens
- Reference Figma code exports when available
- Regular design reviews against Figma specifications

### Risk 2: Performance
**Risk:** Adding shadcn-svelte and Tailwind CSS may increase bundle size.

**Mitigation:**
- Tree-shake unused shadcn components
- Tailwind CSS purges unused styles in production
- Use SvelteKit's static adapter optimization
- Lazy load heavy components

### Risk 3: Accessibility
**Risk:** New components may not meet accessibility standards.

**Mitigation:**
- shadcn-svelte uses Radix UI primitives (built for accessibility)
- Test with keyboard navigation
- Test with screen readers
- Follow WCAG 2.1 AA guidelines

### Trade-off: Complexity vs. Maintainability
**Trade-off:** More dependencies (shadcn, Tailwind, mdsvex) increase complexity but improve maintainability and development speed.

**Decision:** Accept increased complexity for:
- Faster development with pre-built components
- Consistent design system
- Better long-term maintainability

## Migration Plan

### Phase 1: Setup (Parallelizable)
- Install and configure shadcn-svelte
- Install and configure mdsvex
- Set up Tailwind CSS
- Configure theme and language contexts

### Phase 2: Design System
- Implement color palette and typography
- Create base layout components
- Build theme toggle functionality

### Phase 3: Component Implementation
- Build Header component
- Build Sidebar/Navigation component
- Build Blog Card component
- Build Search and Tags components

### Phase 4: Layout Implementation
- Implement desktop layout
- Implement responsive tablet layout
- Implement mobile layout with hamburger menu

### Phase 5: Feature Migration
- Migrate blog listing page
- Migrate individual post page
- Implement i18n for all UI strings
- Test theme switching

### Phase 6: Validation
- Test all viewports
- Test accessibility
- Run type checks and linting
- Verify static build

### Rollback Plan
- Keep existing code in Git branch
- Can revert by switching branches
- No database changes (purely frontend)

## Open Questions
- Q: Should we implement RTL support for languages that need it?
  - A: Not required for EN/UA, defer if needed later
- Q: Should we use TypeScript for all new components?
  - A: Yes, project convention is TypeScript strict mode
- Q: How should we handle images in mdsvex posts?
  - A: Use existing static folder structure, mdsvex will handle `<img>` tags
