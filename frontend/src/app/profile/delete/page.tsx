'use client';

import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
} from '@/components/Icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/auth';
import { deleteUserAccount } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteAccountPage() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [confirmationText, setConfirmationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const requiredText = 'DELETE MY ACCOUNT';
  const isConfirmationValid = confirmationText === requiredText;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationText(e.target.value);
    if (error) setError('');
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConfirmationValid) {
      setError('Please type the exact confirmation text to proceed.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await deleteUserAccount(confirmationText);
      if (success) {
        signOut();
        router.push('/auth');
      } else {
        setError('Failed to delete account. Please try again.');
      }
    } catch {
      setError('An error occurred while deleting your account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0f1419] text-white">
        {/* Header */}
        <header className="py-4 sm:py-6 px-4 border-b border-gray-700">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            {/* Logo and Title - Left Side */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
                <TrophyIcon size={32} />
                <h1 className="text-xl sm:text-2xl font-bold">
                  Delete Account
                </h1>
              </button>
            </div>
          </div>
        </header>

        {/* Delete Account Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-[#1a1f2e] rounded-lg p-6">
            {/* Warning Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-400">
                  Delete Your Account
                </h2>
                <p className="text-gray-400">This action cannot be undone</p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                ⚠️ Warning
              </h3>
              <p className="text-gray-300 mb-3">
                Deleting your account will permanently remove:
              </p>
              <ul className="text-gray-300 space-y-1 ml-4">
                <li>• All your personal information</li>
                <li>• Your match history and statistics</li>
                <li>• Your tournament data</li>
                <li>• All associated player records</li>
              </ul>
              <p className="text-red-400 font-medium mt-3">
                This action is irreversible and cannot be undone.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                {error}
              </div>
            )}

            {/* Confirmation Form */}
            <form onSubmit={handleDeleteAccount} className="space-y-6">
              <div>
                <label
                  htmlFor="confirmation"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Type{' '}
                  <span className="font-mono text-red-400">{requiredText}</span>{' '}
                  to confirm
                </label>
                <input
                  type="text"
                  id="confirmation"
                  value={confirmationText}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#2d3748] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Type the confirmation text exactly as shown"
                />
                {confirmationText && !isConfirmationValid && (
                  <p className="mt-2 text-sm text-red-400">
                    Please type the exact text:{' '}
                    <span className="font-mono">{requiredText}</span>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !isConfirmationValid}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                >
                  {isLoading
                    ? 'Deleting Account...'
                    : 'Permanently Delete Account'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
