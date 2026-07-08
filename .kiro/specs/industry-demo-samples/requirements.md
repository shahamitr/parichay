# Requirements Document

## Introduction

The Industry Demo Samples feature provides pre-built, realistic demo microsites for every industry category supported by the Parichay platform. Currently, the platform has 11 industry categories but only 5 generic demo brands that do not map one-to-one to each industry. This feature ensures that every industry category (Business Owners, Corporate Professionals, Event Planners, Freelancers & Consultants, Educational Institutions, Creatives & Designers, Real Estate Agents, Healthcare Professionals, Restaurants & Cafes, Fitness & Wellness, Legal Services) has a dedicated, fully configured demo microsite. Sales teams can show prospects a live demo matching their industry with one click, and customers browsing the platform can see exactly how Parichay would look for their business type.

## Glossary

- **Demo_Catalog**: The public-facing page that lists all available industry demo microsites, organized by industry category
- **Demo_Microsite**: A fully configured, read-only microsite instance created from demo seed data, representing a realistic business in a specific industry
- **Industry_Category**: One of the 11 supported business verticals defined in `src/data/categories.ts` (e.g., Business Owners, Healthcare Professionals, Restaurants & Cafes)
- **Demo_Seed_Script**: The TypeScript seed script (`prisma/seed-demo.ts`) that programmatically creates demo brands, branches, users, leads, and analytics data in the database
- **Microsite_Config**: The JSON configuration stored in the Branch model's `micrositeConfig` field, containing all section configurations (hero, about, services, gallery, team, testimonials, booking, contact)
- **Industry_Template**: A predefined content template from `src/data/industry-templates.ts` containing sample section data for a specific business type
- **Layout_Template**: One of the 15 layout configurations from `src/data/layout-options.ts` that controls visual structure (hero style, gallery layout, spacing, typography)
- **Color_Theme**: The JSON object on the Brand model containing primary, secondary, and accent color values
- **Demo_User**: A platform user account created specifically for demo purposes, with credentials following the pattern `[name]@demo.parichay.io` / `Demo@123`
- **One_Click_Preview**: The ability for a sales team member or prospect to navigate directly to a live demo microsite for a specific industry with a single click from the Demo_Catalog

## Requirements

### Requirement 1: Full Industry Coverage in Demo Seed Data

**User Story:** As a platform administrator, I want the demo seed script to create a dedicated demo microsite for every industry category, so that no industry is left without a showcase.

#### Acceptance Criteria

1. WHEN the Demo_Seed_Script is executed, THE Demo_Seed_Script SHALL create exactly one Demo_Microsite (brand + branch + Demo_User) for each of the 11 Industry_Category entries defined in `src/data/categories.ts`
2. WHEN the Demo_Seed_Script is executed, THE Demo_Seed_Script SHALL assign each Demo_Microsite a unique brand slug following the pattern `demo-{industry-slug}` (e.g., `demo-business-owners`, `demo-healthcare-professionals`)
3. WHEN the Demo_Seed_Script is executed, THE Demo_Seed_Script SHALL create a Demo_User for each Demo_Microsite with email format `{industry-slug}@demo.parichay.io` and password `Demo@123`
4. WHEN the Demo_Seed_Script is executed, THE Demo_Seed_Script SHALL set the `industryCategory` field on each Demo_User to the corresponding Industry_Category identifier
5. IF the Demo_Seed_Script encounters an existing demo brand with the same slug, THEN THE Demo_Seed_Script SHALL delete the existing demo data before re-creating the Demo_Microsite to ensure a clean state

### Requirement 2: Industry-Specific Microsite Content

**User Story:** As a sales team member, I want each demo microsite to contain realistic, industry-appropriate content, so that prospects can immediately see how Parichay fits their business.

#### Acceptance Criteria

1. THE Demo_Seed_Script SHALL populate each Demo_Microsite's Microsite_Config with industry-specific content for all supported sections: hero, about, services, gallery, team, testimonials, booking, and contact
2. WHEN a Demo_Microsite is created for an Industry_Category that has a matching Industry_Template in `src/data/industry-templates.ts`, THE Demo_Seed_Script SHALL use that Industry_Template's content as the base configuration
3. WHEN a Demo_Microsite is created for an Industry_Category that does not have a matching Industry_Template, THE Demo_Seed_Script SHALL generate realistic placeholder content appropriate to that industry (e.g., practice areas for Legal Services, class schedules for Fitness & Wellness)
4. THE Demo_Seed_Script SHALL populate each Demo_Microsite with a minimum of 3 service items, 2 team members, 2 testimonials, and 4 gallery images
5. THE Demo_Seed_Script SHALL set the hero section title to the demo business name and the subtitle to a tagline relevant to the Industry_Category

### Requirement 3: Industry-Appropriate Visual Theming

**User Story:** As a prospect browsing demos, I want each demo microsite to have a visual theme that matches the industry, so that I can see how my business type would look on the platform.

#### Acceptance Criteria

