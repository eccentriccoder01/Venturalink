
import { db, auth } from './firebase.js';import { getCurrentUser, getUserType } from './auth.js';
import { doc, getDoc, addDoc, updateDoc, collection, getDocs, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

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

// Animation and UI state management
let currentUser = null;
const animationQueue = [];
let isAnimating = false;

auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = '/login.html';
        return;
    }
    currentUser = user;
    await initializeDashboard(user);
});

async function initializeDashboard(user) {
    showLoadingState();
    
    try {
        await loadUserProfile(user);
        await showRoleSpecificSections(user);
        await loadDashboardData(user);
        setupEventListeners();
        setupAnimations();
        
        // Trigger entrance animations
        setTimeout(() => {
            triggerEntranceAnimations();
            hideLoadingState();
        }, 500);
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showMessage('Error loading dashboard', 'error');
        hideLoadingState();
    }
}

// Enhanced loading state with premium animations
function showLoadingState() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            </div>
            <div class="loading-text">Loading your dashboard...</div>
        </div>
    `;
    
    // Add loading styles
    const loadingStyles = `
        <style>
            #loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: var(--bg-primary);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(20px);
            }
            
            .loading-container {
                text-align: center;
                color: var(--text-primary);
            }
            
            .loading-spinner {
                position: relative;
                width: 80px;
                height: 80px;
                margin: 0 auto 2rem;
            }
            
            .spinner-ring {
                position: absolute;
                width: 100%;
                height: 100%;
                border: 2px solid transparent;
                border-top: 2px solid;
                border-radius: 50%;
                animation: spin 1.5s linear infinite;
            }
            
            .spinner-ring:nth-child(1) {
                border-top-color: #667eea;
                animation-delay: 0s;
            }
            
            .spinner-ring:nth-child(2) {
                border-top-color: #4facfe;
                animation-delay: -0.5s;
                width: 70%;
                height: 70%;
                top: 15%;
                left: 15%;
            }
            
            .spinner-ring:nth-child(3) {
                border-top-color: #43e97b;
                animation-delay: -1s;
                width: 40%;
                height: 40%;
                top: 30%;
                left: 30%;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-text {
                font-family: var(--font-primary);
                font-size: 1.2rem;
                font-weight: 500;
                background: var(--gradient-primary);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: pulse 2s ease-in-out infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', loadingStyles);
    document.body.appendChild(loadingOverlay);
}

function hideLoadingState() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        loadingOverlay.style.transform = 'scale(0.95)';
        setTimeout(() => {
            loadingOverlay.remove();
        }, 300);
    }
}

// Enhanced animations setup
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Observe all animatable elements
    document.querySelectorAll('.glass-card, .proposal-card, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

function triggerEntranceAnimations() {
    // Stagger animations for better visual flow
    const animatableElements = [
        '.hero-header',
        '.dashboard-tabs',
        '.glass-card',
        '.proposal-card'
    ];

    animatableElements.forEach((selector, index) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, elementIndex) => {
            setTimeout(() => {
                el.classList.add('animate-entrance');
            }, (index * 200) + (elementIndex * 100));
        });
    });
}

// Function to load user profile with enhanced animations
async function loadUserProfile(user) {
    try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Update profile elements with animations
            if (userNameElement) {
                animateTextChange(userNameElement, userData.name || user.email);
            }
            if (userRoleElement) {
                animateTextChange(userRoleElement, userData.userType || 'User');
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

// Enhanced text change animation
function animateTextChange(element, newText) {
    element.style.transform = 'translateY(-10px)';
    element.style.opacity = '0';
    
    setTimeout(() => {
        element.textContent = newText;
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
    }, 150);
}

// Enhanced counter animation for statistics
function animateCounter(element, finalValue, duration = 2000) {
    const startValue = 0;
    const increment = finalValue / (duration / 16);
    let currentValue = startValue;
    
    const updateCounter = () => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            element.textContent = finalValue;
            return;
        }
        element.textContent = Math.floor(currentValue);
        requestAnimationFrame(updateCounter);
    };
    
    updateCounter();
}

async function showRoleSpecificSections(user) {
    const userType = await getUserType(user);
    
    // Hide all sections first
    if (investorDashboard) investorDashboard.style.display = 'none';
    if (businessDashboard) businessDashboard.style.display = 'none';
    
    // Show role-specific section with animation
    switch (userType) {
        case 'investor':
            if (investorDashboard) {
                investorDashboard.style.display = 'block';
                setTimeout(() => {
                    investorDashboard.classList.add('animate-slide-in');
                }, 100);
            }
            break;
        case 'business':
            if (businessDashboard) {
                businessDashboard.style.display = 'block';
                setTimeout(() => {
                    businessDashboard.classList.add('animate-slide-in');
                }, 100);
            }
            break;
    }
}

async function loadDashboardData(user) {
    if (!user) return;

    try {
        const proposalsSnapshot = await getDocs(collection(db, 'proposals'));
        if (totalProposalsElement) {
            animateCounter(totalProposalsElement, proposalsSnapshot.size);
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
                animateCounter(activeInvestmentsElement, investmentsSnapshot.size);
            }
            
            if (investorDashboard) {
                const proposalsList = document.getElementById('proposals-list');
                if (proposalsList) {
                    proposalsList.innerHTML = '';
                    
                    proposalsSnapshot.forEach((doc, index) => {
                        const proposal = doc.data();
                        const proposalDiv = createProposalCard(proposal, index);
                        proposalsList.appendChild(proposalDiv);
                    });
                    window.lucide.createIcons();
                }
            }

        } else if (userType === 'business') {
            const myProposalsQuery = query(
                collection(db, 'proposals'),
                where('userId', '==', user.uid)
            );
            const myProposalsSnapshot = await getDocs(myProposalsQuery);

            const myProposals = document.getElementById('my-proposals');
            if (myProposals) {
                myProposals.innerHTML = '';

                myProposalsSnapshot.forEach((doc, index) => {
                    const proposal = doc.data();
                    const proposalDiv = createProposalCard(proposal, index);
                    myProposals.appendChild(proposalDiv);
                });
                    window.lucide.createIcons();
            }
        }

        await loadRecentActivity(user.uid);
        if (unreadMessagesElement) {
            animateCounter(unreadMessagesElement, Math.floor(Math.random() * 10));
        }
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showMessage('Error loading dashboard data', 'error');
    }
}

// Enhanced proposal card creation with animations
function createProposalCard(proposal, index) {
    const proposalDiv = document.createElement('div');
    proposalDiv.className = 'proposal-card';
    proposalDiv.style.animationDelay = `${index * 100}ms`;
    
    proposalDiv.innerHTML = `
        <div class="proposal-header">
            <h3>${proposal.title}</h3>
            <div class="status ${proposal.status || 'pending'}">${proposal.status || 'pending'}</div>
        </div>
        <p class="proposal-description">${proposal.description}</p>
        <div class="proposal-footer">
            <div class="amount">${formatNumber(proposal.amount)}</div>
            <div class="proposal-actions">
                <button class="action-btn small primary" onclick="viewProposal('${proposal.id}')">
                    <i data-lucide="eye"></i>
                    View
                </button>
                <button class="action-btn small secondary" onclick="contactUser('${proposal.userId}')">
                    <i data-lucide="message-circle"></i>
                    Contact
                </button>
            </div>
        </div>
    `;
    
    // Add hover effects
    proposalDiv.addEventListener('mouseenter', () => {
        proposalDiv.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    proposalDiv.addEventListener('mouseleave', () => {
        proposalDiv.style.transform = 'translateY(0) scale(1)';
    });
    
    return proposalDiv;
}

// Enhanced number formatting
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
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
        
        if (activitiesSnapshot.empty) {
            // Add sample activities for demo
            const sampleActivities = [
                { description: 'New investment opportunity in FinTech sector', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
                { description: 'Proposal "AI-Driven Analytics" received funding', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
                { description: 'Connected with 3 new investors', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) }
            ];
            
            sampleActivities.forEach((activity, index) => {
                const activityElement = createActivityItem(activity, index);
                activityFeedElement.appendChild(activityElement);
            });
        } else {
            activitiesSnapshot.forEach((doc, index) => {
                const activity = doc.data();
                const activityElement = createActivityItem(activity, index);
                activityFeedElement.appendChild(activityElement);
            });
        }
    } catch (error) {
        console.error('Error loading activities:', error);
        // Show sample activities on error
        const sampleActivities = [
            { description: 'Welcome to Venturalink!', timestamp: new Date() }
        ];
        
        sampleActivities.forEach((activity, index) => {
            const activityElement = createActivityItem(activity, index);
            activityFeedElement.appendChild(activityElement);
        });
    }
}

function createActivityItem(activity, index) {
    const activityElement = document.createElement('div');
    activityElement.className = 'activity-item';
    activityElement.style.animationDelay = `${index * 100}ms`;
    
    const timestamp = activity.timestamp.toDate ? activity.timestamp.toDate() : activity.timestamp;
    
    activityElement.innerHTML = `
        <div class="activity-icon">
            <i data-lucide="activity"></i>
        </div>
        <div class="activity-content">
            <p>${activity.description}</p>
            <small>${formatDate(timestamp)}</small>
        </div>
    `;
    
    return activityElement;
}

function setupEventListeners() {
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    if (proposalForm) {
        proposalForm.addEventListener('submit', handleProposalSubmit);
    }
    
    // Enhanced tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', handleTabSwitch);
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Modal event listeners
    setupModalEventListeners();
}

// Enhanced tab switching with animations
function handleTabSwitch(event) {
    const clickedTab = event.currentTarget;
    const tabName = clickedTab.dataset.tab;
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to clicked tab
    clickedTab.classList.add('active');
    
    // Hide all tab contents with fade out
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        setTimeout(() => {
            content.classList.remove('active');
        }, 150);
    });
    
    // Show target content with fade in
    setTimeout(() => {
        const targetContent = document.getElementById(`${tabName}-tab`);
        if (targetContent) {
            targetContent.classList.add('active');
            setTimeout(() => {
                targetContent.style.opacity = '1';
                targetContent.style.transform = 'translateY(0)';
            }, 50);
        }
    }, 200);
    
    // Move tab indicator
    moveTabIndicator(clickedTab);
}

function moveTabIndicator(activeTab) {
    const indicator = document.querySelector('.tab-indicator');
    const tabsContainer = activeTab.closest('.tabs-container');
    
    if (indicator && tabsContainer) {
        const containerRect = tabsContainer.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();
        
        indicator.style.left = `${tabRect.left - containerRect.left}px`;
        indicator.style.width = `${tabRect.width}px`;
    }
}

// Debounce function for search
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

// Enhanced search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const proposalCards = document.querySelectorAll('.proposal-card');
    
    proposalCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.proposal-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeInScale 0.3s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

function setupModalEventListeners() {
    const modal = document.getElementById('new-proposal-form');
    const overlay = modal?.querySelector('.modal-overlay');
    
    if (overlay) {
        overlay.addEventListener('click', hideNewProposalForm);
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal?.classList.contains('active')) {
            hideNewProposalForm();
        }
    });
}

async function handleProfileUpdate(event) {
    event.preventDefault();
    
    if (!currentUser) return;
    
    try {
        showButtonLoading(event.target.querySelector('button[type="submit"]'));
        
        const formData = {
            name: profileForm.displayName.value,
            bio: profileForm.bio.value,
            phone: profileForm.phone.value,
            updatedAt: new Date()
        };
        
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, formData);
        
        if (userNameElement) {
            animateTextChange(userNameElement, formData.name);
        }

        showMessage('Profile updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating profile:', error);
        showMessage('Error updating profile', 'error');
    } finally {
        hideButtonLoading(event.target.querySelector('button[type="submit"]'));
    }
}

