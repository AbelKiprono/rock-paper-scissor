import { Choice, Result } from '../types/game';
import { 
  HandMetal, 
  Hand, 
  Scissors,
  Trophy,
  RotateCw
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface GameResultsProps {
  playerChoice: Choice;
  opponentChoice: Choice;
  result: Result;
  isGameOver: boolean;
  scores: { player: number; opponent: number };
  onPlayAgain: () => void;
  onReset: () => void;
}

const GameResults = ({ 
  playerChoice, 
  opponentChoice, 
  result,
  isGameOver,
  scores,
  onPlayAgain,
  onReset
}: GameResultsProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Delay animation start slightly
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const getChoiceIcon = (choice: Choice) => {
    switch (choice) {
      case 'rock':
        return <HandMetal size={32} />;
      case 'paper':
        return <Hand size={32} />;
      case 'scissors':
        return <Scissors size={32} />;
      default:
        return null;
    }
  };

  const getResultMessage = () => {
    switch (result) {
      case 'win':
        return 'You win!';
      case 'lose':
        return 'You lose!';
      case 'draw':
        return "It's a draw!";
      default:
        return '';
    }
  };

  const getResultColor = () => {
    switch (result) {
      case 'win':
        return 'text-green-600';
      case 'lose':
        return 'text-red-600';
      case 'draw':
        return 'text-gray-600';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className={`text-center transition-opacity duration-500 ${showAnimation ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className={`text-2xl font-bold ${getResultColor()}`}>
          {getResultMessage()}
        </h3>
        
        {isGameOver && (
          <div className="mt-4 flex items-center justify-center">
            <Trophy size={24} className={`${scores.player > scores.opponent ? 'text-yellow-500' : 'text-gray-400'} mr-2`} />
            <p className="text-lg font-semibold">
              {scores.player > scores.opponent 
                ? 'You won the game!' 
                : 'Better luck next time!'}
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className={`text-center p-4 rounded-lg bg-blue-100 transition-transform duration-500 ${showAnimation ? 'scale-100' : 'scale-90'}`}>
          <p className="text-sm text-gray-600 mb-2">Your choice</p>
          <div className={`p-4 rounded-full inline-block ${
            result === 'win' ? 'bg-green-500' : result === 'lose' ? 'bg-red-500' : 'bg-gray-500'
          } text-white`}>
            {getChoiceIcon(playerChoice)}
          </div>
          <p className="mt-2 font-medium capitalize">{playerChoice}</p>
        </div>
        
        <div className={`text-center p-4 rounded-lg bg-orange-100 transition-transform duration-500 ${showAnimation ? 'scale-100' : 'scale-90'}`}>
          <p className="text-sm text-gray-600 mb-2">Opponent's choice</p>
          <div className={`p-4 rounded-full inline-block ${
            result === 'lose' ? 'bg-green-500' : result === 'win' ? 'bg-red-500' : 'bg-gray-500'
          } text-white`}>
            {getChoiceIcon(opponentChoice)}
          </div>
          <p className="mt-2 font-medium capitalize">{opponentChoice}</p>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4 pt-4">
        {!isGameOver ? (
          <button
            onClick={onPlayAgain}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center transition-colors duration-200"
          >
            <RotateCw size={18} className="mr-2" />
            Next Round
          </button>
        ) : (
          <>
            <button
              onClick={onReset}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center transition-colors duration-200"
            >
              New Game
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GameResults;