'use client';

import { ChartBarIcon, UserIcon } from '@/components/Icons';
import { Friend } from '@/types';
import { useRouter } from 'next/navigation';

interface FriendsTabProps {
  friends: Friend[];
  friendsLoading: boolean;
  currentUserId: string;
}

export default function FriendsTab({
  friends,
  friendsLoading,
  currentUserId: _currentUserId,
}: FriendsTabProps) {
  const router = useRouter();

  const handleFriendClick = (friendId: string) => {
    router.push(`/profile/${friendId}`);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Friends</h3>
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm">
          Add Friend
        </button>
      </div>

      {/* Loading State */}
      {friendsLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading friends...</p>
        </div>
      )}

      {/* Friends List */}
      {!friendsLoading && friends.length > 0 && (
        <div className="space-y-4">
          {friends.map(friend => (
            <div
              key={friend.id}
              onClick={() => handleFriendClick(friend.id)}
              className="bg-[#2d3748] rounded-lg p-4 hover:bg-[#374151] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {(friend.first_name || friend.username)
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
                      {friend.first_name || friend.username}
                    </h4>
                    <p className="text-gray-400 text-sm">@{friend.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400">
                        {friend.total_matches || 0}
                      </div>
                      <div className="text-xs text-gray-400">Matches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">
                        {friend.total_matches && friend.total_matches > 0
                          ? `${(((friend.wins || 0) / friend.total_matches) * 100).toFixed(1)}%`
                          : '0%'}
                      </div>
                      <div className="text-xs text-gray-400">Win Rate</div>
                    </div>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      router.push(`/head-to-head/${friend.id}`);
                    }}
                    className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                    title="View Head-to-Head Stats"
                  >
                    <ChartBarIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State (if no friends) */}
      {!friendsLoading && friends.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            No Friends Yet
          </h3>
          <p className="text-gray-400 mb-4">
            Add friends to challenge them and track your head-to-head records!
          </p>
          <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
            Add Your First Friend
          </button>
        </div>
      )}
    </div>
  );
}
