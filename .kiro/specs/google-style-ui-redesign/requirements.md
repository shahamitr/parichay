# Requirements Document

## Introduction

This document defines the requirements for a comprehensive Google-style UI/UX redesign of the Parichay platform. The redesign applies Google Material Design 3 principles across all three application layers: public-facing pages (frontend), the admin panel (Google Workspace-inspired), and customer authentication flows (Google sign-in patterns). The goal is a cohesive, professional, and highly usable interface that feels modern, clean, and intuitive — aligned with the design language users already trust from Google products.

## Glossary

- **Design_System**: The centralized set of design tokens (colors, typography, spacing, shadows, radii) stored in `src/config/design-tokens.ts` and `tailwind.config.ts` that governs visual consistency across the platform
- **Public_Pages**: All visitor-facing pages including the landing page, features, pricing, about, contact, and informational pages served under the root route
- **Admin_Panel**: The authenticated administration interface at `/admin/*` used by brand managers and super admins to manage brands, branches, leads, analytics, and settings
- **Auth_Flow**: The authentication pages including login, registration, forgot-password, and reset-password flows
- **Customer_Dashboard**: The post-login customer-facing dashboard at `/customer-dashboard` for end customers viewing their profiles
- **Component_Library**: The reusable UI components located in `src/components/ui/` (Button, Card, DataTable, Input, Dialog, etc.)
- **Navigation_System**: The admin sidebar (`ModernSidebar`), admin header (`AdminHeader`), and public navigation (`CommonHeader`) components
- **Color_Palette**: The defined set of primary, secondary, neutral, semantic (success, warning, error) colors used throughout the interface
- **Typography_Scale**: The hierarchy of font sizes, weights, and line heights applied across headings, body text, labels, and captions
- **Motion_System**: The collection of animations, transitions, and micro-interactions used for state changes, page transitions, and user feedback
- **Responsive_Layout**: The adaptive layout system that adjusts content arrangement, spacing, and component sizing across mobile (< 768px), tablet (768–1024px), and desktop (> 1024px) breakpoints
- **Dark_Mode**: The alternate color scheme activated by user preference or system setting, providing reduced-luminance visuals

## Requirements

### Requirement 1: Design Token Foundation (Color Palette)

**User Story:** As a developer, I want a unified Google-inspired color palette defined as design tokens, so that all components and pages share a consistent, modern visual identity.

#### Acceptance Criteria

