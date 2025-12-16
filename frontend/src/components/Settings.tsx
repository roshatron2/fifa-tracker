import { useAuth } from '@/contexts/auth';
import { createTournament, getFriends, getPlayers } from '@/lib/api';
import { Friend, User } from '@/types';
import { useEffect, useRef, useState } from 'react';
import UserTournaments from './UserTournaments';
import CustomDropdown from './CustomDropdown';

interface SettingsProps {
  onTournamentCreated?: (
    tournamentId?: string,
    deletedTournamentId?: string
  ) => void;
}

export default function Settings({ onTournamentCreated }: SettingsProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [player_ids, setPlayer_ids] = useState<string[]>([]);
  const [allPlayers, setAllPlayers] = useState<User[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [roundsPerMatchup, setRoundsPerMatchup] = useState<number>(2);
  const [halfLength, setHalfLength] = useState<number>(4);
  const [errors, setErrors] = useState<{ roundsPerMatchup?: string; halfLength?: string }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const players = await getPlayers();
        setAllPlayers(players);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    const fetchFriends = async () => {
      try {
        const friendsList = await getFriends();
        setFriends(friendsList);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
    fetchPlayers();
    fetchFriends();
  }, []);

  // Automatically add current user to selected players when component mounts
  useEffect(() => {
    if (user && allPlayers.length > 0) {
      const currentUserPlayer = allPlayers.find(
        player => player.id === user.id
      );
      if (currentUserPlayer && !selectedPlayers.some(p => p.id === user.id)) {
        setSelectedPlayers(prev => [...prev, currentUserPlayer]);
        setPlayer_ids(prev => [...prev, user.id]);
      }
    }
  }, [user, allPlayers, selectedPlayers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredPlayers = friends.filter(friend => {
    const searchLower = searchTerm.toLowerCase();
    const firstName = friend.first_name?.toLowerCase() || '';
    const username = friend.username?.toLowerCase() || '';

    return (
      (firstName.includes(searchLower) || username.includes(searchLower)) &&
      !selectedPlayers.some(selected => selected.id === friend.id) &&
      !(user && friend.id === user.id) // Exclude current user from dropdown
    );
  });

  const handlePlayerSelect = (friend: Friend) => {
    // Prevent adding the current user twice
    if (user && friend.id === user.id) {
      return;
    }
    // Convert friend to user format for selectedPlayers
    const userFriend: User = {
      id: friend.id,
      email: '', // Friends don't have email in the Friend interface
      username: friend.username,
      first_name: friend.first_name,
      last_name: friend.last_name,
    };
    setSelectedPlayers(prev => [...prev, userFriend]);
    setPlayer_ids(prev => [...prev, friend.id]);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handlePlayerRemove = (playerId: string) => {
    // Prevent removing the current user from the tournament
    if (user && playerId === user.id) {
      return;
    }
    setSelectedPlayers(prev => prev.filter(p => p.id !== playerId));
    setPlayer_ids(prev => prev.filter(id => id !== playerId));
  };

  // Calculate estimated tournament time
  const calculateEstimatedTime = () => {
    // Count total players (selected players + current user)
    const totalPlayers = user 
      ? selectedPlayers.length + (selectedPlayers.some(p => p.id === user.id) ? 0 : 1)
      : selectedPlayers.length;
    
    if (totalPlayers < 2) {
      return null;
    }
    
    // Calculate number of unique matchups: n * (n-1) / 2
    const uniqueMatchups = (totalPlayers * (totalPlayers - 1)) / 2;
    
    // Total matches = unique matchups * rounds per matchup
    const totalMatches = uniqueMatchups * roundsPerMatchup;
    
    // Time per match = half_length * 2 (two halves)
    const timePerMatch = halfLength * 2;
    
    // Total time in minutes
    const totalMinutes = totalMatches * timePerMatch;
    
    // Convert to hours and minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return { hours, minutes, totalMatches };
  };

  const estimatedTime = calculateEstimatedTime();

  const handleCreateTournament = async () => {
    // Validate required fields
    const newErrors: { roundsPerMatchup?: string; halfLength?: string } = {};
    
    if (!roundsPerMatchup || roundsPerMatchup < 1) {
      newErrors.roundsPerMatchup = 'Rounds per matchup is required and must be at least 1';
    }
    
    if (!halfLength || halfLength < 3 || halfLength > 6) {
      newErrors.halfLength = 'Half length is required and must be between 3 and 6 minutes';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    try {
      // Ensure current user is included in player_ids
      const finalPlayerIds = [...player_ids];
      if (user && !finalPlayerIds.includes(user.id)) {
        finalPlayerIds.push(user.id);
      }

      const tournament = await createTournament(
        name,
        description,
        finalPlayerIds,
        roundsPerMatchup,
        halfLength
      );
      if (tournament) {
        // Reset form
        setName('');
        setDescription('');
        setPlayer_ids([]);
        setSelectedPlayers([]);
        setRoundsPerMatchup(2);
        setHalfLength(4);
        setErrors({});

        // Switch to manage tab to show the new tournament
        setActiveTab('manage');

        // Refresh the tournament list in the parent component and set as active
        if (onTournamentCreated) {
          onTournamentCreated(tournament.id);
        }
      }
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-[#1a1f2e] rounded-lg p-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'create'
                ? 'bg-green-500 text-white'
                : 'bg-[#2d3748] text-gray-300 hover:bg-[#4a5568]'
            }`}
          >
            Create Tournament
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'manage'
                ? 'bg-green-500 text-white'
                : 'bg-[#2d3748] text-gray-300 hover:bg-[#4a5568]'
            }`}
          >
            My Tournaments
          </button>
        </div>

        {activeTab === 'create' ? (
          <div style={{ overflow: 'visible' }}>
            <h2 className="text-2xl font-bold mb-2">Tournament Management</h2>
            <p className="text-gray-400 mb-6">
              Create new tournaments and select players
            </p>

            <div className="space-y-4" style={{ overflow: 'visible', position: 'relative' }}>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tournament Name
                </label>
                <input
                  type="text"
                  placeholder="Enter tournament name"
                  className="w-full bg-[#2d3748] border border-gray-600 rounded-lg px-3 py-2 text-white"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tournament Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter tournament description"
                  className="w-full bg-[#2d3748] border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#2d3748] border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#2d3748] border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rounds per Matchup <span className="text-red-400">*</span>
                  </label>
                  <CustomDropdown
                    options={[
                      { value: '1', label: '1' },
                      { value: '2', label: '2' }
                    ]}
                    value={roundsPerMatchup.toString()}
                    onChange={value => {
                      const numValue = parseInt(value);
                      setRoundsPerMatchup(numValue);
                      if (errors.roundsPerMatchup) {
                        setErrors(prev => ({ ...prev, roundsPerMatchup: undefined }));
                      }
                    }}
                    placeholder="Select rounds"
                    className={errors.roundsPerMatchup ? 'border-red-500' : ''}
                  />
                  {errors.roundsPerMatchup && (
                    <p className="text-xs text-red-400 mt-1">{errors.roundsPerMatchup}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Number of times each player plays against each other
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Half Length (minutes) <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newValue = Math.max(3, halfLength - 1);
                        setHalfLength(newValue);
                        if (errors.halfLength) {
                          setErrors(prev => ({ ...prev, halfLength: undefined }));
                        }
                      }}
                      className="w-12 h-12 bg-[#2d3748] border border-gray-600 rounded-lg flex items-center justify-center text-white text-xl font-bold transition-colors hover:bg-[#374151]"
                    >
                      -
                    </button>
                    <div className="flex-1 bg-[#2d3748] border border-gray-600 rounded-lg px-4 py-3 text-center">
                      <span className="text-white text-2xl font-bold">
                        {halfLength}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newValue = Math.min(6, halfLength + 1);
                        setHalfLength(newValue);
                        if (errors.halfLength) {
                          setErrors(prev => ({ ...prev, halfLength: undefined }));
                        }
                      }}
                      className="w-12 h-12 bg-[#2d3748] border border-gray-600 rounded-lg flex items-center justify-center text-white text-xl font-bold transition-colors hover:bg-[#374151]"
                    >
                      +
                    </button>
                  </div>
                  {errors.halfLength && (
                    <p className="text-xs text-red-400 mt-1">{errors.halfLength}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Time taken for each half (3-6 minutes)
                  </p>
                </div>
              </div>

              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium mb-2">
                  Select Friends
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  You will automatically be added as a participant in this
                  tournament.
                </p>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search friends by name or username..."
                    className="w-full bg-[#2d3748] border border-gray-600 rounded-lg px-3 py-2 text-white"
                    value={searchTerm}
                    onChange={e => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                  />

                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-[#2d3748] border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredPlayers.length > 0 ? (
                        filteredPlayers.map(friend => (
                          <div
                            key={friend.id}
                            className="px-3 py-2 hover:bg-[#4a5568] cursor-pointer text-white"
                            onClick={() => handlePlayerSelect(friend)}
                          >
                            {friend.username}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-400 text-sm">
                          {searchTerm
                            ? 'No friends found matching your search'
                            : 'Type to search friends by name or username...'}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedPlayers.length > 0 && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium mb-2">
                      Selected Friends
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlayers.map(player => {
                        const isCurrentUser = user && player.id === user.id;
                        return (
                          <span
                            key={player.id}
                            className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                              isCurrentUser
                                ? 'bg-green-600 text-white'
                                : 'bg-[#2d3748] text-white'
                            }`}
                          >
                            {player.first_name || player.username}
                            {isCurrentUser ? (
                              <span className="text-green-300 text-xs">
                                (You)
                              </span>
                            ) : (
                              <button
                                onClick={() => handlePlayerRemove(player.id)}
                                className="text-red-400 hover:text-red-300 text-xs"
                              >
                                ×
                              </button>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {estimatedTime && (
                <div className="bg-[#2d3748] border border-gray-600 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    Tournament Estimate
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Matches:</span>
                      <span className="text-white font-medium">{estimatedTime.totalMatches}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estimated Time:</span>
                      <span className="text-white font-medium">
                        {estimatedTime.hours > 0 && `${estimatedTime.hours} hour${estimatedTime.hours > 1 ? 's' : ''} `}
                        {estimatedTime.minutes > 0 && `${estimatedTime.minutes} minute${estimatedTime.minutes > 1 ? 's' : ''}`}
                        {estimatedTime.hours === 0 && estimatedTime.minutes === 0 && '0 minutes'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleCreateTournament}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Create New Tournament
              </button>
            </div>
          </div>
        ) : (
          <UserTournaments onTournamentCreated={onTournamentCreated} />
        )}
      </div>
    </div>
  );
}
