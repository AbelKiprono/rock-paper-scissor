import { useState } from 'react';
import { Choice } from '../types/game';
import { 
  HandMetal, 
  Hand, 
  Scissors,
  BadgeInfo
} from 'lucide-react';

interface ChoiceSelectionProps {
  onSelect: (choice: Choice) => void;
}

const ChoiceSelection = ({ onSelect }: ChoiceSelectionProps) => {
  const [hoveredChoice, setHoveredChoice] = useState<Choice | null>(null);
  const [showRules, setShowRules] = useState(false);

  const choices: { value: Choice, icon: React.ReactNode, color: string }[] = [
    { 
      value: 'rock', 
      icon: <HandMetal size={36} />, 
      color: 'bg-red-500 hover:bg-red-600'
    },
    { 
      value: 'paper', 
      icon: <Hand size={36} />, 
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    { 
      value: 'scissors', 
      icon: <Scissors size={36} />, 
      color: 'bg-yellow-500 hover:bg-yellow-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-1">Make your choice</h3>
        <p className="text-gray-600 text-sm">First to win 2 rounds wins the game</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {choices.map((choice) => (
          <button
            key={choice.value}
            onClick={() => onSelect(choice.value)}
            onMouseEnter={() => setHoveredChoice(choice.value)}
            onMouseLeave={() => setHoveredChoice(null)}
            className={`${choice.color} text-white p-6 rounded-full flex flex-col items-center justify-center transition-transform duration-200 ${
              hoveredChoice === choice.value ? 'scale-110' : ''
            }`}
          >
            {choice.icon}
            <span className="mt-2 font-medium capitalize">{choice.value}</span>
          </button>
        ))}
      </div>
      
      <div className="text-center mt-6">
        <button 
          onClick={() => setShowRules(!showRules)}
          className="text-gray-600 hover:text-gray-900 text-sm flex items-center justify-center mx-auto"
        >
          <BadgeInfo size={16} className="mr-1" />
          {showRules ? 'Hide rules' : 'Show rules'}
        </button>
        
        {showRules && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg text-left text-sm">
            <h4 className="font-medium mb-2">Game Rules:</h4>
            <ul className="space-y-1 text-gray-700 list-disc pl-5">
              <li>Rock crushes Scissors</li>
              <li>Scissors cuts Paper</li>
              <li>Paper covers Rock</li>
              <li>First to win 2 rounds wins the game</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChoiceSelection;