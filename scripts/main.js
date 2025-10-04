// ===========================================
// Back to Top Button Logic (Rocket Launch)
// ===========================================
document.addEventListener('DOMContentLoaded', function () {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (!backToTopBtn) return;

    // Add random offset to smoke puffs
    const smokePuffs = backToTopBtn.querySelectorAll('.smoke');
    smokePuffs.forEach(smoke => {
        const randomX = (Math.random() - 0.5) * 30;
        smoke.style.setProperty('--random-x', `${randomX}px`);
    });

    // Show button when scrolled down
    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    // Smooth scroll + launch animation
    backToTopBtn.addEventListener('click', function () {
        // Prevent launching if already in flight
        if (backToTopBtn.classList.contains('launching')) {
            return;
        }

        // Add launch animation class
        backToTopBtn.classList.add('launching');

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Remove class and reset after animation ends
        setTimeout(() => {
            backToTopBtn.classList.remove('launching');
            // Randomize smoke positions for next launch
            smokePuffs.forEach(smoke => {
                const randomX = (Math.random() - 0.5) * 30;
                smoke.style.setProperty('--random-x', `${randomX}px`);
            });
        }, 1500);
    });
});

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

// =========================================
// ULTRA PREMIUM UI ENHANCEMENTS
// =========================================

class PremiumUIController {
    constructor() {
        this.cursorFollower = null;
        this.mousePos = { x: 0, y: 0 };
        this.lastMousePos = { x: 0, y: 0 };
        this.isMouseMoving = false;
        this.mouseStopTimeout = null;
        this.magneticElements = [];
        this.parallaxElements = [];
        this.scrollProgress = 0;
        this.isScrolling = false;
        this.lastScrollTime = 0;
        this.initializeEnhancements();
    }

    initializeEnhancements() {
        this.setupAdvancedCursor();
        this.setupMagneticElements();
        this.setupScrollEnhancements();
        this.setupParallaxEffects();
        this.setupTextAnimations();
        this.setupButtonEnhancements();
        this.setupCardInteractions();
        this.setupLoadingAnimations();
        this.setupScrollTriggerAnimations();
        this.setupSoundEffects();
        this.setupMicroInteractions();
        this.setupAdvancedTransitions();
    }

