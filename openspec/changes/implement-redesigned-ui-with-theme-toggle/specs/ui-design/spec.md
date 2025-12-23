# ui-design Specification

## Purpose
Defines the visual design system, theme implementation, and UI component requirements for the blog application.

## ADDED Requirements
### Requirement: Theme Support
The system SHALL support light and dark color themes with user preference persistence.

#### Scenario: Toggle theme
- **WHEN** a user clicks the theme toggle button
- **THEN** the application switches between light and dark themes
- **AND** the preference is saved to localStorage
- **AND** the theme is applied across all pages

#### Scenario: System preference default
- **WHEN** a user visits the site for the first time
- **THEN** the theme matches their system preference (light/dark mode)
- **AND** the theme is saved to localStorage

#### Scenario: Theme persistence
- **WHEN** a user returns to the site
- **THEN** their previously selected theme is loaded from localStorage
- **AND** the theme is applied consistently across all pages

### Requirement: Design System Consistency
The system SHALL use shadcn-svelte components with a consistent design system based on Tailwind CSS.

#### Scenario: Component styling
- **WHEN** a developer creates a new UI component
- **THEN** it MUST use shadcn-svelte components where available
- **AND** follow the defined color palette and typography scale
- **AND** use CSS variables for theming

#### Scenario: Custom styling
- **WHEN** a developer needs custom styling beyond shadcn-svelte
- **THEN** they MUST use Tailwind CSS utility classes
- **AND** respect the design tokens (colors, spacing, typography)

### Requirement: Color Palette
The system SHALL provide a defined color palette for light and dark themes matching the Figma design.

#### Scenario: Light theme colors
- **WHEN** the light theme is active
- **THEN** the background color SHALL be `#f8fafc` (slate-50)
- **AND** the primary text color SHALL be `#0f172b` (slate-950)
- **AND** the secondary text color SHALL be `#45556c` (slate-600)
- **AND** the card background SHALL be `#ffffff`
- **AND** the border color SHALL be `#e2e8f0` (slate-200)
- **AND** the active element background SHALL be `#eff6ff` (blue-50)

#### Scenario: Dark theme colors
- **WHEN** the dark theme is active
- **THEN** the background color SHALL be `#09090b` (neutral-950)
- **AND** the primary text color SHALL be `#fafafa` (neutral-50)
- **AND** the secondary text color SHALL be `#9f9fa9` (neutral-400)
- **AND** the card background SHALL be `#18181b` (neutral-900)
- **AND** the border color SHALL be `#27272a` (neutral-800)
- **AND** the active element background SHALL be `#ffffff` (with text color neutral-950)

### Requirement: Typography
The system SHALL use Inter font family with defined typography scale.

#### Scenario: Font loading
- **WHEN** the application loads
- **THEN** the Inter font family SHALL be used for all text
- **AND** font weights of 400 (regular), 500 (medium) SHALL be available
- **AND** fonts SHALL be loaded from a CDN or bundled

#### Scenario: Heading styles
- **WHEN** rendering headings
- **THEN** h1 headings SHALL use 24px font size, 36px line height
- **AND** h2 headings SHALL use 20px font size, 30px line height
- **AND** h3 headings SHALL use 18px font size, 27px line height

#### Scenario: Body text
- **WHEN** rendering body text
- **THEN** the default font size SHALL be 16px
- **AND** the line height SHALL be 24px
- **AND** the font weight SHALL be 400 (regular)

#### Scenario: Small text
- **WHEN** rendering small text (labels, meta info)
- **THEN** the font size SHALL be 12px-14px
- **AND** the line height SHALL be 16px-20px
- **AND** the font weight SHALL be 400 (regular)

### Requirement: Spacing Scale
The system SHALL use a consistent spacing scale based on Tailwind's spacing system.

#### Scenario: Layout spacing
- **WHEN** creating layouts
- **THEN** content padding SHALL be 16px (4) on mobile
- **AND** content padding SHALL be 32px (8) on desktop
- **AND** element gaps SHALL be 8px, 16px, 24px, or 32px

#### Scenario: Card spacing
- **WHEN** rendering cards
- **THEN** the internal padding SHALL be 16px-24px
- **AND** the border radius SHALL be 10px
- **AND** the gap between cards SHALL be 24px

### Requirement: Component Styling
The system SHALL style UI components according to the Figma design specifications.

#### Scenario: Button styling
- **WHEN** a button is rendered
- **THEN** it SHALL have a border radius of 10px
- **AND** it SHALL use the theme-appropriate background and border colors
- **AND** it SHALL have padding of 8px-16px
- **AND** it SHALL respond to hover states

#### Scenario: Input styling
- **WHEN** a text input is rendered
- **THEN** it SHALL have a border radius of 10px
- **AND** it SHALL have a border with the theme's border color
- **AND** it SHALL have padding of 8px-12px
- **AND** it SHALL display placeholder text in muted color

#### Scenario: Card styling
- **WHEN** a content card is rendered
- **THEN** it SHALL have a border with the theme's border color
- **AND** it SHALL use the theme's card background color
- **AND** it SHALL have a border radius of 10px
- **AND** it SHALL have internal padding of 16px-24px

### Requirement: Iconography
The system SHALL use Lucide icons for all icon elements.

#### Scenario: Icon rendering
- **WHEN** an icon is displayed
- **THEN** it SHALL use Lucide icon components
- **AND** icons SHALL be sized consistently (16px, 20px, 24px)
- **AND** icons SHALL inherit text color for theme compatibility
