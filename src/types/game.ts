export type GameMode = 'single' | 'multi' | null;
export type Choice = 'rock' | 'paper' | 'scissors' | null;
export type Result = 'win' | 'lose' | 'draw' | null;

export interface GameState {
  mode: GameMode;
  room: string | null;
  playerName: string;
  isPlaying: boolean;
}

export interface GameResult {
  playerChoice: Choice;
  opponentChoice: Choice;
  result: Result;
}

export interface Player {
  id: string;
  name: string;
  choice: Choice;
  ready: boolean;
}

export interface Room {
  id: string;
  players: Player[];
  round: number;
  results: GameResult[];
}