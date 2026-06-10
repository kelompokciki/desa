const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const isFirebaseConfigValid = () => {
  return (
    typeof firebaseConfig.apiKey === 'string' &&
    firebaseConfig.apiKey.length > 10 &&
    !firebaseConfig.apiKey.startsWith('YOUR_') &&
    typeof firebaseConfig.authDomain === 'string' &&
    !firebaseConfig.authDomain.startsWith('YOUR_')
  );
};

if (!isFirebaseConfigValid()) {
  console.warn('Firebase config belum terpasang. Menjalankan mock auth untuk pengembangan lokal. Untuk produksi, isi firebase/firebase-config.js dengan konfigurasi Firebase Anda.');

  // Simple in-browser mock auth using sessionStorage/localStorage
  (function createMockFirebase() {
    const listeners = [];

    function emit(user) {
      listeners.forEach((cb) => {
        try { cb(user); } catch (e) { console.warn(e); }
      });
    }

    function loadUsers() {
      try { return JSON.parse(localStorage.getItem('mock_users') || '[]'); } catch (e) { return []; }
    }
    function saveUsers(u) { localStorage.setItem('mock_users', JSON.stringify(u)); }
    function getCurrent() { try { return JSON.parse(sessionStorage.getItem('mock_current_user') || 'null'); } catch(e){return null;} }
    function setCurrent(u) { if (u) sessionStorage.setItem('mock_current_user', JSON.stringify(u)); else sessionStorage.removeItem('mock_current_user'); emit(u); }
    // Ensure a default admin account exists in mock users for testing
    (function ensureDefaultAdmin() {
      const users = loadUsers();
      const adminEmail = 'admin@wayilahan.id';
      if (!users.find((u) => u.email === adminEmail)) {
        const adminUser = { email: adminEmail, password: 'admin123', uid: 'admin_1' };
        users.push(adminUser);
        saveUsers(users);
        console.info('Mock admin user created:', adminEmail, 'password: admin123');
      }
    })();

    const mock = {
      initializeApp: () => ({ mock: true }),
      auth: () => ({
        signInWithEmailAndPassword(email, password) {
          return new Promise((resolve, reject) => {
            const users = loadUsers();
            const user = users.find((u) => u.email === email && u.password === password);
            if (user) {
              const u = { email: user.email, uid: user.uid };
              setCurrent(u);
              resolve({ user: u });
            } else {
              reject({ code: 'auth/user-not-found', message: 'Email atau password salah (mock).' });
            }
          });
        },
        createUserWithEmailAndPassword(email, password) {
          return new Promise((resolve, reject) => {
            const users = loadUsers();
            if (users.find((u) => u.email === email)) {
              reject({ code: 'auth/email-already-in-use', message: 'Email sudah terdaftar (mock).' });
              return;
            }
            const uid = 'm_' + Date.now();
            const user = { email, password, uid };
            users.push(user);
            saveUsers(users);
            const u = { email: user.email, uid: user.uid };
            setCurrent(u);
            resolve({ user: u });
          });
        },
        signOut() {
          return new Promise((resolve) => { setCurrent(null); resolve(); });
        },
        onAuthStateChanged(cb) {
          listeners.push(cb);
          // call immediately with current
          try { cb(getCurrent()); } catch (e) { console.warn(e); }
        },
        get currentUser() { return getCurrent(); }
      }),
      firestore: () => ({
        // minimal stub for compatibility; real Firestore is not used by the sample app
        collection: () => ({ doc: () => ({ set: () => Promise.resolve(), get: () => Promise.resolve({ exists: false }), update: () => Promise.resolve() }) })
      })
    };

    const firebaseApp = mock.initializeApp();
    const firebaseAuth = mock.auth();
    const firebaseDb = mock.firestore();

    window.firebaseApp = firebaseApp;
    window.firebaseAuth = firebaseAuth;
    window.firebaseDb = firebaseDb;
    window.isFirebaseConfigValid = isFirebaseConfigValid;
    window.__FIREBASE_MOCK = true;
  })();

} else {
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const firebaseAuth = firebaseApp.auth();
  const firebaseDb = firebaseApp.firestore();

  window.firebaseApp = firebaseApp;
  window.firebaseAuth = firebaseAuth;
  window.firebaseDb = firebaseDb;
  window.isFirebaseConfigValid = isFirebaseConfigValid;
}
