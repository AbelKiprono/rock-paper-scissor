import { useState, useEffect } from 'react';
import { GameState, Choice, Result, GameResult } from '../types/game';
import ChoiceSelection from './ChoiceSelection';
import GameResults from './GameResults';
import { generateComputerChoice, determineWinner } from '../utils/gameUtils';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useMultiplayer } from '../hooks/useMultiplayer';

interface GameBoardProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  resetGame: () => void;
}

const GameBoard = ({ gameState, setGameState, resetGame }: GameBoardProps) => {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [opponentChoice, setOpponentChoice] = useState<Choice>(null);
  const [result, setResult] = useState<Result>(null);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [scores, setScores] = useState({ player: 0, opponent: 0 });

  const { 
    isConnected, 
    opponentName, 
    opponentReady,
    sendChoice,
    waitingForOpponent,
    opponentDisconnected,
  } = useMultiplayer(gameState, setOpponentChoice);

  const handleChoice = (choice: Choice) => {
    setPlayerChoice(choice);
    
    if (gameState.mode === 'single') {
      // For single player, generate computer choice
      setCountdown(3);
    } else {
      // For multiplayer, send choice to opponent
      sendChoice(choice);
    }
  };

  const updateScores = (result: Result) => {
    setScores(prev => ({
      player: prev.player + (result === 'win' ? 1 : 0),
      opponent: prev.opponent + (result === 'lose' ? 1 : 0)
    }));
  };

  const playAgain = () => {
    setPlayerChoice(null);
    setOpponentChoice(null);
    setResult(null);
    setIsGameOver(false);
    setRoundNumber(prev => prev + 1);
  };

  // Handle countdown for computer selection in single player
  useEffect(() => {
    if (gameState.mode === 'single' && playerChoice && countdown !== null) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        const computerChoice = generateComputerChoice();
        setOpponentChoice(computerChoice);
        const gameResult = determineWinner(playerChoice, computerChoice);
        setResult(gameResult);
        updateScores(gameResult);
        
        setGameHistory(prev => [
          ...prev, 
          { playerChoice, opponentChoice: computerChoice, result: gameResult }
        ]);
      }
    }
  }, [countdown, playerChoice, gameState.mode]);

  // Handle result when both choices are made in multiplayer
  useEffect(() => {
    if (gameState.mode === 'multi' && playerChoice && opponentChoice) {
      const gameResult = determineWinner(playerChoice, opponentChoice);
      setResult(gameResult);
      updateScores(gameResult);
      
      setGameHistory(prev => [
        ...prev, 
        { playerChoice, opponentChoice, result: gameResult }
      ]);
    }
  }, [playerChoice, opponentChoice, gameState.mode]);

  // Check for game over (best of 3)
  useEffect(() => {
    if (scores.player >= 2 || scores.opponent >= 2) {
      setIsGameOver(true);
    }
  }, [scores]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button 
          onClick={resetGame}
          className="text-gray-600 hover:text-gray-900 flex items-center text-sm"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>
        
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            {gameState.mode === 'single' 
              ? 'VS Computer' 
              : `Room: ${gameState.room}`
            }
          </h2>
        </div>
        
        <div className="w-16"></div> {/* Spacer for alignment */}
      </div>
      
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-center">
            <p className="text-sm text-gray-600">You</p>
            <p className="font-bold text-lg">{gameState.playerName}</p>
            <p className="text-xl font-bold text-blue-600">{scores.player}</p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">Round</p>
            <p className="font-bold text-lg">{roundNumber}</p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {gameState.mode === 'single' ? 'Computer' : 'Opponent'}
            </p>
            <p className="font-bold text-lg">
              {gameState.mode === 'single' ? 'AI' : (opponentName || 'Waiting...')}
            </p>
            <p className="text-xl font-bold text-orange-500">{scores.opponent}</p>
          </div>
        </div>
      </div>
      
      {gameState.mode === 'multi' && !isConnected && (
        <div className="text-center py-6">
          <div className="animate-spin mb-4 mx-auto">
            <RefreshCw size={36} className="text-blue-500" />
          </div>
          <p className="text-lg">Connecting to server...</p>
          <p className="text-gray-600 mt-2">Share room code: <span className="font-mono font-bold">{gameState.room}</span></p>
        </div>
      )}
      
      {gameState.mode === 'multi' && isConnected && !opponentReady && (
        <div className="text-center py-6">
          <div className="animate-pulse mb-4">
            <RefreshCw size={36} className="text-blue-500 mx-auto" />
          </div>
          <p className="text-lg">Waiting for opponent to join...</p>
          <p className="text-gray-600 mt-2">Share room code: <span className="font-mono font-bold">{gameState.room}</span></p>
        </div>
      )}
      
      {opponentDisconnected && (
        <div className="text-center py-6">
          <p className="text-lg text-red-500">Opponent disconnected</p>
          <button 
            onClick={resetGame} 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Return to menu
          </button>
        </div>
      )}
      
      {((gameState.mode === 'single') || (gameState.mode === 'multi' && isConnected && opponentReady)) && (
        <>
          {!playerChoice && !result && (
            <ChoiceSelection onSelect={handleChoice} />
          )}
          
          {playerChoice && !opponentChoice && (
            <div className="text-center py-6">
              <p className="text-lg mb-2">You chose {playerChoice}</p>
              {countdown !== null && (
                <div className="text-3xl font-bold text-blue-600 animate-pulse">
                  {countdown > 0 ? countdown : 'Revealing...'}
                </div>
              )}
              {gameState.mode === 'multi' && waitingForOpponent && (
                <div className="text-lg text-gray-600 mt-2">Waiting for opponent...</div>
              )}
            </div>
          )}
          
          {playerChoice && opponentChoice && result && (
            <GameResults 
              playerChoice={playerChoice}
              opponentChoice={opponentChoice}
              result={result}
              isGameOver={isGameOver}
              scores={scores}
              onPlayAgain={playAgain}
              onReset={resetGame}
            />
          )}
        </>
      )}
    </div>
  );
};

export default GameBoard;