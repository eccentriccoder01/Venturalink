const firebaseConfig = {
  apiKey: "AIzaSyA37bruIT_neT5w-8CUuPGofy0Lnv2UJOg",
  authDomain: "project-1-747ec.firebaseapp.com",
  projectId: "project-1-747ec",
  storageBucket: "project-1-747ec.firebasestorage.app",
  messagingSenderId: "122686135785",
  appId: "1:122686135785:web:7e159363045f52208cbf78",
  measurementId: "G-1GT8XMMFM3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const mainNav = document.getElementById('main-nav');
const navLinks = document.querySelector('.nav-links');
const menuToggle = document.querySelector('.menu-toggle');

// Event listener for mobile menu toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
    // Apply animation delay to nav links
    document.querySelectorAll('.nav-link').forEach((link, index) => {
        if (navLinks.classList.contains('active')) {
            link.style.setProperty('--delay', `${index * 0.1}s`);
        } else {
            link.style.removeProperty('--delay');
        }
    });
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

auth.onAuthStateChanged((user) => {
    if (user) {
        updateNavigationForLoggedInUser(user);

        const ctaInvestor = document.querySelector('.cta-buttons .btn-primary');
        const ctaEntrepreneur = document.querySelector('.cta-buttons .btn-secondary');

        const userType = localStorage.getItem('userType');
        if (ctaInvestor && ctaEntrepreneur && userType) {
            if (userType === 'investor') {
                ctaInvestor.href = '/proposals.html';
                ctaEntrepreneur.href = '/proposals.html';
            } else if (userType === 'business') {
                ctaInvestor.href = '/create-proposal.html';
                ctaEntrepreneur.href = '/create-proposal.html';
            } else {
                ctaInvestor.href = '/dashboard.html';
                ctaEntrepreneur.href = '/dashboard.html';
            }
        }
    } else {
        updateNavigationForLoggedOutUser();
    }
});

// Update navigation based on auth state
function updateNavigationForLoggedInUser(user) {
    const userType = localStorage.getItem('userType'); // 'investor', 'business', or 'advisor'
    
    // Clear existing navigation
    navLinks.innerHTML = '';
    
    // Add common links
    navLinks.innerHTML += `
        <a href="/" class="nav-link">Home</a>
        <a href="${getDashboardRoute(userType)}" class="nav-link">Dashboard</a>
    `;
    
    function getDashboardRoute(userType) {
        if (userType === 'investor') return '/proposals.html';
        if (userType === 'business') return '/create-proposal.html';
        return '/dashboard.html';
    }

    // Add role-specific links
    switch(userType) {
        case 'investor':
            navLinks.innerHTML += `
                <a href="/investments" class="nav-link">My Investments</a>
                <a href="/proposals" class="nav-link">View Proposals</a>
            `;
            break;
        case 'business':
            navLinks.innerHTML += `
                <a href="/proposals" class="nav-link">My Proposals</a>
                <a href="/create-proposal" class="nav-link">Create Proposal</a>
            `;
            break;
        case 'advisor':
            navLinks.innerHTML += `
                <a href="/queries" class="nav-link">View Queries</a>
                <a href="/post-advice" class="nav-link">Post Advice</a>
            `;
            break;
    }
    
    // Add logout link
    navLinks.innerHTML += `
        <a href="#" class="nav-link" id="logout-link">Logout</a>
    `;
    
    // Add logout event listener
    document.getElementById('logout-link').addEventListener('click', handleLogout);
}

function updateNavigationForLoggedOutUser() {
    navLinks.innerHTML = `
        <a href="/" class="nav-link">Home</a>
        <a href="/about" class="nav-link">About</a>
        <a href="/login" class="nav-link">Login</a>
        <a href="/register" class="nav-link">Register</a>
    `;
}

// Handle logout
async function handleLogout(e) {
    e.preventDefault();
    try {
        await auth.signOut();
        localStorage.removeItem('userType');
        window.location.href = '/';
    } catch (error) {
        console.error('Error signing out:', error);
        showAlert('Error signing out. Please try again.', 'error');
    }
}

// Utility function to show alerts
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Insert alert at the top of the main content, before any existing content
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(alertDiv, main.firstChild);
    } else {
        document.body.insertBefore(alertDiv, document.body.firstChild);
    }
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Handle form submissions
document.addEventListener('submit', async (e) => {
    if (e.target.matches('form')) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const formType = e.target.dataset.formType;
        
        try {
            switch(formType) {
                case 'login':
                    await handleLogin(formData);
                    break;
                case 'register':
                    await handleRegistration(formData);
                    break;
                case 'proposal':
                    await handleProposalSubmission(formData);
                    break;
                // Add more form handlers as needed
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showAlert(error.message, 'error');
        }
    }
});

// Login handler
async function handleLogin(formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Get user type from Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            const userType = userDoc.data().userType;
            localStorage.setItem('userType', userType);

            if (userType === 'investor') {
                window.location.href = '/proposals.html';
            } else if (userType === 'business') {
                window.location.href = '/create-proposal.html';
            } else {
                window.location.href = '/dashboard.html';
            }
        } else {
            throw new Error('User profile not found. Please complete registration.');
        }
    } catch (error) {
        throw new Error('Invalid email or password. Please try again.');
    }
}

// Registration handler
async function handleRegistration(formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    const userType = formData.get('userType'); // Ensure your registration form has a 'userType' input
    const name = formData.get('name'); // Ensure your registration form has a 'name' input
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Create user profile in Firestore
        await db.collection('users').doc(user.uid).set({
            name,
            email,
            userType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        localStorage.setItem('userType', userType);
        showAlert('Registration successful! Redirecting to dashboard...', 'success');
        setTimeout(() => {
            window.location.href = '/dashboard'; // Redirect to dashboard or appropriate page
        }, 1500);
    } catch (error) {
        console.error("Registration error:", error.code, error.message);
        let errorMessage = 'Registration failed. Please try again.';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email format.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password should be at least 6 characters.';
        }
        throw new Error(errorMessage);
    }
}

// Proposal submission handler (example - assuming this form exists on another page)
async function handleProposalSubmission(formData) {
    const title = formData.get('title');
    const description = formData.get('description');
    const amount = formData.get('amount');
    const category = formData.get('category');
    
    const user = auth.currentUser;
    if (!user) {
        throw new Error('You must be logged in to submit a proposal.');
    }
    
    try {
        await db.collection('proposals').add({
            title,
            description,
            amount: parseFloat(amount),
            category,
            userId: user.uid,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showAlert('Proposal submitted successfully!', 'success');
    } catch (error) {
        console.error("Proposal submission error:", error);
        throw new Error('Failed to submit proposal. Please ensure all fields are correct.');
    }
}

// Initialize the application with element animations
function init() {
    // Apply fade-in animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1'; // CSS animation handles transform
    }

    // Intersection Observer for feature cards and other sections
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view'); // Add a class to trigger CSS animation
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    };

    const sectionsToAnimate = document.querySelectorAll('.animate-slide-up, .animate-fade-in');
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionsToAnimate.forEach(section => {
        observer.observe(section);
    });

    // Handle scroll for header shadow
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    console.log('Application initialized with enhanced UI features.');
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);