import { Match, MatchResult } from '@/types';
import axios from 'axios';
import {
  API_BASE_URL,
  createAuthenticatedRequest,
  debugError,
  unwrapListResponse,
} from './shared';

export async function recordMatch(
  player1_id: string,
  player2_id: string,
  team1: string,
  team2: string,
  player1_goals: number,
  player2_goals: number,
  half_length: number,
  completed: boolean,
  tournament_id?: string
): Promise<Match | null> {
  try {
    const axiosInstance = createAuthenticatedRequest();

    const matchData: {
      player1_id: string;
      player2_id: string;
      team1: string;
      team2: string;
      player1_goals: number;
      player2_goals: number;
      half_length: number;
      completed: boolean;
      tournament_id?: string;
    } = {
      player1_id,
      player2_id,
      team1,
      team2,
      player1_goals,
      player2_goals,
      half_length,
      completed,
    };

    // Only include tournament_id if it's provided and not empty
    if (tournament_id && tournament_id.trim() !== '') {
      matchData.tournament_id = tournament_id;
    }

    const response = await axiosInstance.post('/matches/', matchData);
    const { data } = response.data;
    return data;
  } catch (error) {
    debugError('Error recording match:', error);

    // Check for mixed content error specifically
    if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
      debugError('Network error detected. This might be due to:');
      debugError(
        '1. Mixed content: HTTPS frontend trying to connect to HTTP backend'
      );
      debugError('2. CORS issues');
      debugError('3. Backend server not running');
      debugError('Current API URL:', API_BASE_URL);

      // Check if we're using HTTP in production
      if (
        typeof window !== 'undefined' &&
        window.location.protocol === 'https:' &&
        API_BASE_URL.startsWith('http:')
      ) {
        debugError('MIXED CONTENT ERROR: Frontend is HTTPS but API is HTTP');
        debugError('Solution: Use HTTPS ngrok URL in environment variables');
        debugError(
          'Current ngrok URL:',
          process.env.NEXT_PUBLIC_API_BASE_URL_NGROK
        );
        debugError('Expected format: https://your-ngrok-url.ngrok-free.app');
      }
    }

    return null;
  }
}

export async function getMatchHistory(): Promise<MatchResult[]> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.get('/matches/');
    return unwrapListResponse(response.data);
  } catch (error) {
    debugError('Error fetching match history:', error);
    return [];
  }
}

export async function updateMatch(
  match_id: string,
  player1_goals: number,
  player2_goals: number,
  team1: string,
  team2: string,
  half_length: number,
  completed: boolean
): Promise<void> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    await axiosInstance.put(`/matches/${match_id}`, {
      team1,
      team2,
      player1_goals,
      player2_goals,
      half_length,
      completed,
    } as Match);
  } catch (error) {
    debugError('Error updating match:', error);
  }
}

export async function getMatchById(match_id: string): Promise<Match | null> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.get(`/matches/${match_id}`);
    const { data } = response.data;
    return data;
  } catch (error) {
    debugError('Error fetching match by ID:', error);
    return null;
  }
}

export async function deleteMatch(match_id: string): Promise<void> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    await axiosInstance.delete(`/matches/${match_id}`);
  } catch (error) {
    debugError('Error deleting match:', error);
  }
}
