'use client';

import { useToast } from '@/components/ToastProvider';

export default function ToastExample() {
  const { showToast } = useToast();

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-xl font-bold mb-4">Toast Examples</h2>

      <div className="space-x-2">
        <button
          onClick={() => showToast('Success message!', 'success')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Success Toast
        </button>

        <button
          onClick={() => showToast('Error message!', 'error')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Error Toast
        </button>

        <button
          onClick={() => showToast('Warning message!', 'warning')}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Warning Toast
        </button>

        <button
          onClick={() => showToast('Info message!', 'info')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Info Toast
        </button>

        <button
          onClick={() => showToast('Custom duration (10s)', 'info', 10000)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Custom Duration
        </button>
      </div>
    </div>
  );
}
