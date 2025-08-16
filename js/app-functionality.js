/* Enhanced Application Functionality - Complete Interactive System */

class ShortcutSenseiApp {
    constructor() {
        this.user = null;
        this.theme = localStorage.getItem('theme') || 'dark';
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        this.notifications = [];
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        try {
            // Set initial theme
            this.setTheme(this.theme);
            
            // Initialize core systems
            await this.initializeCore();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize animations
            this.initializeAnimations();
            
            // Load user data
            this.loadUserData();
            
            // Setup real-time features
            this.setupRealTimeFeatures();
            
            this.isInitialized = true;
            console.log('🚀 Shortcut Sensei App - Fully Initialized');
            
        } catch (error) {
            console.error('❌ App initialization error:', error);
            this.showToast('Failed to initialize application', 'error');
        }
    }

    async initializeCore() {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Initialize search system
        this.initializeSearch();
        
        // Initialize authentication
        this.initializeAuth();
        
        // Initialize theme system
        this.initializeTheme();
        
        // Initialize navigation
        this.initializeNavigation();
        
        // Initialize statistics
        this.initializeStatistics();
    }

    setupEventListeners() {
        // Global click handler
        document.addEventListener('click', this.handleGlobalClick.bind(this));
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', this.handleGlobalKeydown.bind(this));
        
        // Window events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        
        // Form submissions
        document.addEventListener('submit', this.handleFormSubmit.bind(this));
        
        // Input events
        document.addEventListener('input', this.handleInput.bind(this));
    }

    handleGlobalClick(e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;
        const data = target.dataset;
        
        this.executeAction(action, data, e);
    }

