const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const isFirebaseConfigValid = () => {
  return !firebaseConfig.apiKey.startsWith('YOUR_') && !firebaseConfig.authDomain.startsWith('YOUR_');
};

if (!isFirebaseConfigValid()) {
  console.warn('Firebase config belum terpasang. Ganti placeholder di firebase/firebase-config.js dengan konfigurasi Firebase yang valid.');
}

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAuth = firebaseApp.auth();
const firebaseDb = firebaseApp.firestore();

window.firebaseApp = firebaseApp;
window.firebaseAuth = firebaseAuth;
window.firebaseDb = firebaseDb;
window.isFirebaseConfigValid = isFirebaseConfigValid;
