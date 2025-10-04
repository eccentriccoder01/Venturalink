import { db, auth } from './firebase.js';
import { getUserType } from './auth.js';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// ===========================
// Notifications
// ===========================
export function showNotification(message, type = 'info') {
    const existing = document.querySelector(".notification");
    if (existing) existing.remove();

    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
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
const avatarImg = document.getElementById('avatar-img');
const completionFill = document.getElementById('completion-fill');
const completionText = document.getElementById('completion-text');
const proposalsCountElement = document.getElementById('proposals-count');
const investmentsCountElement = document.getElementById('investments-count');
const proposalsInvestmentsTitle = document.getElementById('proposals-investments-title');
const proposalsInvestmentsList = document.getElementById('proposals-investments-list');
const profileForm = document.getElementById('profile-form');
const logoutModal = document.getElementById('logout-modal');
const confirmLogoutBtn = document.getElementById('confirm-logout');
const cancelLogoutBtn = document.getElementById('cancel-logout');

let currentUser = null;

// ===========================
// Initialize
// ===========================
auth.onAuthStateChanged(async user => {
    if (!user) return window.location.href = '/login.html';
    currentUser = user;
    await loadUserProfile(user);
    await loadRoleContent(user);
    setupEventListeners();
});

// ===========================
// Profile Loading
// ===========================
async function loadUserProfile(user) {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) return;

    const data = userDoc.data();
    const displayName = data.name || user.displayName || user.email.split('@')[0];
    userNameElement.textContent = displayName;
    userRoleElement.textContent = data.userType || 'User';
    if (avatarImg && (data.avatar || user.photoURL)) avatarImg.src = data.avatar || user.photoURL;

    if (profileForm) {
        profileForm.displayName.value = data.name || '';
        profileForm.bio.value = data.bio || '';
        profileForm.phone.value = data.phone || '';
    }

    updateProfileCompletion(data);
}

function updateProfileCompletion(data) {
    let completed = 0;
    ['name','bio','phone'].forEach(f => data[f] && completed++);
    const percent = Math.round((completed/3)*100);
    if (completionFill) completionFill.style.width = `${percent}%`;
    if (completionText) completionText.textContent = `Profile ${percent}% Complete`;
}

// ===========================
// Role-Specific Content
// ===========================
async function loadRoleContent(user) {
    const userType = await getUserType(user);
    if (userType === 'business') {
        proposalsInvestmentsTitle.textContent = 'My Proposals';
        await loadMyProposals(user.uid);
        investmentsCountElement.textContent = 'N/A';
    } else if (userType === 'investor') {
        proposalsInvestmentsTitle.textContent = 'My Investments';
        proposalsInvestmentsList.innerHTML = '<p>Investment tracking coming soon!</p>';
        proposalsCountElement.textContent = 'N/A';
        investmentsCountElement.textContent = '0';
    }
}

async function loadMyProposals(userId) {
    const q = query(collection(db,'proposals'), where('userId','==',userId));
    const snapshot = await getDocs(q);
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
async function handleProfileUpdate(e) {
    e.preventDefault();
    if (!currentUser) return;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.querySelector('span').textContent;

    try {
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Saving...';

        const data = {
            name: profileForm.displayName.value,
            bio: profileForm.bio.value,
            phone: profileForm.phone.value,
            updatedAt: new Date()
        };
        await updateDoc(doc(db,'users',currentUser.uid), data);

        userNameElement.textContent = data.name;
        updateProfileCompletion(data);
        showNotification('Profile updated successfully!', 'success');
    } catch(err) {
        console.error(err);
        showNotification('Failed to update profile.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = originalText;
    }
}

// ===========================
// Logout
// ===========================
window.handleLogout = function() {
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
        setTimeout(()=> window.location.href='login.html',300);
    } catch(err) {
        console.error(err);
        showNotification('Logout failed.', 'error');
    }
}

// ===========================
// Theme Toggle Integration
// ===========================
// Remove theme toggle logic here because theme.js handles it.
// profile.js only relies on #theme-toggle existing in DOM.
// No duplicate toggle needed.
