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
            <div className="bg-[#1a1f2e] rounded-xl overflow-hidden">
              {/* Players Header */}
              <div className="px-5 pt-6 pb-5 sm:px-8 sm:pt-8 sm:pb-6">
                <div className="flex items-center justify-between max-w-xs mx-auto sm:max-w-sm">
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-lg sm:text-xl">
                        {stats.player1_name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-sm sm:text-base font-semibold text-white truncate max-w-[100px] sm:max-w-[140px]">
                      {stats.player1_name}
                    </h2>
                  </div>

                  <div className="flex flex-col items-center px-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {stats.total_matches} {stats.total_matches === 1 ? 'match' : 'matches'}
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold text-gray-500">
                      VS
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-lg sm:text-xl">
                        {stats.player2_name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-sm sm:text-base font-semibold text-white truncate max-w-[100px] sm:max-w-[140px]">
                      {stats.player2_name}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Win Distribution Bar */}
              {stats.total_matches > 0 && (
                <div className="px-5 sm:px-8 pb-5 sm:pb-6">
                  <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-700/50">
                    <div
                      className="bg-blue-500 transition-all duration-500"
                      style={{
                        width: `${(stats.player1_wins / stats.total_matches) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-gray-500 transition-all duration-500"
                      style={{
                        width: `${(stats.draws / stats.total_matches) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${(stats.player2_wins / stats.total_matches) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Stats Table */}
              <div className="border-t border-gray-700/50">
                {/* Wins Row */}
                <div className="grid grid-cols-3 px-5 sm:px-8 py-3.5 sm:py-4">
                  <div className="text-left">
                    <span className="text-xl sm:text-2xl font-bold text-blue-400">
                      {stats.player1_wins}
                    </span>
                    <span className="text-xs sm:text-sm text-blue-400/60 ml-1.5">
                      {(stats.player1_win_rate * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-center self-center">
                    <span className="text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wide">
                      Wins
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm text-emerald-400/60 mr-1.5">
                      {(stats.player2_win_rate * 100).toFixed(0)}%
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-emerald-400">
                      {stats.player2_wins}
                    </span>
                  </div>
                </div>

                {/* Draws Row */}
                <div className="grid grid-cols-3 px-5 sm:px-8 py-3.5 sm:py-4 border-t border-gray-700/30">
                  <div className="text-left">
                    <span className="text-xl sm:text-2xl font-bold text-gray-400">
                      {stats.draws}
                    </span>
                  </div>
                  <div className="text-center self-center">
                    <span className="text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wide">
                      Draws
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-bold text-gray-400">
                      {stats.draws}
                    </span>
                  </div>
                </div>

                {/* Goals Row */}
                <div className="grid grid-cols-3 px-5 sm:px-8 py-3.5 sm:py-4 border-t border-gray-700/30">
                  <div className="text-left">
                    <span className="text-xl sm:text-2xl font-bold text-blue-400">
                      {stats.player1_goals}
                    </span>
                  </div>
                  <div className="text-center self-center">
                    <span className="text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wide">
                      Goals
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-bold text-emerald-400">
                      {stats.player2_goals}
                    </span>
                  </div>
                </div>

                {/* Avg Goals Row */}
                <div className="grid grid-cols-3 px-5 sm:px-8 py-3.5 sm:py-4 border-t border-gray-700/30">
                  <div className="text-left">
                    <span className="text-xl sm:text-2xl font-bold text-blue-400">
                      {stats.player1_avg_goals.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-center self-center">
                    <span className="text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wide">
                      Avg Goals
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-bold text-emerald-400">
                      {stats.player2_avg_goals.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
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
