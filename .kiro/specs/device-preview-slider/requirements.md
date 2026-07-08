# Requirements Document

## Introduction

The Device Preview Slider feature adds a device-frame preview tool to the Parichay (Zintro) admin panel. It allows shop owners and marketing personnel to visualize how a customer-facing microsite or invitation page renders on mobile and tablet devices without leaving the admin interface. This aids in quality assurance during microsite building and enhances sales demonstrations by showcasing the responsive experience to potential clients.

## Glossary

- **Preview_Slider**: The UI component containing a toggle/slider control that switches between device frame views (mobile, tablet, desktop)
- **Device_Frame**: A visual wrapper that simulates the physical dimensions and chrome of a specific device category (mobile phone, tablet, or desktop browser)
- **Admin_Panel**: The authenticated dashboard area at `/admin` used by shop owners and platform administrators to manage brands, branches, and microsites
- **Microsite**: A customer-facing single-page web experience for a brand/branch, accessible via a custom URL or QR code
- **Preview_Viewport**: The iframe or container that renders the microsite content within the selected Device_Frame dimensions
- **Demo_Mode**: A presentation-oriented view optimized for marketing demonstrations, hiding admin chrome and focusing on the device preview

## Requirements

### Requirement 1: Device Frame Selection

**User Story:** As a shop owner, I want to switch between mobile, tablet, and desktop device frames so that I can verify how my microsite looks on each device category.

#### Acceptance Criteria

1. THE Preview_Slider SHALL provide selectable device frame options for mobile (375×667px), tablet (768×1024px), and desktop (1280×800px) viewports
2. WHEN a device frame option is selected, THE Preview_Viewport SHALL resize its width and height to match the selected device dimensions within 300ms while preserving the current microsite scroll position and content state
3. THE Preview_Slider SHALL visually indicate which device frame is currently active by displaying the active option in a visually distinct selected state (e.g., highlighted background or border) that differs from the inactive options by at least one perceivable attribute (color, weight, or outline)
4. THE Preview_Slider SHALL default to the mobile device frame when first opened from the admin builder or Demo_Mode
5. IF the currently active device frame option is selected again, THEN THE Preview_Slider SHALL take no action and the Preview_Viewport SHALL remain unchanged

### Requirement 2: Live Microsite Rendering

**User Story:** As a shop owner, I want to see a live rendering of my microsite inside the selected device frame so that I can evaluate the actual customer experience.

#### Acceptance Criteria

1. WHEN a device frame is selected, THE Preview_Viewport SHALL render the current microsite content at the selected viewport dimensions within 2 seconds of frame selection
2. WHEN the microsite content height exceeds the device frame height, THE Preview_Viewport SHALL display the content as scrollable within the frame using native vertical scrolling
3. WHEN the microsite content is updated in the admin builder, THE Preview_Viewport SHALL reflect those changes within 3 seconds without requiring a full page reload
4. IF the microsite fails to load within 10 seconds or returns a network error, THEN THE Preview_Viewport SHALL display an error message indicating the failure reason and a retry button that re-attempts loading the microsite
5. IF the retry action is triggered and the microsite fails to load again, THEN THE Preview_Viewport SHALL display the error message with the retry button remaining available for subsequent attempts

### Requirement 3: Admin Panel Integration

**User Story:** As a shop owner, I want to access the device preview from the microsite builder section of the admin panel so that I can check responsiveness during content editing.

#### Acceptance Criteria

1. THE Admin_Panel SHALL display the Preview_Slider toggle control within the microsite builder page at `/admin/microsite/[branchId]`
2. WHEN the Preview_Slider toggle is activated, THE Admin_Panel SHALL display the Device_Frame in a side-by-side split layout adjacent to the builder controls
3. WHILE the user scrolls through the admin builder page, THE Preview_Slider toggle SHALL remain visible in a fixed or sticky position within the viewport
4. WHEN the browser window width is below 1024px, THE Preview_Slider SHALL switch to an overlay/modal presentation instead of side-by-side layout
5. WHEN the user modifies content in the builder, THE Device_Frame SHALL refresh to reflect the updated content within 2 seconds without requiring a manual reload
6. THE Device_Frame SHALL provide at least three device-size presets: mobile (max-width 375px), tablet (max-width 768px), and desktop (max-width 1440px)

### Requirement 4: Device Frame Visual Chrome

**User Story:** As a shop owner, I want to see realistic device bezels around the preview so that I can better understand the physical context of the customer's viewing experience.

#### Acceptance Criteria

