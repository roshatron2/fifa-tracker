'use client';

import { UserIcon } from '@/components/Icons';
import { searchUsers, sendFriendRequest } from '@/lib/api';
import { Friend, UserSearchResult } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FriendsProps {
  friends: Friend[];
  isLoadingFriends: boolean;
}

export default function Friends({ friends, isLoadingFriends }: FriendsProps) {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search users with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await searchUsers(searchQuery, 20);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching users:', error);
        setError('Failed to search users. Please try again.');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSendFriendRequest = async (userId: string) => {
    try {
      await sendFriendRequest(userId);
      // Update the search results to reflect the change
      setSearchResults(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, friend_request_sent: true } : user
        )
      );
    } catch (error) {
      console.error('Error sending friend request:', error);
      setError('Failed to send friend request. Please try again.');
    }
  };

  const getDisplayName = (user: Friend | UserSearchResult) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.first_name || user.username;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Friends
        </h2>
        <p className="text-gray-400 text-sm sm:text-base">
          Manage your friends and discover new players
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-[#1a1f2e] rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Find Friends</h3>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by username, first name, or last name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-[#2d3748] border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchQuery.trim() && (
          <div>
            {isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                <p className="text-gray-400 text-sm">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-300 mb-3">
                  Search Results ({searchResults.length})
                </h4>
                {searchResults.map(user => (
                  <div
                    key={user.id}
                    className="bg-[#2d3748] rounded-lg p-3 sm:p-4 hover:bg-[#374151] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-medium text-sm truncate">
                            {getDisplayName(user)}
                          </p>
                          <p className="text-gray-400 text-xs truncate">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {user.is_friend ? (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() =>
                                router.push(`/head-to-head/${user.id}`)
                              }
                              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors whitespace-nowrap"
                            >
                              H2H
                            </button>
                            <span className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-full whitespace-nowrap text-center">
                              Friend
                            </span>
                          </div>
                        ) : user.friend_request_sent ? (
                          <span className="px-3 py-1.5 bg-yellow-500 text-white text-xs rounded-full whitespace-nowrap text-center">
                            Sent
                          </span>
                        ) : user.friend_request_received ? (
                          <span className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-full whitespace-nowrap text-center">
                            Received
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSendFriendRequest(user.id)}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors whitespace-nowrap"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">
                  No users found matching your search.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Friends List */}
      <div className="bg-[#1a1f2e] rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Your Friends ({friends.length})
        </h3>

        {isLoadingFriends ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">Loading friends...</p>
          </div>
        ) : friends.length > 0 ? (
          <div className="space-y-4">
            {friends.map(friend => (
              <div
                key={friend.id}
                className="bg-[#2d3748] rounded-lg p-4 hover:bg-[#374151] transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-medium text-sm truncate">
                        {getDisplayName(friend)}
                      </h3>
                      <p className="text-gray-400 text-xs truncate">
                        @{friend.username}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/profile/${friend.id}`)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400 mb-2 text-sm">No friends yet</p>
            <p className="text-gray-500 text-xs">
              Use the search above to find and add friends!
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300 text-xs mt-1"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