    executeAction(action, data, event) {
        switch (action) {
            case 'toggle-search':
                this.toggleSearch();
                break;
            case 'close-search':
                this.closeSearch();
                break;
            case 'toggle-theme':
                this.toggleTheme();
                break;
            case 'toggle-mobile-menu':
                this.toggleMobileMenu();
                break;
            case 'open-auth':
                this.openAuthModal();
                break;
            case 'close-auth':
                this.closeAuthModal();
                break;
            case 'start-quiz':
                this.startQuiz(data.mode || 'quick');
                break;
            case 'view-profile':
                this.viewProfile();
                break;
            case 'copy-shortcut':
                this.copyShortcut(data.shortcut);
                break;
            case 'toggle-favorite':
                this.toggleFavorite(data.app);
                break;
            case 'share-content':
                this.shareContent(data);
                break;
            case 'subscribe-newsletter':
                this.subscribeNewsletter(event);
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    handleGlobalKeydown(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.toggleSearch();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
        
        // Ctrl/Cmd + / for help
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            this.showKeyboardHelp();
        }
    }

    handleScroll() {
        const nav = document.getElementById('main-nav');
        if (window.scrollY > 50) {
            nav?.classList.add('scrolled');
        } else {
            nav?.classList.remove('scrolled');
        }
        
        // Update progress indicators
        this.updateScrollProgress();
    }

    handleResize() {
        // Adjust layout for screen size
        this.adjustResponsiveLayout();
    }

    handleFormSubmit(e) {
        const form = e.target;
        if (!form.matches('form')) return;
        
        e.preventDefault();
        
        if (form.id === 'newsletter-form') {
            this.handleNewsletterSubmit(form);
        } else if (form.id === 'signinForm') {
            this.handleSignIn(form);
        } else if (form.id === 'signupForm') {
            this.handleSignUp(form);
        }
    }

    handleInput(e) {
        if (e.target.id === 'search-input') {
            this.debounce(this.performSearch.bind(this), 300)(e.target.value);
        } else if (e.target.id === 'apps-search') {
            this.debounce(this.searchApplications.bind(this), 300)(e.target.value);
        }
    }

    // Search System
    initializeSearch() {
        this.searchIndex = this.buildSearchIndex();
    }

    buildSearchIndex() {
        return [
            // Applications
            { type: 'app', title: 'Visual Studio Code', url: 'Visual Studio.html', category: 'Development', keywords: ['vscode', 'editor', 'code'] },
            { type: 'app', title: 'Adobe Photoshop', url: 'Adobe PhotoShop.html', category: 'Design', keywords: ['photoshop', 'adobe', 'design'] },
            { type: 'app', title: 'Google Chrome', url: 'Google Chrome.html', category: 'Browser', keywords: ['chrome', 'browser', 'google'] },
            { type: 'app', title: 'Microsoft Excel', url: 'Microsoft Excell.htm', category: 'Productivity', keywords: ['excel', 'spreadsheet', 'office'] },
            { type: 'app', title: 'Microsoft Word', url: 'Microsoft Word.htm', category: 'Productivity', keywords: ['word', 'document', 'office'] },
            { type: 'app', title: 'Discord', url: 'Discord.html', category: 'Communication', keywords: ['discord', 'chat', 'gaming'] },
            
            // Shortcuts
            { type: 'shortcut', title: 'Copy', description: 'Ctrl+C / Cmd+C', category: 'General' },
            { type: 'shortcut', title: 'Paste', description: 'Ctrl+V / Cmd+V', category: 'General' },
            { type: 'shortcut', title: 'Cut', description: 'Ctrl+X / Cmd+X', category: 'General' },
            { type: 'shortcut', title: 'Undo', description: 'Ctrl+Z / Cmd+Z', category: 'General' },
            { type: 'shortcut', title: 'Save', description: 'Ctrl+S / Cmd+S', category: 'General' },
            
            // Pages
            { type: 'page', title: 'Quiz', url: 'quiz-integrated.html', category: 'Learning' },
            { type: 'page', title: 'Community', url: 'community-ultimate.html', category: 'Social' },
            { type: 'page', title: 'About', url: 'about.html', category: 'Information' }
        ];
    }

    toggleSearch() {
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('search-input');
        
        if (overlay?.classList.contains('active')) {
            this.closeSearch();
        } else {
            overlay?.classList.add('active');
            setTimeout(() => input?.focus(), 150);
        }
    }

    closeSearch() {
        const overlay = document.getElementById('search-overlay');
        overlay?.classList.remove('active');
        this.clearSearchResults();
    }

    performSearch(query) {
        if (!query.trim()) {
            this.showSearchSuggestions();
            return;
        }
        
        const results = this.searchIndex.filter(item => {
            const searchText = [item.title, item.description, item.category, ...(item.keywords || [])].join(' ').toLowerCase();
            return searchText.includes(query.toLowerCase());
        });
        
        this.displaySearchResults(results, query);
        this.addToSearchHistory(query);
    }

    showSearchSuggestions() {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;
        
        resultsContainer.innerHTML = `
            <div class="search-suggestions">
                <div class="suggestion-category">
                    <h4>Popular Searches</h4>
                    <div class="suggestions">
                        <span class="suggestion" onclick="app.searchFor('VS Code')">VS Code</span>
                        <span class="suggestion" onclick="app.searchFor('Photoshop')">Photoshop</span>
                        <span class="suggestion" onclick="app.searchFor('Chrome')">Chrome</span>
                        <span class="suggestion" onclick="app.searchFor('Copy')">Copy</span>
                        <span class="suggestion" onclick="app.searchFor('Paste')">Paste</span>
                    </div>
                </div>
            </div>
        `;
    }

    displaySearchResults(results, query) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No results found for "${query}"</p>
                </div>
            `;
            return;
        }
        
        const html = results.map(result => `
            <div class="search-result" onclick="app.selectSearchResult('${result.url || '#'}')">
                <div class="result-title">${result.title}</div>
                <div class="result-description">${result.description || result.category}</div>
            </div>
        `).join('');
        
        resultsContainer.innerHTML = `
            <div class="search-results-list">
                ${html}
            </div>
        `;
    }

    searchFor(query) {
        const input = document.getElementById('search-input');
        if (input) {
            input.value = query;
            this.performSearch(query);
        }
    }

    selectSearchResult(url) {
        if (url && url !== '#') {
            this.closeSearch();
            setTimeout(() => window.location.href = url, 100);
        }
    }

    clearSearchResults() {
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
    }

    addToSearchHistory(query) {
        if (!this.searchHistory.includes(query)) {
            this.searchHistory.unshift(query);
            this.searchHistory = this.searchHistory.slice(0, 10);
            localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
        }
    }

    // Authentication System
    initializeAuth() {
        this.loadUserData();
        this.updateAuthUI();
    }

    openAuthModal() {
        const modal = document.getElementById('authModalOverlay');
        modal?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeAuthModal() {
        const modal = document.getElementById('authModalOverlay');
        modal?.classList.remove('active');
        document.body.style.overflow = '';
    }

    async handleSignIn(form) {
        const formData = new FormData(form);
        const email = formData.get('email') || document.getElementById('signinEmail').value;
        const password = formData.get('password') || document.getElementById('signinPassword').value;
        
        if (!email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }
        
        this.showLoading(form);
        
        // Simulate API call
        setTimeout(() => {
            const userData = {
                id: Date.now(),
                name: email.split('@')[0],
                email: email,
                avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=6366f1&color=fff`,
                level: 15,
                xp: 2450,
                streak: 30
            };
            
