import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHSYHYProIQaLDzBV2YjU5tceh0jxZOM4",
  authDomain: "venturalink-3ebe5.firebaseapp.com",
  projectId: "venturalink-3ebe5",
  storageBucket: "venturalink-3ebe5.firebasestorage.app",
  messagingSenderId: "919446126939",
  appId: "1:919446126939:web:e5efc3774d3f0e3cbd5a7e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and db
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
