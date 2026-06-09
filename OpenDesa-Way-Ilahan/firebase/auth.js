async function signIn(email, password) {
  return firebaseAuth.signInWithEmailAndPassword(email, password);
}

async function signOut() {
  return firebaseAuth.signOut();
}

function protectAdminRoute() {
  firebaseAuth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = '../login.html';
    }
  });
}

window.signIn = signIn;
window.signOut = signOut;
window.protectAdminRoute = protectAdminRoute;
