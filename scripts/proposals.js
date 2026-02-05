// Enhanced Proposals JavaScript with Premium UI Interactions
import { auth, db } from './firebase.js';
import { collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// DOM Elements
const proposalsGrid = document.getElementById('proposals-grid');
const modal = document.getElementById('proposal-modal');
const closeModal = document.querySelector('.close-modal');
const proposalDetails = document.getElementById('proposal-details');
const categoryFilter = document.getElementById('category-filter');
const amountFilter = document.getElementById('amount-filter');
const sortBy = document.getElementById('sort-by');
const debugInfo = document.getElementById('debug-info');
const userStatus = document.getElementById('user-status');
const userType = document.getElementById('user-type');
const resetFilters = document.querySelector('.reset-filters');
const viewToggle = document.querySelectorAll('.view-btn');

// State Management
let currentView = 'grid';
let isLoading = false;
let proposals = [];
let filteredProposals = [];

// Enhanced Debug Info
function updateDebugInfo(status, type) {
    if (debugInfo) {
        debugInfo.style.display = 'block';
        userStatus.textContent = status;
        userType.textContent = type || 'Not set';
        
        // Add animation
        debugInfo.style.animation = 'fadeInRight 0.5s ease-out';
    }
}

// Enhanced Currency Formatting
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        notation: amount >= 1000000 ? 'compact' : 'standard'
    }).format(amount);
}

// Enhanced Date Formatting
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

// Enhanced Alert System
function showAlert(message, type = 'info') {
    const alertContainer = document.createElement('div');
    alertContainer.className = 'alert-container';
    alertContainer.style.cssText = `
        position: fixed;
        top: 100px;
        right: var(--space-xl);
        z-index: 10001;
        animation: slideInRight 0.3s ease-out;
    `;

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        background: ${type === 'error' ? 'rgba(255, 107, 107, 0.1)' : 'rgba(67, 233, 123, 0.1)'};
        border: 1px solid ${type === 'error' ? 'rgba(255, 107, 107, 0.3)' : 'rgba(67, 233, 123, 0.3)'};
        color: ${type === 'error' ? '#ff6b6b' : '#43e97b'};
        padding: var(--space-lg);
        border-radius: var(--radius-md);
        backdrop-filter: blur(20px);
        box-shadow: var(--shadow-strong);
        min-width: 300px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: var(--space-sm);
    `;

    const icon = type === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle';
    alert.innerHTML = `<i class="${icon}"></i>${message}`;
    
    alertContainer.appendChild(alert);
    document.body.appendChild(alertContainer);

    // Auto remove after 5 seconds
    setTimeout(() => {
        alertContainer.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => alertContainer.remove(), 300);
    }, 5000);
}

// Enhanced Proposal Card Creation
function createProposalCard(proposal) {
    const card = document.createElement('div');
    card.className = 'proposal-card';
    card.style.animation = 'fadeInUp 0.6s ease-out';

    // Category icons mapping
    const categoryIcons = {
        technology: 'fas fa-rocket',
        healthcare: 'fas fa-heartbeat',
        education: 'fas fa-graduation-cap',
        retail: 'fas fa-shopping-bag',
        manufacturing: 'fas fa-industry',
        services: 'fas fa-concierge-bell',
        other: 'fas fa-lightbulb'
    };

    const categoryIcon = categoryIcons[proposal.category.toLowerCase()] || categoryIcons.other;

    card.innerHTML = `
        <div class="proposal-header">
            <h3>
                <i class="${categoryIcon}"></i>
                ${proposal.title}
            </h3>
            <span class="proposal-category">
                ${proposal.category.charAt(0).toUpperCase() + proposal.category.slice(1)}
            </span>
        </div>
        
        <div class="proposal-body">
            <p class="proposal-description">${proposal.description}</p>
            
            <div class="proposal-details">
                <div class="detail-item">
                    <span class="detail-label">Investment Needed</span>
                    <span class="detail-value">${formatCurrency(proposal.amount)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Posted</span>
                    <span class="detail-value">${formatDate(proposal.createdAt)}</span>
                </div>
            </div>
        </div>
        
        <div class="proposal-footer">
            <div class="proposal-date">
                <i class="fas fa-calendar-alt"></i>
                ${formatDate(proposal.createdAt)}
            </div>
        </div>
    `;

    // Enhanced hover effects
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });

    // Enhanced click interaction
    card.addEventListener('click', (e) => {
        e.preventDefault();
        showProposalDetails(proposal);
    });

    return card;
}

// Enhanced Modal Details
function showProposalDetails(proposal) {
    const categoryIcons = {
        technology: 'fas fa-rocket',
        healthcare: 'fas fa-heartbeat',
        education: 'fas fa-graduation-cap',
        retail: 'fas fa-shopping-bag',
        manufacturing: 'fas fa-industry',
        services: 'fas fa-concierge-bell',
        other: 'fas fa-lightbulb'
    };

    const categoryIcon = categoryIcons[proposal.category.toLowerCase()] || categoryIcons.other;

    proposalDetails.innerHTML = `
        <div class="proposal-detail-section">
            <div style="display: flex; align-items: center; gap: var(--space-lg); margin-bottom: var(--space-lg);">
                <div style="display: flex; align-items: center; gap: var(--space-sm);">
                    <i class="${categoryIcon}" style="color: var(--text-accent); font-size: 1.5rem;"></i>
                    <h3 style="margin: 0; font-size: 2rem;">${proposal.title}</h3>
                </div>
                <span class="proposal-category">${proposal.category.charAt(0).toUpperCase() + proposal.category.slice(1)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-sm); color: var(--text-tertiary);">
                <i class="fas fa-calendar-alt"></i>
                <span>Posted on ${formatDate(proposal.createdAt)}</span>
            </div>
        </div>

        <div class="proposal-detail-section">
            <h3><i class="fas fa-info-circle" style="color: var(--text-accent);"></i> Business Description</h3>
            <p>${proposal.description}</p>
        </div>

        <div class="proposal-detail-section">
            <h3><i class="fas fa-exclamation-triangle" style="color: #ff6b6b;"></i> Problem Statement</h3>
            <p>${proposal.problem || 'Not specified'}</p>
        </div>

        <div class="proposal-detail-section">
            <h3><i class="fas fa-lightbulb" style="color: #43e97b;"></i> Solution</h3>
            <p>${proposal.solution || 'Not specified'}</p>
        </div>

        <div class="proposal-detail-section">
            <h3><i class="fas fa-chart-line" style="color: var(--text-accent);"></i> Investment Details</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-lg); margin-top: var(--space-lg);">
                <div style="background: var(--bg-tertiary); padding: var(--space-lg); border-radius: var(--radius-md); border: 1px solid var(--glass-border);">
                    <div style="color: var(--text-tertiary); font-size: 0.875rem; margin-bottom: var(--space-sm);">Amount Needed</div>
                    <div style="color: var(--text-primary); font-size: 1.5rem; font-weight: 700;">${formatCurrency(proposal.amount)}</div>
                </div>
                ${proposal.equity ? `
                <div style="background: var(--bg-tertiary); padding: var(--space-lg); border-radius: var(--radius-md); border: 1px solid var(--glass-border);">
                    <div style="color: var(--text-tertiary); font-size: 0.875rem; margin-bottom: var(--space-sm);">Equity Offered</div>
                    <div style="color: var(--text-primary); font-size: 1.5rem; font-weight: 700;">${proposal.equity}%</div>
                </div>
                ` : ''}
            </div>
            <div style="margin-top: var(--space-lg);">
                <strong style="color: var(--text-primary);">Use of Funds:</strong>
                <p style="margin-top: var(--space-sm);">${proposal.useOfFunds || 'Not specified'}</p>
            </div>
        </div>

        <div class="proposal-detail-section">
            <h3><i class="fas fa-globe" style="color: var(--text-accent);"></i> Market Information</h3>
            ${proposal.marketSize ? `
                <div style="margin-bottom: var(--space-md);">
                    <strong style="color: var(--text-primary);">Market Size:</strong>
                    <p style="margin-top: var(--space-xs);">${proposal.marketSize}</p>
                </div>
            ` : ''}
            ${proposal.competitors ? `
                <div style="margin-bottom: var(--space-md);">
                    <strong style="color: var(--text-primary);">Competitors:</strong>
                    <p style="margin-top: var(--space-xs);">${proposal.competitors}</p>
                </div>
            ` : ''}
            ${proposal.timeline ? `
                <div style="margin-bottom: var(--space-md);">
                    <strong style="color: var(--text-primary);">Business Timeline:</strong>
                    <p style="margin-top: var(--space-xs);">${proposal.timeline}</p>
                </div>
            ` : ''}
        </div>
    `;

    // Enhanced modal display with animation
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.querySelector('.modal-container').style.animation = 'modalSlideUp 0.4s ease-out';
    }, 10);
}

// Enhanced Loading State
function showLoadingState() {
    proposalsGrid.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            </div>
            <p>Discovering incredible opportunities...</p>
        </div>
    `;
}

