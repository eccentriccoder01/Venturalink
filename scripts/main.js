const firebaseConfig = {
  apiKey: "AIzaSyA37bruIT_neT5w-8CUuPGofy0Lnv2UJOg",
  authDomain: "project-1-747ec.firebaseapp.com",
  projectId: "project-1-747ec",
  storageBucket: "project-1-747ec.firebasestorage.app",
  messagingSenderId: "122686135785",
  appId: "1:122686135785:web:7e159363045f52208cbf78",
  measurementId: "G-1GT8XMMFM3"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const mainNav = document.getElementById('main-nav');
const navLinks = document.querySelector('.nav-links');
const menuToggle = document.querySelector('.menu-toggle');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
    document.querySelectorAll('.nav-link').forEach((link, index) => {
        if (navLinks.classList.contains('active')) {
            link.style.setProperty('--delay', `${index * 0.1}s`);
        } else {
            link.style.removeProperty('--delay');
        }
    });
});

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
    const userType = localStorage.getItem('userType');
    navLinks.innerHTML = '';
    navLinks.innerHTML += `
        <a href="/" class="nav-link">Home</a>
        <a href="/dashboard.html" class="nav-link">Dashboard</a>
    `;
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
    }

    navLinks.innerHTML += `
        <a href="#" class="nav-link" id="logout-link">Logout</a>
    `;

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

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(alertDiv, main.firstChild);
    } else {
        document.body.insertBefore(alertDiv, document.body.firstChild);
    }
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

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
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showAlert(error.message, 'error');
        }
    }
});

async function handleLogin(formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
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

async function handleRegistration(formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    const userType = formData.get('userType'); 
    const name = formData.get('name');
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        await db.collection('users').doc(user.uid).set({
            name,
            email,
            userType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        localStorage.setItem('userType', userType);
        showAlert('Registration successful! Redirecting to dashboard...', 'success');
        setTimeout(() => {
            window.location.href = '/dashboard';
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
function init() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1'; 
    }
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view'); 
                observer.unobserve(entry.target);
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

document.addEventListener('DOMContentLoaded', init);