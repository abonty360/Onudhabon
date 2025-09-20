import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket(guardianId, onProgressUpdate) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:4000');
    socketRef.current.emit('joinGuardian', { guardianId });

    socketRef.current.on('progressUpdated', (data) => {
      onProgressUpdate(data);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [guardianId, onProgressUpdate]);
}