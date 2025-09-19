import { Server } from 'socket.io';

let io;

export function init(server) {
  io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('joinGuardian', ({ guardianId }) => {
      socket.join(`guardian_${guardianId}`);
    });
  });
}

export function getIo() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}
