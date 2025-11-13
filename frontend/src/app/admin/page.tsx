'use client';

import { TrophyIcon } from '@/components/Icons';
import { getTable } from '@/lib/api';
import { PlayerStats } from '@/types';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [tableData, setTableData] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTable();
        // Ensure data is an array
        if (Array.isArray(data)) {
          setTableData(data);
        } else {
          console.error('Invalid data format received:', data);
          setError('Invalid data format received from server.');
          setTableData([]);
        }
      } catch (err) {
        console.error('Error fetching table data:', err);
        setError('Failed to load table data. Please try again.');
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419] text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1419] text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419] text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Global player statistics and rankings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a1f2e] rounded-lg p-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Players</h3>
            <p className="text-2xl font-bold">
              {Array.isArray(tableData) ? tableData.length : 0}
            </p>
          </div>
          <div className="bg-[#1a1f2e] rounded-lg p-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Matches</h3>
            <p className="text-2xl font-bold">
              {Array.isArray(tableData)
                ? tableData.reduce(
                    (sum, player) => sum + player.total_matches,
                    0
                  )
                : 0}
            </p>
          </div>
          <div className="bg-[#1a1f2e] rounded-lg p-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Goals</h3>
            <p className="text-2xl font-bold">
              {Array.isArray(tableData)
                ? tableData.reduce(
                    (sum, player) => sum + player.total_goals_scored,
                    0
                  )
                : 0}
            </p>
          </div>
          <div className="bg-[#1a1f2e] rounded-lg p-4">
            <h3 className="text-gray-400 text-sm font-medium">
              Active Players
            </h3>
            <p className="text-2xl font-bold">
              {Array.isArray(tableData)
                ? tableData.filter(player => player.total_matches > 0).length
                : 0}
            </p>
          </div>
        </div>

        {/* Global Standings Table */}
        <div className="bg-[#1a1f2e] rounded-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Global Standings
          </h2>

          {!Array.isArray(tableData) || tableData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No player data available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <colgroup>
                  <col className="w-12 sm:w-16" />
                  <col className="w-20 sm:w-24" />
                  <col className="w-8 sm:w-10" />
                  <col className="w-8 sm:w-10" />
                  <col className="w-8 sm:w-10" />
                  <col className="w-8 sm:w-10" />
                  <col className="w-8 sm:w-10" />
                  <col className="w-8 sm:w-10" />
                  <col className="w-10 sm:w-12" />
                  <col className="w-10 sm:w-12" />
                </colgroup>
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-1 font-medium text-gray-300 text-xs sm:text-sm">
                      Pos
                    </th>
                    <th className="text-left py-3 px-1 font-medium text-gray-300 text-xs sm:text-sm">
                      Player
                    </th>
                    <th className="text-center py-3 px-1 font-medium text-gray-300 text-xs sm:text-sm">
                      P
                    </th>
                    <th className="text-center py-3 px-1 font-medium text-gray-300 text-xs sm:text-sm">
                      W
                    </th>
                    <th className="text-center py-3 px-1 font-medium text-gray-300 text-xs sm:text-sm">
                      D
                    </th>
                    <th className="text-center py-3 px-1 font-medium text-gray-300 text-xs sm:text-sm">
                      L
                    </th>
                    <th className="text-center py-3 px-1 font-medium text-gray-300 text-xs sm:text-sm">
                      GF
                    </th>
                    <th className="text-center py-3 px-1 font-medium text-gray-300 text-xs sm:text-sm">
                      GA
                    </th>
                    <th className="text-center py-3 px-1 font-medium text-gray-300 text-xs sm:text-sm">
                      GD
                    </th>
                    <th className="text-center py-3 px-1 font-medium text-gray-300 text-xs sm:text-sm">
                      Pts
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData
                    .sort((a, b) => b.points - a.points)
                    .map((player, index) => (
                      <tr
                        key={player.id}
                        className={`border-b border-gray-800 ${index === 0 ? 'bg-yellow-500/10' : ''}`}
                      >
                        <td className="py-3 px-1">
                          <div className="flex items-center gap-1">
                            {index === 0 && <TrophyIcon size={12} />}
                            <span
                              className={`text-xs sm:text-sm ${index === 0 ? 'font-bold' : ''}`}
                            >
                              {index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-1 font-medium text-xs sm:text-sm truncate">
                          {player.first_name || player.username}
                        </td>
                        <td className="py-3 px-1 text-center text-xs sm:text-sm">
                          {player.total_matches}
                        </td>
                        <td className="py-3 px-1 text-center text-green-400 font-medium text-xs sm:text-sm">
                          {player.wins}
                        </td>
                        <td className="py-3 px-1 text-center text-yellow-400 font-medium text-xs sm:text-sm">
                          {player.draws}
                        </td>
                        <td className="py-3 px-1 text-center text-red-400 font-medium text-xs sm:text-sm">
                          {player.losses}
                        </td>
                        <td className="py-3 px-1 text-center text-xs sm:text-sm">
                          {player.total_goals_scored}
                        </td>
                        <td className="py-3 px-1 text-center text-xs sm:text-sm">
                          {player.total_goals_conceded}
                        </td>
                        <td
                          className={`py-3 px-1 text-center font-medium text-xs sm:text-sm ${player.goal_difference >= 0 ? 'text-green-400' : 'text-red-400'}`}
                        >
                          {player.goal_difference >= 0 ? '+' : ''}
                          {player.goal_difference}
                        </td>
                        <td className="py-3 px-1 text-center font-bold text-xs sm:text-sm">
                          {player.points}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Additional Admin Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Performers */}
          <div className="bg-[#1a1f2e] rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">Top Performers</h3>
            <div className="space-y-3">
              {Array.isArray(tableData) ? (
                tableData
                  .sort((a, b) => b.points - a.points)
                  .slice(0, 5)
                  .map((player, index) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {index + 1}.
                        </span>
                        <span className="text-sm">
                          {player.first_name || player.username}
                        </span>
                      </div>
                      <span className="text-sm font-bold">
                        {player.points} pts
                      </span>
                    </div>
                  ))
              ) : (
                <p className="text-gray-400 text-sm">No data available</p>
              )}
            </div>
          </div>

          {/* Most Active Players */}
          <div className="bg-[#1a1f2e] rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">Most Active Players</h3>
            <div className="space-y-3">
              {Array.isArray(tableData) ? (
                tableData
                  .sort((a, b) => b.total_matches - a.total_matches)
                  .slice(0, 5)
                  .map((player, index) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {index + 1}.
                        </span>
                        <span className="text-sm">
                          {player.first_name || player.username}
                        </span>
                      </div>
                      <span className="text-sm font-bold">
                        {player.total_matches} matches
                      </span>
                    </div>
                  ))
              ) : (
                <p className="text-gray-400 text-sm">No data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
