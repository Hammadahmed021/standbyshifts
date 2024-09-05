import io from 'socket.io-client';
import { showInfoToast, showErrorToast } from './src/utils/Toast';
import { setNotification } from './src/store/notificationSlice';
import { useDispatch } from 'react-redux';

let socket = null;


export const initializeSocket = (userId, dispatch) => {
  if (!userId) {
    // console.error('User ID is required to join a room');
    return;
  }

  try {
    socket = io('https://tablenow.dk:3000');

    socket.on('connect', () => {
      // console.log('Connected to Socket.IO server');
      // console.log('Socket ID:', socket.id);
    });

    socket.emit('join', userId);

    socket.on('joined', (room) => {
      // console.log(`Joined room: ${room}`);
    });

    socket.on('notification', (message) => {
      // Trigger an action to show modal
      dispatch(setNotification(message));
    });

  } catch (error) {
    // console.error('Socket.IO connection error:', error);
    showErrorToast('Socket.IO connection error');
  }
};

export const cleanupSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    // console.log('Socket disconnected');
  }
};
