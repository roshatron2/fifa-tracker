import {
  MatchResult,
  PaginatedResponse,
  PlayerStats,
  Tournament,
  User,
} from '@/types';
import axios, { AxiosError } from 'axios';
import {
  createAuthenticatedRequest,
  debugError,
  debugLog,
  debugWarn,
  unwrapListResponse,
  unwrapPaginatedResponse,
} from './shared';

export async function getTournaments(): Promise<Tournament[]> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    debugLog('Making request to tournaments endpoint...');
    const response = await axiosInstance.get('/tournaments/');
    debugLog('Tournaments response:', response.data);
    return unwrapListResponse(response.data);
  } catch (error) {
    debugError('Error fetching tournaments:', error);
    if (axios.isAxiosError(error)) {
      debugError('Axios error details:', {
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
    return [];
  }
}

export async function getTournament(
  tournament_id: string
): Promise<Tournament | null> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.get(`/tournaments/${tournament_id}/`);
    const { data } = response.data;
    return data;
  } catch (error) {
    debugError('Error fetching tournament:', error);
    return null;
  }
}

export async function updateTournament(
  tournament_id: string,
  name?: string,
  description?: string,
  player_ids?: string[],
  completed?: boolean,
  start_date?: string,
  end_date?: string
): Promise<Tournament | null> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const payload: Record<string, unknown> = {};
    if (name !== undefined) payload.name = name;
    if (description !== undefined) payload.description = description;
    if (player_ids !== undefined) payload.player_ids = player_ids;
    if (completed !== undefined) payload.completed = completed;
    if (start_date !== undefined) payload.start_date = start_date;
    if (end_date !== undefined) payload.end_date = end_date;

    const response = await axiosInstance.put(
      `/tournaments/${tournament_id}/`,
      payload
    );
    const { data } = response.data;
    return data;
  } catch (error) {
    debugError('Error updating tournament:', error);
    return null;
  }
}

export async function createTournament(
  name: string,
  description: string,
  player_ids: string[]
): Promise<Tournament | null> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.post('/tournaments/', {
      name,
      description,
      player_ids,
    });
    const { data } = response.data;
    return data;
  } catch (error) {
    debugError('Error creating tournament:', error);
    return null;
  }
}

export async function deleteTournament(tournament_id: string): Promise<void> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    await axiosInstance.delete(`/tournaments/${tournament_id}`);
  } catch (error) {
    debugError('Error deleting tournament:', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 403) {
        throw new Error(
          'You do not have permission to delete this tournament. Only the tournament owner can delete it.'
        );
      } else if (axiosError.response?.status === 404) {
        throw new Error('Tournament not found.');
      } else if (axiosError.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else {
        const errorData = axiosError.response?.data as Record<string, unknown>;
        throw new Error(
          `Failed to delete tournament: ${errorData?.detail || axiosError.message}`
        );
      }
    }
    throw new Error('Failed to delete tournament. Please try again.');
  }
}

export async function addPlayerToTournament(
  tournament_id: string,
  player_id: string
): Promise<void> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    await axiosInstance.post(`/tournaments/${tournament_id}/players`, {
      player_id,
    });
  } catch (error) {
    debugError('Error adding player to tournament:', error);
  }
}

export async function removePlayerFromTournament(
  tournament_id: string,
  player_id: string
): Promise<void> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    await axiosInstance.delete(
      `/tournaments/${tournament_id}/players/${player_id}`
    );
  } catch (error) {
    debugError('Error removing player from tournament:', error);
  }
}

export async function getTournamentPlayers(
  tournament_id: string
): Promise<User[]> {
  try {
    // Guard against empty tournament ID
    if (!tournament_id || tournament_id.trim() === '') {
      debugWarn(
        'Attempted to fetch tournament players with empty tournament ID'
      );
      return [];
    }

    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.get(
      `/tournaments/${tournament_id}/players`
    );
    // This endpoint returns unwrapped array directly
    return response.data;
  } catch (error) {
    debugError('Error fetching tournament players:', error);
    return [];
  }
}

export async function getTournamentMatches(
  tournament_id: string,
  page: number = 1,
  page_size: number = 50
): Promise<PaginatedResponse<MatchResult>> {
  try {
    // Guard against empty tournament ID
    if (!tournament_id || tournament_id.trim() === '') {
      debugWarn(
        'Attempted to fetch tournament matches with empty tournament ID'
      );
      return {
        items: [],
        total: 0,
        page: 1,
        page_size: page_size,
        total_pages: 0,
        has_next: false,
        has_previous: false,
      };
    }

    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.get(
      `/tournaments/${tournament_id}/matches`,
      {
        params: {
          page,
          page_size,
        },
      }
    );
    return unwrapPaginatedResponse<MatchResult>(response.data);
  } catch (error) {
    debugError('Error fetching tournament matches:', error);
    return {
      items: [],
      total: 0,
      page: 1,
      page_size: page_size,
      total_pages: 0,
      has_next: false,
      has_previous: false,
    };
  }
}

export async function getTournamentStandings(
  tournament_id: string
): Promise<PlayerStats[]> {
  try {
    // Guard against empty tournament ID
    if (!tournament_id || tournament_id.trim() === '') {
      debugWarn(
        'Attempted to fetch tournament standings with empty tournament ID'
      );
      return [];
    }

    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.get(
      `/tournaments/${tournament_id}/stats`
    );
    // This endpoint returns unwrapped array directly
    return response.data;
  } catch (error) {
    debugError('Error fetching tournament standings:', error);
    return [];
  }
}
