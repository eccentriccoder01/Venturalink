// Import Firebase services and auth functions
import { db, auth } from './firebase.js';
import { getCurrentUser, getUserType } from './auth.js';
import { doc, getDoc, addDoc, updateDoc, collection, getDocs, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Get DOM elements
const userNameElement = document.getElementById('user-name');
const userRoleElement = document.getElementById('user-role');
const totalProposalsElement = document.getElementById('total-proposals');
const activeInvestmentsElement = document.getElementById('active-investments');
const unreadMessagesElement = document.getElementById('unread-messages');
const activityFeedElement = document.getElementById('activity-feed');

// Get dashboard sections
const investorDashboard = document.getElementById('investor-dashboard');
const businessDashboard = document.getElementById('business-dashboard');

// Get forms
const profileForm = document.getElementById('profile-form');
const proposalForm = document.getElementById('proposal-form');

auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = '/login.html';
        return;
    }
    await initializeDashboard(user);
});


async function initializeDashboard(user) {
    await loadUserProfile(user);
    await showRoleSpecificSections(user);
    await loadDashboardData(user);
    setupEventListeners();
}

// Function to load user profile
async function loadUserProfile(user) {
    try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            // Update profile elements
            if (userNameElement) {
                userNameElement.textContent = userData.name || user.email;
            }
            if (userRoleElement) {
                userRoleElement.textContent = userData.userType || 'User';
            }
            
            // Fill profile form if it exists
            if (profileForm) {
                profileForm.displayName.value = userData.name || '';
                profileForm.bio.value = userData.bio || '';
                profileForm.phone.value = userData.phone || '';
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        showMessage('Error loading profile', 'error');
    }
}

async function showRoleSpecificSections(user) {
    const userType = await getUserType(user);
    if (investorDashboard) investorDashboard.style.display = 'none';
    if (businessDashboard) businessDashboard.style.display = 'none';
    switch (userType) {
        case 'investor':
            if (investorDashboard) investorDashboard.style.display = 'block';
            break;
        case 'business':
            if (businessDashboard) businessDashboard.style.display = 'block';
            break;
    }
}

async function loadDashboardData(user) {
    if (!user) return;

    try {
        const proposalsSnapshot = await getDocs(collection(db, 'proposals'));
        if (totalProposalsElement) {
            totalProposalsElement.textContent = proposalsSnapshot.size;
        }
        const userType = await getUserType(user);
        if (userType === 'investor') {
            const investmentsQuery = query(
            collection(db, 'investments'),
            where('investorId', '==', user.uid),
            where('status', '==', 'active')
            );
            const investmentsSnapshot = await getDocs(investmentsQuery);

            if (activeInvestmentsElement) {
                activeInvestmentsElement.textContent = investmentsSnapshot.size;
            }
            if (investorDashboard) {
                const proposalsList = document.getElementById('proposals-list');
                proposalsList.innerHTML = '';

                proposalsSnapshot.forEach(doc => {
                    const proposal = doc.data();
                    const proposalDiv = document.createElement('div');
                    proposalDiv.className = 'proposal-card';
                    proposalDiv.innerHTML = `
                        <h3>${proposal.title}</h3>
                        <p>${proposal.description}</p>
                        <p><strong>Amount:</strong> $${proposal.amount}</p>
                    `;
                    proposalsList.appendChild(proposalDiv);
                });
            }

        } else if (userType === 'business') {
const myProposalsQuery = query(
            collection(db, 'proposals'),
            where('userId', '==', user.uid)
            );
            const myProposalsSnapshot = await getDocs(myProposalsQuery);

            const myProposals = document.getElementById('my-proposals');
            myProposals.innerHTML = '';

            myProposalsSnapshot.forEach(doc => {
                const proposal = doc.data();
                const proposalDiv = document.createElement('div');
                proposalDiv.className = 'proposal-card';
                proposalDiv.innerHTML = `
                    <h3>${proposal.title}</h3>
                    <p>${proposal.description}</p>
                    <p><strong>Amount:</strong> $${proposal.amount}</p>
                `;
                myProposals.appendChild(proposalDiv);
            });
        }

        await loadRecentActivity(user.uid);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showMessage('Error loading dashboard data', 'error');
    }
}

async function loadRecentActivity(userId) {
    if (!activityFeedElement) return;

    try {
        const activitiesQuery = query(
        collection(db, 'activities'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(5)
        );
        const activitiesSnapshot = await getDocs(activitiesQuery);
        activityFeedElement.innerHTML = '';
        activitiesSnapshot.forEach(doc => {
            const activity = doc.data();
            const activityElement = document.createElement('div');
            activityElement.className = 'activity-item';
            activityElement.innerHTML = `
                <p>${activity.description}</p>
                <small>${formatDate(activity.timestamp)}</small>
            `;
            activityFeedElement.appendChild(activityElement);
        });
    } catch (error) {
        console.error('Error loading activities:', error);
    }
}
function setupEventListeners() {
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    if (proposalForm) {
        proposalForm.addEventListener('submit', handleProposalSubmit);
    }
    const navLinks = document.querySelectorAll('.dashboard-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
}

async function handleProfileUpdate(event) {
    event.preventDefault();
    try {
        const formData = {
            name: profileForm.displayName.value,
            bio: profileForm.bio.value,
            phone: profileForm.phone.value,
            updatedAt: new Date()
        };
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, formData);
        if (userNameElement) {
            userNameElement.textContent = formData.name;
        }

        showMessage('Profile updated successfully', 'success');
    } catch (error) {
        console.error('Error updating profile:', error);
        showMessage('Error updating profile', 'error');
    }
}
async function handleProposalSubmit(event) {
    event.preventDefault();
    try {
        // Get form data
        const formData = {
            title: proposalForm.title.value,
            description: proposalForm.description.value,
            amount: parseFloat(proposalForm.amount.value),
            userId: user.uid,
            status: 'pending',
            createdAt: new Date()
        };
        await addDoc(collection(db, 'proposals'), formData);
        proposalForm.reset();
        showMessage('Proposal submitted successfully', 'success');
        await loadDashboardData();
    } catch (error) {
        console.error('Error submitting proposal:', error);
        showMessage('Error submitting proposal', 'error');
    }
}
function handleNavigation(event) {
    event.preventDefault();
    
    // Get target section
    const targetId = event.target.getAttribute('href').substring(1);
    
    // Hide all sections
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active link
    const links = document.querySelectorAll('.dashboard-nav a');
    links.forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Function to format date
function formatDate(timestamp) {
    if (!timestamp) return '';
    
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Function to show messages
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type}`;
    messageDiv.textContent = message;

    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(messageDiv, main.firstChild);
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Logout handler
window.handleLogout = async function () {
    try {
        await auth.signOut();
        localStorage.clear();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout failed:', error);
        alert('Logout failed');
    }
};
