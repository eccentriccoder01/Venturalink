import { db, auth } from './firebase.js';
import { getCurrentUser, getUserType } from './auth.js';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// ===========================
// Notification System
// ===========================
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

    if (!document.querySelector("#notification-styles")) {
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
            .notification-success { border-left: 4px solid #43e97b; }
            .notification-error { border-left: 4px solid #ef4444; }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }
            .notification-message { color: #fff; font-size: 14px; line-height: 1.4; }
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
            .notification-close:hover { background: rgba(255,255,255,0.1); color: #fff; }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @media (max-width: 480px) {
                .notification { top: 10px; right: 10px; left: 10px; min-width: auto; }
            }
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

// ===========================
// DOM Elements
// ===========================
const userNameElement = document.getElementById('user-name');
const userRoleElement = document.getElementById('user-role');
const profileForm = document.getElementById('profile-form');
const avatarImg = document.getElementById('avatar-img');
const completionFill = document.getElementById('completion-fill');
const completionText = document.getElementById('completion-text');
const proposalsCountElement = document.getElementById('proposals-count');
const investmentsCountElement = document.getElementById('investments-count');
const activityFeedElement = document.getElementById('activity-feed');
const proposalsInvestmentsTitle = document.getElementById('proposals-investments-title');
const proposalsInvestmentsList = document.getElementById('proposals-investments-list');

const logoutModal = document.getElementById('logout-modal');
const confirmLogoutBtn = document.getElementById('confirm-logout');
const cancelLogoutBtn = document.getElementById('cancel-logout');

let currentUser = null;

// ===========================
// Initialize Profile Page
// ===========================
auth.onAuthStateChanged(async (user) => {
    if (!user) return window.location.href = '/login.html';
    currentUser = user;
    await initializeProfilePage(user);
});

async function initializeProfilePage(user) {
    try {
        await loadUserProfile(user);
        await loadRoleSpecificContent(user);
        setupEventListeners();
        window.lucide.createIcons();
    } catch (error) {
        console.error('Error initializing profile page:', error);
    }
}

function getDisplayNameFromEmail(email) {
    if (!email) return "User";
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
}

// ===========================
// Load Profile Data
// ===========================
async function loadUserProfile(user) {
    try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) return;

        const userData = userDoc.data();
        const displayName = userData.name || user.displayName || getDisplayNameFromEmail(user.email);

        userNameElement.textContent = displayName;
        userRoleElement.textContent = userData.userType || 'User';
        if (avatarImg && (userData.avatar || user.photoURL)) avatarImg.src = userData.avatar || user.photoURL;

        if (profileForm) {
            profileForm.displayName.value = userData.name || '';
            profileForm.bio.value = userData.bio || '';
            profileForm.phone.value = userData.phone || '';
        }

        updateProfileCompletion(userData);
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

function updateProfileCompletion(userData) {
    let completedFields = 0;
    const totalFields = 3;
    if (userData.name) completedFields++;
    if (userData.bio) completedFields++;
    if (userData.phone) completedFields++;
    const percentage = Math.round((completedFields / totalFields) * 100);

    if (completionFill) completionFill.style.width = `${percentage}%`;
    if (completionText) completionText.textContent = `Profile ${percentage}% Complete`;
}

// ===========================
// Role-Specific Content
// ===========================
async function loadRoleSpecificContent(user) {
    const userType = await getUserType(user);
    if (userType === 'business') {
        proposalsInvestmentsTitle.textContent = 'My Proposals';
        await loadMyProposals(user.uid);
        investmentsCountElement.textContent = 'N/A';
    } else if (userType === 'investor') {
        proposalsInvestmentsTitle.textContent = 'My Investments';
        proposalsInvestmentsList.innerHTML = '<p>Investment tracking features are coming soon!</p>';
        proposalsCountElement.textContent = 'N/A';
        investmentsCountElement.textContent = '0';
    }
}

async function loadMyProposals(userId) {
    try {
        const myProposalsQuery = query(collection(db, 'proposals'), where('userId', '==', userId));
        const snapshot = await getDocs(myProposalsQuery);
        proposalsCountElement.textContent = snapshot.size;
        proposalsInvestmentsList.innerHTML = '';

        if (snapshot.empty) {
            proposalsInvestmentsList.innerHTML = '<p>No proposals yet. <a href="/create-proposal.html">Create one!</a></p>';
            return;
        }

        snapshot.forEach(doc => {
            const proposal = doc.data();
            const el = document.createElement('div');
            el.className = 'proposal-item';
            el.innerHTML = `
                <div><h4>${proposal.title}</h4><p>Amount: <strong>$${proposal.amount.toLocaleString()}</strong></p></div>
                <span class="status ${proposal.status || 'pending'}">${proposal.status || 'pending'}</span>`;
            proposalsInvestmentsList.appendChild(el);
        });
    } catch (error) {
        console.error('Error loading proposals:', error);
    }
}

// ===========================
// Event Listeners
// ===========================
function setupEventListeners() {
    if (profileForm) profileForm.addEventListener('submit', handleProfileUpdate);

    if (confirmLogoutBtn) confirmLogoutBtn.addEventListener('click', confirmLogout);
    if (cancelLogoutBtn) cancelLogoutBtn.addEventListener('click', () => logoutModal.classList.add('hidden'));
}

// ===========================
// Profile Update
// ===========================
async function handleProfileUpdate(event) {
    event.preventDefault();
    if (!currentUser) return;

    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.querySelector('span').textContent;

    try {
        submitButton.disabled = true;
        submitButton.querySelector('span').textContent = 'Saving...';

        const formData = {
            name: profileForm.displayName.value,
            bio: profileForm.bio.value,
            phone: profileForm.phone.value,
            updatedAt: new Date()
        };

        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, formData);

        userNameElement.textContent = formData.name;
        updateProfileCompletion(formData);
        showNotification('Profile updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Failed to update profile. Please try again.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.querySelector('span').textContent = originalText;
    }
}

// ===========================
// Logout Modal
// ===========================
window.handleLogout = function () {
    if (logoutModal) logoutModal.classList.remove('hidden');
};

async function confirmLogout() {
    if (!currentUser) return;
    logoutModal.classList.add('hidden');

    try {
        await auth.signOut();
        localStorage.clear();
        document.body.style.transition = 'opacity 0.3s';
        document.body.style.opacity = '0';
        setTimeout(() => window.location.href = 'login.html', 300);
    } catch (error) {
        console.error('Logout failed:', error);
        showNotification('Logout failed. Please try again.', 'error');
    }
}
