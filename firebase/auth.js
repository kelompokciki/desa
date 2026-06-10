const ADMIN_EMAILS = ['admin@wayilahan.id'];

async function signUp(email, password) {
  return firebaseAuth.createUserWithEmailAndPassword(email, password);
}

async function signIn(email, password) {
  return firebaseAuth.signInWithEmailAndPassword(email, password);
}

async function signOut() {
  return firebaseAuth.signOut();
}

function isAdminUser(user) {
  return user && ADMIN_EMAILS.includes(user.email);
}

function protectSiteRoute() {
  firebaseAuth.onAuthStateChanged((user) => {
    if (!user) {
      const currentPath = window.location.pathname;
      if (!currentPath.endsWith('/login.html') && !currentPath.endsWith('/register.html')) {
        window.location.href = 'login.html';
      }
    }
  });
}

function protectAdminRoute() {
  firebaseAuth.onAuthStateChanged((user) => {
    if (!user || !isAdminUser(user)) {
      window.location.href = '../login.html';
    }
  });
}

function redirectIfAuthenticated() {
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      if (isAdminUser(user)) {
        window.location.href = 'admin/dashboard.html';
      } else {
        window.location.href = 'index.html';
      }
    }
  });
}

function setupAuthNavbar() {
  const logoutBtn = document.getElementById('logoutBtnPage');
  if (!logoutBtn) {
    return;
  }

  logoutBtn.addEventListener('click', async () => {
    await signOut();
    window.location.href = 'login.html';
  });

  firebaseAuth.onAuthStateChanged((user) => {
    logoutBtn.classList.toggle('d-none', !user);
  });
}

function setupMockResetButton() {
  // Create a small floating button shown only when mock auth is active
  try {
    if (!window.__FIREBASE_MOCK) return;
    if (document.getElementById('resetMockBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'resetMockBtn';
    btn.textContent = 'Reset Mock';
    btn.title = 'Reset data mock (localStorage)';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      zIndex: 9999,
      background: '#fff',
      color: '#0b6623',
      border: '1px solid rgba(11,102,35,0.12)',
      padding: '8px 10px',
      borderRadius: '6px',
      boxShadow: '0 6px 18px rgba(15,89,35,0.08)',
      cursor: 'pointer'
    });

    btn.addEventListener('click', () => {
      if (!confirm('Hapus semua data mock dan logout?')) return;
      localStorage.removeItem('mock_users');
      sessionStorage.removeItem('mock_current_user');
      // also remove any mock-related keys
      Object.keys(localStorage).forEach((k) => { if (k.startsWith('mock_')) localStorage.removeItem(k); });
      Object.keys(sessionStorage).forEach((k) => { if (k.startsWith('mock_')) sessionStorage.removeItem(k); });
      location.reload();
    });

    document.body.appendChild(btn);
  } catch (e) {
    console.warn('setupMockResetButton error', e);
  }
}

window.signUp = signUp;
window.signIn = signIn;
window.signOut = signOut;
window.protectSiteRoute = protectSiteRoute;
window.protectAdminRoute = protectAdminRoute;
window.redirectIfAuthenticated = redirectIfAuthenticated;
window.isAdminUser = isAdminUser;
window.setupAuthNavbar = setupAuthNavbar;
