// firebase-auth-gate.js
// Reusable Firebase Auth Gate for 'admitted' users

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

export { getAuth, onAuthStateChanged, signOut };

// You may want to set this in each HTML file if you have multiple projects
export function getFirebaseConfig() {
  return {
    apiKey: "AIzaSyAwzp3h8tt_tcDF1um--LoroAu1rErMmBc",
    authDomain: "virac-tsv.firebaseapp.com",
    projectId: "virac-tsv",
    storageBucket: "virac-tsv.appspot.com",
    messagingSenderId: "455316064834",
    appId: "1:455316064834:web:1dc1033265b58a6c82bbdb"
  };
}

export function authGate({
  onAdmitted = () => {},
  onDenied = () => {},
  loginPage = "login.html"
} = {}) {
  const app = initializeApp(getFirebaseConfig());
  const db = getFirestore(app);
  const auth = getAuth(app);

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = loginPage;
      return;
    }
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists() || userSnap.data().status !== "admitted") {
        alert("Access denied. Only admitted users can view this page.");
        await signOut(auth);
        window.location.href = loginPage;
        if (typeof onDenied === "function") onDenied();
      } else {
        if (typeof onAdmitted === "function") onAdmitted(user, userSnap.data());
      }
    } catch (err) {
      alert("Authentication error. Please try again.");
      window.location.href = loginPage;
    }
  });
}