// Enhanced Empty State
function showEmptyState() {
    proposalsGrid.innerHTML = `
        <div style="
            grid-column: 1 / -1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--space-lg);
            padding: var(--space-3xl);
            color: var(--text-secondary);
            text-align: center;
        ">
            <div style="
                width: 120px;
                height: 120px;
                background: var(--bg-tertiary);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
                color: var(--text-tertiary);
                border: 2px solid var(--glass-border);
            ">
                <i class="fas fa-search"></i>
            </div>
            <h3 style="color: var(--text-primary); font-size: 1.5rem; margin: 0;">No opportunities found</h3>
            <p style="max-width: 400px; line-height: 1.6;">
                Try adjusting your filters or check back later for new investment opportunities.
            </p>
            <button class="btn btn-primary" onclick="resetAllFilters()" style="margin-top: var(--space-md);">
                <i class="fas fa-refresh"></i>
                <span>Reset Filters</span>
            </button>
        </div>
    `;
}

// Enhanced Proposals Loading with Animations
// async function loadProposals(filters = {}) {
//     if (isLoading) return;
    
//     isLoading = true;
//     showLoadingState();
    
//     try {
//         let q = query(collection(db, 'proposals'), where('status', '==', 'pending'));

//         // Apply category filter
//         if (filters.category) {
//             q = query(collection(db, 'proposals'), where('status', '==', 'pending'), where('category', '==', filters.category));
//         }

//         const snapshot = await getDocs(q);
//         proposals = [];

//         snapshot.forEach(doc => {
//             proposals.push({ id: doc.id, ...doc.data() });
//         });

//         // Apply amount filter
//         if (filters.amount) {
//             const [min, max] = filters.amount.split('-').map(Number);
//             proposals = proposals.filter(proposal => {
//                 if (max) {
//                     return proposal.amount >= min && proposal.amount <= max;
//                 } else {
//                     return proposal.amount >= min;
//                 }
//             });
//         }

//         // Apply sorting with enhanced logic
//         switch (filters.sort) {
//             case 'oldest':
//                 proposals.sort((a, b) => a.createdAt?.toDate() - b.createdAt?.toDate());
//                 break;
//             case 'amount-low':
//                 proposals.sort((a, b) => a.amount - b.amount);
//                 break;
//             case 'amount-high':
//                 proposals.sort((a, b) => b.amount - a.amount);
//                 break;
//             default: // 'newest'
//                 proposals.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());
//         }

//         filteredProposals = [...proposals];
//         displayProposals();

//     } catch (error) {
//         console.error('Error loading proposals:', error);
//         showAlert('Failed to load opportunities. Please try again.', 'error');
//         showEmptyState();
//     } finally {
//         isLoading = false;
//     }
// }


