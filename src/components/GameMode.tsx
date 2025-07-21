import { useState } from 'react';
import { GameState } from '../types/game';
import { Swords, User } from 'lucide-react';

interface GameModeProps {
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const GameMode = ({ setGameState }: GameModeProps) => {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showMultiplayerOptions, setShowMultiplayerOptions] = useState(false);

  const handleSinglePlayer = () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      mode: 'single',
      playerName: playerName.trim(),
      isPlaying: true
    }));
  };

  const handleMultiplayerJoin = () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!roomId.trim()) {
      alert('Please enter a room ID');
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      mode: 'multi',
      playerName: playerName.trim(),
      room: roomId.trim(),
      isPlaying: true
    }));
  };

  const handleMultiplayerCreate = () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    setGameState(prev => ({
      ...prev,
      mode: 'multi',
      playerName: playerName.trim(),
      room: newRoomId,
      isPlaying: true
    }));
  };

  return (
    <div className="space-y-6 transition-all duration-300">
      <div className="space-y-2">
        <label htmlFor="playerName" className="block text-sm font-medium text-gray-700">
          Your Name
        </label>
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <span className="bg-gray-100 p-2 text-gray-500">
            <User size={20} />
          </span>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="flex-1 p-2 focus:outline-none"
            placeholder="Enter your name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={handleSinglePlayer}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          <User size={20} className="mr-2" />
          Play vs Computer
        </button>
        
        <button
          onClick={() => setShowMultiplayerOptions(!showMultiplayerOptions)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          <Swords size={20} className="mr-2" />
          Multiplayer
        </button>
      </div>

      {showMultiplayerOptions && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
              Room ID
            </label>
            <input
              type="text"
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter room ID to join"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleMultiplayerJoin}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Join Room
            </button>
            <button
              onClick={handleMultiplayerCreate}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Create Room
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameMode;