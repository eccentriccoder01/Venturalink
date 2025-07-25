// Import Firebase services
import { auth, db } from './firebase.js';
import { getCurrentUser } from './auth.js';

// Get proposal form and debug elements
const proposalForm = document.getElementById('proposal-form');
const debugInfo = document.getElementById('debug-info');
const userStatus = document.getElementById('user-status');
const userType = document.getElementById('user-type');

// Global logout function
window.logout = async function() {
    try {
        await firebase.auth().signOut();
        window.location.href = './index.html';
    } catch (error) {
        console.error('Error signing out:', error);
        alert('Error signing out. Please try again.');
    }
};

// Function to show alert message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    // Insert alert at the top of the form
    proposalForm.insertBefore(alertDiv, proposalForm.firstChild);

    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Function to update debug info
function updateDebugInfo(status, type) {
    if (debugInfo) {
        debugInfo.style.display = 'block';
        userStatus.textContent = status;
        userType.textContent = type || 'Not set';
    }
}

// Function to handle form submission
async function handleProposalSubmit(event) {
    event.preventDefault();
    console.log('Form submission started');

    const user = getCurrentUser();
    if (!user) {
        console.log('No user found');
        showAlert('You must be logged in to submit a proposal', 'error');
        return;
    }

    console.log('User found:', user.uid);

    // Get form values
    const formData = {
        title: proposalForm.title.value.trim(),
        category: proposalForm.category.value,
        description: proposalForm.description.value.trim(),
        problem: proposalForm.problem.value.trim(),
        solution: proposalForm.solution.value.trim(),
        amount: parseFloat(proposalForm.amount.value),
        equity: proposalForm.equity.value ? parseFloat(proposalForm.equity.value) : null,
        useOfFunds: proposalForm.useOfFunds.value.trim(),
        marketSize: proposalForm.marketSize.value.trim(),
        competitors: proposalForm.competitors.value.trim(),
        timeline: proposalForm.timeline.value.trim(),
        userId: user.uid,
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        console.log('Submitting proposal...');
        // Add proposal to database
        const docRef = await firebase.firestore().collection('proposals').add(formData);
        console.log('Proposal submitted with ID:', docRef.id);
        
        // Show success message
        showAlert('Proposal submitted successfully!', 'success');
        
        // Reset form
        proposalForm.reset();
        
        // Redirect to my proposals page after 2 seconds
        setTimeout(() => {
            window.location.href = './proposals.html';
        }, 2000);

    } catch (error) {
        console.error('Error submitting proposal:', error);
        showAlert('Error submitting proposal. Please try again.', 'error');
    }
}

// Add form submit event listener
if (proposalForm) {
    proposalForm.addEventListener('submit', handleProposalSubmit);
}

// Function to handle logout
async function handleLogout() {
    try {
        await firebase.auth().signOut();
        localStorage.removeItem('userType');
        window.location.href = './index.html';
    } catch (error) {
        console.error('Logout error:', error);
        showAlert('Error signing out', 'error');
    }
}

// Check if user is logged in and is a business user
auth.onAuthStateChanged(async (user) => {
    console.log('Auth state changed:', user ? 'User logged in' : 'No user');
    
    if (!user) {
        console.log('No user, redirecting to login');
        updateDebugInfo('Not logged in', 'None');
        window.location.href = './login.html';
        return;
    }

    try {
        // Get user type from database
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        console.log('User document:', userDoc.exists ? 'Found' : 'Not found');
        
        if (!userDoc.exists) {
            console.log('User document not found');
            updateDebugInfo('Logged in', 'Document not found');
            showAlert('User profile not found', 'error');
            setTimeout(() => {
                window.location.href = './dashboard.html';
            }, 2000);
            return;
        }

        const userData = userDoc.data();
        console.log('User type:', userData.userType);
        updateDebugInfo('Logged in', userData.userType);

        if (userData.userType !== 'business') {
            console.log('Not a business user');
            showAlert('Only business users can submit proposals', 'error');
            setTimeout(() => {
                window.location.href = './dashboard.html';
            }, 2000);
        }
    } catch (error) {
        console.error('Error checking user type:', error);
        updateDebugInfo('Error', 'Error checking type');
        showAlert('Error checking user permissions', 'error');
    }
}); 