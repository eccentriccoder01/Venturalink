// Import Firebase services
import { auth, db } from './firebase.js';
import { getCurrentUser } from './auth.js';

// Get proposal form and debug elements
const proposalForm = document.getElementById('proposal-form');
const debugInfo = document.getElementById('debug-info');
const userStatus = document.getElementById('user-status');
const userType = document.getElementById('user-type');

// Form navigation elements
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const progressFill = document.getElementById('progress-fill');
const currentSectionSpan = document.querySelector('.current-section');

// Form state
let currentSection = 1;
const totalSections = 4;

// Global logout function
window.logout = async function() {
    try {
        await firebase.auth().signOut();
        window.location.href = './index.html';
    } catch (error) {
        console.error('Error signing out:', error);
        showAlert('Error signing out. Please try again.', 'error');
    }
};

// Enhanced alert function with animations
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                ${type === 'success' ? 
                    '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>' :
                type === 'error' ?
                    '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>' :
                    '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>'
                }
            </svg>
            <span>${message}</span>
        </div>
    `;

    // Insert alert at the top of the form
    proposalForm.insertBefore(alertDiv, proposalForm.firstChild);

    // Auto-remove alert after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.style.opacity = '0';
            alertDiv.style.transform = 'translateY(-20px)';
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, 5000);
}

// Function to update debug info with enhanced styling
function updateDebugInfo(status, type) {
    if (debugInfo) {
        debugInfo.style.display = 'block';
        userStatus.textContent = status;
        userType.textContent = type || 'Not set';
        
        // Add status indicator colors
        const statusItem = userStatus.parentElement;
        const typeItem = userType.parentElement;
        
        statusItem.style.background = status === 'Logged in' ? 
            'rgba(67, 233, 123, 0.1)' : 'rgba(255, 107, 107, 0.1)';
        
        typeItem.style.background = type === 'business' ? 
            'rgba(67, 233, 123, 0.1)' : 'rgba(255, 193, 7, 0.1)';
    }
}

// Form navigation functions
function updateFormNavigation() {
    // Update progress bar
    const progressPercentage = (currentSection / totalSections) * 100;
    progressFill.style.width = `${progressPercentage}%`;
    
    // Update section indicator
    currentSectionSpan.textContent = currentSection;
    
    // Update progress steps
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 <= currentSection);
    });
    
    // Update button states
    prevBtn.disabled = currentSection === 1;
    
    if (currentSection === totalSections) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'flex';
    } else {
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
    }
    
    // Update form sections
    document.querySelectorAll('.form-section').forEach((section, index) => {
        section.classList.toggle('active', index + 1 === currentSection);
    });
}

function nextSection() {
    if (currentSection < totalSections && validateCurrentSection()) {
        currentSection++;
        updateFormNavigation();
        
        // Smooth scroll to top of form
        document.querySelector('.proposal-box').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

function prevSection() {
    if (currentSection > 1) {
        currentSection--;
        updateFormNavigation();
        
        // Smooth scroll to top of form
        document.querySelector('.proposal-box').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// Form validation for current section
function validateCurrentSection() {
    const activeSection = document.querySelector(`.form-section[data-section="${currentSection}"]`);
    const requiredFields = activeSection.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            // Add error styling
            field.style.borderColor = '#ff6b6b';
            field.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.2)';
            
            // Remove error styling after user starts typing
            const removeError = () => {
                field.style.borderColor = '';
                field.style.boxShadow = '';
                field.removeEventListener('input', removeError);
            };
            field.addEventListener('input', removeError);
        }
    });
    
    if (!isValid) {
        showAlert('Please fill in all required fields before proceeding.', 'error');
    }
    
    return isValid;
}

// Character counter functionality
function setupCharacterCounters() {
    const counters = document.querySelectorAll('.char-counter');
    
    counters.forEach(counter => {
        const targetId = counter.getAttribute('data-target');
        const maxLength = parseInt(counter.getAttribute('data-max'));
        const targetField = document.getElementById(targetId);
        
        if (targetField) {
            const updateCounter = () => {
                const currentLength = targetField.value.length;
                counter.textContent = `${currentLength}/${maxLength}`;
                
                // Update counter styling based on length
                counter.classList.remove('warning', 'danger');
                if (currentLength > maxLength * 0.8) {
                    counter.classList.add('warning');
                }
                if (currentLength > maxLength * 0.95) {
                    counter.classList.add('danger');
                }
            };
            
            targetField.addEventListener('input', updateCounter);
            updateCounter(); // Initialize counter
        }
    });
}

// Enhanced form submission with loading states
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

    // Show loading state
    const originalSubmitText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
            <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6z"/>
        </svg>
        Submitting...
    `;
    submitBtn.disabled = true;

    // Get form values with enhanced validation
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
        
        // Show success message with celebration animation
        showAlert('🎉 Proposal submitted successfully! Redirecting...', 'success');
        
        // Add success animation to submit button
        submitBtn.innerHTML = `
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Success!
        `;
        submitBtn.style.background = 'var(--gradient-success)';
        
        // Reset form with animation
        setTimeout(() => {
            proposalForm.reset();
            setupCharacterCounters(); // Reset counters
        }, 1000);
        
        // Redirect to proposals page after 3 seconds
        setTimeout(() => {
            window.location.href = './proposals.html';
        }, 3000);

    } catch (error) {
        console.error('Error submitting proposal:', error);
        showAlert('❌ Error submitting proposal. Please try again.', 'error');
        
        // Reset submit button
        submitBtn.innerHTML = originalSubmitText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
    }
}

