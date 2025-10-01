import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
// TODO: Consider updating Firebase SDK version periodically
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
// TODO: Consider updating Firebase SDK version periodically
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js"; 
// TODO: Consider updating Firebase SDK version periodically

const firebaseConfig = {
  apiKey: "AIzaSyA37bruIT_neT5w-8CUuPGofy0Lnv2UJOg",
  authDomain: "project-1-747ec.firebaseapp.com",
  projectId: "project-1-747ec",
  storageBucket: "project-1-747ec.firebasestorage.app",
  messagingSenderId: "122686135785",
  appId: "1:122686135785:web:7e159363045f52208cbf78",
  measurementId: "G-1GT8XMMFM3"
};  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and db
const auth = getAuth(app);
const db = getFirestore(app);  

export { auth, db };
