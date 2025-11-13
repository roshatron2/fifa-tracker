# Toast System

A reusable toast notification system for the FIFA Tracker web application.

## Features

- ✅ **Global toast management** - Use toasts anywhere in your app
- ✅ **Multiple toast types** - Success, error, warning, and info
- ✅ **Customizable duration** - Set how long toasts stay visible
- ✅ **Auto-dismiss** - Toasts automatically disappear after specified time
- ✅ **Manual dismiss** - Users can close toasts manually
- ✅ **Smooth animations** - Slide-in animations for better UX
- ✅ **TypeScript support** - Full type safety
- ✅ **Accessible** - Proper ARIA labels and keyboard support

## Usage

### Basic Usage

```tsx
import { useToast } from '@/components/ToastProvider';

function MyComponent() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast('Operation completed successfully!', 'success');
  };

  const handleError = () => {
    showToast('Something went wrong!', 'error');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
    </div>
  );
}
```

### Advanced Usage

```tsx
import { useToast } from '@/components/ToastProvider';

function MyComponent() {
  const { showToast } = useToast();

  const handleCustomToast = () => {
    // Custom duration (10 seconds)
    showToast('This toast will stay for 10 seconds', 'info', 10000);
  };

  return <button onClick={handleCustomToast}>Custom Duration Toast</button>;
}
```

## API Reference

### `useToast()` Hook

Returns an object with the following methods:

#### `showToast(message: string, type?: ToastType, duration?: number)`

- **message**: The text to display in the toast
- **type**: Toast type - `'success'` | `'error'` | `'warning'` | `'info'` (default: `'info'`)
- **duration**: How long the toast stays visible in milliseconds (default: `3000`)

#### `removeToast(id: string)`

Manually remove a toast by its ID (usually not needed as toasts auto-dismiss).

### Toast Types

| Type      | Color  | Icon | Use Case              |
| --------- | ------ | ---- | --------------------- |
| `success` | Green  | ✓    | Successful operations |
| `error`   | Red    | ✕    | Errors and failures   |
| `warning` | Yellow | ⚠   | Warnings and cautions |
| `info`    | Blue   | ℹ   | General information   |

## Examples

### Success Toast

```tsx
showToast('Player added successfully!', 'success');
```

### Error Toast

```tsx
showToast('Failed to save match. Please try again.', 'error');
```

### Warning Toast

```tsx
showToast('You are about to delete this tournament.', 'warning');
```

### Info Toast

```tsx
showToast('New match has been recorded.', 'info');
```

### Custom Duration

```tsx
showToast('This message stays for 5 seconds', 'info', 5000);
```

## Implementation Details

The toast system consists of three main components:

1. **`Toast.tsx`** - Individual toast component with styling and animations
2. **`ToastProvider.tsx`** - Context provider that manages toast state globally
3. **`useToast()`** - Hook for easy access to toast functions

The system is already integrated into your app layout, so you can start using `useToast()` immediately in any component.

## Migration from Existing Toast Implementations

If you have existing toast implementations in components like `MatchHistory.tsx` or `UserTournaments.tsx`, you can replace them with this centralized system:

**Before:**

```tsx
const [toasts, setToasts] = useState<Toast[]>([]);
const showToast = (message: string, type: 'success' | 'error') => {
  // ... local implementation
};
```

**After:**

```tsx
import { useToast } from '@/components/ToastProvider';

const { showToast } = useToast();
// Remove local toast state and functions
```

This provides a cleaner, more maintainable solution with consistent styling and behavior across your entire application.