// Save draft functionality
async function saveDraft() {
    const user = getCurrentUser();
    if (!user) {
        showAlert('You must be logged in to save drafts', 'error');
        return;
    }

    const draftData = {
        title: proposalForm.title.value.trim(),
        category: proposalForm.category.value,
        description: proposalForm.description.value.trim(),
        problem: proposalForm.problem.value.trim(),
        solution: proposalForm.solution.value.trim(),
        amount: proposalForm.amount.value ? parseFloat(proposalForm.amount.value) : null,
        equity: proposalForm.equity.value ? parseFloat(proposalForm.equity.value) : null,
        useOfFunds: proposalForm.useOfFunds.value.trim(),
        marketSize: proposalForm.marketSize.value.trim(),
        competitors: proposalForm.competitors.value.trim(),
        timeline: proposalForm.timeline.value.trim(),
        userId: user.uid,
        status: 'draft',
        lastSaved: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        // Save or update draft
        const draftRef = firebase.firestore().collection('drafts').doc(user.uid);
        await draftRef.set(draftData);
        
        showAlert('💾 Draft saved successfully!', 'success');
        
        // Add visual feedback to save button
        const saveDraftBtn = document.querySelector('.save-draft');
        const originalText = saveDraftBtn.innerHTML;
        saveDraftBtn.innerHTML = `
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Saved!
        `;
        
        setTimeout(() => {
            saveDraftBtn.innerHTML = originalText;
        }, 2000);
        
    } catch (error) {
        console.error('Error saving draft:', error);
        showAlert('Error saving draft. Please try again.', 'error');
    }
}

// Load draft functionality
async function loadDraft() {
    const user = getCurrentUser();
    if (!user) return;

    try {
        const draftRef = firebase.firestore().collection('drafts').doc(user.uid);
        const draftDoc = await draftRef.get();
        
        if (draftDoc.exists) {
            const draftData = draftDoc.data();
            
            // Populate form fields
            Object.keys(draftData).forEach(key => {
                const field = proposalForm[key];
                if (field && draftData[key]) {
                    field.value = draftData[key];
                }
            });
            
            // Update character counters
            setupCharacterCounters();
            
            showAlert('📄 Draft loaded successfully!', 'info');
        }
    } catch (error) {
        console.error('Error loading draft:', error);
    }
}

// Enhanced form interactions
function setupFormInteractions() {
    // Add floating label animations
    const floatingLabels = document.querySelectorAll('.floating-label input, .floating-label textarea');
    
    floatingLabels.forEach(input => {
        // Handle autofill detection
        const checkAutofill = () => {
            if (input.matches(':-webkit-autofill') || input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        };
        
        input.addEventListener('input', checkAutofill);
        input.addEventListener('blur', checkAutofill);
        input.addEventListener('focus', checkAutofill);
        
        // Initial check
        setTimeout(checkAutofill, 100);
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.nav-btn, .action-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            // Add ripple styles
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add CSS for ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(rippleStyle);

// Event listeners setup
function setupEventListeners() {
    // Form navigation
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSection);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSection);
    }
    
    // Form submission
    if (proposalForm) {
        proposalForm.addEventListener('submit', handleProposalSubmit);
    }
    
    // Action buttons
    const saveDraftBtn = document.querySelector('.save-draft');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', saveDraft);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    saveDraft();
                    break;
                case 'Enter':
                    if (e.shiftKey) {
                        e.preventDefault();
                        if (currentSection < totalSections) {
                            nextSection();
                        } else {
                            proposalForm.dispatchEvent(new Event('submit'));
                        }
                    }
                    break;
            }
        }
        
        // Arrow key navigation
        if (e.altKey) {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (currentSection > 1) prevSection();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (currentSection < totalSections) nextSection();
                    break;
            }
        }
    });
}

