import { useState } from 'react';
import GameMode from './components/GameMode';
import GameBoard from './components/GameBoard';
import { GameState } from './types/game';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    mode: null,
    room: null,
    playerName: '',
    isPlaying: false,
  });

  const resetGame = () => {
    setGameState({
      mode: null,
      room: null,
      playerName: '',
      isPlaying: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <header className="bg-blue-600 text-white p-4 text-center">
          <h1 className="text-2xl font-bold">Rock Paper Scissors</h1>
        </header>
        
        <main className="p-6">
          {!gameState.mode ? (
            <GameMode setGameState={setGameState} />
          ) : (
            <GameBoard 
              gameState={gameState} 
              setGameState={setGameState}
              resetGame={resetGame}
            />
          )}
        </main>
        
        <footer className="bg-gray-100 p-3 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Rock Paper Scissors
        </footer>
      </div>
    </div>
  );
}

export default App;