    // Advanced Cursor System
    setupAdvancedCursor() {
        this.cursorFollower = document.querySelector('.cursor-follower');
        if (!this.cursorFollower) return;

        // Create multiple cursor elements for advanced effects
        const cursorTrail = document.createElement('div');
        cursorTrail.className = 'cursor-trail';
        document.body.appendChild(cursorTrail);

        const cursorGlow = document.createElement('div');
        cursorGlow.className = 'cursor-glow';
        document.body.appendChild(cursorGlow);

        // Add cursor styles
        const cursorStyles = `
            .cursor-follower {
                width: 12px;
                height: 12px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
                transition: transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                opacity: 0;
            }

            .cursor-trail {
                width: 6px;
                height: 6px;
                background: rgba(102, 126, 234, 0.3);
                border-radius: 50%;
                position: fixed;
                pointer-events: none;
                z-index: 9998;
                transition: all 0.15s ease;
                opacity: 0;
            }

            .cursor-glow {
                width: 40px;
                height: 40px;
                background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
                border-radius: 50%;
                position: fixed;
                pointer-events: none;
                z-index: 9997;
                transition: all 0.2s ease;
                opacity: 0;
            }

            .cursor-hover {
                transform: scale(2) !important;
                background: linear-gradient(135deg, #f093fb, #f5576c) !important;
            }

            .cursor-click {
                transform: scale(0.8) !important;
            }

            .cursor-text {
                transform: scale(0.3) !important;
                background: #ffffff !important;
                mix-blend-mode: difference;
            }

            @media (pointer: coarse) {
                .cursor-follower,
                .cursor-trail,
                .cursor-glow {
                    display: none;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = cursorStyles;
        document.head.appendChild(styleSheet);

        // Mouse tracking with advanced interpolation
        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;
        let trailX = 0, trailY = 0;
        let glowX = 0, glowY = 0;

        const updateCursor = () => {
            // Smooth interpolation for main cursor
            currentX += (targetX - currentX) * 0.15;
            currentY += (targetY - currentY) * 0.15;

            // Delayed interpolation for trail
            trailX += (currentX - trailX) * 0.08;
            trailY += (currentY - trailY) * 0.08;

            // Slower interpolation for glow
            glowX += (currentX - glowX) * 0.05;
            glowY += (currentY - glowY) * 0.05;

            this.cursorFollower.style.transform = `translate3d(${currentX - 6}px, ${currentY - 6}px, 0)`;
            cursorTrail.style.transform = `translate3d(${trailX - 3}px, ${trailY - 3}px, 0)`;
            cursorGlow.style.transform = `translate3d(${glowX - 20}px, ${glowY - 20}px, 0)`;

            requestAnimationFrame(updateCursor);
        };

        document.addEventListener('mousemove', (e) => {
                const loader = document.createElement('div');
                loader.className = 'page-loader';
                loader.innerHTML = `
                    <div class="loader-content">
                        <div class="loader-logo">
                            <svg viewBox="0 0 40 40" width="60" height="60">
                                <path d="M20 4L36 12V28L20 36L4 28V12L20 4Z" stroke="url(#loader-gradient)" stroke-width="2" fill="none"/>
                                <circle cx="20" cy="20" r="6" fill="url(#loader-gradient)"/>
                                <defs>
                                    <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style="stop-color:#667eea"/>
                                        <stop offset="100%" style="stop-color:#764ba2"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div class="loader-text">Venturalink</div>
                        <div class="loader-progress">
                            <div class="loader-bar"></div>
                        </div>
                    </div>
                `;
                loader.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: #0a0a0f;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    opacity: 1;
                    transition: opacity 0.5s ease;
                `;

                const loaderStyles = `
                    .loader-content {
                        text-align: center;
                    }

                    .loader-logo {
                        margin-bottom: 2rem;
                        animation: logoSpin 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
                    }

                    .loader-text {
                        font-family: 'Space Grotesk', sans-serif;
                        font-size: 2rem;
                        font-weight: 700;
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-bottom: 2rem;
                        animation: textGlow 2s ease-in-out infinite alternate;
                    }

                    .loader-progress {
                        width: 200px;
                        height: 4px;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 2px;
                        overflow: hidden;
                        margin: 0 auto;
                    }

                    .loader-bar {
                        height: 100%;
                        background: linear-gradient(90deg, #667eea, #764ba2);
                        width: 0%;
                        border-radius: 2px;
                        animation: loaderProgress 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                    }

                    @keyframes logoSpin {
                        0%, 100% { transform: rotate(0deg) scale(1); }
                        50% { transform: rotate(180deg) scale(1.1); }
                    }

                    @keyframes textGlow {
                        0% { filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5)); }
                        100% { filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.8)); }
                    }

                    @keyframes loaderProgress {
                        to { width: 100%; }
                    }
                `;

                const loaderStyleSheet = document.createElement('style');
                loaderStyleSheet.textContent = loaderStyles;
                document.head.appendChild(loaderStyleSheet);

                document.body.appendChild(loader);

                // Remove loader after animation and show main content
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.remove();
                        // Show main content after loader hides
                        const mainContent = document.querySelector('main');
                        if (mainContent) {
                            mainContent.style.opacity = '1';
                            mainContent.style.pointerEvents = 'auto';
                        }
                    }, 500);
                }, 2500);
            
            this.isScrolling = true;
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, 150);
        });

        // Create scroll progress indicator
        const scrollProgress = document.createElement('div');
        scrollProgress.className = 'scroll-progress';
        scrollProgress.innerHTML = `
            <div class="scroll-progress-bar"></div>
            <div class="scroll-progress-circle">
                <svg width="50" height="50">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(102, 126, 234, 0.2)" stroke-width="2"/>
                    <circle cx="25" cy="25" r="20" fill="none" stroke="url(#scroll-gradient)" stroke-width="2" 
                            stroke-dasharray="125.6" stroke-dashoffset="125.6" class="progress-circle"/>
                    <defs>
                        <linearGradient id="scroll-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#667eea"/>
                            <stop offset="100%" style="stop-color:#764ba2"/>
                        </linearGradient>
                    </defs>
                </svg>
                <span class="scroll-percentage">0%</span>
            </div>
        `;
        document.body.appendChild(scrollProgress);

        // Add scroll progress styles
        const scrollStyles = `
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                z-index: 9996;
                pointer-events: none;
            }

            .scroll-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                width: 0%;
                transition: width 0.1s ease;
                box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
            }

            .scroll-progress-circle {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: rgba(10, 10, 15, 0.8);
                border-radius: 50%;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                opacity: 0;
                transform: translateY(20px);
            }

            .scroll-progress-circle.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .scroll-progress-circle:hover {
                transform: scale(1.1);
                box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
            }

            .progress-circle {
                transition: stroke-dashoffset 0.1s ease;
                transform-origin: center;
                transform: rotate(-90deg);
            }

            .scroll-percentage {
                position: absolute;
                font-size: 10px;
                font-weight: 600;
                color: #667eea;
            }
        `;

        const scrollStyleSheet = document.createElement('style');
        scrollStyleSheet.textContent = scrollStyles;
        document.head.appendChild(scrollStyleSheet);

        // Scroll to top functionality
        scrollProgress.querySelector('.scroll-progress-circle').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    updateScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress-bar');
        const progressCircle = document.querySelector('.progress-circle');
        const progressPercentage = document.querySelector('.scroll-percentage');
        const progressContainer = document.querySelector('.scroll-progress-circle');
        
        if (progressBar && progressCircle && progressPercentage) {
            const progress = this.scrollProgress * 100;
            const circumference = 125.6;
            const offset = circumference - (progress / 100) * circumference;
            
            progressBar.style.width = `${progress}%`;
            progressCircle.style.strokeDashoffset = offset;
            progressPercentage.textContent = `${Math.round(progress)}%`;
            
            if (progress > 10) {
                progressContainer.classList.add('visible');
            } else {
                progressContainer.classList.remove('visible');
            }
        }
    }

    updateParallax() {
        this.parallaxElements.forEach(el => {
            const speed = el.dataset.parallaxSpeed || 0.5;
            const yPos = -(window.pageYOffset * speed);
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    updateHeaderEffects() {
        const header = document.querySelector('.main-header');
        if (header) {
            const scrolled = window.pageYOffset > 50;
            header.classList.toggle('scrolled', scrolled);
            
            // Add blur effect based on scroll speed
            const scrollSpeed = Math.abs(window.pageYOffset - (this.lastScrollY || 0));
            this.lastScrollY = window.pageYOffset;
            
            if (scrollSpeed > 10) {
                header.style.backdropFilter = 'blur(25px)';
            } else {
                header.style.backdropFilter = 'blur(20px)';
            }
        }
    }

    // Parallax Effects Setup
    setupParallaxEffects() {
        this.parallaxElements = document.querySelectorAll('.floating-shape, .bg-orb');
        
        // Add parallax data attributes
        this.parallaxElements.forEach((el, index) => {
            el.dataset.parallaxSpeed = (0.2 + index * 0.1).toString();
        });
    }

    // Advanced Text Animations
    setupTextAnimations() {
        // Split text animation for hero title
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            this.createSplitTextAnimation(heroTitle);
        }

        // Typewriter effect for descriptions
        const descriptions = document.querySelectorAll('.hero-subtext, .section-subtitle');
        descriptions.forEach(desc => {
            this.createTypewriterEffect(desc);
        });

        // Morphing text effects
        this.setupMorphingText();
    }

    createSplitTextAnimation(element) {
        const text = element.textContent;
        element.innerHTML = '';
        
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.cssText = `
                display: inline-block;
                opacity: 0;
                transform: translateY(50px) rotateX(90deg);
                animation: charReveal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                animation-delay: ${index * 0.03}s;
            `;
            element.appendChild(span);
        });

        const animationStyles = `
            @keyframes charReveal {
                to {
                    opacity: 1;
                    transform: translateY(0) rotateX(0);
                }
            }
        `;

        if (!document.querySelector('#char-reveal-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'char-reveal-styles';
            styleSheet.textContent = animationStyles;
            document.head.appendChild(styleSheet);
        }
    }

    createTypewriterEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid #667eea';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30 + Math.random() * 20);
            } else {
                // Remove cursor after typing
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        };

        // Start typewriter when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeWriter, 500);
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(element);
    }

    setupMorphingText() {
        const morphingElements = document.querySelectorAll('.gradient-text');
        
        morphingElements.forEach(el => {
            const originalText = el.textContent;
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            
            el.addEventListener('mouseenter', () => {
                let iteration = 0;
                const interval = setInterval(() => {
                    el.textContent = originalText
                        .split('')
                        .map((char, index) => {
                            if (index < iteration) return originalText[index];
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join('');
                    
                    if (iteration >= originalText.length) clearInterval(interval);
                    iteration += 1/3;
                }, 30);
            });
        });
    }

    // Enhanced Button Interactions
    setupButtonEnhancements() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(btn => {
            // Ripple effect
            btn.addEventListener('click', (e) => {
                this.createRippleEffect(e, btn);
            });

            // Particle explosion on hover
            btn.addEventListener('mouseenter', () => {
                this.createParticleExplosion(btn);
            });

            // 3D tilt effect
            btn.addEventListener('mousemove', (e) => {
                this.create3DTiltEffect(e, btn);
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            });
        });
    }

    createRippleEffect(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);

        const rippleStyles = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;

        if (!document.querySelector('#ripple-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'ripple-styles';
            styleSheet.textContent = rippleStyles;
            document.head.appendChild(styleSheet);
        }
    }

    createParticleExplosion(element) {
        const particleCount = 6;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 20 + Math.random() * 10;
            const x = Math.cos(angle) * velocity;
            const y = Math.sin(angle) * velocity;
            
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.transform = 'translate(-50%, -50%)';
            
            element.style.position = 'relative';
            element.appendChild(particle);
            
            particle.animate([
                { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`, opacity: 1, offset: 0.7 },
                { transform: `translate(calc(-50% + ${x * 1.5}px), calc(-50% + ${y * 1.5}px)) scale(0)`, opacity: 0 }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => particle.remove();
        }
    }

    create3DTiltEffect(e, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const rotateX = (e.clientY - centerY) / 10;
        const rotateY = (centerX - e.clientX) / 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    }

    // Advanced Card Interactions
    setupCardInteractions() {
        const cards = document.querySelectorAll('.feature-card');
        
        cards.forEach(card => {
            // Liquid morphing effect
            this.setupLiquidMorph(card);
            
            // Advanced hover states
            this.setupAdvancedHover(card);
            
            // Card flip interactions
            this.setupCardFlip(card);
        });
    }

    setupLiquidMorph(card) {
        const morphBg = document.createElement('div');
        morphBg.className = 'liquid-morph';
        morphBg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
            border-radius: inherit;
            opacity: 0;
            transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
            z-index: -1;
        `;
        
        card.style.position = 'relative';
        card.appendChild(morphBg);
        
        card.addEventListener('mouseenter', () => {
            morphBg.style.opacity = '1';
            morphBg.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            morphBg.style.opacity = '0';
            morphBg.style.transform = 'scale(1)';
        });
    }

    setupAdvancedHover(card) {
        const elements = card.querySelectorAll('.feature-icon, h3, .feature-list li');
        
        card.addEventListener('mouseenter', () => {
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.transform = 'translateX(10px)';
                    el.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }, index * 50);
            });
        });
        
        card.addEventListener('mouseleave', () => {
            elements.forEach(el => {
                el.style.transform = 'translateX(0)';
            });
        });
    }

    setupCardFlip(card) {
        let isFlipped = false;
        
        card.addEventListener('dblclick', () => {
            isFlipped = !isFlipped;
            const rotateY = isFlipped ? 180 : 0;
            
            card.style.transform = `rotateY(${rotateY}deg)`;
            card.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            // Add back face content
            if (isFlipped && !card.querySelector('.card-back')) {
                this.createCardBack(card);
            }
        });
    }

    createCardBack(card) {
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
            border-radius: inherit;
            padding: inherit;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotateY(180deg);
            backface-visibility: hidden;
        `;
        
        cardBack.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
                <h3 style="color: #667eea; margin-bottom: 1rem;">Premium Features</h3>
                <p style="color: rgba(255, 255, 255, 0.8);">
                    Advanced analytics, priority support, and exclusive access to new features.
                </p>
            </div>
        `;
        
        card.appendChild(cardBack);
        card.style.transformStyle = 'preserve-3d';
    }

    // Loading Animations
    setupLoadingAnimations() {
        // Page load animation
        window.addEventListener('load', () => {
            this.createPageLoadAnimation();
        });

        // Form loading states
        this.setupFormLoadingStates();
    }

    createPageLoadAnimation() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-logo">
                    <svg viewBox="0 0 40 40" width="60" height="60">
                        <path d="M20 4L36 12V28L20 36L4 28V12L20 4Z" stroke="url(#loader-gradient)" stroke-width="2" fill="none"/>
                        <circle cx="20" cy="20" r="6" fill="url(#loader-gradient)"/>
                        <defs>
                            <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#667eea"/>
                                <stop offset="100%" style="stop-color:#764ba2"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div class="loader-text">Venturalink</div>
                <div class="loader-progress">
                    <div class="loader-bar"></div>
                </div>
            </div>
        `;
        
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #0a0a0f;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 1;
            transition: opacity 0.5s ease;
        `;

        const loaderStyles = `
            .loader-content {
                text-align: center;
            }

            .loader-logo {
                margin-bottom: 2rem;
                animation: logoSpin 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
            }

            .loader-text {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 2rem;
                font-weight: 700;
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 2rem;
                animation: textGlow 2s ease-in-out infinite alternate;
            }

            .loader-progress {
                width: 200px;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
                margin: 0 auto;
            }

            .loader-bar {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                width: 0%;
                border-radius: 2px;
                animation: loaderProgress 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }

            @keyframes logoSpin {
                0%, 100% { transform: rotate(0deg) scale(1); }
                50% { transform: rotate(180deg) scale(1.1); }
            }

            @keyframes textGlow {
                0% { filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5)); }
                100% { filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.8)); }
            }

            @keyframes loaderProgress {
                to { width: 100%; }
            }
        `;

        const loaderStyleSheet = document.createElement('style');
        loaderStyleSheet.textContent = loaderStyles;
        document.head.appendChild(loaderStyleSheet);

        document.body.appendChild(loader);

        // Remove loader after animation
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 2500);
    }

    setupFormLoadingStates() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                if (submitBtn) {
                    this.createButtonLoadingState(submitBtn);
                }
            });
        });
    }

    createButtonLoadingState(button) {
        const originalText = button.textContent;
        const originalHTML = button.innerHTML;
        
        button.disabled = true;
        button.innerHTML = `
            <div class="loading-spinner"></div>
            <span>Processing...</span>
        `;
        
        const spinnerStyles = `
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: #ffffff;
                animation: spin 1s ease-in-out infinite;
                margin-right: 8px;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;

        if (!document.querySelector('#spinner-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'spinner-styles';
            styleSheet.textContent = spinnerStyles;
            document.head.appendChild(styleSheet);
        }

        // Restore button after form processing
        setTimeout(() => {
            button.disabled = false;
            button.innerHTML = originalHTML;
        }, 3000);
    }

    // Scroll Trigger Animations
    setupScrollTriggerAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerElementAnimation(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.feature-card, .section-header, .hero-stats, .footer-brand'
        );

        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`;
            observer.observe(el);
        });

        // Counter animation for stats
        this.setupCounterAnimations();
    }

    triggerElementAnimation(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        // Special animations for specific elements
        if (element.classList.contains('feature-card')) {
            setTimeout(() => {
                element.style.transform = 'translateY(0) scale(1)';
            }, 300);
        }
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(current).toLocaleString();
            
            // Add pulsing effect
            if (current === target) {
                element.style.animation = 'counterComplete 0.5s ease';
            }
        }, 16);

        const counterStyles = `
            @keyframes counterComplete {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;

        if (!document.querySelector('#counter-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'counter-styles';
            styleSheet.textContent = counterStyles;
            document.head.appendChild(styleSheet);
        }
    }

    // Sound Effects (Optional - can be muted)
    setupSoundEffects() {
        // Create audio context for sound effects
        this.audioContext = null;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio context not supported');
            return;
        }

        // Add subtle sound effects for interactions
        const buttons = document.querySelectorAll('.btn, .nav-link');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => this.playHoverSound());
            btn.addEventListener('click', () => this.playClickSound());
        });
    }

    playHoverSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    playClickSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.02, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    // Micro Interactions
    setupMicroInteractions() {
        // Input field enhancements
        this.setupInputEnhancements();
        
        // Logo animations
        this.setupLogoAnimations();
        
        // Navigation enhancements
        this.setupNavEnhancements();
        
        // Footer interactions
        this.setupFooterInteractions();
    }

    setupInputEnhancements() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Floating labels
            this.createFloatingLabel(input);
            
            // Focus rings
            input.addEventListener('focus', () => {
                input.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)';
                input.style.borderColor = '#667eea';
            });
            
            input.addEventListener('blur', () => {
                input.style.boxShadow = 'none';
                input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            });
            
            // Typing animation
            input.addEventListener('input', () => {
                this.createTypingParticles(input);
            });
        });
    }

    createFloatingLabel(input) {
        if (input.dataset.floatingLabel) return;
        
        const placeholder = input.placeholder;
        if (!placeholder) return;
        
        input.placeholder = '';
        input.dataset.floatingLabel = 'true';
        
        const label = document.createElement('label');
        label.textContent = placeholder;
        label.style.cssText = `
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.6);
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            font-size: 0.9rem;
        `;
        
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        wrapper.appendChild(label);
        
        const updateLabel = () => {
            if (input.value || input === document.activeElement) {
                label.style.top = '8px';
                label.style.fontSize = '0.75rem';
                label.style.color = '#667eea';
            } else {
                label.style.top = '50%';
                label.style.fontSize = '0.9rem';
                label.style.color = 'rgba(255, 255, 255, 0.6)';
            }
        };
        
        input.addEventListener('focus', updateLabel);
        input.addEventListener('blur', updateLabel);
        input.addEventListener('input', updateLabel);
    }

    createTypingParticles(input) {
        const rect = input.getBoundingClientRect();
        const particle = document.createElement('div');
        
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: #667eea;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.right - 10}px;
            top: ${rect.top + rect.height / 2}px;
        `;
        
        document.body.appendChild(particle);
        
        particle.animate([
            { transform: 'translateY(0) scale(1)', opacity: 1 },
            { transform: 'translateY(-20px) scale(0)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => particle.remove();
    }

    setupLogoAnimations() {
        const logo = document.querySelector('.logo-link');
        if (!logo) return;
        
        let animationFrame;
        
        logo.addEventListener('mouseenter', () => {
            const logoIcon = logo.querySelector('.logo-icon svg');
            if (logoIcon) {
                logoIcon.style.animation = 'logoHover 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
        });
        
        // Add logo hover styles
        const logoStyles = `
            @keyframes logoHover {
                0% { transform: rotate(0deg) scale(1); }
                25% { transform: rotate(5deg) scale(1.05); }
                50% { transform: rotate(-5deg) scale(1.1); }
                75% { transform: rotate(3deg) scale(1.05); }
                100% { transform: rotate(0deg) scale(1); }
            }
        `;

        if (!document.querySelector('#logo-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'logo-styles';
            styleSheet.textContent = logoStyles;
            document.head.appendChild(styleSheet);
        }
    }

    setupNavEnhancements() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            // Liquid loading effect
            link.addEventListener('click', (e) => {
                if (link.href && !link.href.includes('#')) {
                    e.preventDefault();
                    this.createLiquidTransition(link.href);
                }
            });
            
            // Underline animation
            this.createUnderlineAnimation(link);
        });
    }

    createLiquidTransition(href) {
        const liquid = document.createElement('div');
        liquid.style.cssText = `
            position: fixed;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100vh;
            background: linear-gradient(135deg, #667eea, #764ba2);
            z-index: 9999;
            transition: left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        document.body.appendChild(liquid);
        
        setTimeout(() => {
            liquid.style.left = '0%';
        }, 10);
        
        setTimeout(() => {
            window.location.href = href;
        }, 800);
    }

    createUnderlineAnimation(link) {
        const underline = document.createElement('div');
        underline.style.cssText = `
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        link.style.position = 'relative';
        link.appendChild(underline);
        
        link.addEventListener('mouseenter', () => {
            underline.style.width = '100%';
        });
        
        link.addEventListener('mouseleave', () => {
            underline.style.width = '0';
        });
    }

    setupFooterInteractions() {
        const footerLinks = document.querySelectorAll('.footer-section a');
        
        footerLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.createFooterLinkEffect(link);
            });
        });
    }

    createFooterLinkEffect(link) {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: absolute;
            top: 0;
            left: -10px;
            right: -10px;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
            border-radius: 4px;
            z-index: -1;
            opacity: 0;
            animation: footerGlow 0.6s ease-out forwards;
        `;
        
        link.style.position = 'relative';
        link.appendChild(glow);
        
        setTimeout(() => glow.remove(), 600);
        
        const glowStyles = `
            @keyframes footerGlow {
                to { opacity: 1; }
            }
        `;

        if (!document.querySelector('#footer-glow-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'footer-glow-styles';
            styleSheet.textContent = glowStyles;
            document.head.appendChild(styleSheet);
        }
    }

    // Advanced Transitions
    setupAdvancedTransitions() {
        // Page transition effects
        this.setupPageTransitions();
        
        // Element transition orchestration
        this.setupTransitionOrchestration();
        
        // Smooth state changes
        this.setupSmoothStateChanges();
    }

    setupPageTransitions() {
        // Intercept page navigation for smooth transitions
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.includes('#') && !link.target) {
                e.preventDefault();
                this.performPageTransition(link.href);
            }
        });
    }

    performPageTransition(href) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at center, #667eea, #0a0a0f);
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        
        document.body.appendChild(overlay);
        
        // Fade in overlay
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        // Navigate after transition
        setTimeout(() => {
            window.location.href = href;
        }, 500);
    }

    setupTransitionOrchestration() {
        // Orchestrate multiple element transitions
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            const elements = section.querySelectorAll('h1, h2, h3, p, .btn, .feature-card');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.orchestrateElementTransitions(elements);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(section);
        });
    }

    orchestrateElementTransitions(elements) {
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.transform = 'translateY(0) scale(1)';
                el.style.opacity = '1';
                el.style.filter = 'blur(0)';
            }, index * 100);
        });
    }

    setupSmoothStateChanges() {
        // Smooth transitions for dynamic content changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            this.animateNewElement(node);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    animateNewElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px) scale(0.9)';
        element.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) scale(1)';
        });
    }
}

// =========================================
// ORIGINAL FUNCTIONALITY (PRESERVED)
// =========================================

const mainNav = document.getElementById('main-nav');
const navLinks = document.querySelector('.nav-links');
const menuToggle = document.querySelector('.menu-toggle');

menuToggle?.addEventListener('click', () => {
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

navLinks?.querySelectorAll('.nav-link').forEach(link => {
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
                ctaInvestor.href = '/profile.html';
                ctaEntrepreneur.href = '/profile.html';
            }
        }
    } else {
        updateNavigationForLoggedOutUser();
    }
});

function updateNavigationForLoggedInUser(user) {
    const userType = localStorage.getItem('userType');
    navLinks.innerHTML = '';
    navLinks.innerHTML += `
        <a href="/" class="nav-link">Home</a>
        <a href="/profile.html" class="nav-link">Dashboard</a>
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

    document.getElementById('logout-link')?.addEventListener('click', handleLogout);
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
    alertDiv.innerHTML = `
        <div class="alert-content">
            <div class="alert-icon">
                ${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}
            </div>
            <div class="alert-message">${message}</div>
            <button class="alert-close">&times;</button>
        </div>
    `;

    // Enhanced alert styles
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'rgba(245, 87, 108, 0.1)' : type === 'success' ? 'rgba(67, 233, 123, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
        border: 1px solid ${type === 'error' ? 'rgba(245, 87, 108, 0.3)' : type === 'success' ? 'rgba(67, 233, 123, 0.3)' : 'rgba(102, 126, 234, 0.3)'};
        border-radius: 12px;
        padding: 16px 20px;
        backdrop-filter: blur(10px);
        z-index: 10001;
        min-width: 300px;
        transform: translateX(400px);
        transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    `;

    const alertStyles = `
        .alert-content {
            display: flex;
            align-items: center;
            gap: 12px;
            color: white;
        }

        .alert-icon {
            font-size: 1.2rem;
        }

        .alert-message {
            flex: 1;
            font-weight: 500;
        }

        .alert-close {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .alert-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
        }
    `;

    if (!document.querySelector('#alert-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'alert-styles';
        styleSheet.textContent = alertStyles;
        document.head.appendChild(styleSheet);
    }

    document.body.appendChild(alertDiv);

    // Slide in animation
    setTimeout(() => {
        alertDiv.style.transform = 'translateX(0)';
    }, 10);

    // Close functionality
    const closeBtn = alertDiv.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
        alertDiv.style.transform = 'translateX(400px)';
        setTimeout(() => alertDiv.remove(), 500);
    });

    // Auto remove
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.style.transform = 'translateX(400px)';
            setTimeout(() => alertDiv.remove(), 500);
        }
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
                window.location.href = '/profile.html';
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
            window.location.href = '/profile';
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


// ===== THEME DEBUG MESSAGE =====

