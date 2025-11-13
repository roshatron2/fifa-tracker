'use client';

import { ArrowLeftIcon, TrophyIcon } from '@/components/Icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0f1419] text-white">
        {/* Header */}
        <header className="py-4 sm:py-6 px-4 border-b border-gray-700">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
                <TrophyIcon size={32} />
                <h1 className="text-xl sm:text-2xl font-bold">FIFA Tracker</h1>
              </button>
            </div>
          </div>
        </header>

        {/* Settings Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-[#1a1f2e] rounded-lg p-6">
            {/* Page Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
              <p className="text-gray-400">
                Manage your account preferences and settings
              </p>
            </div>

            {/* Account Information */}
            <div className="border-b border-gray-700 pb-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Name
                  </label>
                  <p className="text-white">
                    {user?.first_name || user?.username}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Username
                  </label>
                  <p className="text-white">@{user?.username || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <p className="text-white">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Account Actions</h3>

              <div className="space-y-4">
                <div className="bg-[#2d3748] rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h4 className="text-md font-medium text-white mb-1">
                        Edit Profile
                      </h4>
                      <p className="text-sm text-gray-400">
                        Update your personal information and preferences
                      </p>
                    </div>
                    <button
                      onClick={() => router.push('/profile/edit')}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors w-full md:w-auto"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>

                <div className="bg-[#2d3748] rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h4 className="text-md font-medium text-white mb-1">
                        Delete Account
                      </h4>
                      <p className="text-sm text-gray-400">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <button
                      onClick={() => router.push('/profile/delete')}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors w-full md:w-auto"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sign Out Section */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="bg-[#2d3748] rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h4 className="text-md font-medium text-white mb-1">
                      Sign Out
                    </h4>
                    <p className="text-sm text-gray-400">
                      Sign out of your account on this device
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      router.push('/');
                    }}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors w-full md:w-auto"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
