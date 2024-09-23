// // Import the Firebase scripts that are necessary for background messaging
// importScripts('https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/9.24.0/firebase-messaging.js');


// // Initialize the Firebase app in the service worker by passing in the firebaseConfig
// const firebaseConfig = {
//   apiKey: 'AIzaSyDgjcWL3AELpBajvMhPYMkKdhC2r0WDx60',
//   authDomain: 'table-now-543c9.firebaseapp.com',
//   projectId: 'table-now-543c9',
//   messagingSenderId: '136138103938',
//   appId: '1:136138103938:web:a54a46d92397120df6a89b',
// };

// firebase.initializeApp(firebaseConfig);

// // Retrieve an instance of Firebase Messaging so that it can handle background messages
// const messaging = firebase.messaging();

// // Handle background messages
// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);

//   // Customize the notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.icon || '/default-icon.png',
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
