'use client';

import FriendRequestsTab from '@/components/FriendRequestsTab';
import FriendsTab from '@/components/FriendsTab';
import { ArrowLeftIcon, TrophyIcon, UserIcon } from '@/components/Icons';
import ProfileTab from '@/components/ProfileTab';
import ProtectedRoute from '@/components/ProtectedRoute';
import SuggestedPlayersTab from '@/components/SuggestedPlayersTab';
import { useAuth } from '@/contexts/auth';
import {
  acceptFriendRequest,
  getCurrentUserStats,
  getFriendRequests,
  getFriends,
  getRecentNonFriendOpponents,
  rejectFriendRequest,
  sendFriendRequest,
} from '@/lib/api';
import {
  Friend,
  FriendRequestsResponse,
  NonFriendPlayer,
  UserDetailedStats,
} from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserDetailedStats | null>(null);
  const [suggestedPlayers, setSuggestedPlayers] = useState<NonFriendPlayer[]>(
    []
  );
  const [suggestedPlayersLoading, setSuggestedPlayersLoading] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [friendRequests, setFriendRequests] = useState<FriendRequestsResponse>({
    sent_requests: [],
    received_requests: [],
  });
  const [friendRequestsLoading, setFriendRequestsLoading] = useState(false);
  const [sentFriendRequests, setSentFriendRequests] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'profile' | 'friends' | 'players-you-might-know' | 'friend-requests'
  >('profile');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-menu')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const fetchUserStats = async () => {
      // Don't fetch stats if auth is still loading or user is not available
      if (authLoading || !user?.id) {
        return;
      }

      try {
        setLoading(true);
        const stats = await getCurrentUserStats(user.id);
        setUserStats(stats);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user, authLoading]);

  // Fetch friends and suggested players on page load
  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchFriends();
      fetchSuggestedPlayers();
    }
  }, [user, authLoading]);

  const fetchSuggestedPlayers = async () => {
    try {
      setSuggestedPlayersLoading(true);
      const players = await getRecentNonFriendOpponents();
      setSuggestedPlayers(players);
    } catch (error) {
      console.error('Error fetching suggested players:', error);
    } finally {
      setSuggestedPlayersLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      setFriendsLoading(true);
      const friendsList = await getFriends();
      setFriends(friendsList);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setFriendsLoading(false);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      setFriendRequestsLoading(true);
      const requests = await getFriendRequests();
      setFriendRequests(requests); // Store both sent and received requests
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    } finally {
      setFriendRequestsLoading(false);
    }
  };

  const handleAcceptFriendRequest = async (userId: string) => {
    try {
      await acceptFriendRequest(userId);
      // Remove the accepted request from the received list
      setFriendRequests(prev => ({
        ...prev,
        received_requests: (prev.received_requests || []).filter(
          request => request.friend_id !== userId
        ),
      }));
      alert('Friend request accepted!');
    } catch (error) {
      console.error('Error accepting friend request:', error);
      // Show user-friendly error message
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to accept friend request. Please try again later.');
      }
    }
  };

  const handleRejectFriendRequest = async (userId: string) => {
    try {
      await rejectFriendRequest(userId);
      // Remove the rejected request from the received list
      setFriendRequests(prev => ({
        ...prev,
        received_requests: (prev.received_requests || []).filter(
          request => request.friend_id !== userId
        ),
      }));
      alert('Friend request rejected!');
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      // Show user-friendly error message
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to reject friend request. Please try again later.');
      }
    }
  };

  const handleSendFriendRequest = async (userId: string) => {
    try {
      await sendFriendRequest(userId);
      // Add to sent requests set
      setSentFriendRequests(prev => new Set(prev).add(userId));
      alert('Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      // Show user-friendly error message
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to send friend request. Please try again later.');
      }
    }
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
                onClick={() => router.push('/')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
                <TrophyIcon size={32} />
                <h1 className="text-xl sm:text-2xl font-bold">FIFA Tracker</h1>
              </button>
            </div>

            {/* Profile and Menu - Right Side */}
            <div className="flex items-center gap-3">
              <div className="relative profile-menu">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#1a1f2e] transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm text-gray-300">
                    {user?.first_name || user?.username}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1a1f2e] rounded-lg shadow-lg border border-gray-700 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          router.push('/profile/settings');
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2d3748] hover:text-white transition-colors"
                      >
                        Settings
                      </button>
                      <hr className="my-1 border-gray-700" />
                      <button
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2d3748] hover:text-white transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-[#1a1f2e] rounded-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {user?.first_name || user?.username}
                </h2>
                <p className="text-gray-400">{user?.email}</p>
                {user?.username && (
                  <p className="text-gray-500 text-sm">@{user.username}</p>
                )}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-700 mb-6">
              <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setActiveTab('friends');
                    if (friends.length === 0) {
                      fetchFriends();
                    }
                  }}
                  className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'friends'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Friends ({friends.length})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('players-you-might-know');
                    if (suggestedPlayers && suggestedPlayers.length === 0) {
                      fetchSuggestedPlayers();
                    }
                  }}
                  className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'players-you-might-know'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">
                    Players You Might Know
                  </span>
                  <span className="sm:hidden">Players</span> (
                  {suggestedPlayers?.length || 0})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('friend-requests');
                    if (
                      (friendRequests.sent_requests?.length || 0) === 0 &&
                      (friendRequests.received_requests?.length || 0) === 0
                    ) {
                      fetchFriendRequests();
                    }
                  }}
                  className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'friend-requests'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">Friend Requests</span>
                  <span className="sm:hidden">Requests</span> (
                  {(friendRequests.sent_requests?.length || 0) +
                    (friendRequests.received_requests?.length || 0)}
                  )
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && (
              <ProfileTab
                user={user}
                userStats={userStats}
                authLoading={authLoading}
                loading={loading}
              />
            )}

            {/* Friends Tab Content */}
            {activeTab === 'friends' && (
              <FriendsTab
                friends={friends}
                friendsLoading={friendsLoading}
                currentUserId={user?.id || ''}
              />
            )}

            {/* Players You Might Know Tab Content */}
            {activeTab === 'players-you-might-know' && (
              <SuggestedPlayersTab
                suggestedPlayers={suggestedPlayers}
                suggestedPlayersLoading={suggestedPlayersLoading}
                sentFriendRequests={sentFriendRequests}
                onRefresh={fetchSuggestedPlayers}
                onSendFriendRequest={handleSendFriendRequest}
              />
            )}

            {/* Friend Requests Tab Content */}
            {activeTab === 'friend-requests' && (
              <FriendRequestsTab
                friendRequests={friendRequests}
                friendRequestsLoading={friendRequestsLoading}
                onRefresh={fetchFriendRequests}
                onAcceptFriendRequest={handleAcceptFriendRequest}
                onRejectFriendRequest={handleRejectFriendRequest}
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
