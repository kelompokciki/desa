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

window.signUp = signUp;
window.signIn = signIn;
window.signOut = signOut;
window.protectSiteRoute = protectSiteRoute;
window.protectAdminRoute = protectAdminRoute;
window.redirectIfAuthenticated = redirectIfAuthenticated;
window.isAdminUser = isAdminUser;
window.setupAuthNavbar = setupAuthNavbar;
