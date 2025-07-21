import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Store active rooms and their players
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create-room', ({ room, playerName }) => {
    console.log(`Creating/joining room: ${room} by ${playerName}`);
    
    if (!rooms.has(room)) {
      rooms.set(room, {
        players: [{ id: socket.id, name: playerName, choice: null }],
        round: 1
      });
    } else {
      const roomData = rooms.get(room);
      if (roomData.players.length < 2) {
        roomData.players.push({ id: socket.id, name: playerName, choice: null });
      } else {
        socket.emit('room-full');
        return;
      }
    }

    socket.join(room);
    
    const roomData = rooms.get(room);
    if (roomData.players.length === 2) {
      io.to(room).emit('start-game', {
        players: roomData.players.map(p => ({ id: p.id, name: p.name }))
      });
    } else {
      socket.emit('waiting-for-opponent');
    }
  });

  socket.on('player-choice', ({ room, choice }) => {
    if (!rooms.has(room)) return;

    const roomData = rooms.get(room);
    const player = roomData.players.find(p => p.id === socket.id);
    if (player) {
      player.choice = choice;
    }

    // Check if both players have made their choices
    if (roomData.players.every(p => p.choice !== null)) {
      io.to(room).emit('round-complete', {
        choices: roomData.players.map(p => ({
          id: p.id,
          name: p.name,
          choice: p.choice
        }))
      });

      // Reset choices for next round
      roomData.players.forEach(p => p.choice = null);
      roomData.round++;
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove player from their room
    rooms.forEach((data, roomId) => {
      const playerIndex = data.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        data.players.splice(playerIndex, 1);
        if (data.players.length === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit('opponent-disconnected');
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});