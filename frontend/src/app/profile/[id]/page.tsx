'use client';

import { ArrowLeftIcon, TrophyIcon, UserIcon } from '@/components/Icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/auth';
import { getPlayerStats } from '@/lib/api';
import { UserDetailedStats } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PlayerProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PlayerProfilePage({ params }: PlayerProfilePageProps) {
  const [id, setId] = useState<string>('');
  const { isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [playerStats, setPlayerStats] = useState<UserDetailedStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      if (authLoading || !id) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const stats = await getPlayerStats(id);
        if (stats) {
          setPlayerStats(stats);
        } else {
          setError('Player not found');
        }
      } catch (error) {
        console.error('Error fetching player stats:', error);
        setError('Failed to load player data');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, [id, authLoading]);

  if (authLoading || loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#0f1419] text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">
              {authLoading ? 'Loading...' : 'Loading player data...'}
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !playerStats) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#0f1419] text-white">
          {/* Header */}
          <header className="py-4 sm:py-6 px-4 border-b border-gray-700">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
                  <TrophyIcon size={32} />
                  <h1 className="text-xl sm:text-2xl font-bold">
                    FIFA Tracker
                  </h1>
                </button>
              </div>
            </div>
          </header>

          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-[#1a1f2e] rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-300 mb-2">
                Player Not Found
              </h2>
              <p className="text-gray-400 mb-4">
                The player with ID &quot;{id}&quot; could not be found.
              </p>
              <button
                onClick={() => router.push('/profile')}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Back to Profile
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0f1419] text-white">
        {/* Header */}
        <header className="py-4 sm:py-6 px-4 border-b border-gray-700">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
                <TrophyIcon size={32} />
                <h1 className="text-xl sm:text-2xl font-bold">FIFA Tracker</h1>
              </button>
            </div>
          </div>
        </header>

        {/* Player Profile Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-[#1a1f2e] rounded-lg p-6">
            {/* Player Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xl">
                  {(playerStats.first_name || playerStats.username)
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {playerStats.first_name || playerStats.username}
                </h2>
                <p className="text-gray-400">@{playerStats.username}</p>
                <p className="text-gray-500 text-sm">{playerStats.email}</p>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Player Statistics</h3>

              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#2d3748] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {playerStats.total_matches || 0}
                  </div>
                  <div className="text-sm text-gray-400">Matches Played</div>
                </div>
                <div className="bg-[#2d3748] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {playerStats.wins || 0}
                  </div>
                  <div className="text-sm text-gray-400">Wins</div>
                </div>
                <div className="bg-[#2d3748] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {playerStats.win_rate !== null &&
                    playerStats.win_rate !== undefined
                      ? (playerStats.win_rate * 100).toFixed(1)
                      : playerStats.total_matches > 0
                        ? (
                            ((playerStats.wins || 0) /
                              (playerStats.total_matches || 1)) *
                            100
                          ).toFixed(1)
                        : '0.0'}
                    %
                  </div>
                  <div className="text-sm text-gray-400">Win Rate</div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#2d3748] rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-red-400">
                    {playerStats.losses || 0}
                  </div>
                  <div className="text-sm text-gray-400">Losses</div>
                </div>
                <div className="bg-[#2d3748] rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-gray-400">
                    {playerStats.draws || 0}
                  </div>
                  <div className="text-sm text-gray-400">Draws</div>
                </div>
                <div className="bg-[#2d3748] rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-purple-400">
                    {playerStats.points || 0}
                  </div>
                  <div className="text-sm text-gray-400">Points</div>
                </div>
                <div className="bg-[#2d3748] rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-orange-400">
                    {playerStats.elo_rating || 1200}
                  </div>
                  <div className="text-sm text-gray-400">Elo Rating</div>
                </div>
              </div>

              {/* Goals Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#2d3748] rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-green-400">
                    {playerStats.total_goals_scored || 0}
                  </div>
                  <div className="text-sm text-gray-400">Goals Scored</div>
                </div>
                <div className="bg-[#2d3748] rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-red-400">
                    {playerStats.total_goals_conceded || 0}
                  </div>
                  <div className="text-sm text-gray-400">Goals Conceded</div>
                </div>
                <div className="bg-[#2d3748] rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-blue-400">
                    {(playerStats.total_goals_scored || 0) -
                      (playerStats.total_goals_conceded || 0)}
                  </div>
                  <div className="text-sm text-gray-400">Goal Difference</div>
                </div>
              </div>

              {/* Averages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#2d3748] rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-green-400">
                    {(playerStats.average_goals_scored || 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-400">Avg Goals Scored</div>
                </div>
                <div className="bg-[#2d3748] rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-red-400">
                    {(playerStats.average_goals_conceded || 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-400">
                    Avg Goals Conceded
                  </div>
                </div>
              </div>

              {/* Tournament Stats */}
              <div className="bg-[#2d3748] rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-yellow-400">
                  {playerStats.tournaments_played || 0}
                </div>
                <div className="text-sm text-gray-400">Tournaments Played</div>
              </div>

              {/* Head-to-Head Records */}
              {((playerStats.highest_wins_against &&
                Object.keys(playerStats.highest_wins_against).length > 0) ||
                (playerStats.highest_losses_against &&
                  Object.keys(playerStats.highest_losses_against).length >
                    0)) && (
                <div className="space-y-4">
                  <h4 className="text-md font-semibold">
                    Head-to-Head Records
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {playerStats.highest_wins_against &&
                      Object.keys(playerStats.highest_wins_against).length >
                        0 && (
                        <div className="bg-[#2d3748] rounded-lg p-4">
                          <div className="text-sm font-medium text-green-400 mb-2">
                            Most Wins Against
                          </div>
                          {Object.entries(playerStats.highest_wins_against).map(
                            ([player, wins]) => (
                              <div
                                key={player}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-gray-300">{player}</span>
                                <span className="text-green-400 font-medium">
                                  {wins || 0} wins
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    {playerStats.highest_losses_against &&
                      Object.keys(playerStats.highest_losses_against).length >
                        0 && (
                        <div className="bg-[#2d3748] rounded-lg p-4">
                          <div className="text-sm font-medium text-red-400 mb-2">
                            Most Losses Against
                          </div>
                          {Object.entries(
                            playerStats.highest_losses_against
                          ).map(([player, losses]) => (
                            <div
                              key={player}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-gray-300">{player}</span>
                              <span className="text-red-400 font-medium">
                                {losses || 0} losses
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Last 5 Teams */}
              {playerStats.last_5_teams &&
                playerStats.last_5_teams.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold">Recent Teams</h4>
                    <div className="bg-[#2d3748] rounded-lg p-4">
                      <div className="flex flex-wrap gap-2">
                        {playerStats.last_5_teams.map((team, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                          >
                            {team}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              {/* Last 5 Matches */}
              {playerStats.last_5_matches &&
                playerStats.last_5_matches.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold">Recent Matches</h4>
                    <div className="space-y-3">
                      {playerStats.last_5_matches.map((match, index) => {
                        const matchDate = new Date(match.date);
                        const formattedDate = matchDate.toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        );
                        const formattedTime = matchDate.toLocaleTimeString(
                          'en-US',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        );

                        // Determine match result styling based on match_result field
                        const getResultStyling = (result: string) => {
                          switch (result) {
                            case 'win':
                              return {
                                border: 'border-green-500',
                                badge: 'bg-green-500/20 text-green-300',
                                text: 'W',
                              };
                            case 'draw':
                              return {
                                border: 'border-yellow-500',
                                badge: 'bg-yellow-500/20 text-yellow-300',
                                text: 'D',
                              };
                            case 'loss':
                              return {
                                border: 'border-red-500',
                                badge: 'bg-red-500/20 text-red-300',
                                text: 'L',
                              };
                            default:
                              return {
                                border: 'border-gray-500',
                                badge: 'bg-gray-500/20 text-gray-300',
                                text: '?',
                              };
                          }
                        };

                        const resultStyling = getResultStyling(
                          match.match_result
                        );

                        return (
                          <div
                            key={index}
                            className={`bg-[#2d3748] rounded-lg p-4 border-l-4 ${resultStyling.border}`}
                          >
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 space-y-2 md:space-y-0">
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-2">
                                  <span className="text-sm font-medium text-gray-300">
                                    {match.tournament_name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formattedDate} at {formattedTime}
                                  </span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                                    <span className="text-sm text-gray-300">
                                      {playerStats.username} ({match.team1})
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg font-bold text-white">
                                        {match.current_player_goals} -{' '}
                                        {match.opponent_goals}
                                      </span>
                                      <div className="md:hidden">
                                        <span
                                          className={`px-2 py-1 rounded-full text-sm font-medium ${resultStyling.badge}`}
                                        >
                                          {resultStyling.text}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="text-sm text-gray-300">
                                      {match.opponent_username} ({match.team2})
                                    </span>
                                  </div>
                                  <div className="hidden md:block text-xs">
                                    <span
                                      className={`px-2 py-1 rounded-full ${resultStyling.badge}`}
                                    >
                                      {resultStyling.text}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