1. THE Demo_Seed_Script SHALL assign each Demo_Microsite's brand a Color_Theme matching the `colorScheme` defined in the corresponding Industry_Category entry in `src/data/categories.ts`
2. THE Demo_Seed_Script SHALL assign each Demo_Microsite a Layout_Template from the 15 available options in `src/data/layout-options.ts` that is appropriate for the Industry_Category (e.g., `restaurant-hospitality` for Restaurants & Cafes, `fitness-energy` for Fitness & Wellness, `luxury-boutique` for Legal Services)
3. THE Demo_Seed_Script SHALL ensure no two Demo_Microsites use the same Layout_Template, unless the total number of Industry_Category entries exceeds the number of available Layout_Template options

### Requirement 4: Demo Catalog Page

**User Story:** As a sales team member, I want a single page that lists all industry demos organized by category, so that I can quickly find and show the right demo to a prospect.

#### Acceptance Criteria

1. THE Demo_Catalog SHALL display all 11 Industry_Category entries as selectable cards, each showing the category name, icon, description, and Color_Theme
2. WHEN a user clicks on an Industry_Category card in the Demo_Catalog, THE Demo_Catalog SHALL navigate the user directly to the corresponding Demo_Microsite's live preview page
3. THE Demo_Catalog SHALL be accessible at the URL path `/demo/industries`
4. THE Demo_Catalog SHALL load the list of available Demo_Microsites from the database, filtering brands by the `demo-` slug prefix
5. IF a Demo_Microsite does not exist for a given Industry_Category, THEN THE Demo_Catalog SHALL display the category card in a disabled state with a "Coming Soon" label
6. THE Demo_Catalog SHALL include a search input that filters the displayed Industry_Category cards by name

### Requirement 5: One-Click Demo Access from Category Selection

**User Story:** As a prospect exploring the platform, I want to see a live demo for my industry type during onboarding or browsing, so that I can evaluate the platform before signing up.

#### Acceptance Criteria

1. WHEN a user views an Industry_Category detail on the landing page or onboarding flow, THE Platform SHALL display a "View Live Demo" button that links to the corresponding Demo_Microsite
2. WHEN the `demoUrl` field is defined on an Industry_Category entry in `src/data/categories.ts`, THE Platform SHALL use that URL for the demo link
3. WHEN the `demoUrl` field is not defined on an Industry_Category entry, THE Platform SHALL construct the demo link using the pattern `/{demo-brand-slug}/{branch-slug}`
4. THE Platform SHALL update the `demoUrl` field on all 11 Industry_Category entries in `src/data/categories.ts` to point to the corresponding Demo_Microsite URLs

### Requirement 6: Demo Data Integrity and Sample Analytics

**User Story:** As a sales team member, I want demo microsites to include sample leads and analytics data, so that I can demonstrate the platform's CRM and analytics capabilities during a demo.

#### Acceptance Criteria

1. WHEN the Demo_Seed_Script is executed, THE Demo_Seed_Script SHALL create a minimum of 5 sample leads for each Demo_Microsite with realistic names, contact details, and varied lead statuses (NEW, CONTACTED, QUALIFIED, CONVERTED)
2. WHEN the Demo_Seed_Script is executed, THE Demo_Seed_Script SHALL create a minimum of 30 analytics events per Demo_Microsite, distributed across event types (PAGE_VIEW, CLICK, QR_SCAN, LEAD_SUBMIT, VCARD_DOWNLOAD) and spread over the preceding 30 days
3. WHEN the Demo_Seed_Script is executed, THE Demo_Seed_Script SHALL create sample QR codes for each Demo_Microsite
4. THE Demo_Seed_Script SHALL set realistic timestamps on all sample data, with creation dates distributed over the preceding 30 days to simulate organic activity

### Requirement 7: Demo Microsite Read-Only Protection

**User Story:** As a platform administrator, I want demo microsites to be protected from accidental modification by public visitors, so that the demos remain consistent and always available.

#### Acceptance Criteria

1. THE Platform SHALL render Demo_Microsite pages in a read-only mode where contact forms and booking forms collect submissions without modifying the demo configuration
2. WHEN a lead form is submitted on a Demo_Microsite, THE Platform SHALL store the lead in the database associated with the Demo_Microsite's branch, allowing the CRM demo to function
3. THE Platform SHALL display a banner or badge on Demo_Microsite pages indicating that the page is a demo preview
4. THE Platform SHALL prevent Demo_User accounts from modifying the Microsite_Config of Demo_Microsites through the admin dashboard, unless the user has the SUPER_ADMIN role

### Requirement 8: Demo Seed Script Idempotency and Maintenance

**User Story:** As a developer, I want the demo seed script to be safely re-runnable, so that I can refresh demo data without manual cleanup or data corruption.

#### Acceptance Criteria

1. WHEN the Demo_Seed_Script is executed multiple times, THE Demo_Seed_Script SHALL produce the same result as executing the script once (idempotent behavior)
2. THE Demo_Seed_Script SHALL delete all existing demo-prefixed brands, associated branches, users, leads, analytics events, and QR codes before creating new demo data
3. THE Demo_Seed_Script SHALL log progress messages to the console indicating the number of Demo_Microsites created, the number of leads generated, and the number of analytics events generated
4. IF the Demo_Seed_Script fails during execution, THEN THE Demo_Seed_Script SHALL log a descriptive error message including the Industry_Category that caused the failure
5. THE Demo_Seed_Script SHALL complete execution for all 11 Industry_Category entries within 60 seconds on a standard development environment
