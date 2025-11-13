'use client';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

export default function ToastComponent({ toast, onRemove }: ToastProps) {
  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      case 'info':
        return 'bg-blue-500 border-blue-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div
      className={`${getToastStyles(toast.type)} text-white px-4 py-3 rounded-lg shadow-lg border flex items-center justify-between min-w-[300px] max-w-[500px] animate-in slide-in-from-right duration-300`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg font-bold">{getIcon(toast.type)}</span>
        <span className="flex-1">{toast.message}</span>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-3 text-white hover:text-gray-200 transition-colors text-xl font-bold"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
