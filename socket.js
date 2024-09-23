  import io from 'socket.io-client';
  import { showErrorToast } from './src/utils/Toast';
  import { setNotification } from './src/store/notificationSlice';
  import { Capacitor } from '@capacitor/core';
  import { LocalNotifications } from '@capacitor/local-notifications';
  import { PushNotifications } from '@capacitor/push-notifications';

  let socket = null;
  const SOCKET_SERVER_URL = 'https://tablenow.dk:3000';

  let pushNotificationListenersAdded = false;

  const requestPushNotificationPermission = async (dispatch) => {
    try {
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive === 'granted') {
        console.log('Push Notification permission granted');
  
        await PushNotifications.register();
  
        if (!pushNotificationListenersAdded) {
          PushNotifications.addListener('registration', (token) => {
            console.log('Device registered for push notifications, token:', token.value);
          });
  
          PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push notification received:', notification);
            dispatch(setNotification(notification.body));
            // showLocalNotification(notification.body);
          });
  
          PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            console.log('Push notification action performed:', notification);
          });
  
          // Mark listeners as added
          pushNotificationListenersAdded = true;
        }
      } else {
        console.log('Push Notification permission denied');
      }
    } catch (err) {
      console.error('Error requesting push notification permission', err);
    }
  };
  

  // let lastNotificationId = null;

// const showLocalNotification = async (message) => {
//   if (Capacitor.isNativePlatform()) {
//     try {
//       const { display } = await LocalNotifications.requestPermissions();
//       if (display === 'granted') {
//         const notificationId = Math.floor(Math.random() * 2147483647);

//         // Prevent duplicate notifications
//         if (notificationId === lastNotificationId) {
//           console.log('Duplicate notification, ignoring...');
//           return;
//         }
//         lastNotificationId = notificationId;

//         await LocalNotifications.schedule({
//           notifications: [
//             {
//               title: 'New Notification',
//               body: message,
//               id: notificationId,
//               schedule: { at: new Date(new Date().getTime() + 1000) }, // 1 second delay
//               sound: 'default',
//               smallIcon: 'icon',
//             },
//           ],
//         });
//         console.log('Local notification triggered:', message);
//       } else {
//         console.log('Local notification permissions not granted');
//       }
//     } catch (error) {
//       console.error('Error scheduling local notification:', error);
//     }
//   }
// };

  
  // Show browser notification
  const showBrowserNotification = (message) => {
    if (!('Notification' in window)) {
      console.error('This browser does not support notifications.');
      return;
    }
    if (Notification.permission === 'granted') {
      new Notification('New Notification', { body: message });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('New Notification', { body: message });
        }
      });
    }
  };

  // Initialize socket connection and handle notifications
  export const initializeSocket = (userId, dispatch) => {
    if (!userId) {
      console.error('User ID is required to join a room');
      return;
    }

    try {
      socket = io(SOCKET_SERVER_URL, {
        transports: ['websocket'],
        timeout: 10000,
      });

      socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
      });

      // Emit a join event to the server with the userId
      socket.emit('join', userId);

      socket.on('joined', (room) => {
        console.log(`Joined room: ${room}`);
      });

      // Handle incoming notifications from Socket.IO
      socket.on('notification', async (message) => {
        console.log('Notification received from socket:', message);

        // Dispatch the notification to the Redux store
        dispatch(setNotification(message));

        // Show a local or push notification on mobile
        if (Capacitor.isNativePlatform()) {
          showLocalNotification(message);
        } else {
          // For browsers, show browser notification
          showBrowserNotification(message);
        }
      });

      // Request push notifications permission on mobile devices
      if (Capacitor.isNativePlatform()) {
        requestPushNotificationPermission(dispatch);
      }
    } catch (error) {
      console.error('Socket.IO connection error:', error);
      showErrorToast('Socket.IO connection error');
    }
  };

  // Cleanup socket connection
  export const cleanupSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      console.log('Socket disconnected');
    }
  };

// import io from 'socket.io-client';
// import { showErrorToast } from './src/utils/Toast';
// import { setNotification } from './src/store/notificationSlice';
// import { Capacitor } from '@capacitor/core';
// import { LocalNotifications } from '@capacitor/local-notifications';
// import { PushNotifications } from '@capacitor/push-notifications';

// let socket = null;
// const SOCKET_SERVER_URL = 'https://tablenow.dk:3000';

// // Request permission for push notifications (only for mobile apps)
// const requestPushNotificationPermission = async (dispatch) => {
//   try {
//     const permission = await PushNotifications.requestPermissions();
//     if (permission.receive === 'granted') {
//       console.log('Push Notification permission granted');

//       // Register the device for push notifications
//       await PushNotifications.register();

//       // Handle the registration of the device
//       PushNotifications.addListener('registration', (token) => {
//         console.log('Device registered for push notifications, token:', token.value);
//         // Send the token to your server for future use
//       });

//       // Handle push notification received when app is in the foreground
//       PushNotifications.addListener('pushNotificationReceived', (notification) => {
//         console.log('Push notification received:', notification);
//         // Dispatch the notification to Redux store
//         dispatch(setNotification(notification.body));
//       });

//       // Handle push notification action performed (when the notification is clicked)
//       PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
//         console.log('Push notification action performed:', notification);
//       });
//     } else {
//       console.log('Push Notification permission denied');
//     }
//   } catch (err) {
//     console.error('Error requesting push notification permission', err);
//   }
// };

// // Initialize socket connection and handle notifications
// export const initializeSocket = (userId, dispatch) => {
//   if (!userId) {
//     console.error('User ID is required to join a room');
//     return;
//   }

//   try {
//     // Common socket logic for both web and mobile
//     socket = io(SOCKET_SERVER_URL, {
//       transports: ['websocket'], // Ensure WebSocket transport is used
//       timeout: 10000, // Set timeout to handle connection errors
//     });

//     socket.on('connect', () => {
//       console.log('Connected to Socket.IO server');
//     });

//     // Emit a join event to the server with the userId
//     socket.emit('join', userId);

//     socket.on('joined', (room) => {
//       console.log(`Joined room: ${room}`);
//     });

//     socket.on('notification', async (message) => {
//       // Dispatch the notification to the Redux store
//       dispatch(setNotification(message));

//       // Trigger local notifications only if the app is native
//       if (Capacitor.isNativePlatform()) {
//         await LocalNotifications.schedule({
//           notifications: [
//             {
//               title: 'New Notification',
//               body: message,
//               id: new Date().getTime(),
//               schedule: { at: new Date(new Date().getTime() + 1000) },
//               sound: 'default',
//               smallIcon: 'icon', // Use the correct path for Android
//             },
//           ],
//         });
//       }
//     });

//     // For mobile platforms, request push notifications permission
//     if (Capacitor.isNativePlatform()) {
//       requestPushNotificationPermission(dispatch);
//     }
//   } catch (error) {
//     console.error('Socket.IO connection error:', error);
//     showErrorToast('Socket.IO connection error');
//   }
// };

// // Cleanup socket connection
// export const cleanupSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//     console.log('Socket disconnected');
//   }
// };
