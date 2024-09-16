// importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js');


const firebaseConfig = {
  apiKey: 'AIzaSyDgjcWL3AELpBajvMhPYMkKdhC2r0WDx60',
  authDomain: 'table-now-543c9.firebaseapp.com',
  projectId: 'table-now-543c9',
  messagingSenderId: '136138103938',
  appId: '1:136138103938:web:a54a46d92397120df6a89b',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
