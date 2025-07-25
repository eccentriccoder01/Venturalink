import { auth, db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

export function getCurrentUser() {
    return auth.currentUser;
}

export async function getUserType(user = auth.currentUser) {
    if (!user) return null;

    try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            return userDoc.data().userType || null;
        }
        return null;
    } catch (error) {
        console.error('Error getting user type:', error);
        return null;
    }
}