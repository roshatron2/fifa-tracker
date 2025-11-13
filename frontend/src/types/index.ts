// Pagination interfaces
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

// API Response wrapper interfaces
export interface StandardResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}

export interface StandardListResponse<T> {
  success: boolean;
  data: { [key: string]: T[] };
  message: string;
}

export interface StandardPaginatedResponse<T> {
  success: boolean;
  data: PaginatedResponse<T>;
  message: string;
}

export interface Player {
  name: string;
  id: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  first_name?: string | null;
  last_name?: string | null;
  is_active?: boolean;
  is_superuser?: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  total_matches?: number;
  total_goals_scored?: number;
  total_goals_conceded?: number;
  goal_difference?: number;
  wins?: number;
  losses?: number;
  draws?: number;
  points?: number;
  elo_rating?: number;
  tournaments_played?: number;
  tournament_ids?: string[];
  access_token?: string;
  last_5_teams?: string[];
}

export interface Match {
  id: string;
  player1_id: string;
  player2_id: string;
  player1_goals: number;
  player2_goals: number;
  team1: string;
  team2: string;
  date: string;
  half_length: number;
  completed: boolean;
  tournament_id?: string;
}

export interface Tournament {
  id: string;
  name: string;
  player_ids: string[];
  description: string;
  completed: boolean;
  start_date: string;
  end_date: string;
  owner_id?: string;
}

export interface MatchResult {
  id: string;
  player1_name: string;
  player2_name: string;
  player1_goals: number;
  player2_goals: number;
  team1: string;
  team2: string;
  date: string;
  half_length: number;
  completed: boolean;
}

export interface PlayerStats {
  id: string;
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  total_matches: number;
  total_goals_scored: number;
  total_goals_conceded: number;
  goal_difference: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  last_5_matches: string[];
}

export interface DetailedPlayerStats {
  id: string;
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  total_matches: number;
  total_goals_scored: number;
  total_goals_conceded: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  win_rate: number;
  average_goals_scored: number;
  average_goals_conceded: number;
  highest_wins_against: {
    [playerName: string]: number;
  };
  highest_losses_against: {
    [playerName: string]: number;
  };
  winrate_over_time: {
    date: string;
    winrate: number;
  }[];
}

export interface UserDetailedStats {
  id: string;
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  total_matches: number;
  total_goals_scored: number;
  total_goals_conceded: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  win_rate: number;
  average_goals_scored: number;
  average_goals_conceded: number;
  highest_wins_against: {
    [playerName: string]: number;
  } | null;
  highest_losses_against: {
    [playerName: string]: number;
  } | null;
  winrate_over_time: {
    date: string;
    winrate: number;
  }[];
  elo_rating: number;
  tournaments_played: number;
  tournament_ids: string[];
  last_5_teams: string[];
  last_5_matches: {
    date: string;
    player1_goals: number;
    player2_goals: number;
    tournament_name: string;
    team1: string;
    team2: string;
    opponent_id: string;
    opponent_username: string;
    opponent_first_name: string;
    opponent_last_name: string;
    current_player_id: string;
    current_player_username: string;
    current_player_goals: number;
    opponent_goals: number;
    match_result: 'win' | 'loss' | 'draw';
  }[];
}

// Friend-related interfaces
export interface FriendRequest {
  friend_id: string;
}

export interface FriendResponse {
  message: string;
  success: boolean;
}

export interface NonFriendPlayer {
  id: string;
  username: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  friend_request_sent?: boolean;
}

export interface FriendRequestsResponse {
  sent_requests: FriendRequestUser[];
  received_requests: FriendRequestUser[];
}

export interface FriendRequestUser {
  friend_id: string;
  username: string;
  first_name: string;
  last_name: string;
}

export interface Friend {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  total_matches?: number;
  wins?: number;
  elo_rating?: number;
}

// User search interfaces
export interface UserSearchQuery {
  query: string;
  limit?: number;
}

export interface UserSearchResult {
  id: string;
  username: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  email: string;
  is_friend: boolean;
  friend_request_sent: boolean;
  friend_request_received: boolean;
}
