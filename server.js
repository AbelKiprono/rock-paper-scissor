import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

// Socket.io instance with CORS config
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend origin
    methods: ["GET", "POST"]
  }
});

// Store active rooms and player info
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create or join a room
  socket.on('create-room', ({ room, playerName }) => {
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

  // Handle player move
  socket.on('player-choice', ({ room, choice }) => {
    if (!rooms.has(room)) return;

    const roomData = rooms.get(room);
    const player = roomData.players.find(p => p.id === socket.id);
    if (player) {
      player.choice = choice;
    }

    // If both players have made a move
    if (roomData.players.every(p => p.choice !== null)) {
      io.to(room).emit('round-complete', {
        choices: roomData.players.map(p => ({
          id: p.id,
          name: p.name,
          choice: p.choice
        }))
      });

      // Reset for next round
      roomData.players.forEach(p => p.choice = null);
      roomData.round++;
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

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
