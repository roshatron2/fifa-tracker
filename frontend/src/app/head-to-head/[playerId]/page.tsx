'use client';

import { ArrowLeftIcon, TrophyIcon } from '@/components/Icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/auth';
import { getHeadToHead } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface HeadToHeadStats {
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
}

export default function HeadToHeadPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  return <HeadToHeadContent params={params} />;
}

function HeadToHeadContent({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<HeadToHeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerId, setPlayerId] = useState<string>('');

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setPlayerId(resolvedParams.playerId);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    const fetchHeadToHead = async () => {
      if (!user?.id || !playerId) {
        return;
      }

      try {
        setLoading(true);
        const data = await getHeadToHead(user.id, playerId);
        setStats(data);
      } catch (error) {
        console.error('Error fetching head-to-head stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeadToHead();
  }, [user?.id, playerId]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0f1419] text-white">
        {/* Header */}
        <header className="py-4 sm:py-6 px-4 border-b border-gray-700">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
                <TrophyIcon size={32} />
                <h1 className="text-xl sm:text-2xl font-bold">
                  Head-to-Head Stats
                </h1>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading stats...</p>
            </div>
          ) : stats ? (
            <div className="space-y-4">
              {/* Players Header - Mobile Optimized */}
              <div className="bg-[#1a1f2e] rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between sm:grid sm:grid-cols-3 sm:gap-4">
                  {/* Player 1 */}
                  <div className="text-center flex-1 sm:flex-none">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-white font-bold text-sm sm:text-xl">
                        {stats.player1_name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-sm sm:text-xl font-bold text-white truncate">
                      {stats.player1_name}
                    </h2>
                  </div>

                  {/* VS */}
                  <div className="text-center px-2 sm:px-0">
                    <span className="text-lg sm:text-3xl font-bold text-gray-400">
                      VS
                    </span>
                  </div>

                  {/* Player 2 */}
                  <div className="text-center flex-1 sm:flex-none">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-white font-bold text-sm sm:text-xl">
                        {stats.player2_name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-sm sm:text-xl font-bold text-white truncate">
                      {stats.player2_name}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Beautiful Stats Overview */}
              <div className="space-y-4">
                {/* Total Matches - Prominent Display */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6 text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <TrophyIcon size={20} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-yellow-400">
                      Total Matches
                    </h3>
                  </div>
                  <p className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-1">
                    {stats.total_matches}
                  </p>
                  <p className="text-gray-400 text-sm">Head-to-Head Battles</p>
                </div>

                {/* Win Statistics - Mobile Optimized */}
                <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
                  {/* Player 1 Wins - Mobile Horizontal Layout */}
                  <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-3 sm:p-6">
                    <div className="flex items-center justify-between sm:flex-col sm:text-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {stats.player1_name.split(' ')[0][0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-blue-400">
                            {stats.player1_name.split(' ')[0]} Wins
                          </h4>
                          <p className="text-xs text-gray-400">Win Rate</p>
                        </div>
                      </div>
                      <div className="text-right sm:text-center">
                        <p className="text-2xl sm:text-4xl font-bold text-blue-400">
                          {stats.player1_wins}
                        </p>
                        <p className="text-sm font-semibold text-blue-300">
                          {(stats.player1_win_rate * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Draws - Mobile Horizontal Layout */}
                  <div className="bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-500/20 rounded-xl p-3 sm:p-6">
                    <div className="flex items-center justify-between sm:flex-col sm:text-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            =
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-400">
                            Draws
                          </h4>
                          <p className="text-xs text-gray-400">Draw Rate</p>
                        </div>
                      </div>
                      <div className="text-right sm:text-center">
                        <p className="text-2xl sm:text-4xl font-bold text-gray-400">
                          {stats.draws}
                        </p>
                        <p className="text-sm font-semibold text-gray-300">
                          {stats.total_matches > 0
                            ? (
                                (stats.draws / stats.total_matches) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Player 2 Wins - Mobile Horizontal Layout */}
                  <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-3 sm:p-6">
                    <div className="flex items-center justify-between sm:flex-col sm:text-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {stats.player2_name.split(' ')[0][0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-purple-400">
                            {stats.player2_name.split(' ')[0]} Wins
                          </h4>
                          <p className="text-xs text-gray-400">Win Rate</p>
                        </div>
                      </div>
                      <div className="text-right sm:text-center">
                        <p className="text-2xl sm:text-4xl font-bold text-purple-400">
                          {stats.player2_wins}
                        </p>
                        <p className="text-sm font-semibold text-purple-300">
                          {(stats.player2_win_rate * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal Statistics - Mobile Optimized */}
              <div className="bg-[#1a1f2e] rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
                  Goal Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {/* Player 1 Goals */}
                  <div className="text-center">
                    <p className="text-gray-400 text-xs sm:text-sm mb-2 truncate">
                      {stats.player1_name}
                    </p>
                    <div className="space-y-2">
                      <div className="bg-blue-500/10 rounded-lg p-2 sm:p-3">
                        <p className="text-gray-300 text-xs sm:text-sm mb-1">
                          Total Goals
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-blue-400">
                          {stats.player1_goals}
                        </p>
                      </div>
                      <div className="bg-blue-500/10 rounded-lg p-2 sm:p-3">
                        <p className="text-gray-300 text-xs sm:text-sm mb-1">
                          Avg per Match
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-blue-400">
                          {stats.player1_avg_goals.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Player 2 Goals */}
                  <div className="text-center">
                    <p className="text-gray-400 text-xs sm:text-sm mb-2 truncate">
                      {stats.player2_name}
                    </p>
                    <div className="space-y-2">
                      <div className="bg-purple-500/10 rounded-lg p-2 sm:p-3">
                        <p className="text-gray-300 text-xs sm:text-sm mb-1">
                          Total Goals
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-purple-400">
                          {stats.player2_goals}
                        </p>
                      </div>
                      <div className="bg-purple-500/10 rounded-lg p-2 sm:p-3">
                        <p className="text-gray-300 text-xs sm:text-sm mb-1">
                          Avg per Match
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-purple-400">
                          {stats.player2_avg_goals.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Win Comparison - Mobile Optimized */}
              {stats.total_matches > 0 && (
                <div className="bg-[#1a1f2e] rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
                    Win Distribution
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-2 h-6 sm:h-8 rounded-lg overflow-hidden">
                    <div
                      className="bg-green-500 h-full flex items-center justify-center text-white text-xs sm:text-sm font-bold"
                      style={{
                        width: `${(stats.player1_wins / stats.total_matches) * 100}%`,
                      }}
                    >
                      {stats.player1_wins > 0 && stats.player1_wins}
                    </div>
                    <div
                      className="bg-gray-500 h-full flex items-center justify-center text-white text-xs sm:text-sm font-bold"
                      style={{
                        width: `${(stats.draws / stats.total_matches) * 100}%`,
                      }}
                    >
                      {stats.draws > 0 && stats.draws}
                    </div>
                    <div
                      className="bg-purple-500 h-full flex items-center justify-center text-white text-xs sm:text-sm font-bold"
                      style={{
                        width: `${(stats.player2_wins / stats.total_matches) * 100}%`,
                      }}
                    >
                      {stats.player2_wins > 0 && stats.player2_wins}
                    </div>
                  </div>
                  <div className="flex justify-between mt-3 sm:mt-4 text-xs sm:text-sm">
                    <span className="text-green-400 truncate">
                      {stats.player1_name.split(' ')[0]}
                    </span>
                    <span className="text-gray-400">Draws</span>
                    <span className="text-purple-400 truncate">
                      {stats.player2_name.split(' ')[0]}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No head-to-head data available
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
