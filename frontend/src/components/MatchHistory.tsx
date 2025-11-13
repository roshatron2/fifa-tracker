import { MatchResult } from '@/types';

interface MatchHistoryProps {
  matches: MatchResult[];
  tournamentId?: string;
  isTournamentCreator?: boolean;
  isTournamentCompleted?: boolean;
  onMatchUpdated?: () => void;
  onPageChange?: (newPage: number) => void;
  currentPage?: number;
  totalPages?: number;
  onMatchClick?: (match: MatchResult) => void;
}

// Utility function to format date as "October 19th, 2025"
function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Get month name
  const month = date.toLocaleDateString('en-US', { month: 'long' });

  // Get day with ordinal suffix
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);

  // Get year
  const year = date.getFullYear();

  return `${month} ${day}${suffix}, ${year}`;
}

// Utility function to get ordinal suffix
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

// Utility function to group matches by date
function groupMatchesByDate(matches: MatchResult[]): {
  [key: string]: MatchResult[];
} {
  const grouped: { [key: string]: MatchResult[] } = {};

  // Safety check: ensure matches is an array
  if (!Array.isArray(matches)) {
    console.warn('groupMatchesByDate: matches is not an array:', matches);
    return grouped;
  }

  matches.forEach(match => {
    const dateKey = new Date(match.date).toDateString(); // Use date string as key
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(match);
  });

  return grouped;
}

export default function MatchHistory({
  matches,
  isTournamentCompleted = false,
  onMatchUpdated: _onMatchUpdated,
  onPageChange,
  currentPage = 1,
  totalPages,
  onMatchClick,
}: MatchHistoryProps) {
  // Safety check: ensure matches is always an array
  const safeMatches = Array.isArray(matches) ? matches : [];

  const groupedMatches = groupMatchesByDate(safeMatches);

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedMatches).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Match History</h2>
        {safeMatches.length > 0 && (
          <span className="text-sm text-gray-300 bg-gray-800/50 px-3 py-1 rounded-full">
            {safeMatches[0].half_length} min halves
          </span>
        )}
      </div>

      {safeMatches.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg">No matches found</p>
          <p className="text-gray-500 text-sm mt-2">
            Matches will appear here once they are logged
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(dateKey => {
            const dateMatches = groupedMatches[dateKey];
            const formattedDate = formatDate(dateMatches[0].date);
            console.log(formattedDate);

            return (
              <div key={dateKey} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-600 pb-2">
                  {formattedDate}
                </h3>
                <div className="space-y-3">
                  {dateMatches.map((match, index) => (
                    <div
                      key={`${dateKey}-${index}`}
                      className={`${
                        match.completed
                          ? 'bg-[#1e293b] border border-green-600/40'
                          : 'bg-[#2d3748] border border-red-600/40'
                      } rounded-lg p-3 sm:p-4 ${
                        onMatchClick
                          ? 'cursor-pointer hover:bg-[#374151] transition-colors'
                          : ''
                      }`}
                      onClick={
                        onMatchClick ? () => onMatchClick(match) : undefined
                      }
                    >
                      <div className="space-y-3">
                        {/* Top row - Status */}
                        <div className="flex justify-center">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              match.completed
                                ? 'bg-green-600/20 text-green-300 border border-green-500/50'
                                : 'bg-red-600/20 text-red-300 border border-red-500/50'
                            }`}
                          >
                            {match.completed ? 'Completed' : 'Incomplete'}
                          </span>
                        </div>

                        {/* Middle row - Players and Score */}
                        <div className="flex items-center">
                          <div className="font-semibold text-base sm:text-lg text-white flex-1 text-left">
                            {match.player1_name}
                          </div>
                          <div className="bg-gray-700 px-4 py-2 rounded-lg text-sm sm:text-base font-bold text-white mx-6 min-w-[80px] text-center flex-shrink-0">
                            {match.player1_goals} - {match.player2_goals}
                          </div>
                          <div className="font-semibold text-base sm:text-lg text-white flex-1 text-right">
                            {match.player2_name}
                          </div>
                        </div>

                        {/* Bottom row - Action Button */}
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              onMatchClick?.(match);
                            }}
                            disabled={isTournamentCompleted && match.completed}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isTournamentCompleted && match.completed
                                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                : match.completed
                                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                            title={
                              isTournamentCompleted && match.completed
                                ? 'Tournament completed - cannot update match'
                                : match.completed
                                  ? 'Update this match'
                                  : 'Log this match'
                            }
                          >
                            {match.completed ? 'Update' : 'Log'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Summary */}
      {totalPages && totalPages > 1 && (
        <div className="text-center text-sm text-gray-400 mt-4">
          Page {currentPage} of {totalPages} • {safeMatches.length} matches on
          this page
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-2 bg-[#2d3748] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#374151] transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange?.(pageNum)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    pageNum === currentPage
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#2d3748] text-white hover:bg-[#374151]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-2 bg-[#2d3748] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#374151] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