// Function to handle logout with enhanced UX
async function handleLogout() {
    try {
        // Show confirmation if form has data
        const hasData = Array.from(proposalForm.elements).some(element => 
            element.value && element.value.trim() !== ''
        );
        
        if (hasData) {
            const confirmLogout = confirm('You have unsaved changes. Do you want to save as draft before logging out?');
            if (confirmLogout) {
                await saveDraft();
            }
        }
        
        await firebase.auth().signOut();
        showAlert('Successfully logged out. Redirecting...', 'success');
        
        setTimeout(() => {
            window.location.href = './index.html';
        }, 1500);
        
    } catch (error) {
        console.error('Logout error:', error);
        showAlert('Error signing out', 'error');
    }
}

// Currency validation function for handling formatted amounts (₹3,00,000, etc.)
function setupCurrencyValidation() {
    const amountField = document.getElementById('amount');
    
    if (!amountField) return;
    
    // Real-time validation and formatting
    amountField.addEventListener('input', function(e) {
        let value = e.target.value;
        
        // Remove all non-numeric characters except comma and dot
        let numericValue = value.replace(/[^\d,.]/g, '');
        
        // Update the field with cleaned value
        e.target.value = numericValue;
        
        // Validate: ensure it's a valid number
        if (numericValue && isNaN(numericValue.replace(/,/g, ''))) {
            e.target.style.borderColor = '#ff6b6b';
        } else {
            e.target.style.borderColor = '';
        }
    });
    
    // Validation on blur and form submission
    const validateAmount = () => {
        const value = amountField.value.trim();
        
        if (!value) return true; // Allow empty if not required by section
        
        // Remove commas and convert to number
        const numericValue = parseFloat(value.replace(/,/g, ''));
        
        if (isNaN(numericValue) || numericValue < 1000) {
            amountField.style.borderColor = '#ff6b6b';
            amountField.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.2)';
            showAlert('Please enter a valid amount (minimum ₹1000)', 'error');
            return false;
        }
        
        amountField.style.borderColor = '';
        amountField.style.boxShadow = '';
        return true;
    };
    
    amountField.addEventListener('blur', validateAmount);
    
    // Override form submission to validate amount
    const originalValidate = validateCurrentSection;
    window.validateCurrentSection = function() {
        const result = originalValidate.call(this);
        
        // Check if we're on section 3 (Investment section)
        if (currentSection === 3) {
            return result && validateAmount();
        }
        
        return result;
    };
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupFormInteractions();
    setupCharacterCounters();
    setupCurrencyValidation();
    updateFormNavigation();
    
    // Load draft if available
    setTimeout(loadDraft, 1000);
});

// Authentication state management
auth.onAuthStateChanged(async (user) => {
    console.log('Auth state changed:', user ? 'User logged in' : 'No user');
    
    if (!user) {
        console.log('No user, redirecting to login');
        updateDebugInfo('Not logged in', 'None');
        
        // Add fade out animation before redirect
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            window.location.href = './login.html';
        }, 500);
        return;
    }

    try {
        // Get user type from database
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        console.log('User document:', userDoc.exists ? 'Found' : 'Not found');
        
        if (!userDoc.exists) {
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

        if (userData.userType !== 'business') {
            console.log('Not a business user');
            showAlert('⚠️ Only business users can submit proposals. Redirecting...', 'error');
            setTimeout(() => {
                window.location.href = './profile.html';
            }, 3000);
        } else {
            // Show welcome message for business users
            setTimeout(() => {
                showAlert('✨ Welcome! Ready to share your innovative business idea?', 'info');
            }, 1000);
        }
    } catch (error) {
        console.error('Error checking user type:', error);
        updateDebugInfo('Error', 'Error checking type');
        showAlert('Error checking user permissions. Please refresh the page.', 'error');
    }
});

// ===========================
// Select Dropdown Keyboard Navigation Enhancement
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    const customSelects = document.querySelectorAll('.custom-select select');
    
    customSelects.forEach(select => {
        // Improve keyboard navigation for accessibility
        select.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const options = Array.from(select.options);
                const currentIndex = select.selectedIndex;
                
                if (e.key === 'ArrowDown' && currentIndex < options.length - 1) {
                    select.selectedIndex = currentIndex + 1;
                } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                    select.selectedIndex = currentIndex - 1;
                }
                
                // Trigger change event
                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        
        // Add visual feedback on focus
        select.addEventListener('focus', () => {
            const parent = select.closest('.custom-select');
            if (parent) {
                parent.style.borderColor = 'var(--text-accent)';
            }
        });
        
        select.addEventListener('blur', () => {
            const parent = select.closest('.custom-select');
            if (parent) {
                parent.style.borderColor = '';
            }
        });
    });
});
