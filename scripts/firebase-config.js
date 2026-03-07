// scripts/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Get Firebase configuration from window object (loaded by env.js)
// env.js fetches this from /api/config endpoint
const firebaseConfig = window.firebaseConfig || {
    apiKey: undefined,
    authDomain: undefined,
    projectId: undefined,
    storageBucket: undefined,
    messagingSenderId: undefined,
    appId: undefined,
    measurementId: undefined
};

// Check if configuration is available
if (!firebaseConfig.apiKey) {
    console.error('❌ Firebase configuration not available. Make sure env.js is loaded before this script.');
    console.warn('⚠️ Firebase initialization will fail without proper configuration.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db, app, firebaseConfig }; // Export everything