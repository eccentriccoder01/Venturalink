import { db, auth } from './firebase.js';
import { getCurrentUser, getUserType } from './auth.js';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Profile Page Elements
const userNameElement = document.getElementById('user-name');
const userRoleElement = document.getElementById('user-role');
const profileForm = document.getElementById('profile-form');
const avatarImg = document.getElementById('avatar-img');

// Profile Completion Elements
const completionFill = document.getElementById('completion-fill');
const completionText = document.getElementById('completion-text');

// Stat Cards
const proposalsCountElement = document.getElementById('proposals-count');
const investmentsCountElement = document.getElementById('investments-count');

// Activity Feed
const activityFeedElement = document.getElementById('activity-feed');

// Proposals/Investments Section
const proposalsInvestmentsTitle = document.getElementById('proposals-investments-title');
const proposalsInvestmentsList = document.getElementById('proposals-investments-list');

let currentUser = null;

auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = '/login.html';
        return;
    }
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

async function loadUserProfile(user) {
    try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const displayName = userData.name || user.displayName || getDisplayNameFromEmail(user.email);

            userNameElement.textContent = displayName;
            userRoleElement.textContent = userData.userType || 'User';
            if (avatarImg && (userData.avatar || user.photoURL)) {
                avatarImg.src = userData.avatar || user.photoURL;
            }

            if (profileForm) {
                profileForm.displayName.value = userData.name || '';
                profileForm.bio.value = userData.bio || '';
                profileForm.phone.value = userData.phone || '';
            }
            
            updateProfileCompletion(userData);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

function updateProfileCompletion(userData) {
    let completedFields = 0;
    const totalFields = 3; // name, bio, phone
    if (userData.name) completedFields++;
    if (userData.bio) completedFields++;
    if (userData.phone) completedFields++;
    const percentage = Math.round((completedFields / totalFields) * 100);
    
    if (completionFill) completionFill.style.width = `${percentage}%`;
    if (completionText) completionText.textContent = `Profile ${percentage}% Complete`;
}

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
        // Placeholder for investor-specific data loading
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

function setupEventListeners() {
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
}

async function handleProfileUpdate(event) {
    event.preventDefault();
    if (!currentUser) return;
    const submitButton = event.target.querySelector('button[type="submit"]');

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
        alert('Profile updated successfully!');
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile.');
    } finally {
        submitButton.disabled = false;
        submitButton.querySelector('span').textContent = 'Save Changes';
    }
}

window.handleLogout = async function () {
    try {  
        await auth.signOut();
        localStorage.clear();
        document.body.style.transition = 'opacity 0.3s';
        document.body.style.opacity = '0';
        setTimeout(() => window.location.href = 'login.html', 300);
    } catch (error) {
        console.error('Logout failed:', error);
    }
};