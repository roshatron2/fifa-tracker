'use client';

import { UserIcon } from '@/components/Icons';
import { FriendRequestUser } from '@/types';

interface FriendRequestsTabProps {
  friendRequests: {
    sent_requests: FriendRequestUser[];
    received_requests: FriendRequestUser[];
  };
  friendRequestsLoading: boolean;
  onRefresh: () => void;
  onAcceptFriendRequest: (userId: string) => void;
  onRejectFriendRequest: (userId: string) => void;
}

export default function FriendRequestsTab({
  friendRequests,
  friendRequestsLoading,
  onRefresh,
  onAcceptFriendRequest,
  onRejectFriendRequest,
}: FriendRequestsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Friend Requests</h3>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {friendRequestsLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading friend requests...</p>
        </div>
      )}

      {/* Received Requests Section */}
      {!friendRequestsLoading &&
        friendRequests.received_requests &&
        friendRequests.received_requests.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-green-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Received Requests ({friendRequests.received_requests.length})
            </h4>
            <div className="space-y-4">
              {friendRequests.received_requests.map(request => (
                <div
                  key={request.friend_id}
                  className="bg-[#2d3748] rounded-lg p-4 hover:bg-[#374151] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {(request.first_name || request.username)
                              .split(' ')
                              .map(n => n[0])
                              .join('')
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#2d3748] bg-orange-500"></div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          {request.first_name || request.username}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          @{request.username}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {request.first_name} {request.last_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            onAcceptFriendRequest(request.friend_id)
                          }
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            onRejectFriendRequest(request.friend_id)
                          }
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Sent Requests Section */}
      {!friendRequestsLoading &&
        friendRequests.sent_requests &&
        friendRequests.sent_requests.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-blue-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Sent Requests ({friendRequests.sent_requests.length})
            </h4>
            <div className="space-y-4">
              {friendRequests.sent_requests.map(request => (
                <div
                  key={request.friend_id}
                  className="bg-[#2d3748] rounded-lg p-4 hover:bg-[#374151] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {(request.first_name || request.username)
                              .split(' ')
                              .map(n => n[0])
                              .join('')
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#2d3748] bg-blue-500"></div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          {request.first_name || request.username}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          @{request.username}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {request.first_name} {request.last_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex gap-2">
                        <button
                          disabled
                          className="px-3 py-1 bg-gray-500 text-white rounded text-sm cursor-not-allowed"
                        >
                          Pending
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Empty State (if no friend requests) */}
      {!friendRequestsLoading &&
        (!friendRequests.sent_requests ||
          friendRequests.sent_requests.length === 0) &&
        (!friendRequests.received_requests ||
          friendRequests.received_requests.length === 0) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              No Friend Requests
            </h3>
            <p className="text-gray-400 mb-4">
              You don&apos;t have any pending friend requests at the moment.
            </p>
            <button
              onClick={onRefresh}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
    </div>
  );
}
