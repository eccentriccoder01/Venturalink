// 1. Import the configuration object from our new untracked file
import { firebaseConfig } from './firebase-config.js';

// 2. Import the necessary functions from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// 3. Initialize Firebase with the imported config
const app = initializeApp(firebaseConfig);

// 4. Export auth and db for rest of the app to use
export const auth = getAuth(app);
export const db = getFirestore(app);