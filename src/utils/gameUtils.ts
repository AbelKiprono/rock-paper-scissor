import { Choice, Result } from '../types/game';

export const generateComputerChoice = (): Choice => {
  const choices: Choice[] = ['rock', 'paper', 'scissors'];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
};

export const determineWinner = (playerChoice: Choice, opponentChoice: Choice): Result => {
  if (!playerChoice || !opponentChoice) return null;
  
  if (playerChoice === opponentChoice) {
    return 'draw';
  }
  
  if (
    (playerChoice === 'rock' && opponentChoice === 'scissors') ||
    (playerChoice === 'paper' && opponentChoice === 'rock') ||
    (playerChoice === 'scissors' && opponentChoice === 'paper')
  ) {
    return 'win';
  }
  
  return 'lose';
};