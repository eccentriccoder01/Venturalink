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

    // Add loading state to button
    const submitBtn = loginForm.querySelector('.auth-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    
    btnText.textContent = 'Signing In...';
    submitBtn.style.opacity = '0.7';
    submitBtn.disabled = true;

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const userDoc = await db.collection('users').doc(user.uid).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        localStorage.setItem('userType', userData.userType);
        
        // Success animation
        btnText.textContent = 'Success!';
        submitBtn.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
        
        setTimeout(() => {
          window.location.href = './dashboard.html';
        }, 1000);
      } else {
        throw new Error("User profile not found. Please complete registration.");
      }
    } catch (error) {
      // Reset button state
      btnText.textContent = originalText;
      submitBtn.style.opacity = '1';
      submitBtn.disabled = false;
      submitBtn.style.background = '';
      
      // Show error with better UX
      showNotification("Login failed: " + error.message, 'error');
    }
    console.log('Login form submitted');
  });
}

// Enhanced notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
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

  // Add notification styles
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      background: rgba(26, 26, 36, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 16px;
      min-width: 300px;
      max-width: 400px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      animation: slideInRight 0.3s ease-out;
    }
    
    .notification-error {
      border-left: 4px solid #ef4444;
    }
    
    .notification-success {
      border-left: 4px solid #43e97b;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    
    .notification-message {
      color: #ffffff;
      font-size: 14px;
      line-height: 1.4;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: #a0a0a8;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    
    .notification-close:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }
    
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @media (max-width: 480px) {
      .notification {
        top: 10px;
        right: 10px;
        left: 10px;
        min-width: auto;
      }
    }
  `;
  
  if (!document.querySelector('#notification-styles')) {
    style.id = 'notification-styles';
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}