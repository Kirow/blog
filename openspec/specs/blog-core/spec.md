# blog-core Specification

## Purpose
TBD - created by archiving change implement-static-blog. Update Purpose after archive.
## Requirements
### Requirement: Blog Post Authoring
The system SHALL support authoring blog posts in Markdown format with YAML frontmatter.

#### Scenario: Valid post structure
- **WHEN** a file is created in the posts directory with `.md` extension
- **AND** it contains valid YAML frontmatter (title, date, tags)
- **THEN** it is recognized as a blog post and rendered correctly

### Requirement: Blog Post Listing
The system SHALL display a list of published blog posts, ordered by date (newest first).

#### Scenario: Listing posts
- **WHEN** the user visits the blog index page
- **THEN** a list of posts is displayed showing title, date, and tags

### Requirement: Tag Support
The system SHALL allow categorizing posts with tags and filtering posts by tag.

#### Scenario: Filtering by tag
- **WHEN** a user clicks on a tag
- **THEN** the list of posts is filtered to show only posts containing that tag

