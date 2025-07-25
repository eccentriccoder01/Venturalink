// Import Firebase services
import { auth, db } from './firebase.js';

// Get registration form
const registerForm = document.getElementById('register-form');

// Handle form submission
if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get form values
        const name = registerForm.name.value.trim();
        const email = registerForm.email.value.trim();
        const password = registerForm.password.value;
        const userType = registerForm.userType.value;

        try {
            // Create user account using compat version
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Save user data using compat version
            await firebase.firestore().collection('users').doc(user.uid).set({
                name,
                email,
                userType,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Save user type
            localStorage.setItem('userType', userType);

            // Redirect based on user type
            if (userType === 'business') {
                window.location.href = './create-proposal.html';
            } else {
                window.location.href = './proposals.html';
            }

        } catch (error) {
            // Show error message
            alert(error.message);
        }
    });
} 