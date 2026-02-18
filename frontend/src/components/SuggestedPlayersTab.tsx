'use client';

import { UserIcon, UserPlusIcon } from '@/components/Icons';
import { NonFriendPlayer } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SuggestedPlayersTabProps {
  suggestedPlayers: NonFriendPlayer[];
  suggestedPlayersLoading: boolean;
  sentFriendRequests: Set<string>;
  onRefresh: () => void | Promise<void>;
  onSendFriendRequest: (userId: string) => void | Promise<void>;
}

export default function SuggestedPlayersTab({
  suggestedPlayers,
  suggestedPlayersLoading,
  sentFriendRequests,
  onRefresh,
  onSendFriendRequest,
}: SuggestedPlayersTabProps) {
  const router = useRouter();
  const [sendingRequestId, setSendingRequestId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSendRequest = async (userId: string) => {
    setSendingRequestId(userId);
    try {
      await onSendFriendRequest(userId);
    } finally {
      setSendingRequestId(null);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Players You Might Know</h3>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`px-4 py-2 text-white rounded-lg transition-colors text-sm ${
            isRefreshing
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isRefreshing ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></span>
              Refreshing...
            </span>
          ) : (
            'Refresh'
          )}
        </button>
      </div>

      {/* Loading State */}
      {suggestedPlayersLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading suggested players...</p>
        </div>
      )}

      {/* Players List */}
      {!suggestedPlayersLoading &&
        suggestedPlayers &&
        suggestedPlayers.length > 0 && (
          <div className="space-y-4">
            {suggestedPlayers.map(player => (
              <div
                key={player.id}
                className="bg-[#2d3748] rounded-lg p-4 hover:bg-[#374151] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-4 cursor-pointer flex-1"
                    onClick={() => router.push(`/profile/${player.id}`)}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {(player.first_name || player.username)
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#2d3748] bg-gray-500"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        {player.first_name || player.username}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        @{player.username}
                      </p>
                      {player.full_name && (
                        <p className="text-gray-500 text-xs">
                          {player.full_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      {player.friend_request_sent ||
                      sentFriendRequests.has(player.id) ? (
                        <button
                          disabled
                          className="px-3 py-1 bg-gray-500 text-white rounded text-sm cursor-not-allowed"
                        >
                          Request Sent
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSendRequest(player.id)}
                          disabled={sendingRequestId === player.id}
                          className={`p-2 text-white rounded-lg transition-colors ${
                            sendingRequestId === player.id
                              ? 'bg-gray-500 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-600'
                          }`}
                          title="Add Friend"
                        >
                          {sendingRequestId === player.id ? (
                            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                          ) : (
                            <UserPlusIcon className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Empty State (if no suggested players) */}
      {!suggestedPlayersLoading &&
        suggestedPlayers &&
        suggestedPlayers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              No Suggested Players
            </h3>
            <p className="text-gray-400 mb-4">
              We couldn&apos;t find any players you might know based on your
              recent matches.
            </p>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`px-6 py-2 text-white rounded-lg transition-colors ${
                isRefreshing
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isRefreshing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></span>
                  Refreshing...
                </span>
              ) : (
                'Try Again'
              )}
            </button>
          </div>
        )}
    </div>
  );
}
