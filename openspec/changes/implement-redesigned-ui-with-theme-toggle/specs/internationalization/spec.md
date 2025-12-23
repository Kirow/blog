# internationalization Specification

## Purpose
Defines the internationalization (i18n) system for supporting multiple languages in the blog application.

## ADDED Requirements
### Requirement: Language Toggle
The system SHALL provide a toggle to switch between English (EN) and Ukrainian (UA) languages.

#### Scenario: Toggle language
- **WHEN** a user clicks the language toggle button
- **THEN** the application switches between EN and UA
- **AND** the language preference is saved to localStorage
- **AND** the UI text updates to the selected language

#### Scenario: Language persistence
- **WHEN** a user returns to the site
- **THEN** their previously selected language is loaded from localStorage
- **AND** the language is applied consistently across all pages

#### Scenario: Language button display
- **WHEN** the language toggle is displayed
- **THEN** it SHALL show the current active language code (EN or UA)
- **AND** it SHALL have rounded corners (10px border radius)
- **AND** it SHALL use the theme's secondary background color

### Requirement: Translation Coverage
The system SHALL provide translations for all user-facing UI elements.

#### Scenario: UI element translations
- **WHEN** a UI element is displayed
- **THEN** navigation items (Home, About, Contacts) SHALL have translations
- **AND** button labels (Read more, Search, etc.) SHALL have translations
- **AND** form input placeholders (Search articles...) SHALL have translations
- **AND** section headings (Search, Tags) SHALL have translations
- **AND** error messages SHALL have translations

#### Scenario: Static content translation
- **WHEN** static content is displayed (About, Contact pages)
- **THEN** it SHALL be available in both EN and UA as separate markdown files
- **AND** the correct language version is loaded based on user preference

### Requirement: Default Language
The system SHALL default to English (EN) for all users.

#### Scenario: First visit
- **WHEN** a user visits the site for the first time
- **THEN** the default language SHALL be English (EN)
- **AND** the language toggle SHALL display "EN"
- **AND** all UI elements SHALL display in English

### Requirement: Language Storage Format
The system SHALL store language preference in a standardized format.

#### Scenario: Storage key
- **WHEN** storing language preference
- **THEN** the localStorage key SHALL be `blog-language`
- **AND** the value SHALL be `en` or `ua`
- **AND** the value SHALL be case-insensitive

### Requirement: Language Context
The system SHALL provide a global context for accessing the current language.

#### Scenario: Accessing current language
- **WHEN** a component needs to access the current language
- **THEN** it SHALL use a `language` Svelte store or context
- **AND** it SHALL subscribe to language changes
- **AND** it SHALL reactively update when language changes

#### Scenario: Translating strings
- **WHEN** a component needs to translate a string
- **THEN** it SHALL use a translation function that accepts a key and returns the translated string
- **AND** it SHALL fall back to English if the translation is missing
- **AND** it SHALL support interpolation for dynamic values

### Requirement: Content Separation
The system SHALL separate translatable content from code.

#### Scenario: Translation files
- **WHEN** managing translations
- **THEN** translations SHALL be stored in separate files (JSON or TypeScript)
- **AND** each language SHALL have its own file
- **AND** translations SHALL be organized by feature/page

#### Scenario: Nested translations
- **WHEN** organizing translation keys
- **THEN** keys SHALL be nested by category (e.g., `nav.home`, `blog.read_more`)
- **AND** keys SHALL use dot notation for hierarchy
- **AND** keys SHALL be kebab-case for readability
