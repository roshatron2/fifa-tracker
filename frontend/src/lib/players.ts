import { Player, User, UserDetailedStats } from '@/types';
import axios, { AxiosError } from 'axios';
import {
  createAuthenticatedRequest,
  debugError,
  debugLog,
  unwrapListResponse,
} from './shared';

export async function getPlayers(): Promise<User[]> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.get('/user/');
    return unwrapListResponse(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      debugError('Error fetching players:', {
        message: axiosError.message,
        code: axiosError.code,
        config: axiosError.config,
      });
      if (axiosError.code === 'ECONNREFUSED') {
        debugError(
          'Unable to connect to the API server. Please check if the server is running.'
        );
      }
    } else {
      debugError('Unexpected error:', error);
    }
    return [];
  }
}

export async function createPlayer(name: string): Promise<Player | null> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.post('/user/register', { name });
    const { data } = response.data;
    return data;
  } catch (error) {
    debugError('Error creating player:', error);
    return null;
  }
}

export async function deletePlayer(player_id: string): Promise<void> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    await axiosInstance.delete(`/user/${player_id}`);
  } catch (error) {
    debugError('Error deleting player:', error);
  }
}

export async function updatePlayer(
  player_id: string,
  newName: string
): Promise<void> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    await axiosInstance.put(`/user/${player_id}`, { name: newName });
  } catch (error) {
    debugError('Error updating player:', error);
  }
}

export async function getPlayerStats(
  player_id: string
): Promise<UserDetailedStats | null> {
  try {
    debugLog('getPlayerStats called with player_id:', player_id);
    const axiosInstance = createAuthenticatedRequest();
    debugLog(
      'getPlayerStats axios instance baseURL:',
      axiosInstance.defaults.baseURL
    );
    const response = await axiosInstance.get(`/user/${player_id}/stats`);
    const { data } = response.data;
    return data;
  } catch (error) {
    debugError('Error fetching player stats:', error);
    if (axios.isAxiosError(error)) {
      debugError('getPlayerStats Axios error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers,
        },
      });
    }
    return null;
  }
}

export async function getCurrentUserStats(
  player_id: string
): Promise<UserDetailedStats | null> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    if (player_id == '') {
      return null;
    }

    // Additional debugging for this specific function
    debugLog('getCurrentUserStats called with player_id:', player_id);
    debugLog('Axios instance baseURL:', axiosInstance.defaults.baseURL);

    // Add cache-busting parameter to avoid browser caching issues
    const timestamp = Date.now();
    const response = await axiosInstance.get(
      `/user/${player_id}/stats?_t=${timestamp}`
    );

    // The API returns a single UserDetailedStats object, not an array
    const { data } = response.data;
    return data || null;
  } catch (error) {
    debugError('Error fetching current user stats:', error);

    // Additional error logging for debugging
    if (axios.isAxiosError(error)) {
      debugError('getCurrentUserStats Axios error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers,
        },
      });
    }

    return null;
  }
}

export async function updateUserProfile(
  id: string,
  first_name?: string,
  last_name?: string,
  email?: string,
  username?: string
): Promise<User | null> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const payload: {
      id: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      username?: string;
    } = { id, first_name, last_name, email, username };
    if (id == '') {
      return null;
    }
    const response = await axiosInstance.put(`/user/${id}`, payload);
    const { data } = response.data;
    return data;
  } catch (error) {
    debugError('Error updating user profile:', error);
    return null;
  }
}