async function handleProposalSubmit(event) {
    event.preventDefault();
    
    if (!currentUser) return;
    
    try {
        const submitButton = event.target.querySelector('button[type="submit"]');
        showButtonLoading(submitButton);
        
        const formData = {
            title: proposalForm.title.value,
            description: proposalForm.description.value,
            amount: parseFloat(proposalForm.amount.value),
            userId: currentUser.uid,
            status: 'pending',
            createdAt: new Date()
        };
        
        await addDoc(collection(db, 'proposals'), formData);
        proposalForm.reset();
        hideNewProposalForm();
        
        showMessage('Proposal submitted successfully!', 'success');
        await loadDashboardData(currentUser);
        
    } catch (error) {
        console.error('Error submitting proposal:', error);
        showMessage('Error submitting proposal', 'error');
    } finally {
        const submitButton = event.target.querySelector('button[type="submit"]');
        hideButtonLoading(submitButton);
    }
}
function showButtonLoading(button) {
    if (!button) return;
    
    button.disabled = true;
    button.style.opacity = '0.7';
    
    const originalContent = button.innerHTML;
    button.dataset.originalContent = originalContent;
    
    button.innerHTML = `
        <div class="button-loader">
            <div class="loader-ring"></div>
        </div>
        <span>Processing...</span>
    `;
}

function hideButtonLoading(button) {
    if (!button) return;
    
    button.disabled = false;
    button.style.opacity = '1';
    
    if (button.dataset.originalContent) {
        button.innerHTML = button.dataset.originalContent;
    }
}
function showMessage(message, type = 'info', duration = 5000) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `toast-message toast-${type}`;
    
    const iconMap = {
        success: 'check-circle',
        error: 'alert-circle',
        warning: 'alert-triangle',
        info: 'info'
    };
    
    messageContainer.innerHTML = `
        <div class="toast-content">
            <i data-lucide="${iconMap[type]}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i data-lucide="x"></i>
        </button>
    `;

    if (!document.getElementById('toast-styles')) {
        const toastStyles = document.createElement('style');
        toastStyles.id = 'toast-styles';
        toastStyles.textContent = `
            .toast-message {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: var(--glass-strong);
                backdrop-filter: blur(20px);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-lg);
                padding: var(--space-lg);
                color: var(--text-primary);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: var(--space-md);
                min-width: 300px;
                box-shadow: var(--shadow-strong);
                animation: slideInRight 0.3s ease-out;
                transform-origin: right center;
            }
            
            .toast-success { border-left: 4px solid #22c55e; }
            .toast-error { border-left: 4px solid #ef4444; }
            .toast-warning { border-left: 4px solid #f59e0b; }
            .toast-info { border-left: 4px solid #3b82f6; }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                flex: 1;
            }
            
            .toast-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: var(--space-xs);
                border-radius: var(--radius-sm);
                transition: var(--transition-fast);
            }
            
            .toast-close:hover {
                background: var(--hover-bg);
                color: var(--text-primary);
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                }
            }
        `;
        document.head.appendChild(toastStyles);
    }
    
    document.body.appendChild(messageContainer);
    window.lucide.createIcons();
    setTimeout(() => {
        messageContainer.style.animation = 'slideInRight 0.3s ease-in reverse';
        setTimeout(() => {
            messageContainer.remove();
        }, 300);
    }, duration);
}

function formatDate(timestamp) {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

window.viewProposal = function(proposalId) {
    showMessage('Proposal viewer coming soon!', 'info');
};

window.contactUser = function(userId) {
    showMessage('Messaging system coming soon!', 'info');
};

window.handleLogout = async function () {
    try {
        showLoadingState();    
        await auth.signOut();
        localStorage.clear();
        document.body.style.opacity = '0';
        document.body.style.transform = 'scale(0.95)';  
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    } catch (error) {
        console.error('Logout failed:', error);
        hideLoadingState();
        showMessage('Logout failed', 'error');
    }
};

function initPerformanceMonitoring() {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Dashboard loaded in ${Math.round(loadTime)}ms`);
    });
    if ('memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                console.warn('High memory usage detected');
            }
        }, 30000);
    }
}

window.hideNewProposalForm = () => {
    const modal = document.getElementById('new-proposal-form');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
};


document.addEventListener('DOMContentLoaded', () => {
    initPerformanceMonitoring();
    window.lucide.createIcons();
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .animate-entrance {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-in {
            animation: fadeInScale 0.5s ease-out forwards;
        }
        
        .animate-slide-in {
            animation: slideInLeft 0.5s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        /* Button loader styles */
        .button-loader {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 8px;
        }
        
        .loader-ring {
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(animationStyles);
});