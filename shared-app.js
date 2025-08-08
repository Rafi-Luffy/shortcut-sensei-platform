// Shared Navigation and Utility System for Shortcut Sensei
class ShortcutSenseiApp {
    constructor() {
        this.currentUser = this.loadUserData();
        this.settings = this.loadSettings();
        this.streakData = this.loadStreakData();
        this.achievementsData = this.loadAchievements();
        this.init();
    }

    init() {
        this.initializeNavigation();
        this.initializeAuth();
        this.initializeSearch();
        this.initializeNotifications();
        this.initializeTheme();
        this.initializePerformanceOptimizations();
        this.initializeAnalytics();
    }

    // Navigation System
    initializeNavigation() {
        const nav = document.querySelector('.nav-modern, .nav-sticky');
        if (!nav) return;

        // Add active page detection
        this.setActivePage();
        
        // Add smooth navigation transitions
        this.setupSmoothNavigation();
        
        // Add mobile navigation
        this.setupMobileNavigation();
    }

    setActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === 'index.html' && href === '#') ||
                (currentPage === 'community-ultimate.html' && href.includes('community'))) {
                link.classList.add('active');
            }
        });
    }

    setupSmoothNavigation() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;

            const href = link.getAttribute('href');
            
            // Handle internal navigation
            if (href.startsWith('#')) {
                e.preventDefault();
                this.smoothScrollTo(href);
            } else if (href.endsWith('.html')) {
                e.preventDefault();
                this.navigateToPage(href);
            }
        });
    }

    navigateToPage(href) {
        // Add loading state
        this.showPageTransition();
        
        // Preload page for faster navigation
        this.preloadPage(href).then(() => {
            window.location.href = href;
        });
    }

    showPageTransition() {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.innerHTML = `
            <div class="transition-content">
                <div class="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    preloadPage(href) {
        return new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            link.onload = resolve;
            link.onerror = resolve;
            document.head.appendChild(link);
            
            // Fallback timeout
            setTimeout(resolve, 500);
        });
    }

    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    setupMobileNavigation() {
        const navToggle = document.createElement('button');
        navToggle.className = 'nav-toggle mobile-only';
        navToggle.innerHTML = '<i data-lucide="menu"></i>';
        navToggle.addEventListener('click', this.toggleMobileNav.bind(this));
        
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            navActions.appendChild(navToggle);
        }
    }

    toggleMobileNav() {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.classList.toggle('mobile-open');
        }
    }

    // Authentication System
    initializeAuth() {
        const authBtn = document.getElementById('authBtn');
        if (authBtn) {
            authBtn.addEventListener('click', this.handleAuth.bind(this));
        }

        // Check authentication state
        this.updateAuthUI();
    }

    handleAuth() {
        if (this.currentUser.isAuthenticated) {
            this.showUserMenu();
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu() {
        const menu = document.createElement('div');
        menu.className = 'user-dropdown-menu';
        menu.innerHTML = `
            <div class="user-menu-header">
                <div class="user-avatar">${this.currentUser.initials}</div>
                <div class="user-info">
                    <div class="user-name">${this.currentUser.name}</div>
                    <div class="user-rank">${this.currentUser.rank}</div>
                </div>
            </div>
            <div class="user-menu-items">
                <a href="#profile" class="menu-item">
                    <i data-lucide="user"></i>
                    <span>Profile</span>
                </a>
                <a href="#achievements" class="menu-item">
                    <i data-lucide="trophy"></i>
                    <span>Achievements</span>
                </a>
                <a href="#settings" class="menu-item">
                    <i data-lucide="settings"></i>
                    <span>Settings</span>
                </a>
                <div class="menu-divider"></div>
                <button class="menu-item logout-btn">
                    <i data-lucide="log-out"></i>
                    <span>Sign Out</span>
                </button>
            </div>
        `;
        
        document.body.appendChild(menu);
        this.positionDropdown(menu, document.getElementById('authBtn'));
        
        // Add click outside to close
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!menu.contains(e.target)) {
                    menu.remove();
                }
            }, { once: true });
        }, 100);
    }

    showAuthModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal-overlay';
        modal.innerHTML = `
            <div class="auth-modal">
                <div class="auth-modal-header">
                    <h2>Welcome to Shortcut Sensei</h2>
                    <button class="modal-close" data-action="close-modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="signin">Sign In</button>
                    <button class="auth-tab" data-tab="signup">Sign Up</button>
                </div>
                <div class="auth-content">
                    <div class="auth-form signin-form active">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" placeholder="Enter your email" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" placeholder="Enter your password" required>
                        </div>
                        <button class="btn btn-primary btn-full">Sign In</button>
                        <div class="auth-divider">or</div>
                        <button class="btn btn-social google-btn">
                            <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>
                    </div>
                    <div class="auth-form signup-form">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="Enter your full name" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" placeholder="Enter your email" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" placeholder="Create a password" required>
                        </div>
                        <div class="form-group">
                            <label>Confirm Password</label>
                            <input type="password" placeholder="Confirm your password" required>
                        </div>
                        <button class="btn btn-primary btn-full">Create Account</button>
                        <div class="auth-divider">or</div>
                        <button class="btn btn-social google-btn">
                            <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupAuthModal(modal);
    }

    setupAuthModal(modal) {
        // Tab switching
        modal.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                modal.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                modal.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                e.target.classList.add('active');
                modal.querySelector(`.${targetTab}-form`).classList.add('active');
            });
        });

        // Close modal
        modal.querySelector('[data-action="close-modal"]').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Form submissions
        modal.querySelectorAll('.auth-form').forEach(form => {
            form.addEventListener('submit', this.handleAuthSubmit.bind(this));
        });
    }

    handleAuthSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const isSignup = form.classList.contains('signup-form');
        
        // Show loading state
        const submitBtn = form.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="spinning"></i> Processing...';
        submitBtn.disabled = true;
        
        // Simulate authentication
        setTimeout(() => {
            this.authenticateUser({
                name: isSignup ? form.querySelector('input[type="text"]').value : 'Demo User',
                email: form.querySelector('input[type="email"]').value,
                isAuthenticated: true,
                rank: 'Gold III',
                elo: 1847,
                achievements: 12
            });
            
            document.querySelector('.auth-modal-overlay').remove();
            this.showSuccessMessage(isSignup ? 'Account created successfully!' : 'Welcome back!');
        }, 1500);
    }

    authenticateUser(userData) {
        this.currentUser = {
            ...userData,
            initials: userData.name.split(' ').map(n => n[0]).join('').toUpperCase()
        };
        this.saveUserData();
        this.updateAuthUI();
        this.initializeUserFeatures();
    }

    updateAuthUI() {
        const authBtn = document.getElementById('authBtn');
        if (!authBtn) return;

        if (this.currentUser.isAuthenticated) {
            authBtn.innerHTML = `
                <div class="user-avatar">${this.currentUser.initials}</div>
                <span>${this.currentUser.name.split(' ')[0]}</span>
                <i data-lucide="chevron-down"></i>
            `;
            authBtn.classList.add('authenticated');
        } else {
            authBtn.innerHTML = `
                <i data-lucide="user"></i>
                <span>Sign In</span>
            `;
            authBtn.classList.remove('authenticated');
        }
    }

    // Search System
    initializeSearch() {
        const searchToggle = document.querySelector('[data-action="toggle-search"]');
        if (searchToggle) {
            searchToggle.addEventListener('click', this.toggleSearch.bind(this));
        }

        // Add global search shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggleSearch();
            }
        });
    }

    toggleSearch() {
        let searchOverlay = document.querySelector('.search-overlay');
        
        if (searchOverlay) {
            searchOverlay.remove();
            return;
        }

        searchOverlay = document.createElement('div');
        searchOverlay.className = 'search-overlay';
        searchOverlay.innerHTML = `
            <div class="search-modal">
                <div class="search-header">
                    <div class="search-input-container">
                        <i data-lucide="search"></i>
                        <input type="text" placeholder="Search shortcuts, applications, or ask questions..." class="search-input" autocomplete="off">
                        <kbd class="search-shortcut">Ctrl K</kbd>
                    </div>
                    <button class="search-close" data-action="close-search">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="search-content">
                    <div class="search-suggestions">
                        <div class="suggestion-group">
                            <div class="suggestion-title">Quick Actions</div>
                            <div class="suggestion-item" data-action="start-quiz">
                                <i data-lucide="brain"></i>
                                <span>Start Quiz</span>
                                <kbd>Q</kbd>
                            </div>
                            <div class="suggestion-item" data-action="join-battle">
                                <i data-lucide="sword"></i>
                                <span>Join Battle</span>
                                <kbd>B</kbd>
                            </div>
                            <div class="suggestion-item" data-action="view-leaderboard">
                                <i data-lucide="trophy"></i>
                                <span>Leaderboard</span>
                                <kbd>L</kbd>
                            </div>
                        </div>
                        <div class="suggestion-group">
                            <div class="suggestion-title">Popular Shortcuts</div>
                            <div class="suggestion-item">
                                <i data-lucide="copy"></i>
                                <span>Copy - Ctrl+C</span>
                            </div>
                            <div class="suggestion-item">
                                <i data-lucide="scissors"></i>
                                <span>Cut - Ctrl+X</span>
                            </div>
                            <div class="suggestion-item">
                                <i data-lucide="clipboard"></i>
                                <span>Paste - Ctrl+V</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(searchOverlay);
        
        const searchInput = searchOverlay.querySelector('.search-input');
        searchInput.focus();
        
        // Setup search functionality
        this.setupSearchFunctionality(searchOverlay);
    }

    setupSearchFunctionality(overlay) {
        const searchInput = overlay.querySelector('.search-input');
        const closeBtn = overlay.querySelector('[data-action="close-search"]');
        
        // Close search
        closeBtn.addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
        
        // Escape to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') overlay.remove();
        }, { once: true });
        
        // Search input handling
        searchInput.addEventListener('input', this.handleSearchInput.bind(this));
        
        // Quick action handlers
        overlay.querySelectorAll('[data-action]').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
                overlay.remove();
            });
        });
    }

    handleSearchInput(e) {
        const query = e.target.value.toLowerCase();
        // Implement real-time search here
        console.log('Searching for:', query);
    }

    handleQuickAction(action) {
        switch (action) {
            case 'start-quiz':
                window.location.href = 'quiz.html';
                break;
            case 'join-battle':
                window.location.href = 'community-ultimate.html#battle';
                break;
            case 'view-leaderboard':
                window.location.href = 'community-ultimate.html#leaderboard';
                break;
        }
    }

    // Notification System
    initializeNotifications() {
        this.notificationQueue = [];
        this.createNotificationContainer();
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = this.getNotificationIcon(type);
        notification.innerHTML = `
            <div class="notification-content">
                <i data-lucide="${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i data-lucide="x"></i>
            </button>
        `;
        
        const container = document.querySelector('.notification-container');
        container.appendChild(notification);
        
        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons(notification);
        }
        
        // Auto remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('notification-show');
        });
    }

    removeNotification(notification) {
        notification.classList.add('notification-hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };
        return icons[type] || 'info';
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    // Theme System
    initializeTheme() {
        const savedTheme = localStorage.getItem('shortcut-sensei-theme') || 'light';
        this.setTheme(savedTheme);
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('shortcut-sensei-theme', theme);
        
        const themeIcon = document.querySelector('#theme-toggle .theme-icon');
        if (themeIcon) {
            themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    // Performance Optimizations
    initializePerformanceOptimizations() {
        // Lazy loading for images
        this.setupLazyLoading();
        
        // Intersection observer for animations
        this.setupAnimationObserver();
        
        // Debounced resize handler
        this.setupResizeHandler();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupAnimationObserver() {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            animationObserver.observe(el);
        });
    }

    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    handleResize() {
        // Handle responsive updates
        this.updateMobileNavigation();
        this.updateModalPositions();
    }

    preloadCriticalResources() {
        const criticalPages = ['quiz.html', 'community-ultimate.html'];
        criticalPages.forEach(page => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = page;
            document.head.appendChild(link);
        });
    }

    // Data Management
    loadUserData() {
        const saved = localStorage.getItem('shortcut-sensei-user');
        return saved ? JSON.parse(saved) : {
            isAuthenticated: false,
            name: '',
            email: '',
            rank: 'Unranked',
            elo: 0,
            achievements: 0
        };
    }

    saveUserData() {
        localStorage.setItem('shortcut-sensei-user', JSON.stringify(this.currentUser));
    }

    loadSettings() {
        const saved = localStorage.getItem('shortcut-sensei-settings');
        return saved ? JSON.parse(saved) : {
            theme: 'light',
            notifications: true,
            soundEffects: true,
            autoplay: false
        };
    }

    loadStreakData() {
        const saved = localStorage.getItem('shortcut-sensei-streak');
        return saved ? JSON.parse(saved) : {
            current: 0,
            best: 0,
            lastActiveDate: null
        };
    }

    loadAchievements() {
        const saved = localStorage.getItem('shortcut-sensei-achievements');
        return saved ? JSON.parse(saved) : [];
    }

    // Analytics
    initializeAnalytics() {
        this.trackPageView();
        this.setupEventTracking();
    }

    trackPageView() {
        const page = window.location.pathname;
        console.log('Page view:', page);
        // Integrate with your analytics service
    }

    setupEventTracking() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .btn, [data-action]');
            if (button) {
                const action = button.dataset.action || button.textContent.trim();
                console.log('Button clicked:', action);
                // Track button clicks
            }
        });
    }

    // Utility Methods
    positionDropdown(dropdown, trigger) {
        const rect = trigger.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${rect.bottom + 8}px`;
        dropdown.style.right = `${window.innerWidth - rect.right}px`;
        dropdown.style.zIndex = '9999';
    }

    debounce(func, wait) {
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

    initializeUserFeatures() {
        // Initialize user-specific features after authentication
        this.updateStreakDisplay();
        this.loadUserAchievements();
        this.setupPersonalization();
    }

    updateStreakDisplay() {
        const streakDisplay = document.querySelector('.streak-count');
        if (streakDisplay) {
            streakDisplay.textContent = this.streakData.current;
        }
    }

    loadUserAchievements() {
        // Load and display user achievements
        console.log('Loading achievements for user:', this.currentUser.name);
    }

    setupPersonalization() {
        // Setup personalized content based on user preferences
        console.log('Setting up personalization for:', this.currentUser.name);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.shortcutSenseiApp = new ShortcutSenseiApp();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShortcutSenseiApp;
}
