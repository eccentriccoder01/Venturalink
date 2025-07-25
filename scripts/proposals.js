// Import Firebase services
import { auth, db } from './firebase.js';

// Get DOM elements
const proposalsGrid = document.getElementById('proposals-grid');
const modal = document.getElementById('proposal-modal');
const modalContent = document.querySelector('.modal-content');
const closeModal = document.querySelector('.close-modal');
const proposalDetails = document.getElementById('proposal-details');
const categoryFilter = document.getElementById('category-filter');
const amountFilter = document.getElementById('amount-filter');
const sortBy = document.getElementById('sort-by');
const debugInfo = document.getElementById('debug-info');
const userStatus = document.getElementById('user-status');
const userType = document.getElementById('user-type');

// Function to update debug info
function updateDebugInfo(status, type) {
    if (debugInfo) {
        debugInfo.style.display = 'block';
        userStatus.textContent = status;
        userType.textContent = type || 'Not set';
    }
}

// Function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Function to format date
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

// Function to create proposal card
function createProposalCard(proposal) {
    const card = document.createElement('div');
    card.className = 'proposal-card';
    card.innerHTML = `
        <h3>${proposal.title}</h3>
        <span class="proposal-category">${proposal.category}</span>
        <p class="proposal-description">${proposal.description}</p>
        <div class="proposal-details">
            <span class="proposal-amount">${formatCurrency(proposal.amount)}</span>
            <span class="proposal-date">${formatDate(proposal.createdAt)}</span>
        </div>
    `;

    // Add click event to show proposal details
    card.addEventListener('click', () => showProposalDetails(proposal));
    return card;
}

// Function to show proposal details in modal
function showProposalDetails(proposal) {
    proposalDetails.innerHTML = `
        <div class="proposal-detail-section">
            <h3>${proposal.title}</h3>
            <span class="proposal-category">${proposal.category}</span>
            <p class="proposal-date">Posted on ${formatDate(proposal.createdAt)}</p>
        </div>

        <div class="proposal-detail-section">
            <h3>Business Description</h3>
            <p>${proposal.description}</p>
        </div>

        <div class="proposal-detail-section">
            <h3>Problem Statement</h3>
            <p>${proposal.problem}</p>
        </div>

        <div class="proposal-detail-section">
            <h3>Solution</h3>
            <p>${proposal.solution}</p>
        </div>

        <div class="proposal-detail-section">
            <h3>Investment Details</h3>
            <p><strong>Amount Needed:</strong> ${formatCurrency(proposal.amount)}</p>
            ${proposal.equity ? `<p><strong>Equity Offered:</strong> ${proposal.equity}%</p>` : ''}
            <p><strong>Use of Funds:</strong> ${proposal.useOfFunds}</p>
        </div>

        <div class="proposal-detail-section">
            <h3>Market Information</h3>
            ${proposal.marketSize ? `<p><strong>Market Size:</strong> ${proposal.marketSize}</p>` : ''}
            ${proposal.competitors ? `<p><strong>Competitors:</strong> ${proposal.competitors}</p>` : ''}
            ${proposal.timeline ? `<p><strong>Business Timeline:</strong> ${proposal.timeline}</p>` : ''}
        </div>
    `;

    modal.style.display = 'block';
}

// Function to load and display proposals
async function loadProposals(filters = {}) {
    try {
        let query = db.collection('proposals').where('status', '==', 'pending');

        // Apply category filter
        if (filters.category) {
            query = query.where('category', '==', filters.category);
        }

        // Get proposals
        const snapshot = await query.get();
        let proposals = [];

        snapshot.forEach(doc => {
            proposals.push({ id: doc.id, ...doc.data() });
        });

        // Apply amount filter
        if (filters.amount) {
            const [min, max] = filters.amount.split('-').map(Number);
            proposals = proposals.filter(proposal => {
                if (max) {
                    return proposal.amount >= min && proposal.amount <= max;
                } else {
                    return proposal.amount >= min;
                }
            });
        }

        // Apply sorting
        switch (filters.sort) {
            case 'oldest':
                proposals.sort((a, b) => a.createdAt?.toDate() - b.createdAt?.toDate());
                break;
            case 'amount-low':
                proposals.sort((a, b) => a.amount - b.amount);
                break;
            case 'amount-high':
                proposals.sort((a, b) => b.amount - a.amount);
                break;
            default: // newest
                proposals.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());
        }

        // Clear and update grid
        proposalsGrid.innerHTML = '';
        proposals.forEach(proposal => {
            proposalsGrid.appendChild(createProposalCard(proposal));
        });

    } catch (error) {
        console.error('Error loading proposals:', error);
        showAlert('Error loading proposals. Please try again.', 'error');
    }
}

// Function to show alert message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(alertDiv, main.firstChild);
        setTimeout(() => alertDiv.remove(), 5000);
    }
}

// Function to handle logout
async function handleLogout() {
    try {
        // Sign out the user using Firebase Authentication
        await auth.signOut();

        // Clear any locally stored user data
        localStorage.removeItem('userType');

        // Redirect the user to the homepage or login page
        window.location.href = './index.html';
    } catch (error) {
        // Log the error to the console for debugging
        console.error('Logout error:', error);

        // Show an alert to the user indicating the logout failed
        showAlert('Error signing out. Please try again.', 'error');
    }
}

// Event Listeners
if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Filter event listeners
if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
        loadProposals({
            category: categoryFilter.value,
            amount: amountFilter.value,
            sort: sortBy.value
        });
    });
}

if (amountFilter) {
    amountFilter.addEventListener('change', () => {
        loadProposals({
            category: categoryFilter.value,
            amount: amountFilter.value,
            sort: sortBy.value
        });
    });
}

if (sortBy) {
    sortBy.addEventListener('change', () => {
        loadProposals({
            category: categoryFilter.value,
            amount: amountFilter.value,
            sort: sortBy.value
        });
    });
}

// Check authentication and user type
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
        const userDoc = await db.collection('users').doc(user.uid).get();
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

        if (userData.userType !== 'investor') {
            console.log('Not an investor');
            showAlert('Only investors can view proposals', 'error');
            setTimeout(() => {
                window.location.href = './dashboard.html';
            }, 2000);
            return;
        }

        // Load proposals if user is an investor
        loadProposals();

    } catch (error) {
        console.error('Error checking user type:', error);
        updateDebugInfo('Error', 'Error checking type');
        showAlert('Error checking user permissions', 'error');
    }
});