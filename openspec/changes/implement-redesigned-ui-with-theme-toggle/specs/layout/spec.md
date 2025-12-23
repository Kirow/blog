# layout Specification

## Purpose
Defines the responsive layout requirements for the blog application across desktop, tablet, and mobile viewports.

## ADDED Requirements
### Requirement: Desktop Layout
The system SHALL display a three-column layout on desktop viewports (width > 1024px).

#### Scenario: Desktop layout structure
- **WHEN** the viewport width is greater than 1024px
- **THEN** the layout SHALL have a 240px sidebar on the left
- **AND** the main content area SHALL be in the center (664px width)
- **AND** the right sidebar/widgets area SHALL be 280px on the right
- **AND** page padding SHALL be 32px horizontally
- **AND** total content width SHALL be 1184px with 16px gap between columns

#### Scenario: Desktop navigation
- **WHEN** viewing on desktop
- **THEN** the sidebar SHALL be visible at all times
- **AND** navigation items SHALL be displayed as a vertical list
- **AND** the currently active page SHALL be highlighted

#### Scenario: Desktop header
- **WHEN** viewing on desktop
- **THEN** the header SHALL span the full width
- **AND** it SHALL contain the logo on the left
- **AND** it SHALL contain language and theme toggles on the right

### Requirement: Tablet Layout
The system SHALL display a two-column layout on tablet viewports (640px - 1024px).

#### Scenario: Tablet layout structure
- **WHEN** the viewport width is between 640px and 1024px
- **THEN** the layout SHALL have a collapsed/hidden sidebar
- **AND** the main content area SHALL expand to fill available space
- **AND** the right sidebar/widgets area SHALL be moved below the main content or hidden
- **AND** page padding SHALL be 16px-24px horizontally

#### Scenario: Tablet navigation
- **WHEN** viewing on tablet
- **THEN** the sidebar SHALL be hidden by default
- **AND** a hamburger menu button SHALL be visible in the header
- **AND** clicking the menu button SHALL show a slide-out navigation

### Requirement: Mobile Layout
The system SHALL display a single-column layout on mobile viewports (width < 640px).

#### Scenario: Mobile layout structure
- **WHEN** the viewport width is less than 640px
- **THEN** the layout SHALL be a single column
- **AND** the sidebar SHALL be hidden by default
- **AND** the right sidebar/widgets area SHALL be hidden
- **AND** page padding SHALL be 16px horizontally
- **AND** the main content SHALL use full available width

#### Scenario: Mobile navigation
- **WHEN** viewing on mobile
- **THEN** a hamburger menu button SHALL be visible in the header
- **AND** clicking the button SHALL show a full-screen slide-out menu
- **AND** the menu SHALL cover the entire screen
- **AND** the menu SHALL have a close button
- **AND** clicking outside the menu or pressing escape SHALL close the menu

#### Scenario: Mobile menu content
- **WHEN** the mobile menu is open
- **THEN** it SHALL display navigation links vertically
- **AND** it SHALL display the search input
- **AND** it SHALL display tags (optionally collapsed)
- **AND** the active page SHALL be highlighted

### Requirement: Responsive Header
The system SHALL adapt the header across all viewport sizes.

#### Scenario: Header height
- **WHEN** the header is displayed
- **THEN** the header height SHALL be 100px on desktop
- **AND** the header height SHALL be approximately 80px on mobile
- **AND** the header SHALL maintain consistent vertical padding

#### Scenario: Header elements
- **WHEN** the header is displayed
- **THEN** the logo SHALL be visible on all viewports
- **AND** the language toggle SHALL be visible on all viewports
- **AND** the theme toggle SHALL be visible on all viewports
- **AND** on mobile/tablet, a hamburger menu button SHALL be shown

### Requirement: Blog Card Responsive
The system SHALL adapt blog post cards across all viewport sizes.

#### Scenario: Desktop card
- **WHEN** a blog card is displayed on desktop
- **THEN** it SHALL have a fixed width of 664px
- **AND** it SHALL display the full excerpt text (up to 2 lines)
- **AND** all metadata (date, reading time, tags) SHALL be visible

#### Scenario: Tablet card
- **WHEN** a blog card is displayed on tablet
- **THEN** it SHALL expand to fill the available width
- **AND** the excerpt text MAY be truncated
- **AND** all metadata SHALL be visible

#### Scenario: Mobile card
- **WHEN** a blog card is displayed on mobile
- **THEN** it SHALL use the full available width (minus padding)
- **AND** the excerpt text SHALL be truncated to 2-3 lines
- **AND** tags SHALL wrap to multiple lines if needed
- **AND** the date and reading time SHALL be stacked or condensed

### Requirement: Breakpoint Definitions
The system SHALL use Tailwind CSS breakpoints.

#### Scenario: Mobile breakpoint
- **WHEN** the viewport width is less than 640px
- **THEN** the mobile layout SHALL be applied
- **AND** the Tailwind `default` classes SHALL be used

#### Scenario: Tablet breakpoint
- **WHEN** the viewport width is between 640px and 1024px
- **THEN** the tablet layout SHALL be applied
- **AND** the Tailwind `md:` prefix SHALL be used for overrides

#### Scenario: Desktop breakpoint
- **WHEN** the viewport width is greater than 1024px
- **THEN** the desktop layout SHALL be applied
- **AND** the Tailwind `lg:` prefix SHALL be used for overrides

### Requirement: Responsive Typography
The system SHALL adapt typography sizes across viewports.

#### Scenario: Heading scaling
- **WHEN** viewing on different viewports
- **THEN** h1 headings SHALL be 24px on mobile, 28px on tablet, 32px on desktop
- **AND** h2 headings SHALL be 20px on mobile, 22px on tablet, 24px on desktop
- **AND** h3 headings SHALL be 18px on all viewports

#### Scenario: Body text scaling
- **WHEN** viewing on different viewports
- **THEN** body text SHALL be 16px on all viewports
- **AND** line height SHALL remain 24px
- **AND** text SHALL reflow appropriately

### Requirement: Sidebar Components
The system SHALL properly display sidebar components across viewports.

#### Scenario: Left sidebar (navigation)
- **WHEN** the left sidebar is displayed
- **THEN** on desktop it SHALL be a persistent 240px wide column
- **AND** on tablet/mobile it SHALL be a slide-out menu
- **AND** it SHALL contain navigation links (Home, About, Contacts)

#### Scenario: Right sidebar (widgets)
- **WHEN** the right sidebar is displayed
- **THEN** on desktop it SHALL be a 280px wide column
- **AND** it SHALL contain the search input
- **AND** it SHALL contain the tags cloud
- **AND** on tablet/mobile it SHALL be moved below content or hidden

### Requirement: Grid and Flexbox
The system SHALL use appropriate layout techniques for responsive design.

#### Scenario: Main layout
- **WHEN** creating the main layout
- **THEN** CSS Grid SHALL be used for the three-column desktop layout
- **AND** Flexbox SHALL be used for mobile layouts
- **AND** gap and spacing SHALL be responsive

#### Scenario: Card layout
- **WHEN** creating card layouts
- **THEN** Flexbox SHALL be used for internal card layout
- **AND** flex-wrap SHALL be used for tags
- **AND** gap SHALL be used for consistent spacing
