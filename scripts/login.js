// login.js (NO "import" — just use global Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyA37bruIT_neT5w-8CUuPGofy0Lnv2UJOg",
  authDomain: "project-1-747ec.firebaseapp.com",
  projectId: "project-1-747ec",
  storageBucket: "project-1-747ec.firebasestorage.app",
  messagingSenderId: "122686135785",
  appId: "1:122686135785:web:7e159363045f52208cbf78",
  measurementId: "G-1GT8XMMFM3"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const userDoc = await db.collection('users').doc(user.uid).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        localStorage.setItem('userType', userData.userType);
alert("User type is: " + userData.userType);
window.location.href = './dashboard.html';  // force redirect regardless
      } else {
        alert("User profile not found. Please complete registration.");
      }
    } catch (error) {
      alert("Login failed: " + error.message);
    }
    console.log('Login form submitted');
  });
}