async function loadProposals(filters = {}) {
    if (isLoading) return;
    isLoading = true;

    showLoadingState();

    try {
        // ✅ 1. FETCH ALL PENDING PROPOSALS (NO CATEGORY FILTER IN FIRESTORE)
        const q = query(
            collection(db, 'proposals'),
            where('status', '==', 'pending')
        );

        const snapshot = await getDocs(q);

        proposals = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log('Fetched proposals:', proposals.length);

        // ✅ 2. CLIENT-SIDE FILTERING (SAFE)
        let result = [...proposals];

        // CATEGORY FILTER
        if (filters.category) {
            result = result.filter(p =>
                p.category &&
                p.category.toLowerCase() === filters.category.toLowerCase()
            );
        }

        // AMOUNT FILTER (SAFE PARSING)
        if (filters.amount) {
            let min = 0;
            let max = Infinity;

            switch (filters.amount) {
                case '0-10000':
                    min = 0; max = 10000;
                    break;
                case '10000-50000':
                    min = 10000; max = 50000;
                    break;
                case '50000-100000':
                    min = 50000; max = 100000;
                    break;
            }

            result = result.filter(p =>
                typeof p.amount === 'number' &&
                p.amount >= min &&
                p.amount <= max
            );
        }

        // SORTING (CRASH-PROOF)
        switch (filters.sort) {
            case 'oldest':
                result.sort((a, b) =>
                    (a.createdAt?.toDate?.() || 0) -
                    (b.createdAt?.toDate?.() || 0)
                );
                break;

            case 'amount-low':
                result.sort((a, b) => a.amount - b.amount);
                break;

            case 'amount-high':
                result.sort((a, b) => b.amount - a.amount);
                break;

            default: // newest
                result.sort((a, b) =>
                    (b.createdAt?.toDate?.() || 0) -
                    (a.createdAt?.toDate?.() || 0)
                );
        }

        filteredProposals = result;

        console.log('After filters:', filteredProposals.length);

        displayProposals();

    } catch (error) {
        console.error('Error loading proposals:', error);
        showAlert('Failed to load opportunities.', 'error');
        showEmptyState();
    } finally {
        isLoading = false;
    }
}


// Enhanced Display Function
function displayProposals() {
    if (filteredProposals.length === 0) {
        showEmptyState();
        return;
    }

    proposalsGrid.innerHTML = '';
    
    // Staggered animation for cards
    filteredProposals.forEach((proposal, index) => {
        const card = createProposalCard(proposal);
        card.style.animationDelay = `${index * 0.1}s`;
        proposalsGrid.appendChild(card);
    });
}

// Enhanced Filter Reset
function resetAllFilters() {
    categoryFilter.value = '';
    amountFilter.value = '';
    sortBy.value = 'newest';
    
    // Add visual feedback
    [categoryFilter, amountFilter, sortBy].forEach(select => {
        select.style.transform = 'scale(1.05)';
        setTimeout(() => {
            select.style.transform = 'scale(1)';
        }, 200);
    });
    
    loadProposals();
    showAlert('Filters reset successfully', 'success');
}

// Enhanced Logout Function
async function handleLogout() {
    try {
        // Add loading state to logout button
        const logoutBtn = document.querySelector('.logout-btn');
        const originalContent = logoutBtn.innerHTML;
        logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Signing out...</span>';
        logoutBtn.disabled = true;

        await auth.signOut();
        localStorage.removeItem('userType');
        
        // Success feedback
        showAlert('Successfully signed out', 'success');
        
        setTimeout(() => {
            window.location.href = './index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Logout error:', error);
        showAlert('Error signing out. Please try again.', 'error');
        
        // Reset button state
        const logoutBtn = document.querySelector('.logout-btn');
        logoutBtn.innerHTML = originalContent;
        logoutBtn.disabled = false;
    }
}

// Enhanced Event Listeners
if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.querySelector('.modal-container').style.animation = 'modalSlideDown 0.3s ease-out';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
}

