# Implementation Plan: Device Preview Slider

## Overview

Implement a client-side device preview slider for the Parichay admin panel's microsite builder. The feature renders microsites within realistic device frames (mobile, tablet, desktop) using iframe-based rendering, Zustand state management, and Framer Motion transitions. The implementation follows the component architecture defined in the design document, building incrementally from state management through UI components to Demo Mode.

## Tasks

- [ ] 1. Set up project structure and core state management
  - [ ] 1.1 Create device presets configuration and utility functions
    - Create `src/config/device-presets.ts` with the `DEVICE_PRESETS` array and `DevicePreset` type
    - Create `src/lib/preview-utils.ts` with `computeViewportDimensions`, `computeDemoScale`, and `getLayoutMode` pure functions
    - Export all types: `DeviceType`, `Orientation`, `PreviewStatus`, `DevicePreset`
    - _Requirements: 1.1, 4.3, 4.4, 5.5_

  - [ ]* 1.2 Write property tests for viewport dimension computation
    - **Property 9: Viewport dimension computation correctness**
    - Test that `computeViewportDimensions` returns swapped dimensions when orientation differs from default and device supports toggle, and original dimensions otherwise
    - **Property 2: Orientation toggle is a self-inverse (round-trip)**
    - Test that applying orientation swap twice returns original dimensions for all presets
    - **Validates: Requirements 1.2, 4.3, 4.4, 4.5**

  - [ ]* 1.3 Write property tests for layout mode and demo scaling
    - **Property 4: Responsive layout mode threshold**
    - Test that `getLayoutMode` returns `'overlay'` for width < 1024 and `'side-by-side'` for width >= 1024
    - **Property 5: Demo mode scaling preserves aspect ratio and fills viewport**
    - Test that `computeDemoScale` satisfies aspect ratio preservation, 80% minimum fill, and no overflow constraints
    - **Validates: Requirements 3.4, 5.5**

  - [ ] 1.4 Create the Zustand preview store
    - Create `src/lib/preview-store.ts` implementing the `PreviewState` interface from the design
    - Implement all actions: `togglePanel`, `selectDevice`, `toggleOrientation`, `selectBranch`, `setStatus`, `enterDemoMode`, `exitDemoMode`, `refresh`
    - `selectDevice` should update viewport dimensions via `computeViewportDimensions`
    - `enterDemoMode` should return `false` and not transition if no branch is loaded
    - `refresh` should increment a `refreshKey` counter
    - _Requirements: 1.2, 1.4, 1.5, 5.6_

  - [ ]* 1.5 Write property test for device selection idempotence
    - **Property 1: Device selection idempotence**
    - Test that calling `selectDevice` with the already-active device produces no state change (viewport dimensions, orientation, content state remain identical)
    - **Validates: Requirements 1.5**

- [ ] 2. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Implement device frame and preview viewport components
  - [ ] 3.1 Create the DeviceFrame component
    - Create `src/components/preview/DeviceFrame.tsx`
    - Render device chrome: notch + home bar for mobile, rounded corners for tablet, browser title bar for desktop
    - Render static status bar (time placeholder + battery icon) for mobile and tablet only
    - Accept `device`, `orientation`, `width`, `height`, `children`, `isDemoMode` props
    - Use Framer Motion `layoutId` and `animate` for 300ms viewport transitions
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 3.2 Create the PreviewViewport component
    - Create `src/components/preview/PreviewViewport.tsx`
    - Render sandboxed iframe with `sandbox="allow-scripts allow-same-origin"` to load microsite URL
    - Construct iframe src as the microsite public URL for the selected branch
    - Handle `onLoad` and `onError` events to update preview status
    - Implement 10-second loading timeout that triggers error state
    - Display error message with retry button when status is `'error'`
    - Display loading spinner/skeleton when status is `'loading'`
    - Display empty-state message when branch has no microsite content
    - Show "Draft" indicator badge when branch status is `'draft'`
    - Use `refreshKey` prop to force iframe reload on content changes
    - Enable native vertical scrolling within the iframe container
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.4, 6.5_

  - [ ]* 3.3 Write unit tests for DeviceFrame and PreviewViewport
    - Test status bar renders only for mobile and tablet devices
    - Test correct device chrome elements per device type (notch for mobile, rounded corners for tablet, title bar for desktop)
    - Test error state rendering with retry button
    - Test loading state rendering
    - Test empty-state message rendering
    - Test draft badge visibility
    - _Requirements: 4.1, 4.2, 2.4, 6.4, 6.5_

- [ ] 4. Implement device selector and orientation controls
  - [ ] 4.1 Create the DeviceSelector component
    - Create `src/components/preview/DeviceSelector.tsx`
    - Render radio group with `role="radiogroup"` containing options for each device preset
    - Each option uses `role="radio"` with `aria-checked` state
    - Display active device with visually distinct selected state (highlighted background/border)
    - Implement Arrow key navigation between options with wrap-around
    - Implement Enter/Space activation of focused option
    - Generate ARIA labels containing device name and dimensions (e.g., "Mobile 375 by 667 pixels")
    - Create `formatAriaLabel` utility function in `src/lib/preview-utils.ts`
    - _Requirements: 1.1, 1.3, 7.1, 7.2, 7.3_

  - [ ] 4.2 Create the OrientationToggle component
    - Create `src/components/preview/OrientationToggle.tsx`
    - Render toggle button that swaps width/height for mobile and tablet frames
    - Hide/disable for desktop frame (no orientation toggle)
    - Include accessible label describing the orientation action
    - _Requirements: 4.5, 4.6_

  - [ ]* 4.3 Write property tests for ARIA labels and keyboard navigation
    - **Property 7: ARIA labels contain device name and dimensions**
    - Test that `formatAriaLabel` output contains device type name, width, and height for all presets
    - **Property 6: Keyboard navigation correctness**
    - Test that Arrow key sequences move focus correctly with boundary wrapping/clamping
    - **Validates: Requirements 7.1, 7.2**

  - [ ]* 4.4 Write unit tests for DeviceSelector and OrientationToggle
    - Test default mobile selection on mount
    - Test visual active indicator state changes
    - Test orientation toggle hidden for desktop
    - Test aria-checked synchronization
    - _Requirements: 1.3, 1.4, 4.5, 7.2_

