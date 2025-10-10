import { auth, db } from './firebase.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  linkWithCredential
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const provider = new GoogleAuthProvider();
const loginForm = document.getElementById("login-form");

// === Email/Password Login ===
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;

    const submitBtn = loginForm.querySelector(".auth-submit-btn");
    const btnText = submitBtn.querySelector(".btn-text");
    const originalText = btnText.textContent;

    btnText.textContent = "Signing In...";
    submitBtn.style.opacity = "0.7";
    submitBtn.disabled = true;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem("userType", userData.userType);

        btnText.textContent = "Success!";
        submitBtn.style.background = "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)";

        setTimeout(() => {
          window.location.href = "./profile.html";
        }, 1000);
      } else {
        throw new Error("User profile not found. Please complete registration.");
      }
    } catch (error) {
      btnText.textContent = originalText;
      submitBtn.style.opacity = "1";
      submitBtn.disabled = false;
      submitBtn.style.background = "";

      showNotification("Login failed: " + error.message, "error");
    }
  });
}

// === Google Sign-In (with Account Linking) ===
const googleBtn = document.getElementById("btn-google-sign");
if (googleBtn) {
  googleBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      // Check if email already exists with password sign-in
      const methods = await fetchSignInMethodsForEmail(auth, googleUser.email);

      if (methods.includes("password")) {
        // Link both accounts
        const password = prompt(
          "This email is already registered with a password. Enter it to link your Google account:"
        );

        if (password) {
          const cred = EmailAuthProvider.credential(googleUser.email, password);
          await linkWithCredential(googleUser, cred);
          showNotification("✅ Google and Email accounts linked successfully!", "success");
        } else {
          showNotification("Linking cancelled.", "info");
        }
      }

      console.log("Signed in with Google:", googleUser);
      window.location.href = "./profile.html";
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        showNotification("Google Sign-in failed: " + error.message, "error");
        console.error("Google Sign-in Error:", error);
      }
    }
  });
}

// === Notification System ===
function showNotification(message, type = "info") {
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) existingNotification.remove();

  const notification = document.createElement("div");
  notification.className = notification notification-${type};
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 6l-12 12M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;

  const style = document.createElement("style");
  style.id = "notification-styles";
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      background: rgba(26,26,36,0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 16px;
      min-width: 300px;
      max-width: 400px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      animation: slideInRight 0.3s ease-out;
    }
    .notification-error { border-left: 4px solid #ef4444; }
    .notification-success { border-left: 4px solid #43e97b; }
    .notification-info { border-left: 4px solid #3b82f6; }
    .notification-content {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
    }
    .notification-message {
      color:#fff;
      font-size:14px;
      line-height:1.4;
    }
    .notification-close {
      background:none;
      border:none;
      color:#a0a0a8;
      cursor:pointer;
      padding:4px;
      border-radius:4px;
      flex-shrink:0;
    }
    .notification-close:hover {
      background: rgba(255,255,255,0.1);
      color:#fff;
    }
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @media(max-width:480px){
      .notification{top:10px; right:10px; left:10px; min-width:auto;}
    }
  `;
  if (!document.querySelector("#notification-styles")) document.head.appendChild(style);

  document.body.appendChild(notification);
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideInRight 0.3s ease-out reverse";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}