import { PlayerStats } from '@/types';
import axios from 'axios';
import { createAuthenticatedRequest, debugError, debugLog } from './shared';

export async function getTable(): Promise<PlayerStats[]> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    debugLog('getTable: Making request to /stats/');
    const response = await axiosInstance.get('/stats/');
    debugLog('getTable: Response received:', response.data);

    // Ensure the response data is an array
    const { data } = response.data;
    if (Array.isArray(data)) {
      debugLog('getTable: Returning array with', data.length, 'items');
      return data;
    } else {
      debugError('getTable: Response data is not an array:', data);
      return [];
    }
  } catch (error) {
    debugError('Error fetching table:', error);
    if (axios.isAxiosError(error)) {
      debugError('Axios error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          timeout: error.config?.timeout,
        },
      });
    }
    return [];
  }
}

export async function getHeadToHead(
  player1_id: string,
  player2_id: string
): Promise<{
  player1_id: string;
  player2_id: string;
  player1_name: string;
  player2_name: string;
  total_matches: number;
  player1_wins: number;
  player2_wins: number;
  draws: number;
  player1_goals: number;
  player2_goals: number;
  player1_win_rate: number;
  player2_win_rate: number;
  player1_avg_goals: number;
  player2_avg_goals: number;
}> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.get(
      `/stats/head-to-head/${player1_id}/${player2_id}`
    );
    const { data } = response.data;
    return data;
  } catch (error) {
    debugError('Error fetching head-to-head stats:', error);
    return {
      player1_id: player1_id,
      player2_id: player2_id,
      player1_name: '',
      player2_name: '',
      total_matches: 0,
      player1_wins: 0,
      player2_wins: 0,
      draws: 0,
      player1_goals: 0,
      player2_goals: 0,
      player1_win_rate: 0,
      player2_win_rate: 0,
      player1_avg_goals: 0,
      player2_avg_goals: 0,
    };
  }
}
