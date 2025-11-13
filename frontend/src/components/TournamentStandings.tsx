import { DrawIcon, LossIcon, WinIcon } from '@/components/Icons';
import { PlayerStats } from '@/types';

interface TournamentStandingsProps {
  standings: PlayerStats[];
}

export default function TournamentStandings({
  standings,
}: TournamentStandingsProps) {
  return (
    <div className="bg-[#1a1f2e] rounded-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-2">
        Tournament Standings
      </h2>

      {/* Table view - scrollable on mobile */}
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
            <col className="w-20 sm:w-24" />
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
              <th className="text-center py-3 px-1 font-medium text-gray-300 text-xs sm:text-sm">
                Last 5
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.map((player, index) => (
              <tr
                key={player.id}
                className={`border-b border-gray-800 ${index === 0 ? 'bg-yellow-500/10' : ''}`}
              >
                <td className="py-3 px-1">
                  <div className="flex items-center gap-1">
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
                <td className="py-3 px-1 text-center">
                  <div className="flex justify-center gap-2">
                    {player.last_5_matches
                      ?.slice()
                      .reverse()
                      .map((result, matchIndex) => {
                        if (result === '-') {
                          return (
                            <div
                              key={matchIndex}
                              className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gray-600 border border-gray-500"
                            />
                          );
                        }

                        const getMatchIcon = (result: string) => {
                          switch (result) {
                            case 'W':
                              return (
                                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-green-500 flex items-center justify-center">
                                  <WinIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                </div>
                              );
                            case 'L':
                              return (
                                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-red-500 flex items-center justify-center">
                                  <LossIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                </div>
                              );
                            case 'D':
                              return (
                                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                                  <DrawIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                </div>
                              );
                            default:
                              return (
                                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gray-600 border border-gray-500" />
                              );
                          }
                        };

                        return (
                          <div key={matchIndex}>{getMatchIcon(result)}</div>
                        );
                      })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