1. THE Design_System SHALL define a primary color scale (50–900) based on Google Blue (#1a73e8) with accessible contrast ratios meeting WCAG AA for text on white backgrounds at the 600+ shades
2. THE Design_System SHALL define a neutral color scale (50–900) using Google's gray tones (#f8f9fa through #202124) for backgrounds, borders, and text
3. THE Design_System SHALL define semantic colors (success: Google Green #1e8e3e, warning: Google Yellow #f9ab00, error: Google Red #d93025) each with a 50–900 scale
4. THE Design_System SHALL define a surface color hierarchy: surface-primary (white/#ffffff), surface-secondary (#f8f9fa), surface-tertiary (#f1f3f4), and surface-elevated (white with shadow)
5. WHEN Dark_Mode is active, THE Design_System SHALL map all surface colors to dark equivalents (#202124, #292a2d, #35363a) maintaining the same relative hierarchy
6. THE Design_System SHALL export all color tokens as CSS custom properties on `:root` and as Tailwind CSS utility classes

### Requirement 2: Typography System

**User Story:** As a designer, I want a clean, Google-style typography system with clear hierarchy, so that text is readable and visually structured across all pages.

#### Acceptance Criteria

1. THE Typography_Scale SHALL use Google Sans (or Inter as fallback) for display headings and Roboto (or system-ui as fallback) for body text
2. THE Typography_Scale SHALL define a modular scale: Display (57px), Headline-Large (32px), Headline-Medium (28px), Headline-Small (24px), Title-Large (22px), Title-Medium (16px/medium), Body-Large (16px), Body-Medium (14px), Label-Large (14px/medium), Label-Medium (12px/medium)
3. THE Typography_Scale SHALL apply letter-spacing of -0.02em for display sizes, 0 for body sizes, and +0.01em for label sizes
4. THE Typography_Scale SHALL define line-height ratios: 1.1 for display, 1.3 for headlines, 1.5 for body, and 1.4 for labels
5. THE Typography_Scale SHALL maintain consistent font-weight mapping: Regular (400) for body, Medium (500) for labels and titles, and Bold (600) for headings only

### Requirement 3: Spacing and Layout Grid

**User Story:** As a developer, I want a consistent spacing system and layout grid matching Google's generous whitespace approach, so that the interface feels open, breathable, and organized.

#### Acceptance Criteria

1. THE Design_System SHALL define a 4px base unit spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128 pixels
2. THE Responsive_Layout SHALL use a 12-column grid with 24px gutters on desktop, 16px gutters on tablet, and single-column with 16px margins on mobile
3. THE Responsive_Layout SHALL apply section vertical padding of 96px on desktop, 64px on tablet, and 48px on mobile
4. THE Responsive_Layout SHALL constrain content to a maximum width of 1200px (standard) or 1440px (wide) centered on screen
5. THE Design_System SHALL define consistent component internal padding: cards (24px), inputs (12px vertical, 16px horizontal), buttons (12px vertical, 24px horizontal)

### Requirement 4: Component Library — Buttons

**User Story:** As a user, I want clear, Google-style buttons with distinct visual hierarchy, so that I can identify primary actions and interact confidently.

#### Acceptance Criteria

1. THE Component_Library SHALL provide button variants: Filled (Google Blue background, white text), Tonal (light blue background, blue text), Outlined (1px border, blue text), and Text (no background, blue text)
2. THE Component_Library SHALL provide button sizes: Small (32px height, 12px padding), Medium (40px height, 24px padding), and Large (48px height, 24px padding)
3. WHEN a button is hovered, THE Component_Library SHALL apply a state layer overlay (8% opacity of the button color) with a 200ms ease transition
4. WHEN a button is pressed, THE Component_Library SHALL apply a state layer overlay (12% opacity) and a subtle scale transform (0.98) with a 100ms ease transition
5. WHEN a button is focused via keyboard, THE Component_Library SHALL display a 2px focus ring offset by 2px using the primary color
6. THE Component_Library SHALL render buttons with a border-radius of 20px (fully rounded pill shape) for primary CTAs and 8px for standard action buttons
7. WHEN a button is disabled, THE Component_Library SHALL reduce opacity to 0.38 and remove pointer events

### Requirement 5: Component Library — Cards and Surfaces

**User Story:** As a user, I want clean card-based layouts with subtle elevation, so that information is grouped logically and visually separated.

#### Acceptance Criteria

1. THE Component_Library SHALL provide card variants: Elevated (shadow-md, white background), Filled (surface-secondary background, no shadow), and Outlined (1px border, no shadow)
2. THE Component_Library SHALL apply a border-radius of 12px to all card components
3. WHEN a card is interactive (clickable), THE Component_Library SHALL apply a hover state layer (4% opacity overlay) and transition box-shadow from shadow-sm to shadow-md over 200ms
4. THE Component_Library SHALL render card content with 24px internal padding and maintain 16px gap between stacked cards
5. WHEN a card contains a header action area, THE Component_Library SHALL visually separate the header with a 1px divider using the neutral-200 color

### Requirement 6: Component Library — Form Inputs

**User Story:** As a user, I want clean, clearly-labeled form inputs with obvious focus states, so that I can fill forms quickly and correctly.

#### Acceptance Criteria

1. THE Component_Library SHALL provide an outlined text field with a 1px neutral-300 border, 12px vertical and 16px horizontal padding, and 8px border-radius
2. WHEN an input receives focus, THE Component_Library SHALL transition the border color to primary-600 and display a 2px primary-colored border with a label that floats above the field (Google Material floating label pattern)
3. IF an input validation error occurs, THEN THE Component_Library SHALL display the border in error-600 color with an error message below the field in 12px error-600 text
4. THE Component_Library SHALL provide helper text below inputs in 12px neutral-500 text with 4px top margin
5. THE Component_Library SHALL render form field labels in 14px medium weight neutral-700 text positioned above the input with 8px bottom margin
6. WHEN an input is disabled, THE Component_Library SHALL apply a surface-secondary background with 0.6 opacity text

### Requirement 7: Public Pages — Navigation Header

**User Story:** As a visitor, I want a minimal, Google-style navigation bar that stays out of the way while providing clear access to key pages.

#### Acceptance Criteria

1. THE Navigation_System SHALL render a fixed-top navigation bar with 64px height, white background, and a subtle 1px bottom border in neutral-200
2. THE Navigation_System SHALL display the Parichay logo (mark + wordmark) aligned left with navigation links centered and auth actions (Sign in, Get started) aligned right
3. WHEN the page scrolls past 100px, THE Navigation_System SHALL apply a subtle box-shadow (0 1px 6px rgba(32,33,36,0.08)) using a 200ms transition
4. THE Navigation_System SHALL collapse into a hamburger menu on screens narrower than 768px with a full-screen overlay navigation drawer sliding in from the right
5. THE Navigation_System SHALL highlight the currently active navigation link with primary-600 text color and a 2px bottom indicator
6. WHEN a navigation link is hovered, THE Navigation_System SHALL apply a 4% state layer background with 150ms ease transition

### Requirement 8: Public Pages — Hero Section

**User Story:** As a visitor, I want a bold, clear hero section that communicates the product value immediately, so that I understand what Parichay offers within 5 seconds.

#### Acceptance Criteria

1. THE Public_Pages SHALL render a hero section with 160px top padding (accounting for fixed nav) and 120px bottom padding on desktop
2. THE Public_Pages SHALL display the hero headline in Display typography (57px) with -0.02em letter-spacing, centered, maximum 800px width
3. THE Public_Pages SHALL display a supporting subtitle in Body-Large (16px) neutral-600 text, centered below the headline with 24px gap, maximum 600px width
4. THE Public_Pages SHALL render primary and secondary CTA buttons centered below the subtitle with 40px gap from the subtitle
5. THE Public_Pages SHALL use a clean white background with no decorative gradients or orbs, relying solely on typography hierarchy and whitespace for visual impact
6. WHEN the hero section loads, THE Motion_System SHALL apply a staggered fade-up animation (headline first, subtitle 100ms delayed, CTAs 200ms delayed) with 400ms duration and ease-out timing

### Requirement 9: Public Pages — Feature Sections

**User Story:** As a visitor, I want clearly structured feature sections with consistent visual rhythm, so that I can scan and understand the product capabilities quickly.

#### Acceptance Criteria

1. THE Public_Pages SHALL render feature sections with alternating white and surface-secondary (#f8f9fa) backgrounds for visual rhythm
2. THE Public_Pages SHALL display section headers centered with: Label (13px, primary-600, uppercase, tracking-wide) above a Headline-Medium (28px) title
3. THE Public_Pages SHALL render feature grids in 3-column layout on desktop (gap 32px), 2-column on tablet (gap 24px), and single-column on mobile (gap 24px)
4. THE Public_Pages SHALL display feature items with: a 48px circular icon container (surface-secondary background, primary-600 icon), 16px title below, and 14px neutral-500 description text
5. THE Public_Pages SHALL maintain consistent section spacing of 96px vertical padding on desktop, reducing to 64px on tablet and 48px on mobile

### Requirement 10: Public Pages — Pricing Section

**User Story:** As a visitor, I want a clear, Google-style pricing comparison, so that I can quickly understand plan differences and choose the right one.

#### Acceptance Criteria

1. THE Public_Pages SHALL render pricing cards in a 3-column grid with the recommended plan visually elevated (shadow-lg) and slightly scaled (1.02 transform) relative to other plans
2. THE Public_Pages SHALL display pricing card headers with: plan name (Title-Large), brief description (Body-Medium, neutral-500), and price (Display, bold) with period indicator (/month in neutral-400)
3. THE Public_Pages SHALL render feature lists within pricing cards using a checkmark icon (success-600) prefix with 14px neutral-700 text and 12px vertical gap between items
4. THE Public_Pages SHALL highlight the recommended plan with a primary-600 top border (3px) and a "Recommended" badge in the top-right corner
5. WHEN a pricing card is hovered, THE Motion_System SHALL apply a translateY(-4px) lift with shadow increase over 200ms ease transition

### Requirement 11: Admin Panel — Shell Layout

**User Story:** As an admin, I want a clean Google Workspace-style shell with persistent navigation, so that I can navigate between sections efficiently.

#### Acceptance Criteria

1. THE Admin_Panel SHALL render a left sidebar with 256px width (expanded) or 72px width (collapsed) with a smooth 200ms width transition using cubic-bezier(0.4, 0, 0.2, 1)
2. THE Admin_Panel SHALL render a top app bar with 64px height containing: sidebar toggle button, page title (Title-Medium), centered search trigger, and right-aligned notification bell and user avatar
3. THE Admin_Panel SHALL display the main content area with a surface-secondary (#f8f9fa) background, 32px padding on desktop and 16px on mobile
4. THE Admin_Panel SHALL render sidebar navigation items with: 24px icon (neutral-500), 14px medium text, 48px item height, and 8px border-radius hover state
5. WHEN a sidebar item is active, THE Admin_Panel SHALL apply a primary-100 background with primary-700 text and primary-600 icon color
6. WHEN the sidebar is collapsed, THE Admin_Panel SHALL show only icons centered with tooltip labels on hover
7. THE Admin_Panel SHALL auto-collapse the sidebar on screens narrower than 1024px and provide a hamburger overlay on mobile

### Requirement 12: Admin Panel — Data Tables

**User Story:** As an admin, I want clean, scannable data tables with clear sorting and filtering, so that I can manage large datasets efficiently.

#### Acceptance Criteria

1. THE Admin_Panel SHALL render data tables with: white background card container, 12px border-radius, and shadow-sm elevation
2. THE Admin_Panel SHALL display table headers in 12px uppercase medium-weight neutral-500 text with 16px vertical padding and a bottom border in neutral-200
3. THE Admin_Panel SHALL render table rows with 56px height, 16px horizontal cell padding, and alternating hover state (4% neutral overlay on hover)
4. THE Admin_Panel SHALL provide pagination controls with: page size selector, "Showing X of Y" text, and numbered page buttons using the pill-style active indicator (primary-600 background)
5. WHEN a table column is sortable, THE Admin_Panel SHALL display a sort icon (neutral-400 unsorted, primary-600 sorted) and respond to click with ascending/descending toggle
6. THE Admin_Panel SHALL render table action buttons (view, edit, delete) as icon-only ghost buttons (32px, 8px radius) appearing on row hover

### Requirement 13: Admin Panel — Dashboard Cards

**User Story:** As an admin, I want a Google Analytics-style dashboard with metric cards and charts, so that I can quickly understand business performance at a glance.

#### Acceptance Criteria

1. THE Admin_Panel SHALL render stat cards in a responsive grid: 4 columns on desktop, 2 on tablet, 1 on mobile with 24px gap
2. THE Admin_Panel SHALL display each stat card with: white background, 12px border-radius, 24px padding, metric label (Label-Medium, neutral-500), metric value (Headline-Small, neutral-900), and trend indicator (success-600 up arrow or error-600 down arrow with percentage)
3. WHEN a stat card value changes, THE Motion_System SHALL apply a number count-up animation over 600ms with ease-out timing
4. THE Admin_Panel SHALL render chart containers in filled cards (surface-primary background, 12px radius) with 24px padding and a 1px neutral-200 border
5. THE Admin_Panel SHALL display card action menus (three-dot icon button) in the top-right corner of each card, opening a dropdown with options on click

### Requirement 14: Admin Panel — Command Palette

**User Story:** As an admin, I want a fast command palette (Ctrl+K) for quick navigation, so that I can reach any section without clicking through menus.

#### Acceptance Criteria

1. WHEN the user presses Ctrl+K or Cmd+K, THE Admin_Panel SHALL display a centered modal command palette with: 640px max-width, 12px border-radius, shadow-xl elevation, and backdrop blur overlay
2. THE Admin_Panel SHALL render the command palette search input at the top with: 48px height, no border, 16px text size, and a search icon prefix
3. THE Admin_Panel SHALL display command results as a scrollable list with: 44px item height, icon + label + shortcut layout, and keyboard-navigable (up/down arrows, Enter to select)
4. WHEN results load, THE Motion_System SHALL apply a scale-in animation (0.95 to 1.0) over 150ms with ease-out timing
5. WHEN a result item is highlighted via keyboard, THE Admin_Panel SHALL apply a primary-50 background with primary-700 text

### Requirement 15: Authentication — Login Page

**User Story:** As a user, I want a clean, Google sign-in style login page with a centered card and clear steps, so that I can sign in quickly and confidently.

#### Acceptance Criteria

1. THE Auth_Flow SHALL render the login page with a centered card layout: 448px max-width card on a surface-secondary (#f8f9fa) full-screen background
2. THE Auth_Flow SHALL display the card with: white background, 12px border-radius, 48px padding, and shadow-md elevation
3. THE Auth_Flow SHALL display a centered logo (48px) at the top of the card followed by "Sign in" heading (Headline-Small, 24px) and "to continue to Parichay" subtitle (Body-Medium, neutral-500) with 8px gap
4. THE Auth_Flow SHALL render the email input field with the Google Material floating label pattern and a "Forgot password?" link in 14px primary-600 text aligned right below the password field
5. THE Auth_Flow SHALL display the primary "Sign in" button as a Filled button (full-width, 48px height, 20px border-radius) with 32px top margin
6. THE Auth_Flow SHALL display a "Create account" link below the button in 14px primary-600 text with 24px top margin
7. IF a login error occurs, THEN THE Auth_Flow SHALL display an error banner above the form with: error-50 background, error-600 text, error icon, 8px border-radius, and a subtle slide-down entrance animation

### Requirement 16: Authentication — Registration Page

**User Story:** As a new user, I want a step-by-step registration flow with progressive disclosure, so that I am not overwhelmed by a long form.

#### Acceptance Criteria

1. THE Auth_Flow SHALL render registration as a multi-step flow with a progress indicator showing: step number, step label, and completion state (filled circle for complete, outlined for current, dotted for upcoming)
2. THE Auth_Flow SHALL display Step 1 (Account) with: name and email fields only, keeping the form minimal
3. THE Auth_Flow SHALL display Step 2 (Password) with: password field, confirm password field, and strength indicator bar
4. THE Auth_Flow SHALL display Step 3 (Business) with: business name and category selection (optional)
5. WHEN transitioning between steps, THE Motion_System SHALL apply a horizontal slide animation (slide-left to advance, slide-right to go back) over 300ms with ease-in-out timing
6. THE Auth_Flow SHALL maintain consistent card dimensions (448px max-width, 48px padding) across all steps to prevent layout shifts

### Requirement 17: Motion and Animation System

**User Story:** As a user, I want subtle, purposeful animations that provide feedback and guide my attention, so that the interface feels responsive without being distracting.

#### Acceptance Criteria

1. THE Motion_System SHALL define standard transition durations: instant (100ms) for state changes, quick (200ms) for hover/focus, standard (300ms) for enter/exit, and deliberate (500ms) for complex transitions
2. THE Motion_System SHALL use the standard easing curve cubic-bezier(0.2, 0, 0, 1) for enter animations and cubic-bezier(0.4, 0, 1, 1) for exit animations (matching Google Material Motion)
3. THE Motion_System SHALL apply page transitions as a fade-in (opacity 0 to 1) combined with translateY(8px to 0) over 300ms on route changes
4. WHEN a modal or dialog opens, THE Motion_System SHALL apply a scale-in (0.9 to 1.0) with fade-in over 200ms and a backdrop fade (0 to 0.32 opacity) over 250ms
5. WHILE prefers-reduced-motion is set to reduce, THE Motion_System SHALL disable all decorative animations and reduce transition durations to 0ms
6. THE Motion_System SHALL limit all decorative animations to a maximum of 3 simultaneously visible animated elements per viewport to prevent performance degradation

### Requirement 18: Responsive Design System

**User Story:** As a user on any device, I want the interface to adapt gracefully to my screen size, so that I have an optimal experience regardless of device.

#### Acceptance Criteria

1. THE Responsive_Layout SHALL define breakpoints at: mobile (< 640px), tablet (640–1024px), desktop (1024–1440px), and wide (> 1440px)
2. THE Responsive_Layout SHALL stack navigation and content vertically on mobile with: full-width components, 16px side margins, and a bottom navigation bar for admin on mobile
3. THE Responsive_Layout SHALL render touch targets at minimum 48px × 48px on mobile and tablet devices
4. THE Responsive_Layout SHALL adjust Typography_Scale on mobile: Display reduces to 36px, Headlines reduce by one step, body text remains at 16px for readability
5. THE Responsive_Layout SHALL render data tables with horizontal scroll on mobile with a sticky first column (row identifier) for context retention
6. THE Responsive_Layout SHALL hide non-essential UI elements (decorative text, secondary stats, advanced filters) on mobile to reduce cognitive load

### Requirement 19: Accessibility Compliance

**User Story:** As a user with accessibility needs, I want the redesigned interface to meet WCAG AA standards, so that I can use the platform effectively with assistive technologies.

#### Acceptance Criteria

1. THE Design_System SHALL ensure all text elements maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (18px+ or 14px+ bold) against their background
2. THE Component_Library SHALL provide visible focus indicators (2px primary-600 ring, 2px offset) on all interactive elements when navigated via keyboard
3. THE Component_Library SHALL include appropriate ARIA labels on icon-only buttons, ARIA-live regions for dynamic content updates, and ARIA-expanded states for collapsible elements
4. THE Navigation_System SHALL provide a skip-to-content link as the first focusable element that becomes visible on keyboard focus
5. THE Component_Library SHALL maintain logical tab order matching visual layout order across all pages
6. THE Admin_Panel SHALL announce data table sorting changes and pagination updates via ARIA-live regions for screen reader users

### Requirement 20: Dark Mode Support

**User Story:** As a user who prefers dark interfaces, I want a cohesive dark mode that maintains readability and hierarchy, so that I can use the platform comfortably in low-light environments.

#### Acceptance Criteria

1. THE Design_System SHALL provide automatic dark mode detection via prefers-color-scheme media query with manual override toggle stored in localStorage
2. WHEN Dark_Mode is active, THE Design_System SHALL apply surface colors: background (#202124), surface-primary (#292a2d), surface-secondary (#35363a), and surface-elevated (#3c3e42)
3. WHEN Dark_Mode is active, THE Design_System SHALL adjust text colors: primary-text (#e8eaed), secondary-text (#9aa0a6), and tertiary-text (#5f6368)
4. WHEN Dark_Mode is active, THE Component_Library SHALL reduce shadow intensity to 0 and rely on surface color differentiation and 1px neutral-700 borders for elevation hierarchy
5. WHEN Dark_Mode is toggled, THE Motion_System SHALL apply a 300ms color transition on background and text colors to prevent jarring switches
6. THE Design_System SHALL maintain the same contrast ratios (4.5:1 minimum for normal text) in Dark_Mode as in light mode

### Requirement 21: Loading States and Skeleton Screens

**User Story:** As a user, I want clear loading indicators and skeleton screens, so that I understand the system is working and can anticipate where content will appear.

#### Acceptance Criteria

1. THE Component_Library SHALL provide skeleton loaders that match the exact layout dimensions of the content they replace (cards, tables, text blocks)
2. THE Component_Library SHALL animate skeletons with a shimmer effect: left-to-right gradient sweep using neutral-100 to neutral-200 over 1.5s infinite loop
3. THE Component_Library SHALL provide a circular progress spinner (24px default, primary-600 color) for inline loading states within buttons and small containers
4. WHEN a page is loading, THE Public_Pages SHALL display the skeleton layout within 100ms to prevent layout shift when content arrives
5. THE Admin_Panel SHALL display skeleton loaders for dashboard cards, data table rows, and chart containers during data fetch operations

### Requirement 22: Iconography and Visual Assets

**User Story:** As a user, I want consistent, clean iconography that is immediately recognizable, so that I can navigate and understand actions without reading labels.

#### Acceptance Criteria

1. THE Design_System SHALL use the Lucide React icon library with consistent sizing: 16px for inline/label icons, 20px for button icons, 24px for navigation icons, and 48px for feature showcase icons
2. THE Design_System SHALL apply neutral-500 color to default state icons, primary-600 to active/selected state icons, and matching semantic colors for status icons (success, warning, error)
3. THE Component_Library SHALL render icons with 2px stroke width consistently across all icon usages
4. THE Design_System SHALL provide icon containers (circular or rounded-square backgrounds) using surface-secondary background with 12px padding for feature/illustration icons

### Requirement 23: Toast Notifications and Feedback

**User Story:** As a user, I want clear, non-intrusive feedback for my actions, so that I know whether operations succeeded or failed without disrupting my workflow.

#### Acceptance Criteria

1. THE Component_Library SHALL render toast notifications in the bottom-right corner (desktop) or bottom-center (mobile) with: 360px max-width, 12px border-radius, 16px padding, and shadow-lg elevation
2. THE Component_Library SHALL provide toast variants: success (success-50 bg, success-700 text, checkmark icon), error (error-50 bg, error-700 text, alert icon), warning (warning-50 bg, warning-700 text), and info (primary-50 bg, primary-700 text)
3. WHEN a toast appears, THE Motion_System SHALL apply a slide-up-fade animation over 200ms with ease-out timing
4. THE Component_Library SHALL auto-dismiss success toasts after 4 seconds and error toasts after 8 seconds, with a visible progress bar indicating time remaining
5. THE Component_Library SHALL stack multiple toasts vertically with 8px gap, limiting to 3 visible toasts maximum (older toasts collapse)

### Requirement 24: Search and Filter Patterns

**User Story:** As an admin, I want Google-style search with instant results and clear filter options, so that I can find information quickly across the admin panel.

#### Acceptance Criteria

1. THE Admin_Panel SHALL render the global search input with: 40px height, surface-secondary background, 20px border-radius (pill shape), search icon prefix, and keyboard shortcut hint (⌘K)
2. WHEN the search input is focused, THE Admin_Panel SHALL expand it to 480px width (desktop) with a white background, shadow-md, and display a results dropdown below
3. THE Admin_Panel SHALL display search results grouped by category (Brands, Branches, Leads, Settings) with category headers in Label-Medium neutral-500 text
4. THE Admin_Panel SHALL render filter chips as: 32px height pills with neutral-100 background, neutral-700 text, and an X button for removal
5. WHEN a filter chip is applied, THE Admin_Panel SHALL display active filters above the data table with a "Clear all" text button aligned right

### Requirement 25: Empty States and Error Pages

**User Story:** As a user, I want helpful empty states and error pages that guide me toward action, so that I never feel lost or stuck.

#### Acceptance Criteria

1. THE Component_Library SHALL render empty states with: a 120px illustration (line-art style, neutral-300), Headline-Small title, Body-Medium neutral-500 description, and a primary action button
2. THE Public_Pages SHALL render the 404 page with: centered layout, large "404" display text (neutral-200), descriptive heading, and a "Go home" primary button
3. THE Admin_Panel SHALL render empty table states with: "No [items] yet" heading, brief instructional text, and a "Create your first [item]" CTA button
4. IF a server error occurs, THEN THE Public_Pages SHALL display an error page with: an appropriate illustration, "Something went wrong" heading, and "Try again" button that refreshes the page
5. THE Component_Library SHALL ensure empty state containers maintain minimum 240px height to prevent layout collapse
