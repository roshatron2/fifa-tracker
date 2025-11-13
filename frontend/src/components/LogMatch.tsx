import { FIFA23AllTeams } from '@/constants/teams';
import { getMatchById, recordMatch, updateMatch } from '@/lib/api';
import { Match, Tournament, User } from '@/types';
import { useEffect, useState } from 'react';
import CustomDropdown from './CustomDropdown';
import { useToast } from './ToastProvider';

interface LogMatchProps {
  players: User[];
  tournaments: Tournament[];
  selectedTournamentId: string;
  onMatchLogged?: () => void;
  onNavigateToSettings?: () => void;
  prePopulatedMatch?: {
    id?: string;
    player1_id: string;
    player2_id: string;
    team1: string;
    team2: string;
    player1_goals: number;
    player2_goals: number;
    half_length: number;
    completed: boolean;
  };
}

export default function LogMatch({
  players,
  tournaments,
  selectedTournamentId,
  onMatchLogged,
  onNavigateToSettings,
  prePopulatedMatch,
}: LogMatchProps) {
  const { showToast } = useToast();
  const selectedTournament =
    tournaments.find(t => t.id === selectedTournamentId) || tournaments[0];

  // Check if the tournament is completed
  const isTournamentCompleted = selectedTournament?.completed || false;

  const [formData, setFormData] = useState<Match>({
    player1_id: prePopulatedMatch?.player1_id || '',
    player2_id: prePopulatedMatch?.player2_id || '',
    team1: prePopulatedMatch?.team1 || '',
    team2: prePopulatedMatch?.team2 || '',
    player1_goals: prePopulatedMatch?.player1_goals || 0,
    player2_goals: prePopulatedMatch?.player2_goals || 0,
    tournament_id: selectedTournament?.id || '',
    half_length: prePopulatedMatch?.half_length || 3,
    completed: true,
  } as Match);

  const teams = FIFA23AllTeams.map(team => team.name);

  // Fetch match data when prePopulatedMatch.id exists (only once)
  useEffect(() => {
    const fetchMatchData = async () => {
      if (prePopulatedMatch?.id) {
        try {
          const matchData = await getMatchById(prePopulatedMatch.id);
          if (matchData && matchData.completed) {
            setFormData({
              id: matchData.id,
              date: matchData.date,
              player1_id: matchData.player1_id,
              player2_id: matchData.player2_id,
              team1: matchData.team1,
              team2: matchData.team2,
              player1_goals: matchData.player1_goals,
              player2_goals: matchData.player2_goals,
              tournament_id: selectedTournament?.id || '',
              half_length: matchData.half_length,
            } as Match);
          }
        } catch (error) {
          console.error('Error fetching match data:', error);
          showToast('Failed to load match data', 'error');
        }
      }
    };

    fetchMatchData();
  }, [prePopulatedMatch?.id, selectedTournament?.id, showToast]);

  // Function to get prioritized team options for a player
  const getPrioritizedTeams = (playerId: string) => {
    if (!playerId) return teams;

    const selectedPlayer = players.find(player => player.id === playerId);
    const recentTeams = selectedPlayer?.last_5_teams || [];

    if (recentTeams.length === 0) return teams;

    // Get teams that are not in recent teams
    const otherTeams = teams.filter(team => !recentTeams.includes(team));

    // Return recent teams first, then other teams
    return [...recentTeams, ...otherTeams];
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // If editing an existing match, update instead of creating
    if (prePopulatedMatch?.id) {
      updateMatch(
        prePopulatedMatch.id,
        formData.player1_goals,
        formData.player2_goals,
        formData.team1,
        formData.team2,
        formData.half_length,
        formData.completed
      )
        .then(() => {
          showToast('Match updated successfully!', 'success');
          if (onMatchLogged) {
            onMatchLogged();
          }
        })
        .catch(error => {
          console.error('Error updating match:', error);
          const errorMessage =
            error?.response?.data?.detail ||
            error?.message ||
            'Failed to update match. Please try again.';
          showToast(errorMessage, 'error');
        });
      return;
    }

    // Otherwise, record a new match (automatically marked completed)
    // If tournament is completed, pass null for tournament_id to create a standalone match
    const tournamentId = isTournamentCompleted ? null : formData.tournament_id;

    recordMatch(
      formData.player1_id,
      formData.player2_id,
      formData.team1,
      formData.team2,
      formData.player1_goals,
      formData.player2_goals,
      formData.half_length,
      formData.completed,
      tournamentId || undefined
    )
      .then(() => {
        showToast('Match logged successfully!', 'success');
        if (onMatchLogged) {
          onMatchLogged();
        }
      })
      .catch(error => {
        console.error('Error logging match:', error);
        const errorMessage =
          error?.response?.data?.detail ||
          error?.message ||
          'Failed to log match. Please try again.';
        showToast(errorMessage, 'error');
      });

    // Reset form data after submission attempt
    setFormData({
      player1_id: prePopulatedMatch?.player1_id || '',
      player2_id: prePopulatedMatch?.player2_id || '',
      team1: prePopulatedMatch?.team1 || '',
      team2: prePopulatedMatch?.team2 || '',
      player1_goals: prePopulatedMatch?.player1_goals || 0,
      player2_goals: prePopulatedMatch?.player2_goals || 0,
      tournament_id: selectedTournament?.id || '',
      half_length: prePopulatedMatch?.half_length || 3,
      completed: true,
    } as Match);
  };

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-2">
        {prePopulatedMatch?.id ? 'Update Match' : 'Log New Match'}
      </h2>
      <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
        {prePopulatedMatch?.id
          ? 'Update the selected match result'
          : `Record a new FIFA match result for ${
              selectedTournament?.name || 'the tournament'
            }`}
      </p>

      {isTournamentCompleted && (
        <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <p className="text-blue-400 text-sm">
            This tournament is completed. The match can be logged as a
            standalone match. To create a new tournament, go to the{' '}
            <button
              onClick={onNavigateToSettings}
              className="text-blue-300 underline hover:text-blue-200 cursor-pointer bg-transparent border-none p-0"
            >
              Settings
            </button>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Player 1</label>
          <select
            className="w-full bg-[#2d3748] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm sm:text-base"
            value={formData.player1_id}
            onChange={e => handleInputChange('player1_id', e.target.value)}
          >
            <option value="">Select player 1</option>
            {players.map(player => (
              <option key={player.id} value={player.id}>
                {player.first_name || player.username}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium mb-2 mt-4">Team 1</label>
          <CustomDropdown
            options={getPrioritizedTeams(formData.player1_id)}
            value={formData.team1}
            onChange={value => handleInputChange('team1', value)}
            placeholder="Select team 1"
            searchable={true}
          />

          <label className="block text-sm font-medium mb-2 mt-4">
            Player 1 Score
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() =>
                handleInputChange(
                  'player1_goals',
                  Math.max(0, formData.player1_goals - 1)
                )
              }
              className="w-12 h-12 bg-[#2d3748] border border-gray-600 rounded-lg flex items-center justify-center text-white text-xl font-bold transition-colors hover:bg-[#374151]"
            >
              -
            </button>
            <div className="flex-1 bg-[#2d3748] border border-gray-600 rounded-lg px-4 py-3 text-center">
              <span className="text-white text-2xl font-bold">
                {formData.player1_goals}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                handleInputChange('player1_goals', formData.player1_goals + 1)
              }
              className="w-12 h-12 bg-[#2d3748] border border-gray-600 rounded-lg flex items-center justify-center text-white text-xl font-bold transition-colors hover:bg-[#374151]"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Player 2</label>
          <select
            className="w-full bg-[#2d3748] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm sm:text-base"
            value={formData.player2_id}
            onChange={e => handleInputChange('player2_id', e.target.value)}
          >
            <option value="">Select player 2</option>
            {players.map(player => (
              <option key={player.id} value={player.id}>
                {player.first_name || player.username}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium mb-2 mt-4">Team 2</label>
          <CustomDropdown
            options={getPrioritizedTeams(formData.player2_id)}
            value={formData.team2}
            onChange={value => handleInputChange('team2', value)}
            placeholder="Select team 2"
            searchable={true}
          />

          <label className="block text-sm font-medium mb-2 mt-4">
            Player 2 Score
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() =>
                handleInputChange(
                  'player2_goals',
                  Math.max(0, formData.player2_goals - 1)
                )
              }
              className="w-12 h-12 bg-[#2d3748] border border-gray-600 rounded-lg flex items-center justify-center text-white text-xl font-bold transition-colors hover:bg-[#374151]"
            >
              -
            </button>
            <div className="flex-1 bg-[#2d3748] border border-gray-600 rounded-lg px-4 py-3 text-center">
              <span className="text-white text-2xl font-bold">
                {formData.player2_goals}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                handleInputChange('player2_goals', formData.player2_goals + 1)
              }
              className="w-12 h-12 bg-[#2d3748] border border-gray-600 rounded-lg flex items-center justify-center text-white text-xl font-bold transition-colors hover:bg-[#374151]"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Half Length (minutes)
        </label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() =>
              handleInputChange(
                'half_length',
                Math.max(3, formData.half_length - 1)
              )
            }
            className="w-12 h-12 bg-[#2d3748] border border-gray-600 rounded-lg flex items-center justify-center text-white text-xl font-bold transition-colors hover:bg-[#374151]"
          >
            -
          </button>
          <div className="flex-1 bg-[#2d3748] border border-gray-600 rounded-lg px-4 py-3 text-center">
            <span className="text-white text-2xl font-bold">
              {formData.half_length}
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              handleInputChange(
                'half_length',
                Math.min(6, formData.half_length + 1)
              )
            }
            className="w-12 h-12 bg-[#2d3748] border border-gray-600 rounded-lg flex items-center justify-center text-white text-xl font-bold transition-colors hover:bg-[#374151]"
          >
            +
          </button>
        </div>
        <p className="text-gray-400 text-sm mt-1">Range: 3-6 minutes</p>
      </div>

      <div className="mt-6">
        <button
          className={`w-full font-medium py-3 px-4 rounded-lg transition-colors text-sm sm:text-base ${
            !selectedTournament && !prePopulatedMatch?.id
              ? 'bg-gray-500 cursor-not-allowed text-gray-300'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          onClick={handleSubmit}
          disabled={!selectedTournament && !prePopulatedMatch?.id}
        >
          {prePopulatedMatch?.id
            ? 'Update Match'
            : isTournamentCompleted
              ? 'Log Independent Match'
              : 'Log Match'}
        </button>
      </div>
    </div>
  );
}
