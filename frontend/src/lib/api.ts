// Re-export all API functions from their respective modules
// This maintains backward compatibility while organizing code by API prefix

// Authentication functions
export {
  checkUsernameAvailability,
  deleteUserAccount,
  getCurrentUser,
  handleGoogleCallback,
  login,
  onGoogleSignInClick,
  refreshToken,
  register,
} from './auth';

// Player functions
export {
  createPlayer,
  deletePlayer,
  getCurrentUserStats,
  getPlayers,
  getPlayerStats,
  updatePlayer,
  updateUserProfile,
} from './players';

// Match functions
export {
  deleteMatch,
  getMatchHistory,
  getMatchById,
  recordMatch,
  updateMatch,
} from './matches';

// Statistics functions
export { getHeadToHead, getTable } from './stats';

// Tournament functions
export {
  addPlayerToTournament,
  createTournament,
  deleteTournament,
  getTournament,
  getTournamentMatches,
  getTournamentPlayers,
  getTournaments,
  getTournamentStandings,
  removePlayerFromTournament,
  updateTournament,
} from './tournaments';

// User functions (friends, etc.)
export {
  acceptFriendRequest,
  getFriendRequests,
  getFriends,
  getRecentNonFriendOpponents,
  rejectFriendRequest,
  searchUsers,
  sendFriendRequest,
} from './user';

// Shared utilities
export {
  API_BASE_URL,
  createAuthenticatedRequest,
  debugError,
  debugLog,
  debugWarn,
  getAccessToken,
  getApiBaseUrl,
} from './shared';