1. THE Device_Frame SHALL render a visual bezel including device-characteristic elements for the selected category: a notch and home bar indicator for mobile, rounded corners for tablet, and a browser-style title bar for desktop
2. WHEN the device frame is mobile or tablet, THE Device_Frame SHALL display a static status bar containing a time placeholder and a battery icon above the Preview_Viewport
3. WHEN the device frame is mobile, THE Device_Frame SHALL render in portrait orientation (375×667px viewport) by default
4. WHEN the device frame is tablet, THE Device_Frame SHALL render in landscape orientation (1024×768px viewport) by default
5. THE Device_Frame SHALL provide an orientation toggle control for mobile and tablet frames that swaps width and height dimensions and completes the viewport transition within 300ms
6. WHEN the orientation toggle is activated, THE Preview_Viewport SHALL re-render the microsite content at the swapped dimensions without requiring a full page reload

### Requirement 5: Demo Mode for Marketing Presentations

**User Story:** As a marketing person, I want a fullscreen demo mode that hides admin controls and centers the device preview so that I can present the product cleanly to potential clients.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide a "Demo Mode" button within the microsite builder page that activates the Demo_Mode view using the browser Fullscreen API
2. WHEN the "Demo Mode" button is activated, THE Admin_Panel SHALL hide the sidebar, header, and builder controls and display only the Device_Frame centered on a solid single-color background
3. WHILE Demo_Mode is active, THE Preview_Slider SHALL remain visible and positioned so it does not overlap the Device_Frame, to allow switching between device frames during the demonstration
4. WHILE Demo_Mode is active, WHEN the Escape key is pressed, THE Admin_Panel SHALL exit Demo_Mode and restore the standard admin layout within 300ms
5. WHILE Demo_Mode is active, THE Device_Frame SHALL scale to occupy at least 80% of the available viewport dimension (width or height, whichever is the constraining axis) while maintaining the selected device aspect ratio
6. IF Demo_Mode is activated when no microsite is loaded in the Preview_Viewport, THEN THE Admin_Panel SHALL display an informational message indicating that a microsite must be selected before entering Demo_Mode and SHALL NOT enter Demo_Mode

### Requirement 6: Preview URL Selection

**User Story:** As a shop owner, I want to preview any of my brand/branch microsites in the device frame so that I can check all my pages without navigating away.

#### Acceptance Criteria

1. THE Preview_Slider SHALL provide a dropdown listing all branches belonging to the current user's brand, displaying each branch name and its published/draft status
2. WHEN a different brand/branch is selected from the dropdown, THE Preview_Viewport SHALL display a loading indicator and load that microsite within the current device frame within 3 seconds
3. WHEN the Preview_Slider is accessed from the builder at `/admin/microsite/[branchId]`, THE Preview_Slider SHALL default the dropdown selection to the branch currently being edited
4. IF the selected microsite has not been published, THEN THE Preview_Viewport SHALL render the draft version with a "Draft" indicator badge visible within the Device_Frame chrome area
5. IF the selected branch has neither a published nor a draft microsite available, THEN THE Preview_Viewport SHALL display an empty-state message indicating no content is available for preview
6. IF the microsite fails to load within 3 seconds, THEN THE Preview_Viewport SHALL display an error message with a retry action

### Requirement 7: Keyboard and Accessibility Support

**User Story:** As a shop owner using assistive technology, I want the device preview controls to be keyboard accessible so that I can operate the preview feature without a mouse.

#### Acceptance Criteria

1. THE Preview_Slider SHALL allow the user to navigate between device frame options using Arrow keys, activate a device frame option using Enter or Space, and move focus to and from the Preview_Slider using Tab and Shift+Tab
2. THE Preview_Slider SHALL provide ARIA labels for each device frame option that convey the device name and its viewport dimensions (e.g., "Mobile 375 by 667 pixels"), and SHALL assign a group role to the set of device frame options
3. WHEN a device frame option receives focus, THE Preview_Slider SHALL display a visible focus indicator with a minimum contrast ratio of 3:1 against adjacent colors, meeting WCAG 2.1 AA non-text contrast requirements
4. WHEN the active device frame changes, THE Preview_Viewport SHALL update its accessible label to include the current device name and viewport dimensions, and SHALL announce the change to screen readers via a live region
5. WHEN Demo_Mode is activated via keyboard, THE Preview_Slider SHALL move focus to the first device frame option, and WHEN Demo_Mode is exited, THE Preview_Slider SHALL return focus to the Demo Mode trigger button