- [ ] 5. Implement branch dropdown and live region
  - [ ] 5.1 Create the BranchDropdown component
    - Create `src/components/preview/BranchDropdown.tsx`
    - Fetch branches from existing `/api/brands/[id]` endpoint using the current user's brand context
    - Display each branch name with published/draft/none status badge
    - Default selection to the branch from the current route (`/admin/microsite/[branchId]`)
    - Show loading indicator when branch microsite is loading
    - Handle API fetch errors with error state in dropdown
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ] 5.2 Create the live region for accessibility announcements
    - Add `aria-live="polite"` region element to `PreviewSliderPanel`
    - Update live region text when active device changes (include device name and dimensions)
    - Update accessible label on `PreviewViewport` container when device changes
    - _Requirements: 7.4_

  - [ ]* 5.3 Write property test for live region announcements
    - **Property 8: Live region announces device changes**
    - Test that for any device transition from A to B (where A ≠ B), the live region text includes the new device name and viewport dimensions
    - **Validates: Requirements 7.4**

  - [ ]* 5.4 Write unit tests for BranchDropdown
    - Test default selection from route params
    - Test draft badge rendering for unpublished microsites
    - Test empty state for branches with no content
    - Test loading state during branch fetch
    - _Requirements: 6.1, 6.3, 6.4, 6.5_

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement the PreviewSliderPanel container and layout integration
  - [ ] 7.1 Create the PreviewSliderPanel component
    - Create `src/components/preview/PreviewSliderPanel.tsx`
    - Compose `DeviceSelector`, `BranchDropdown`, `OrientationToggle`, `DemoModeButton`, `DeviceFrame`, and `PreviewViewport`
    - Connect all sub-components to `usePreviewStore`
    - Implement responsive layout: side-by-side for ≥1024px, overlay/modal for <1024px
    - Use `useMediaQuery` hook (or `window.matchMedia`) to detect layout mode
    - Apply Framer Motion `AnimatePresence` for panel open/close transitions
    - Include the `aria-live` region element
    - _Requirements: 3.2, 3.4_

  - [ ] 7.2 Integrate PreviewSliderPanel into the microsite builder page
    - Add preview toggle button to the microsite builder page at `/admin/microsite/[branchId]`
    - Render `PreviewSliderPanel` conditionally based on `isOpen` from store
    - Ensure toggle button remains in a fixed/sticky position while scrolling
    - Wire content update events from builder to trigger `refresh()` on the store
    - _Requirements: 3.1, 3.3, 3.5, 2.3_

  - [ ]* 7.3 Write property test for content update triggers refresh
    - **Property 3: Content update triggers preview refresh**
    - Test that for any content modification event, the preview refresh mechanism is triggered exactly once (refreshKey increments by 1)
    - **Validates: Requirements 2.3, 3.5**

  - [ ]* 7.4 Write unit tests for PreviewSliderPanel layout behavior
    - Test side-by-side layout at ≥1024px window width
    - Test overlay/modal layout at <1024px window width
    - Test sticky positioning of toggle button
    - Test panel open/close transitions
    - _Requirements: 3.2, 3.3, 3.4_

- [ ] 8. Implement Demo Mode
  - [ ] 8.1 Create the DemoModeOverlay component
    - Create `src/components/preview/DemoModeOverlay.tsx`
    - Use browser Fullscreen API (`document.documentElement.requestFullscreen()`)
    - Implement CSS fullscreen fallback when Fullscreen API is not supported
    - Hide sidebar, header, and builder controls; show only DeviceFrame on solid background
    - Keep `DeviceSelector` visible and positioned to not overlap DeviceFrame
    - Scale DeviceFrame using `computeDemoScale` to fill at least 80% of viewport
    - Implement Escape key listener to exit Demo Mode
    - Manage focus: move focus to first device option on enter, return to trigger button on exit
    - Show informational toast when Demo Mode is activated with no microsite loaded (guard condition)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 7.5_

  - [ ]* 8.2 Write unit tests for DemoModeOverlay
    - Test Escape key exits Demo Mode
    - Test focus moves to first device option on enter
    - Test focus returns to Demo Mode button on exit
    - Test guard condition prevents entry with no microsite loaded
    - Test DeviceSelector remains visible in Demo Mode
    - _Requirements: 5.1, 5.4, 5.6, 7.5_

- [ ] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document using `vitest` + `fast-check`
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript throughout, matching the existing project stack (Next.js, Zustand, Framer Motion, Tailwind CSS)
- All components go in `src/components/preview/` directory as specified in the design
- Full WCAG compliance validation requires manual testing with assistive technologies and expert accessibility review

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["1.5", "3.1", "3.2"] },
    { "id": 3, "tasks": ["3.3", "4.1", "4.2"] },
    { "id": 4, "tasks": ["4.3", "4.4", "5.1", "5.2"] },
    { "id": 5, "tasks": ["5.3", "5.4", "7.1"] },
    { "id": 6, "tasks": ["7.2"] },
    { "id": 7, "tasks": ["7.3", "7.4", "8.1"] },
    { "id": 8, "tasks": ["8.2"] }
  ]
}
```