// Enhanced modal backdrop click
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.querySelector('.modal-container').style.animation = 'modalSlideDown 0.3s ease-out';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
});

// Enhanced filter listeners with debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// const debouncedLoadProposals = debounce(() => {
//     loadProposals({
//         category: categoryFilter.value,
//         amount: amountFilter.value,
//         sort: sortBy.value
//     });
// }, 300);


const debouncedLoadProposals = debounce(() => {
    loadProposals({
        category: categoryFilter.value || null,
        amount: amountFilter.value || null,
        sort: sortBy.value || 'newest'
    });
}, 300);


// Enhanced filter event listeners
[categoryFilter, amountFilter, sortBy].forEach(filter => {
    filter.addEventListener('change', () => {
        // Visual feedback
        filter.parentElement.style.transform = 'scale(1.02)';
        setTimeout(() => {
            filter.parentElement.style.transform = 'scale(1)';
        }, 150);
        
        debouncedLoadProposals();
    });
});

// Reset filters button
if (resetFilters) {
    resetFilters.addEventListener('click', resetAllFilters);
}

// View toggle functionality
viewToggle.forEach(btn => {
    btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        
        // Update active state
        viewToggle.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentView = view;
        
        // Apply view-specific styles
        if (view === 'list') {
            proposalsGrid.style.gridTemplateColumns = '1fr';
            proposalsGrid.querySelectorAll('.proposal-card').forEach(card => {
                card.style.display = 'grid';
                card.style.gridTemplateColumns = '1fr 2fr 1fr';
                card.style.alignItems = 'center';
            });
        } else {
            proposalsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(380px, 1fr))';
            proposalsGrid.querySelectorAll('.proposal-card').forEach(card => {
                card.style.display = 'block';
                card.style.gridTemplateColumns = 'none';
            });
        }
    });
});

// Enhanced keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal.click();
    }
    
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'k':
                e.preventDefault();
                categoryFilter.focus();
                break;
            case 'r':
                e.preventDefault();
                resetAllFilters();
                break;
        }
    }
});

// Enhanced scroll effects
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.main-header');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
}, { passive: true });

// Enhanced Authentication Handler
auth.onAuthStateChanged(async (user) => {
    console.log('Auth state changed:', user ? 'User logged in' : 'No user');
    
    if (!user) {
        console.log('No user, redirecting to login');
        updateDebugInfo('Not logged in', 'None');
        
        // Add transition effect before redirect
        document.body.style.opacity = '0.5';
        setTimeout(() => {
            window.location.href = './login.html';
        }, 500);
        return;
    }

    try {
        updateDebugInfo('Checking permissions...', 'Loading...');
        
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        console.log('User document:', userDoc.exists() ? 'Found' : 'Not found');
        
        if (!userDoc.exists()) {
            console.log('User document not found');
            updateDebugInfo('Logged in', 'Document not found');
            showAlert('User profile not found. Redirecting to dashboard...', 'error');
            setTimeout(() => {
                window.location.href = './profile.html';
            }, 2000);
            return;
        }

        const userData = userDoc.data();
        console.log('User type:', userData.userType);
        updateDebugInfo('Logged in', userData.userType);

        if (userData.userType !== 'investor') {
            console.log('Not an investor');
            showAlert('Access restricted to investors only', 'error');
            setTimeout(() => {
                window.location.href = './profile.html';
            }, 2000);
            return;
        }

        // Success! Load proposals with welcome message
        showAlert('Welcome back! Loading investment opportunities...', 'success');
        loadProposals();

    } catch (error) {
        console.error('Error checking user type:', error);
        updateDebugInfo('Error', 'Permission check failed');
        showAlert('Unable to verify permissions. Please try again.', 'error');
    }
});

// Additional CSS animations for enhanced interactions
const additionalStyles = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    @keyframes modalSlideDown {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(-50px) scale(0.95);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Make handleLogout globally available
window.handleLogout = handleLogout;
window.resetAllFilters = resetAllFilters;