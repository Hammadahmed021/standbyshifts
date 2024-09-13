import io from 'socket.io-client';
import { showErrorToast } from './src/utils/Toast';
import { setNotification } from './src/store/notificationSlice';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

let socket = null;
const SOCKET_SERVER_URL = 'https://tablenow.dk:3000'; // Use same URL for browser and app

// Request permission for local notifications in the app
const requestNotificationPermission = async () => {
  try {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display === 'granted') {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
  } catch (err) {
    console.error('Error requesting notification permission', err);
  }
};

// Schedule a local notification
const scheduleLocalNotification = async (message) => {
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'New Notification',
          body: message,
          id: new Date().getTime(), // Unique ID
          schedule: { at: new Date(new Date().getTime() + 1000) }, // Schedule 1 second later
          sound: 'default',
          smallIcon: 'icon', // Ensure this icon exists
          // You can set more options if needed
        },
      ],
    });
    console.log('Local notification scheduled');
  } catch (err) {
    console.error('Error scheduling local notification', err);
  }
};

export const initializeSocket = (userId, dispatch) => {
  if (!userId) {
    console.error('User ID is required to join a room');
    return;
  }

  if (Capacitor.isNativePlatform()) {
    // Request permissions for local notifications
    requestNotificationPermission();
  }

  try {
    socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'], // Ensure WebSocket transport is used
      timeout: 10000, // Set timeout to handle connection errors
    });

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    // Emit a join event to the server with the userId
    socket.emit('join', userId);

    socket.on('joined', (room) => {
      console.log(`Joined room: ${room}`);
    });

    socket.on('notification', async (message) => {
      // Dispatch the notification to the Redux store
      dispatch(setNotification(message));

      // If the platform is a native app, trigger local notifications
      if (Capacitor.isNativePlatform()) {
        await scheduleLocalNotification(message);
      }
    });
  } catch (error) {
    console.error('Socket.IO connection error:', error);
    showErrorToast('Socket.IO connection error');
  }
};

export const cleanupSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected');
  }
};
