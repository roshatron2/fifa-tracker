import {
  Friend,
  FriendRequestsResponse,
  FriendResponse,
  NonFriendPlayer,
  UserSearchResult,
} from '@/types';
import axios, { AxiosError } from 'axios';
import {
  createAuthenticatedRequest,
  debugError,
  unwrapListResponse,
} from './shared';

export async function sendFriendRequest(
  friend_id: string
): Promise<FriendResponse | null> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.post('/user/send-friend-request', {
      friend_id,
    });
    const { data } = response.data;
    return data;
  } catch (error) {
    debugError('Error sending friend request:', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 400) {
        throw new Error(
          'Cannot send friend request to yourself or to an existing friend.'
        );
      } else if (axiosError.response?.status === 404) {
        throw new Error('User not found.');
      } else if (axiosError.response?.status === 409) {
        throw new Error('Friend request already sent or received.');
      } else if (axiosError.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else {
        const errorData = axiosError.response?.data as Record<string, unknown>;
        throw new Error(
          `Failed to send friend request: ${errorData?.detail || axiosError.message}`
        );
      }
    }
    throw new Error('Failed to send friend request. Please try again.');
  }
}

export async function getFriendRequests(): Promise<FriendRequestsResponse> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.get('/user/friend-requests');
    const { data } = response.data;
    return data;
  } catch (error) {
    debugError('Error fetching friend requests:', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
    }
    return { sent_requests: [], received_requests: [] };
  }
}

export async function getFriends(): Promise<Friend[]> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.get('/user/friends');
    return unwrapListResponse(response.data);
  } catch (error) {
    debugError('Error fetching friends:', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
    }
    return [];
  }
}

export async function getRecentNonFriendOpponents(): Promise<
  NonFriendPlayer[]
> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.get(
      '/user/recent-non-friend-opponents'
    );
    return unwrapListResponse(response.data);
  } catch (error) {
    debugError('Error fetching recent non-friend opponents:', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
    }
    return [];
  }
}

export async function acceptFriendRequest(
  friend_id: string
): Promise<FriendResponse | null> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.post('/user/accept-friend-request', {
      friend_id,
    });
    const { data } = response.data;
    return data;
  } catch (error) {
    debugError('Error accepting friend request:', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        throw new Error('Friend request not found.');
      } else if (axiosError.response?.status === 400) {
        throw new Error('Cannot accept this friend request.');
      } else if (axiosError.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else {
        const errorData = axiosError.response?.data as Record<string, unknown>;
        throw new Error(
          `Failed to accept friend request: ${errorData?.detail || axiosError.message}`
        );
      }
    }
    throw new Error('Failed to accept friend request. Please try again.');
  }
}

export async function rejectFriendRequest(
  friend_id: string
): Promise<FriendResponse | null> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.post('/user/reject-friend-request', {
      friend_id,
    });
    const { data } = response.data;
    return data;
  } catch (error) {
    debugError('Error rejecting friend request:', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        throw new Error('Friend request not found.');
      } else if (axiosError.response?.status === 400) {
        throw new Error('Cannot reject this friend request.');
      } else if (axiosError.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else {
        const errorData = axiosError.response?.data as Record<string, unknown>;
        throw new Error(
          `Failed to reject friend request: ${errorData?.detail || axiosError.message}`
        );
      }
    }
    throw new Error('Failed to reject friend request. Please try again.');
  }
}

export async function searchUsers(
  query: string,
  limit?: number
): Promise<UserSearchResult[]> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.post('/user/search', {
      query,
      limit,
    });
    return unwrapListResponse(response.data);
  } catch (error) {
    debugError('Error searching users:', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (axiosError.response?.status === 403) {
        const errorData = axiosError.response?.data as Record<string, unknown>;
        const errorMessage = errorData?.detail as string | undefined;
        throw new Error(
          errorMessage ||
            'Access forbidden: You do not have permission to search users. Please check the backend API documentation at http://localhost:8000/docs#/ to verify the endpoint requirements, or contact support if you believe this is an error.'
        );
      } else if (axiosError.response?.status === 422) {
        throw new Error('Invalid search query. Please check your input.');
      } else {
        const errorData = axiosError.response?.data as Record<string, unknown>;
        throw new Error(
          `Failed to search users: ${errorData?.detail || axiosError.message}`
        );
      }
    }
    throw new Error('Failed to search users. Please try again.');
  }
}
