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

const registerForm = document.getElementById('register-form');

// ✅ Declare checklist globally so updateChecklist can always access it
let checklist = {};

if (registerForm) {
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = registerForm.name.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value;
    const userType = registerForm.userType.value;

    // Add loading state to button
    const submitBtn = registerForm.querySelector('.auth-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;

    btnText.textContent = 'Creating Account...';
    submitBtn.style.opacity = '0.7';
    submitBtn.disabled = true;

    // ✅ Enforce password checklist before registration
    const allValid = updateChecklist(password);
    if (!allValid) {
      showNotification("Please meet all password requirements before continuing.", 'error');
      btnText.textContent = originalText;
      submitBtn.style.opacity = '1';
      submitBtn.disabled = false;
      return;
    }

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await firebase.firestore().collection('users').doc(user.uid).set({
        name,
        email,
        userType,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      localStorage.setItem('userType', userType);

      // Success animation
      btnText.textContent = 'Account Created!';
      submitBtn.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';

      setTimeout(() => {
        if (userType === 'business') {
          window.location.href = './create-proposal.html';
        } else {
          window.location.href = './proposals.html';
        }
      }, 1000);

    } catch (error) {
      // Reset button state
      btnText.textContent = originalText;
      submitBtn.style.opacity = '1';
      submitBtn.disabled = false;
      submitBtn.style.background = '';

      // Show error with better UX
      showNotification("Registration failed: " + error.message, 'error');
    }
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

// Add form validation enhancements
document.addEventListener('DOMContentLoaded', function () {
  const passwordField = registerForm?.querySelector('input[name="password"]');
  const emailField = registerForm?.querySelector('input[name="email"]');

  // ✅ Initialize checklist when DOM is ready
  checklist = {
    minLength: document.getElementById('rule-minLength'),
    uppercase: document.getElementById('rule-uppercase'),
    lowercase: document.getElementById('rule-lowercase'),
    number: document.getElementById('rule-number'),
    specialChar: document.getElementById('rule-specialChar'),
  };

  // Password strength indicator
  if (passwordField) {
    passwordField.addEventListener('input', function () {
      const password = this.value;
      const strength = getPasswordStrength(password);
      updatePasswordStrength(strength);
      updateChecklist(password); // ✅ live update
    });
  }

  // Email validation
  if (emailField) {
    emailField.addEventListener('blur', function () {
      const email = this.value;
      if (email && !isValidEmail(email)) {
        this.style.borderColor = '#ef4444';
      } else {
        this.style.borderColor = '';
      }
    });
  }
});

function getPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
}

// ✅ Update checklist dynamically
function updateChecklist(password) {
  const rules = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[^A-Za-z0-9]/.test(password),
  };

  for (const rule in rules) {
    if (rules[rule]) {
      checklist[rule].classList.add('valid');
      checklist[rule].innerText = "✔ " + checklist[rule].dataset.message;
    } else {
      checklist[rule].classList.remove('valid');
      checklist[rule].innerText = "✖ " + checklist[rule].dataset.message;
    }
  }

  return Object.values(rules).every(Boolean);
}

function updatePasswordStrength(strength) {
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];
  const passwordField = document.querySelector('input[name="password"]');
  if (passwordField && strength > 0) {
    passwordField.style.borderColor = strengthColors[strength - 1];
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