            this.setUser(userData);
            this.hideLoading(form);
            this.closeAuthModal();
            this.showToast(`Welcome back, ${userData.name}!`, 'success');
        }, 1500);
    }

    async handleSignUp(form) {
        const formData = new FormData(form);
        const name = formData.get('name') || document.getElementById('signupName').value;
        const email = formData.get('email') || document.getElementById('signupEmail').value;
        const password = formData.get('password') || document.getElementById('signupPassword').value;
        const confirmPassword = formData.get('confirmPassword') || document.getElementById('confirmPassword').value;
        
        if (!name || !email || !password || !confirmPassword) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }
        
        this.showLoading(form);
        
        // Simulate API call
        setTimeout(() => {
            const userData = {
                id: Date.now(),
                name: name,
                email: email,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
                level: 1,
                xp: 0,
                streak: 0
            };
            
            this.setUser(userData);
            this.hideLoading(form);
            this.closeAuthModal();
            this.showToast(`Welcome to Shortcut Sensei, ${name}!`, 'success');
        }, 1500);
    }

    setUser(userData) {
        this.user = userData;
        localStorage.setItem('user', JSON.stringify(userData));
        this.updateAuthUI();
        this.trackEvent('user_login', { user_id: userData.id });
    }

    loadUserData() {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.user = JSON.parse(savedUser);
            this.updateAuthUI();
        }
    }

    updateAuthUI() {
        const authBtn = document.getElementById('authBtn');
        const userProfileBtn = document.getElementById('userProfileBtn');
        const notificationBell = document.getElementById('notificationBell');
        
        if (this.user) {
            // Hide auth button, show user profile
            if (authBtn) authBtn.style.display = 'none';
            if (userProfileBtn) {
                userProfileBtn.style.display = 'flex';
                const avatar = userProfileBtn.querySelector('.user-avatar-small');
                const name = userProfileBtn.querySelector('.user-name-small');
                
                if (avatar) avatar.src = this.user.avatar;
                if (name) name.textContent = this.user.name;
            }
            if (notificationBell) notificationBell.style.display = 'flex';
        } else {
            // Show auth button, hide user profile
            if (authBtn) authBtn.style.display = 'flex';
            if (userProfileBtn) userProfileBtn.style.display = 'none';
            if (notificationBell) notificationBell.style.display = 'none';
        }
    }

    logout() {
        this.user = null;
        localStorage.removeItem('user');
        this.updateAuthUI();
        this.showToast('Successfully logged out', 'info');
    }

    // Theme System
    initializeTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcons();
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(this.theme);
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeIcons();
        this.trackEvent('theme_changed', { theme });
    }

    updateThemeIcons() {
        const themeIcons = document.querySelectorAll('.theme-icon, .theme-toggle-footer i');
        themeIcons.forEach(icon => {
            if (this.theme === 'dark') {
                icon.setAttribute('data-lucide', 'sun');
            } else {
                icon.setAttribute('data-lucide', 'moon');
            }
        });
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Navigation System
    initializeNavigation() {
        this.setActiveNavigation();
        this.setupMobileMenu();
    }

    setActiveNavigation() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || 
                (currentPath === '' && href === 'index.html') ||
                (currentPath.includes(href.replace('.html', '')) && href !== '#')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setupMobileMenu() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const menu = document.getElementById('nav-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                menu.classList.toggle('active');
            });
        }
    }

    toggleMobileMenu() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const menu = document.getElementById('nav-menu');
        
        toggle?.classList.toggle('active');
        menu?.classList.toggle('active');
    }

    // Statistics and Animations
    initializeStatistics() {
        this.animateCounters();
    }

    animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    // Animations
    initializeAnimations() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupMagneticButtons();
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-fade-in-up, .animate-fade-in-left, .animate-fade-in-right, .animate-scale-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = this.getAnimationType(element);
                    element.style.animation = `${animationType} 0.8s ease-out forwards`;
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        animatedElements.forEach(el => observer.observe(el));
    }

    getAnimationType(element) {
        if (element.classList.contains('animate-fade-in-up')) return 'fadeInUp';
        if (element.classList.contains('animate-fade-in-left')) return 'fadeInLeft';
        if (element.classList.contains('animate-fade-in-right')) return 'fadeInRight';
        if (element.classList.contains('animate-scale-in')) return 'scaleIn';
        return 'fadeInUp';
    }

    setupHoverAnimations() {
        const cards = document.querySelectorAll('.app-card, .feature-card, .stat-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    setupMagneticButtons() {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // Utility Functions
    copyShortcut(shortcut) {
        if (!shortcut) return;
        
        navigator.clipboard.writeText(shortcut).then(() => {
            this.showToast(`Copied "${shortcut}" to clipboard!`, 'success');
        }).catch(() => {
            this.showToast('Failed to copy shortcut', 'error');
        });
    }

    toggleFavorite(appName) {
        if (!this.user) {
            this.showToast('Please sign in to save favorites', 'warning');
            this.openAuthModal();
            return;
        }
        
        const index = this.favorites.indexOf(appName);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showToast(`Removed ${appName} from favorites`, 'info');
        } else {
            this.favorites.push(appName);
            this.showToast(`Added ${appName} to favorites`, 'success');
        }
        
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.updateFavoriteButtons();
    }

    updateFavoriteButtons() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const app = btn.dataset.app;
            if (this.favorites.includes(app)) {
                btn.classList.add('favorited');
                btn.querySelector('i').setAttribute('data-lucide', 'heart');
                btn.style.color = '#ef4444';
            } else {
                btn.classList.remove('favorited');
                btn.querySelector('i').setAttribute('data-lucide', 'heart');
                btn.style.color = '';
            }
        });
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    shareContent(data) {
        const title = data.title || document.title;
        const text = data.text || 'Check out Shortcut Sensei - the ultimate keyboard shortcuts platform!';
        const url = data.url || window.location.href;
        
        if (navigator.share) {
            navigator.share({ title, text, url }).then(() => {
                this.showToast('Content shared successfully!', 'success');
            }).catch(() => {
                this.fallbackShare(title, text, url);
            });
        } else {
            this.fallbackShare(title, text, url);
        }
    }

    fallbackShare(title, text, url) {
        navigator.clipboard.writeText(`${text} ${url}`).then(() => {
            this.showToast('Link copied to clipboard!', 'success');
        }).catch(() => {
            this.showToast('Failed to copy link', 'error');
        });
    }

    // Newsletter
    handleNewsletterSubmit(form) {
        const email = form.querySelector('.newsletter-input').value;
        
        if (!this.validateEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }
        
        this.showLoading(form);
        
        setTimeout(() => {
            this.hideLoading(form);
            form.reset();
            this.showToast('Successfully subscribed to newsletter!', 'success');
            this.trackEvent('newsletter_subscription', { email });
        }, 1500);
    }

    // Quiz System
    startQuiz(mode = 'quick') {
        if (!this.user) {
            this.showToast('Please sign in to track your progress', 'warning');
            this.openAuthModal();
            return;
        }
        
        window.location.href = `quiz-integrated.html?mode=${mode}`;
    }

    // Profile
    viewProfile() {
        if (!this.user) {
            this.openAuthModal();
            return;
        }
        
        window.location.href = 'user-profile.html';
    }

    // Real-time Features
    setupRealTimeFeatures() {
        // Simulate live user count updates
        setInterval(() => {
            this.updateLiveStats();
        }, 10000);
        
        // Simulate notifications
        setInterval(() => {
            if (this.user && Math.random() > 0.7) {
                this.addNotification();
            }
        }, 30000);
    }

    updateLiveStats() {
        const onlineCounters = document.querySelectorAll('[data-live-count]');
        onlineCounters.forEach(counter => {
            const baseCount = parseInt(counter.dataset.liveCount);
            const variation = Math.floor(Math.random() * 100) - 50;
            const newCount = Math.max(baseCount + variation, 0);
            counter.textContent = newCount.toLocaleString();
        });
    }

    addNotification() {
        const notifications = [
            'New daily challenge available!',
            'Someone just beat your high score!',
            'Weekly leaderboard updated',
            'New shortcuts added to VS Code'
        ];
        
        const message = notifications[Math.floor(Math.random() * notifications.length)];
        this.showToast(message, 'info');
        this.updateNotificationBadge();
    }

    updateNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            const count = parseInt(badge.textContent) + 1;
            badge.textContent = count;
            badge.style.animation = 'pulse 0.6s ease';
        }
    }

    // UI Helpers
    showLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <i data-lucide="loader-2" style="animation: spin 1s linear infinite;"></i>
                <span>Processing...</span>
            `;
        }
    }

    hideLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            // Restore original content based on form type
            if (form.id === 'signinForm') {
                submitBtn.innerHTML = `
                    <i data-lucide="log-in"></i>
                    <span>Sign In</span>
                `;
            } else if (form.id === 'signupForm') {
                submitBtn.innerHTML = `
                    <i data-lucide="user-plus"></i>
                    <span>Create Account</span>
                `;
            } else {
                submitBtn.innerHTML = `
                    <i data-lucide="send"></i>
                    <span>Subscribe</span>
                `;
            }
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    showToast(message, type = 'info', duration = 4000) {
        const container = this.getToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i data-lucide="${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i data-lucide="x"></i>
            </button>
        `;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        toast.style.cssText = `
            position: relative;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            margin-bottom: 1rem;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 1rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        `;
        
        container.appendChild(toast);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    getToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };
        return icons[type] || 'info';
    }

    closeAllModals() {
        this.closeSearch();
        this.closeAuthModal();
        
        // Close any other modals
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => modal.classList.remove('active'));
    }

    showKeyboardHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'keyboard-help-modal';
        helpModal.innerHTML = `
            <div class="help-overlay" onclick="this.parentElement.remove()"></div>
            <div class="help-content">
                <div class="help-header">
                    <h3>⌨️ Keyboard Shortcuts</h3>
                    <button onclick="this.parentElement.parentElement.remove()">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="shortcuts-list">
                    <div class="shortcut-item">
                        <div class="shortcut-keys">
                            <kbd>Ctrl</kbd> + <kbd>K</kbd>
                        </div>
                        <span>Open Search</span>
                    </div>
                    <div class="shortcut-item">
                        <div class="shortcut-keys">
                            <kbd>Ctrl</kbd> + <kbd>/</kbd>
                        </div>
                        <span>Show This Help</span>
                    </div>
                    <div class="shortcut-item">
                        <div class="shortcut-keys">
                            <kbd>Esc</kbd>
                        </div>
                        <span>Close Modals</span>
                    </div>
                </div>
            </div>
        `;
        
        helpModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10002;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(helpModal);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Utility Functions
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    updateScrollProgress() {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxScroll) * 100;
        
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    adjustResponsiveLayout() {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth < 1024;
        
        // Adjust grid layouts for mobile
        if (isMobile) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
        
        if (isTablet) {
            document.body.classList.add('tablet');
        } else {
            document.body.classList.remove('tablet');
        }
    }

    trackEvent(eventName, data = {}) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'app_interaction',
                ...data
            });
        }
        
        console.log('Event tracked:', eventName, data);
    }

    // Public API
    getUser() {
        return this.user;
    }

    getFavorites() {
        return this.favorites;
    }

    getTheme() {
        return this.theme;
    }

    isUserLoggedIn() {
        return !!this.user;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ShortcutSenseiApp();
});

// Export for global access
window.ShortcutSenseiApp = ShortcutSenseiApp;