import { useAuth } from '@/contexts/auth';
import { createTournament, getFriends, getPlayers } from '@/lib/api';
import { Friend, User } from '@/types';
import { useEffect, useRef, useState } from 'react';
import UserTournaments from './UserTournaments';

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

  const handleCreateTournament = async () => {
    try {
      // Ensure current user is included in player_ids
      const finalPlayerIds = [...player_ids];
      if (user && !finalPlayerIds.includes(user.id)) {
        finalPlayerIds.push(user.id);
      }

      const tournament = await createTournament(
        name,
        description,
        finalPlayerIds
      );
      if (tournament) {
        // Reset form
        setName('');
        setDescription('');
        setPlayer_ids([]);
        setSelectedPlayers([]);

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
          <div>
            <h2 className="text-2xl font-bold mb-2">Tournament Management</h2>
            <p className="text-gray-400 mb-6">
              Create new tournaments and select players
            </p>

            <div className="space-y-4">
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
