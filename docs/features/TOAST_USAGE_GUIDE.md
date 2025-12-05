# Toast Notification System - Usage Guide

## Overview

A reusable toast/snackbar notification system has been implemented for showing success, error, info, and warning messages throughout the application.

## Components Created

1. **Toast Component** (`src/components/ui/Toast.tsx`)
   - Individual toast notification with auto-dismiss
   - Supports 4 types: success, error, info, warning
   - Animated slide-up entrance
   - Manual close button

2. **Toast Context** (`src/lib/toast-context.tsx`)
   - Global toast management
   - Multiple toasts support
   - Easy-to-use hooks

3. **Toast Provider** (Added to `src/app/layout.tsx`)
   - Wraps entire application
   - Available in all components

## Usage

### Basic Usage

```typescript
'use client';

import { useToast } from '@/lib/toast-context';

export default function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Operation completed successfully!');
  };

  const handleError = () => {
    toast.error('Something went wrong!');
  };

  const handleInfo = () => {
    toast.info('Here is some information');
  };

  const handleWarning = () => {
    toast.warning('Please be careful!');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleInfo}>Show Info</button>
      <button onClick={handleWarning}>Show Warning</button>
    </div>
  );
}
```

### CRUD Operations

#### Create Operation
```typescript
const handleCreate = async () => {
  try {
    const response = await fetch('/api/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast.success('Item created successfully');
    } else {
      toast.error('Failed to create item');
    }
  } catch (error) {
    toast.error('An error occurred');
  }
};
```

#### Update Operation
```typescript
const handleUpdate = async () => {
  try {
    const response = await fetch(`/api/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast.success('Item updated successfully');
    } else {
      toast.error('Failed to update item');
    }
  } catch (error) {
    toast.error('An error occurred');
  }
};
```

#### Delete Operation
```typescript
const handleDelete = async () => {
  try {
    const response = await fetch(`/api/items/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      toast.success('Item deleted successfully');
    } else {
      toast.error('Failed to delete item');
    }
  } catch (error) {
    toast.error('An error occurred');
  }
};
```

## Toast Types

### Success (Green)
- Use for: Successful operations, confirmations
- Example: "Item saved successfully", "Profile updated"

### Error (Red)
- Use for: Failed operations, errors
- Example: "Failed to save", "Invalid input"

### Info (Blue)
- Use for: Informational messages
- Example: "Loading data...", "Processing request"

### Warning (Yellow)
- Use for: Warnings, cautions
- Example: "Unsaved changes", "Action cannot be undone"

## Features

- ✅ Auto-dismiss after 3 seconds (configurable)
- ✅ Manual close button
- ✅ Smooth slide-up animation
- ✅ Multiple toasts support (stacked)
- ✅ Responsive design
- ✅ Fixed position (bottom-right)
- ✅ Z-index 50 (appears above most content)

## Configuration

### Custom Duration

```typescript
// In Toast component usage (if needed)
<Toast
  message="Custom duration"
  type="success"
  onClose={handleClose}
  duration={5000}  // 5 seconds
/>
```

### Position

Currently fixed at bottom-right. To change position, modify the CSS in:
- `src/components/ui/Toast.tsx` - Individual toast
- `src/lib/toast-context.tsx` - Toast container

## Pages Updated

1. **Settings Page** (`src/app/dashboard/settings/page.tsx`)
   - Removed inline success message
   -toast notifications for save operations

## Next Steps - Pages to Update

Update these pages to use toast notifications:

1. **Profile Page** (`src/app/dashboard/profile/page.tsx`)
   - Profile update success/error

2. **Brands Page** (`src/app/dashboard/brands/page.tsx`)
   - Brand create/update/delete operations

3. **Branches Page** (`src/app/dashboard/branches/page.tsx`)
   - Branch create/update/delete operations

4. **Leads Page** (`src/app/dashboard/leads/page.tsx`)
   - Lead operations

5. **Subscription Page** (`src/app/dashboard/subscription/page.tsx`)
   - Subscription updates

## Example Pattern for All Pages

```typescript
'use client';

import { useToast } from '@/lib/toast-context';

export default function MyPage() {
  const toast = useToast();

  const handleCreate = async (data: any) => {
    try {
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Created successfully');
        // Refresh data, close modal, etc.
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/endpoint/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Updated successfully');
      } else {
        toast.error('Failed to update');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    try {
      const response = await fetch(`/api/endpoint/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Deleted successfully');
      } else {
        toast.error('Failed to delete');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    // Your component JSX
  );
}
```

## Styling

Toast notifications use Tailwind CSS classes and are fully responsive. Colors are predefined for each type:

- Success: `bg-green-500`
- Error: `bg-red-500`
- Info: `bg-blue-500`
- Warning: `bg-yellow-500`

## Accessibility

- Toasts auto-dismiss after 3 seconds
- Manual close button available
- Screen reader friendly (uses semantic HTML)
- Keyboard accessible (close button is focusable)

---

**Status: Toast System Implemented** ✅

The toast notification system is ready to use throughout the application!
