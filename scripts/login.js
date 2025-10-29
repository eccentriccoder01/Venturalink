import { auth, db } from './firebase.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  linkWithCredential
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Add Google Button Styles directly to the page
function addGoogleButtonStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Google Button Styling */
    #btn-google-sign {
      background-color: #4285f4 !important;
      color: white !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 12px 24px !important;
      font-weight: 500 !important;
      font-size: 14px !important;
      cursor: pointer !important;
      transition: all 0.3s ease !important;
      box-shadow: 0 2px 4px 0 rgba(0,0,0,0.25) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 12px !important;
      width: 100% !important;
      margin-top: 16px !important;
    }

    #btn-google-sign:hover {
      background-color: #357ae8 !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
    }

    #btn-google-sign:active {
      background-color: #3367d6 !important;
      transform: translateY(0) !important;
    }

    #btn-google-sign:disabled {
      opacity: 0.7 !important;
      cursor: not-allowed !important;
      transform: none !important;
    }

    #btn-google-sign .btn-text {
      color: white !important;
      font-weight: 500 !important;
    }

    /* Google icon styling */
    #btn-google-sign svg {
      width: 18px !important;
      height: 18px !important;
      flex-shrink: 0 !important;
    }
  `;
  document.head.appendChild(style);
}

// Password visibility toggle
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('password-toggle');
if (passwordInput && passwordToggle) {
  passwordToggle.addEventListener('click', () => {
    const isVisible = passwordToggle.getAttribute('data-visible') === 'true';
    if (isVisible) {
      passwordInput.type = 'password';
      passwordToggle.setAttribute('data-visible', 'false');
      passwordToggle.setAttribute('aria-label', 'Show password');
    } else {
      passwordInput.type = 'text';
      passwordToggle.setAttribute('data-visible', 'true');
      passwordToggle.setAttribute('aria-label', 'Hide password');
    }
  });
}

const provider = new GoogleAuthProvider();
const loginForm = document.getElementById("login-form");

// === Google Button Styling Fix ===
function styleGoogleButton() {
  const googleBtn = document.getElementById("btn-google-sign");
  if (googleBtn) {
    // Ensure proper styling
    googleBtn.style.backgroundColor = "#4285f4";
    googleBtn.style.color = "white";
    googleBtn.style.border = "none";
    googleBtn.style.borderRadius = "8px";
    googleBtn.style.padding = "12px 24px";
    googleBtn.style.fontWeight = "500";
    googleBtn.style.boxShadow = "0 2px 4px 0 rgba(0,0,0,0.25)";
    googleBtn.style.display = "flex";
    googleBtn.style.alignItems = "center";
    googleBtn.style.justifyContent = "center";
    googleBtn.style.gap = "12px";
    googleBtn.style.width = "100%";
    googleBtn.style.marginTop = "16px";
    
    // Style the text inside
    const btnText = googleBtn.querySelector('.btn-text');
    if (btnText) {
      btnText.style.color = "white";
      btnText.style.fontWeight = "500";
    }
    
    // Add hover effects
    googleBtn.addEventListener('mouseenter', function() {
      this.style.backgroundColor = "#357ae8";
      this.style.transform = "translateY(-1px)";
      this.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    });
    
    googleBtn.addEventListener('mouseleave', function() {
      this.style.backgroundColor = "#4285f4";
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 2px 4px 0 rgba(0,0,0,0.25)";
    });
    
    // Add active/pressed effect
    googleBtn.addEventListener('mousedown', function() {
      this.style.backgroundColor = "#3367d6";
      this.style.transform = "translateY(0)";
    });
    
    googleBtn.addEventListener('mouseup', function() {
      this.style.backgroundColor = "#4285f4";
      this.style.transform = "translateY(-1px)";
    });
  }
}

// Initialize button styling when page loads
document.addEventListener('DOMContentLoaded', function() {
  addGoogleButtonStyles();
  styleGoogleButton();
});

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
      // ✅ Check if this email uses Google only
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.includes("google.com") && !methods.includes("password")) {
        showNotification("This email is registered with Google. Please use the 'Sign in with Google' button.", "info");
        resetButton();
        return;
      }

      // If no account exists
      if (methods.length === 0) {
        showNotification("No account found with this email. Please sign up first.", "error");
        resetButton();
        return;
      }

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
        // Create user document if it doesn't exist
        await setDoc(userRef, {
          email: user.email,
          userType: "user",
          createdAt: new Date()
        });
        localStorage.setItem("userType", "user");
        
        btnText.textContent = "Success!";
        submitBtn.style.background = "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)";

        setTimeout(() => {
          window.location.href = "./profile.html";
        }, 1000);
      }
    } catch (error) {
      resetButton();
      
      // User-friendly error messages
      let errorMessage = "Login failed. ";
      
      switch (error.code) {
        case 'auth/invalid-login-credentials':
          errorMessage += "The email or password you entered is incorrect.";
          break;
        case 'auth/user-not-found':
          errorMessage += "No account found with this email. Please sign up first.";
          break;
        case 'auth/wrong-password':
          errorMessage += "The password you entered is incorrect.";
          break;
        case 'auth/invalid-email':
          errorMessage += "Please enter a valid email address.";
          break;
        case 'auth/user-disabled':
          errorMessage += "This account has been temporarily disabled.";
          break;
        case 'auth/too-many-requests':
          errorMessage += "Too many login attempts. Please try again in a few minutes.";
          break;
        case 'auth/network-request-failed':
          errorMessage += "Network error. Please check your internet connection.";
          break;
        default:
          errorMessage += "Please try again or use a different login method.";
      }
      
      showNotification(errorMessage, "error");
    }

    function resetButton() {
      btnText.textContent = originalText;
      submitBtn.style.opacity = "1";
      submitBtn.disabled = false;
      submitBtn.style.background = "";
    }
  });
}

// === Google Sign-In ===
const googleBtn = document.getElementById("btn-google-sign");
if (googleBtn) {
  // Apply initial styling
  styleGoogleButton();
  
  googleBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const btnText = googleBtn.querySelector(".btn-text");
    const originalText = btnText.textContent;
    btnText.textContent = "Connecting...";
    googleBtn.style.opacity = "0.7";
    googleBtn.disabled = true;

    try {
      const emailInput = document.getElementById("login-email");
      let emailToCheck = emailInput ? emailInput.value.trim() : null;

      if (emailToCheck) {
        const methods = await fetchSignInMethodsForEmail(auth, emailToCheck);
        if (methods.includes("password") && !methods.includes("google.com")) {
          showNotification("This email is already registered with a password. Please use email and password to login.", "info");
          resetGoogleButton();
          return;
        }
      }

      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      // Create/update user document in Firestore
      const userRef = doc(db, "users", googleUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: googleUser.email,
          userType: "user",
          createdAt: new Date(),
          name: googleUser.displayName || "User"
        });
        localStorage.setItem("userType", "user");
      } else {
        const userData = userDoc.data();
        localStorage.setItem("userType", userData.userType);
      }

      showNotification("Successfully signed in with Google!", "success");
      
      setTimeout(() => {
        window.location.href = "./profile.html";
      }, 1000);

    } catch (error) {
      resetGoogleButton();
      
      if (error.code !== 'auth/popup-closed-by-user') {
        let errorMessage = "Google sign-in failed. ";
        
        switch (error.code) {
          case 'auth/account-exists-with-different-credential':
            errorMessage += "This email is already registered with a different method. Please use email and password login.";
            break;
          case 'auth/popup-blocked':
            errorMessage += "Popup was blocked. Please allow popups for this site.";
            break;
          case 'auth/unauthorized-domain':
            errorMessage += "This domain is not authorized for Google sign-in.";
            break;
          case 'auth/network-request-failed':
            errorMessage += "Network error. Please check your internet connection.";
            break;
          default:
            errorMessage += "Please try again or use email login.";
        }
        
        showNotification(errorMessage, "error");
      }
    }

    function resetGoogleButton() {
      btnText.textContent = originalText;
      googleBtn.style.opacity = "1";
      googleBtn.disabled = false;
      // Re-apply styling after reset
      styleGoogleButton();
    }
  });
}

// === Notification System ===
function showNotification(message, type = "info") {
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) existingNotification.remove();

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
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