# Industry Categories Feature - Specification

## Overview

This specification defines a comprehensive industry-specific experience for OneTouch BizCard, targeting six key user categories with tailored content, templates, and themes.

## Target Industries

1. **Business Owners** - Entrepreneurs and business owners
2. **Corporate Professionals** - Corporate employees and executives
3. **Event Planners** - Event organizers and coordinators
4. **Freelancers & Consultants** - Independent professionals
5. **Educational Institutions** - Schools, colleges, training centers
6. **Creatives & Designers** - Artists, designers, creative professionals

## Features to Implement

### ✅ 1. Landing Page Sections
- Dedicated section for each industry
- Industry-specific benefits and features
- Call-to-action buttons
- Responsive design

### ✅ 2. Industry-Specific Templates
- Minimum 2 templates per industry (12 total)
- Pre-filled sample content
- Industry-appropriate sections
- Fully customizable

### ✅ 3. Marketing Content
- Feature highlights per industry
- Use cases and success stories
- Industry-relevant benefits
- Editable by admins

### ✅ 4. Registration with Category Selection
- Industry selection during signup
- Optional step (can skip)
- Stored in user profile
- Drives template recommendations

### ✅ 5. Industry-Specific Themes
- One theme per industry minimum
- Industry-appropriate colors
- Professional typography
- Instant application

### ✅ 6. System Settings Configuration
- Enable/disable categories
- Edit category details
- Manage templates and themes
- Super Admin only

## Documents

- **requirements.md** - Detailed requirements with user stories
- **design.md** - Technical design and architecture
- **tasks.md** - Implementation task breakdown

## Implementation Approach

This is a large feature that will be implemented incrementally:

1. **Phase 1**: Data layer and API endpoints
2. **Phase 2**: Landing page sections
3. **Phase 3**: Registration flow
4. **Phase 4**: Templates and themes
5. **Phase 5**: System settings
6. **Phase 6**: Polish and optimization

## Estimated Effort

- **Data Setup**: 2-3 hours
- **Landing Page**: 3-4 hours
- **Registration Flow**: 2-3 hours
- **Templates**: 4-6 hours
- **Themes**: 3-4 hours
- **System Settings**: 2-3 hours
- **Testing & Polish**: 2-3 hours

**Total**: 18-26 hours

## Dependencies

- Existing user registration system
- Microsite creation system
- System settings page
- Toast notification system
- Drawer components

## Success Criteria

- All 6 industries have dedicated landing sections
- Users can select industry during registration
- Each industry has at least 2 templates
- Each industry has at least 1 theme
- Admins can manage categories in settings
- All features work responsively
- Toast notifications for all actions

## Next Steps

1. Review requirements with stakeholders
2. Approve design approach
3. Begin implementation starting with Task 1
4. Iterate based on feedback

## Questions to Resolve

1. Should we allow users to change their category after registration?
2. Should templates be exclusive to categories or can users browse all?
3. Do we need analytics per industry category?
4. Should we add more than 2 templates per industry initially?
5. Do we need industry-specific onboarding tutorials?

---

**Status**: Specification Complete - Ready for Implementation

To begin implementation, start with Task 1.1 in tasks.md
