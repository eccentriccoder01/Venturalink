import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const registerForm = document.getElementById('register-form');
let checklist = {};

if (registerForm) {
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = registerForm.name.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value;
    const userType = registerForm.userType.value;

    const submitBtn = registerForm.querySelector('.auth-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;

    btnText.textContent = 'Creating Account...';
    submitBtn.style.opacity = '0.7';
    submitBtn.disabled = true;

    if (!updateChecklist(password)) {
      showNotification("Please meet all password requirements.", 'error');
      btnText.textContent = originalText;
      submitBtn.style.opacity = '1';
      submitBtn.disabled = false;
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        userType,
        createdAt: serverTimestamp()
      });

      localStorage.setItem('userType', userType);

      btnText.textContent = 'Account Created!';
      submitBtn.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';

      setTimeout(() => {
        window.location.href = userType === 'business' ? './create-proposal.html' : './proposals.html';
      }, 1000);

    } catch (error) {
      btnText.textContent = originalText;
      submitBtn.style.opacity = '1';
      submitBtn.disabled = false;
      submitBtn.style.background = '';
      showNotification("Registration failed: " + error.message, 'error');
    }
  });
}

// ✅ Password & email validation
document.addEventListener('DOMContentLoaded', () => {
  const passwordField = registerForm?.querySelector('input[name="password"]');
  const emailField = registerForm?.querySelector('input[name="email"]');
  const passwordToggleBtn = document.getElementById('reg-password-toggle');

  checklist = {
    minLength: document.getElementById('rule-minLength'),
    uppercase: document.getElementById('rule-uppercase'),
    lowercase: document.getElementById('rule-lowercase'),
    number: document.getElementById('rule-number'),
    specialChar: document.getElementById('rule-specialChar'),
  };

  if (passwordField) {
    passwordField.addEventListener('input', () => {
      const password = passwordField.value;
      updatePasswordStrength(getPasswordStrength(password));
      updateChecklist(password);
    });
  }

  if (emailField) {
    emailField.addEventListener('blur', () => {
      emailField.style.borderColor = isValidEmail(emailField.value) ? '' : '#ef4444';
    });
  }

  // Password visibility toggle functionality
  if (passwordToggleBtn && passwordField) {
    passwordToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isVisible = passwordToggleBtn.getAttribute('data-visible') === 'true';
      
      if (isVisible) {
        // Hide password
        passwordField.type = 'password';
        passwordToggleBtn.setAttribute('data-visible', 'false');
      } else {
        // Show password
        passwordField.type = 'text';
        passwordToggleBtn.setAttribute('data-visible', 'true');
      }
    });
  }


