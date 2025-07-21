import { useState, useEffect, useCallback } from 'react';
import { GameState, Choice } from '../types/game';
import { useSocketConnection } from './useSocketConnection';

export const useMultiplayer = (
  gameState: GameState,
  setOpponentChoice: React.Dispatch<React.SetStateAction<Choice>>
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [opponentName, setOpponentName] = useState<string | null>(null);
  const [opponentReady, setOpponentReady] = useState(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  
  const { socket, socketReady } = useSocketConnection();

  useEffect(() => {
    if (!socket || !gameState.mode === 'multi') return;

    socket.on('start-game', ({ players }) => {
      const opponent = players.find(p => p.id !== socket.id);
      if (opponent) {
        setOpponentName(opponent.name);
        setOpponentReady(true);
        setIsConnected(true);
      }
    });

    socket.on('waiting-for-opponent', () => {
      setWaitingForOpponent(true);
    });

    socket.on('round-complete', ({ choices }) => {
      const opponentMove = choices.find(c => c.id !== socket.id);
      if (opponentMove) {
        setOpponentChoice(opponentMove.choice);
        setWaitingForOpponent(false);
      }
    });

    socket.on('opponent-disconnected', () => {
      setOpponentDisconnected(true);
      setOpponentReady(false);
    });

    socket.on('room-full', () => {
      alert('Room is full. Please try another room.');
    });

    if (gameState.room) {
      socket.emit('create-room', {
        room: gameState.room,
        playerName: gameState.playerName
      });
    }

    return () => {
      socket.off('start-game');
      socket.off('waiting-for-opponent');
      socket.off('round-complete');
      socket.off('opponent-disconnected');
      socket.off('room-full');
    };
  }, [socket, gameState.mode, gameState.room]);

  const sendChoice = useCallback((choice: Choice) => {
    if (!socket || !gameState.room) return;
    
    socket.emit('player-choice', {
      room: gameState.room,
      choice
    });
    setWaitingForOpponent(true);
  }, [socket, gameState.room]);

  return {
    isConnected,
    opponentName,
    opponentReady,
    sendChoice,
    waitingForOpponent,
    opponentDisconnected
  };
};