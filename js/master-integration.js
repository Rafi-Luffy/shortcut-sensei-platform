// Master Integration Controller - Ties all premium features together
class MasterIntegrationController {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.userPreferences = this.loadPreferences();
        this.init();
    }

    async init() {
        this.showPremiumLoader();
        await this.initializeModules();
        await this.setupEventListeners();
        await this.setupRealTimeFeatures();
        this.hidePremiumLoader();
        this.startPostInitAnimations();
        this.isInitialized = true;
    }

    showPremiumLoader() {
        const loader = document.createElement('div');
        loader.className = 'premium-loader';
        loader.id = 'premiumLoader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="floating-orbs">
                    <div class="orb orb-1"></div>
                    <div class="orb orb-2"></div>
                    <div class="orb orb-3"></div>
                </div>
                <div class="morphing-text">Shortcut Sensei</div>
                <p style="margin-top: 10px; opacity: 0.8;">Loading premium experience...</p>
                <div class="premium-progress" style="width: 200px; margin: 20px auto;">
                    <div class="premium-progress-bar" id="loaderProgress" style="width: 0%"></div>
                </div>
            </div>
        `;
        document.body.appendChild(loader);

        // Simulate loading progress
        let progress = 0;
        const progressBar = document.getElementById('loaderProgress');
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            progressBar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 100);
    }

    hidePremiumLoader() {
        setTimeout(() => {
            const loader = document.getElementById('premiumLoader');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => loader.remove(), 800);
            }
        }, 2000);
    }

    async initializeModules() {
        // Initialize User System
        if (window.premiumUserSystem) {
            this.modules.userSystem = window.premiumUserSystem;
            this.setupUserSystemIntegration();
        }

        // Initialize Quiz System
        if (window.enhancedQuiz) {
            this.modules.quizSystem = window.enhancedQuiz;
            this.setupQuizSystemIntegration();
        }

        // Initialize Professional App
        if (window.shortcutSenseiApp) {
            this.modules.professionalApp = window.shortcutSenseiApp;
        }

        // Initialize particle system
        this.initializeParticleSystem();
        
        // Initialize scroll animations
        this.initializeScrollAnimations();
    }

    setupUserSystemIntegration() {
        // Connect authentication with navigation
        const authBtn = document.getElementById('auth-btn');
        const userProfileBtn = document.getElementById('userProfileBtn');
        const notificationBell = document.getElementById('notificationBell');

        if (authBtn) {
            authBtn.addEventListener('click', () => {
                if (this.modules.userSystem.currentUser) {
                    this.showUserProfile();
                } else {
                    this.modules.userSystem.startOnboarding();
                }
            });
        }

        if (userProfileBtn) {
            userProfileBtn.addEventListener('click', () => {
                this.showUserProfile();
            });
        }

        if (notificationBell) {
            notificationBell.addEventListener('click', () => {
                this.toggleNotificationCenter();
            });
        }

        // Listen for user login
        document.addEventListener('userLoggedIn', (event) => {
            this.onUserLogin(event.detail);
        });
    }

    setupQuizSystemIntegration() {
        // Connect quiz buttons to enhanced quiz system
        const quizButtons = document.querySelectorAll('[href*="quiz"], .quiz-btn, #explore-apps');
        
        quizButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showEnhancedQuiz();
            });
        });
    }

    showEnhancedQuiz() {
        if (this.modules.quizSystem) {
            // Show quiz selection screen
            const quizScreen = document.getElementById('quizSelectionScreen');
            if (quizScreen) {
                quizScreen.style.display = 'block';
                this.addBackdrop('quiz');
            } else {
                // Create and show quiz interface
                this.modules.quizSystem.showLiveQuizInterface();
            }
        }
    }

    showUserProfile() {
        const profilePanel = document.getElementById('userProfilePanel');
        if (profilePanel) {
            profilePanel.classList.add('open');
            this.addBackdrop('profile');
        }
    }

    toggleNotificationCenter() {
        const notificationCenter = document.getElementById('notificationCenter');
        if (notificationCenter) {
            notificationCenter.classList.toggle('show');
        }
    }

    addBackdrop(type) {
        const backdrop = document.createElement('div');
        backdrop.className = `backdrop backdrop-${type}`;
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            z-index: 9997;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        backdrop.addEventListener('click', () => {
            this.closeModals();
        });
        
        document.body.appendChild(backdrop);
        setTimeout(() => backdrop.style.opacity = '1', 10);
    }

    closeModals() {
        // Close all modals and panels
        const profilePanel = document.getElementById('userProfilePanel');
        const quizScreen = document.getElementById('quizSelectionScreen');
        const notificationCenter = document.getElementById('notificationCenter');
        const backdrops = document.querySelectorAll('.backdrop');

        if (profilePanel) profilePanel.classList.remove('open');
        if (quizScreen) quizScreen.style.display = 'none';
        if (notificationCenter) notificationCenter.classList.remove('show');
        
        backdrops.forEach(backdrop => {
            backdrop.style.opacity = '0';
            setTimeout(() => backdrop.remove(), 300);
        });
    }

    async setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape to close modals
            if (e.key === 'Escape') {
                this.closeModals();
            }
            
            // Ctrl/Cmd + K for global search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.focusGlobalSearch();
            }
            
            // Ctrl/Cmd + / for help
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showKeyboardShortcutsHelp();
            }
        });

        // Enhanced button interactions
        this.setupMagneticButtons();
        
        // Setup scroll-triggered animations
        this.setupScrollTriggers();
    }

    setupMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.magnetic-btn');
        
        magneticButtons.forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                this.addRippleEffect(e.target);
            });
            
            btn.addEventListener('mousemove', (e) => {
                this.magneticEffect(e, btn);
            });
            
            btn.addEventListener('mouseleave', (e) => {
                this.resetMagneticEffect(btn);
            });
        });
    }

    magneticEffect(e, element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`;
    }

    resetMagneticEffect(element) {
        element.style.transform = 'translate(0px, 0px) scale(1)';
    }

    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    setupScrollTriggers() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        // Observe all scroll-reveal elements
        const scrollElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .premium-card, .floating-element');
        scrollElements.forEach(el => observer.observe(el));
    }

    initializeParticleSystem() {
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 8000);
        };

        // Create particles periodically
        setInterval(createParticle, 2000);
    }

    initializeScrollAnimations() {
        // Add scroll-reveal classes to elements that don't have them
        const elements = document.querySelectorAll('.premium-card, .floating-element');
        elements.forEach((el, index) => {
            if (!el.classList.contains('scroll-reveal')) {
                const animations = ['scroll-reveal', 'scroll-reveal-left', 'scroll-reveal-right'];
                el.classList.add(animations[index % 3]);
            }
        });
    }

    startPostInitAnimations() {
        // Add floating animation to elements
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((el, index) => {
            el.style.animationDelay = (index * 0.2) + 's';
        });

        // Trigger entrance animations
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero-content > *');
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animate-in');
                }, index * 200);
            });
        }, 500);
    }

    async setupRealTimeFeatures() {
        // Simulate real-time updates
        this.startRealTimeSimulation();
        
        // Setup WebSocket connection (simulated)
        this.simulateWebSocketConnection();
    }

    startRealTimeSimulation() {
        // Update online user count
        setInterval(() => {
            const onlineCount = document.getElementById('onlineCount');
            if (onlineCount) {
                const count = 2800 + Math.floor(Math.random() * 100);
                onlineCount.textContent = count.toLocaleString();
            }
        }, 10000);

        // Simulate new notifications
        setInterval(() => {
            this.simulateNewNotification();
        }, 30000);

        // Update participant counts in quiz
        setInterval(() => {
            const participantCount = document.getElementById('participantCount');
            if (participantCount) {
                const count = 800 + Math.floor(Math.random() * 100);
                participantCount.textContent = count + ' players';
            }
        }, 15000);
    }

    simulateNewNotification() {
        const notifications = [
            { type: 'friend_request', message: 'Alex_Dev sent you a friend request' },
            { type: 'achievement', message: 'You unlocked "Speed Demon" achievement!' },
            { type: 'challenge', message: 'New daily challenge available' },
            { type: 'community', message: '5 new messages in VS Code Community' }
        ];

        const notification = notifications[Math.floor(Math.random() * notifications.length)];
        
        if (this.modules.userSystem) {
            this.modules.userSystem.showToast(notification.message, 'info', 4000);
            this.updateNotificationBadge();
        }
    }

    updateNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            const currentCount = parseInt(badge.textContent) || 0;
            badge.textContent = currentCount + 1;
            badge.style.animation = 'bounce 0.6s ease';
            setTimeout(() => badge.style.animation = '', 600);
        }
    }

    simulateWebSocketConnection() {
        // Simulate connection events
        setTimeout(() => {
            console.log('🌐 Real-time connection established');
            if (this.modules.userSystem) {
                this.modules.userSystem.showToast('Connected to live community!', 'success', 2000);
            }
        }, 3000);
    }

    focusGlobalSearch() {
        const searchInput = document.querySelector('.search-input, #search-input, #app-search');
        if (searchInput) {
            searchInput.focus();
            if (this.modules.userSystem) {
                this.modules.userSystem.showToast('Global search activated! Start typing...', 'info', 2000);
            }
        }
    }

    showKeyboardShortcutsHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'keyboard-help-modal';
        helpModal.innerHTML = `
            <div class="help-content premium-card">
                <div class="help-header">
                    <h3>🎹 Keyboard Shortcuts</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="close-btn">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="shortcuts-list">
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>K</kbd>
                        <span>Global Search</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>/</kbd>
                        <span>Show This Help</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Esc</kbd>
                        <span>Close Modals</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Alt</kbd> + <kbd>←</kbd>
                        <span>Go Back</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Alt</kbd> + <kbd>→</kbd>
                        <span>Go Forward</span>
                    </div>
                </div>
            </div>
        `;
        
        helpModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
        `;
        
        document.body.appendChild(helpModal);
    }

    onUserLogin(userData) {
        // Update UI for logged in user
        const authBtn = document.getElementById('auth-btn');
        const userProfileBtn = document.getElementById('userProfileBtn');
        
        if (authBtn) authBtn.style.display = 'none';
        if (userProfileBtn) {
            userProfileBtn.style.display = 'flex';
            const avatar = userProfileBtn.querySelector('.user-avatar-small');
            const name = userProfileBtn.querySelector('.user-name-small');
            
            if (avatar) avatar.src = userData.avatar;
            if (name) name.textContent = userData.name;
        }

        // Show welcome message
        if (this.modules.userSystem) {
            this.modules.userSystem.showToast(`Welcome back, ${userData.name}! 🎉`, 'success', 3000);
        }
    }

    loadPreferences() {
        return JSON.parse(localStorage.getItem('shortcutSensei_masterPreferences')) || {
            animations: true,
            darkMode: false,
            notifications: true,
            soundEffects: true
        };
    }

    savePreferences() {
        localStorage.setItem('shortcutSensei_masterPreferences', JSON.stringify(this.userPreferences));
    }

    // Public API for other modules
    getModule(name) {
        return this.modules[name];
    }

    showNotification(message, type = 'info') {
        if (this.modules.userSystem) {
            this.modules.userSystem.showToast(message, type);
        }
    }

    triggerAnimation(element, animationType) {
        element.classList.add(animationType);
        setTimeout(() => element.classList.remove(animationType), 1000);
    }
}

// Initialize Master Controller
document.addEventListener('DOMContentLoaded', () => {
    window.masterController = new MasterIntegrationController();
});

// Add CSS for additional effects
const additionalCSS = `
    <style>
        @keyframes ripple {
            to {
                width: 100px;
                height: 100px;
                opacity: 0;
            }
        }
        
        .animate-in {
            animation: slideInUp 0.6s ease-out;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .keyboard-help-modal .help-content {
            max-width: 400px;
            margin: 20px;
        }
        
        .help-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .help-header h3 {
            margin: 0;
            color: white;
        }
        
        .close-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 5px;
            border-radius: 5px;
            transition: background 0.3s ease;
        }
        
        .close-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .shortcuts-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .shortcut-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
        }
        
        .shortcut-item kbd {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            padding: 4px 8px;
            font-family: monospace;
            font-size: 0.875rem;
            color: white;
            margin: 0 2px;
        }
        
        .shortcut-item span {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.875rem;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', additionalCSS);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MasterIntegrationController;
}