// --- START: Progress Bar Logic ---
if (document.getElementById('progress-bar-fill')) {

    // --- Element Selections for Progress Bar (CORRECTED) ---
    // This now uses the form's name attributes, which is more reliable.
    const formInputs = {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        role: registerForm.userType, // Matches your existing code
        terms: registerForm.terms,     // Assumes the checkbox has name="terms"
    };

    const progressBarFill = document.getElementById('progress-bar-fill');
    const stepCircles = [
        document.getElementById('step-circle-1'),
        document.getElementById('step-circle-2'),
        document.getElementById('step-circle-3'),
        document.getElementById('step-circle-4'),
        document.getElementById('step-circle-5'),
    ];
    const stepAnnotations = [
        document.getElementById('step-annotation-1'),
        document.getElementById('step-annotation-2'),
        document.getElementById('step-annotation-3'),
        document.getElementById('step-annotation-4'),
        document.getElementById('step-annotation-5'),
    ];

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const totalSteps = stepCircles.length;

    // --- Validation Logic for Progress Bar UI ---
    const validators = {
        name: (el) => el && el.value.trim().length > 2,
        email: (el) => el && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value),
        // Use the same password validation as your checklist for consistency
        password: (el) => el && el.value.length >= 8 && /[A-Z]/.test(el.value) && /[a-z]/.test(el.value) && /[0-9]/.test(el.value) && /[^A-Za-z0-9]/.test(el.value),
        role: (el) => el && el.value !== '',
        terms: (el) => el && el.checked,
    };

    // --- Update Progress Bar Function (IMPROVED LOGIC) ---
    const updateProgress = () => {
        let activeStep = 1; // Start at step 1 (Name)
        
        if (validators.name(formInputs.name)) {
            activeStep = 2; // Move to Email
            if (validators.email(formInputs.email)) {
                activeStep = 3; // Move to Password
                if (validators.password(formInputs.password)) {
                    activeStep = 4; // Move to Role
                    if (validators.role(formInputs.role)) {
                        activeStep = 5; // Move to Agree
                        if (validators.terms(formInputs.terms)) {
                            activeStep = 6; // All steps complete
                        }
                    }
                }
            }
        }

        stepCircles.forEach((circle, index) => {
            if (index < activeStep) circle.classList.add('active');
            else circle.classList.remove('active');
        });

        stepAnnotations.forEach((annotation, index) => {
            // Annotations become active as you complete the previous step
            if (index < activeStep) annotation.classList.add('active');
            else annotation.classList.remove('active');
        });

        const progressPercentage = (activeStep - 1) / (totalSteps - 1) * 100;
        progressBarFill.style.width = `${Math.min(100, progressPercentage)}%`;
    };

    // --- Event Listeners for Progress Bar ---
    Object.values(formInputs).forEach(input => {
        if (input) {
            // Use 'keyup' for instant feedback on text fields
            input.addEventListener('keyup', updateProgress);
            input.addEventListener('input', updateProgress);
            // Use 'change' for the dropdown and checkbox
            input.addEventListener('change', updateProgress);
        }
    });

    // --- Initial Call ---
    updateProgress();
}
// --- END: Progress Bar Logic ---

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

function updateChecklist(password) {
    const rules = {
        minLength: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        specialChar: /[^A-Za-z0-9]/.test(password),
    };

    for (const rule in rules) {
        if (checklist[rule]) { // Check if element exists
            if (rules[rule]) {
                checklist[rule].classList.add('valid');
                checklist[rule].innerHTML = `<i data-lucide="check" class="w-4 h-4 mr-2"></i> ${checklist[rule].dataset.message}`;
            } else {
                checklist[rule].classList.remove('valid');
                checklist[rule].innerHTML = `<i data-lucide="x" class="w-4 h-4 mr-2"></i> ${checklist[rule].dataset.message}`;
            }
        }
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    return Object.values(rules).every(Boolean);
}

function updatePasswordStrength(strength) {
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];
  const passwordField = document.querySelector('input[name="password"]');
  if (passwordField && strength > 0) passwordField.style.borderColor = strengthColors[strength - 1];
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

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

  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      .notification { position: fixed; top: 20px; right: 20px; z-index: 1000; background: rgba(26,26,36,0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding:16px; min-width:300px; max-width:400px; box-shadow:0 8px 25px rgba(0,0,0,0.15); animation:slideInRight 0.3s ease-out; }
      .notification-error { border-left:4px solid #ef4444; }
      .notification-success { border-left:4px solid #43e97b; }
      .notification-content { display:flex; align-items:center; justify-content:space-between; gap:12px; }
      .notification-message { color:#fff; font-size:14px; line-height:1.4; }
      .notification-close { background:none; border:none; color:#a0a0a8; cursor:pointer; padding:4px; border-radius:4px; flex-shrink:0; }
      .notification-close:hover { background: rgba(255,255,255,0.1); color:#fff; }
      @keyframes slideInRight { from { transform:translateX(100%); opacity:0;} to { transform:translateX(0); opacity:1;} }
      @media(max-width:480px){ .notification{top:10px; right:10px; left:10px; min-width:auto;} }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideInRight 0.3s ease-out reverse";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}
