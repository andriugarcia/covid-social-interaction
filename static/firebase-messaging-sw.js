
importScripts(
  'https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/8.6.8/firebase-messaging.js'
)
firebase.initializeApp({"apiKey":"AIzaSyBxGHKm38LWJkSQa5l2b17JfyEh-Uu6ztA","authDomain":"olimaps-firebase.firebaseapp.com","projectId":"olimaps-firebase","storageBucket":"olimaps-firebase.appspot.com","messagingSenderId":"581147596652","appId":"1:581147596652:web:721cf9ef21c90aa5d2c549","measurementId":"G-N24W84QP8E"})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

self.addEventListener('push', function (e) {
  data = e.data.json();
  var options = {
    body: data.notification.body,
    icon: data.notification.icon,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
  }
})
