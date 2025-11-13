'use client';

import { useAuth } from '@/contexts/auth';
import { handleGoogleCallback } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const success = searchParams.get('success');
        const token = searchParams.get('token');

        if (success === 'true' && token) {
          // Use the API function to handle the callback
          const userData = await handleGoogleCallback(token);

          if (userData) {
            // Update the auth context with the user data
            updateUser(userData);

            // Redirect to home page
            router.push('/');
          } else {
            setError('Failed to authenticate. Please try again.');
            setIsProcessing(false);
          }
        } else {
          setError('Authentication failed. Please try again.');
          setIsProcessing(false);
        }
      } catch (error) {
        console.error('Callback error:', error);
        setError('An error occurred during authentication. Please try again.');
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, router, updateUser]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-[#0f1419] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1419] text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-red-400 mb-2">
              Authentication Failed
            </h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={() => router.push('/auth')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0f1419] text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
