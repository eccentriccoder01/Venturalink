import { auth } from "./firebase.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Select the form and button
const form = document.getElementById("forgot-password-form");
const submitBtn = form.querySelector(".auth-submit-btn");
const btnText = submitBtn.querySelector(".btn-text");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  if (!email) {
    showNotification("Please enter your email.", "error");
    return;
  }

  submitBtn.disabled = true;
  btnText.textContent = "Sending...";

  try {
    await sendPasswordResetEmail(auth, email);
    showNotification("Reset link sent! Check your email.", "success");
    setTimeout(() => (window.location.href = "login.html"), 2000);
  } catch (error) {
    showNotification(error.message, "error");
    console.error(error);
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = "Send Reset Link";
  }
});

// Notification system (same style as login.js)
function showNotification(message, type = "info") {
  const existing = document.querySelector(".notification");
  if (existing) existing.remove();

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
  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentElement) notification.remove();
  }, 5000);
}
