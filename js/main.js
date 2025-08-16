// Enhanced Shortcut Sensei - Main Application Logic

class ShortcutSensei {
    constructor() {
        this.initialized = false;
        this.user = null;
        this.theme = localStorage.getItem('theme') || 'dark';
        this.apps = this.getApplicationsData();
        this.searchIndex = [];
        this.observers = new Map();
        this.animations = new Map();
        
        this.init();
    }

    async init() {
        try {
            // Set initial theme
            this.setTheme(this.theme);
            
            // Initialize core components
            await this.initializeComponents();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize animations
            this.initializeAnimations();
            
            // Load user data
            await this.loadUserData();
            
            // Setup intersection observers
            this.setupIntersectionObservers();
            
            // Hide preloader
            this.hidePreloader();
            
            this.initialized = true;
            console.log('🚀 Shortcut Sensei Enhanced - Initialized successfully');
            
        } catch (error) {
            console.error('❌ Initialization error:', error);
            this.showToast('Failed to initialize application', 'error');
        }
    }

    async initializeComponents() {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Setup search functionality
        this.buildSearchIndex();
        
        // Initialize statistics counters
        this.initializeCounters();
        
        // Load applications grid
        this.loadApplicationsGrid();
        
        // Setup authentication
        this.initializeAuth();
    }

    setupEventListeners() {
        // Navigation events
        document.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('submit', this.handleSubmit.bind(this));
        document.addEventListener('input', this.handleInput.bind(this));
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Window events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 10));
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        
        // Theme system
        this.setupThemeToggle();
        
        // Mobile menu
        this.setupMobileMenu();
        
        // Search functionality
        this.setupSearch();
        
        // Footer functionality
        this.setupFooter();
    }

    handleClick(e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;
        
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
            case 'start-learning':
            case 'get-started':
                this.showAuthModal();
                break;
            case 'explore-apps':
            case 'view-all-apps':
                this.navigateTo('all-applications.html');
                break;
            case 'take-quiz':
                this.navigateTo('quiz.html');
                break;
            case 'close-modal':
            case 'close-auth-modal':
                this.closeModal();
                break;
            default:
                console.log('Unhandled action:', action);
        }
    }

    handleSubmit(e) {
        const form = e.target;
        if (!form.matches('form')) return;
        
        e.preventDefault();
        
        if (form.id === 'signup-form') {
            this.handleSignup(form);
        } else if (form.id === 'login-form') {
            this.handleLogin(form);
        }
    }

    handleInput(e) {
        if (e.target.id === 'search-input') {
            this.debounce(this.performSearch.bind(this), 300)(e.target.value);
        }
    }

    handleKeydown(e) {
        // Global keyboard shortcuts disabled - search functionality removed
        if (e.key === 'Escape') {
            this.closeModal();
        }
    }

    handleScroll() {
        const nav = document.getElementById('main-nav');
        if (window.scrollY > 50) {
            nav?.classList.add('scrolled');
        } else {
            nav?.classList.remove('scrolled');
        }
        
        // Update active navigation item
        this.updateActiveNavItem();
    }

    handleResize() {
        // Handle responsive adjustments
        this.adjustLayoutForScreenSize();
    }

    // Theme System
    setupThemeToggle() {
        const toggles = document.querySelectorAll('[data-action="toggle-theme"], .theme-toggle, .theme-toggle-footer');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.toggleTheme());
        });
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme toggle icons
        const icons = document.querySelectorAll('.theme-icon, .theme-toggle i, .theme-toggle-footer i');
        icons.forEach(icon => {
            if (theme === 'dark') {
                icon.setAttribute('data-lucide', 'sun');
            } else {
                icon.setAttribute('data-lucide', 'moon');
            }
        });
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    toggleTheme() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    // Search Functionality
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchOverlay = document.getElementById('search-overlay');
        
        searchInput?.addEventListener('focus', () => {
            this.showSearchSuggestions();
        });
        
        searchOverlay?.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                this.closeSearch();
            }
        });
    }    // DISABLED:    // DISABLED:  

    toggleSearch() {
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('search-input');
        
        if (overlay?.classList.contains('active')) {
            this.closeSearch();
        } else {
            overlay?.classList.add('active');
            setTimeout(() => input?.focus(), 100);
        }
    }    // DISABLED:    // DISABLED:  

    closeSearch() {
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('search-input');
        
        overlay?.classList.remove('active');
        input && (input.value = '');
        this.clearSearchResults();
    }

    buildSearchIndex() {
        this.searchIndex = [
            // Applications
            ...this.apps.map(app => ({
                type: 'application',
                title: app.name,
                description: app.description,
                category: app.category,
                url: app.url,
                keywords: app.keywords || []
            })),
            
            // Common shortcuts
            { type: 'shortcut', title: 'Copy', description: 'Ctrl+C / Cmd+C', keywords: ['copy', 'duplicate'] },
            { type: 'shortcut', title: 'Paste', description: 'Ctrl+V / Cmd+V', keywords: ['paste', 'insert'] },
            { type: 'shortcut', title: 'Cut', description: 'Ctrl+X / Cmd+X', keywords: ['cut', 'move'] },
            { type: 'shortcut', title: 'Undo', description: 'Ctrl+Z / Cmd+Z', keywords: ['undo', 'revert'] },
            { type: 'shortcut', title: 'Redo', description: 'Ctrl+Y / Cmd+Shift+Z', keywords: ['redo', 'repeat'] },
            { type: 'shortcut', title: 'Select All', description: 'Ctrl+A / Cmd+A', keywords: ['select', 'all'] },
            { type: 'shortcut', title: 'Find', description: 'Ctrl+F / Cmd+F', keywords: ['find', 'search'] },
            { type: 'shortcut', title: 'Save', description: 'Ctrl+S / Cmd+S', keywords: ['save', 'store'] },
            
            // Pages
            { type: 'page', title: 'Applications', description: 'Browse all available applications', url: 'all-applications.html' },
            { type: 'page', title: 'Quiz', description: 'Test your shortcut knowledge', url: 'quiz.html' },
            { type: 'page', title: 'About', description: 'Learn more about Shortcut Sensei', url: 'About.htm' },
            { type: 'page', title: 'Blog', description: 'Read our latest articles', url: 'blogs.html' }
        ];
    }    // DISABLED:    // DISABLED:  

    performSearch(query) {
        if (!query.trim()) {
            this.showSearchSuggestions();
            return;
        }
        
        const results = this.searchIndex.filter(item => {
            const searchTerms = query.toLowerCase().split(' ');
            const searchableText = [
                item.title,
                item.description,
                item.category,
                ...(item.keywords || [])
            ].join(' ').toLowerCase();
            
            return searchTerms.every(term => searchableText.includes(term));
        });
        
        this.displaySearchResults(results);
    }

    showSearchSuggestions() {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;
        
        resultsContainer.innerHTML = `
            <div class="search-suggestions">
                <div class="suggestion-category">
                    <h4>Popular Searches</h4>
                    <div class="suggestions">
                        <span class="suggestion" data-query="VS Code">VS Code</span>
                        <span class="suggestion" data-query="Photoshop">Photoshop</span>
                        <span class="suggestion" data-query="Chrome">Chrome</span>
                        <span class="suggestion" data-query="Copy">Copy</span>
                        <span class="suggestion" data-query="Paste">Paste</span>
                        <span class="suggestion" data-query="Save">Save</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add click handlers for suggestions
        resultsContainer.querySelectorAll('.suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                const query = suggestion.dataset.query;
                document.getElementById('search-input').value = query;
                this.performSearch(query);
            });
        });
    }

    displaySearchResults(results) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No results found. Try different keywords.</p>
                </div>
            `;
            return;
        }
        
        const groupedResults = this.groupSearchResults(results);
        let html = '';
        
        Object.entries(groupedResults).forEach(([type, items]) => {
            if (items.length === 0) return;
            
            html += `
                <div class="result-category">
                    <h4>${this.capitalizeFirst(type)}s</h4>
                    <div class="result-items">
                        ${items.map(item => `
                            <div class="result-item" data-url="${item.url || '#'}">
                                <div class="result-title">${item.title}</div>
                                <div class="result-description">${item.description}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        resultsContainer.innerHTML = html;
        
        // Add click handlers for results
        resultsContainer.querySelectorAll('.result-item').forEach(item => {
            item.addEventListener('click', () => {
                const url = item.dataset.url;
                if (url && url !== '#') {
                    this.navigateTo(url);
                    this.closeSearch();
                }
            });
        });
    }

    groupSearchResults(results) {
        return results.reduce((groups, item) => {
            const type = item.type;
            if (!groups[type]) groups[type] = [];
            groups[type].push(item);
            return groups;
        }, {});
    }

    clearSearchResults() {
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
    }

    // Mobile Menu
    setupMobileMenu() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const menu = document.getElementById('nav-menu');
        
        toggle?.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu?.classList.toggle('active');
        });
    }

    toggleMobileMenu() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const menu = document.getElementById('nav-menu');
        
        toggle?.classList.toggle('active');
        menu?.classList.toggle('active');
    }

    // Navigation
    updateActiveNavItem() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    navigateTo(url) {
        if (url.startsWith('#')) {
            const element = document.querySelector(url);
            element?.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = url;
        }
    }

    // Statistics Counters
    initializeCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            // Start counter when element is in view
            this.observeElement(counter, () => {
                updateCounter();
            }, { once: true });
        });
    }

    // Applications Grid
    loadApplicationsGrid() {
        const grid = document.getElementById('apps-grid');
        if (!grid) return;
        
        // Show first 6 apps
        const featuredApps = this.apps.slice(0, 6);
        
        grid.innerHTML = featuredApps.map(app => `
            <a href="${app.url}" class="app-card scroll-animate">
                <div class="app-icon">
                    <i data-lucide="${app.icon}"></i>
                </div>
                <h3>${app.name}</h3>
                <p>${app.description}</p>
                <span class="shortcut-count">${app.shortcutCount}+ shortcuts</span>
            </a>
        `).join('');
        
        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Setup category filtering
        this.setupCategoryFiltering();
    }

    setupCategoryFiltering() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        const grid = document.getElementById('apps-grid');
        
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                // Update active button
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter apps
                let filteredApps = category === 'all' 
                    ? this.apps.slice(0, 6)
                    : this.apps.filter(app => app.category === category).slice(0, 6);
                
                // Update grid with animation
                this.updateAppsGrid(grid, filteredApps);
            });
        });
    }

    updateAppsGrid(grid, apps) {
        grid.style.opacity = '0';
        
        setTimeout(() => {
            grid.innerHTML = apps.map(app => `
                <a href="${app.url}" class="app-card">
                    <div class="app-icon">
                        <i data-lucide="${app.icon}"></i>
                    </div>
                    <h3>${app.name}</h3>
                    <p>${app.description}</p>
                    <span class="shortcut-count">${app.shortcutCount}+ shortcuts</span>
                </a>
            `).join('');
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            grid.style.opacity = '1';
        }, 150);
    }

    // Authentication
    initializeAuth() {
        this.setupAuthTabs();
        this.loadUserState();
    }

    setupAuthTabs() {
        const tabs = document.querySelectorAll('.auth-tab');
        const forms = document.querySelectorAll('.auth-form');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetForm = tab.dataset.tab;
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding form
                forms.forEach(form => {
                    if (form.id === `${targetForm}-form`) {
                        form.style.display = 'block';
                    } else {
                        form.style.display = 'none';
                    }
                });
            });
        });
    }

    showAuthModal() {
        const modal = document.getElementById('auth-modal');
        modal?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    async handleSignup(form) {
        const formData = new FormData(form);
        const name = formData.get('name') || document.getElementById('signup-name').value;
        const email = formData.get('email') || document.getElementById('signup-email').value;
        const password = formData.get('password') || document.getElementById('signup-password').value;
        
        if (!name || !email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showToast('Password must be at least 6 characters long', 'error');
            return;
        }
        
        try {
            // Simulate API call
            await this.delay(1000);
            
            const user = {
                name,
                email,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
                joinDate: new Date().toISOString(),
                level: 1,
                xp: 0,
                streak: 0
            };
            
            this.setUser(user);
            this.closeModal();
            this.showToast(`Welcome, ${name}! Account created successfully.`, 'success');
            
        } catch (error) {
            console.error('Signup error:', error);
            this.showToast('Failed to create account. Please try again.', 'error');
        }
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email') || document.getElementById('login-email').value;
        const password = formData.get('password') || document.getElementById('login-password').value;
        
        if (!email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }
        
        try {
            // Simulate API call
            await this.delay(1000);
            
            const user = {
                name: 'Demo User',
                email,
                avatar: `https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff`,
                joinDate: '2024-01-01T00:00:00.000Z',
                level: 15,
                xp: 2450,
                streak: 12
            };
            
            this.setUser(user);
            this.closeModal();
            this.showToast(`Welcome back!`, 'success');
            
        } catch (error) {
            console.error('Login error:', error);
            this.showToast('Invalid credentials. Please try again.', 'error');
        }
    }

    setUser(user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        this.updateUserInterface();
    }

    loadUserState() {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.user = JSON.parse(savedUser);
            this.updateUserInterface();
        }
    }

    updateUserInterface() {
        const authBtn = document.getElementById('auth-btn');
        
        if (this.user && authBtn) {
            authBtn.innerHTML = `
                <img src="${this.user.avatar}" alt="${this.user.name}" style="width: 24px; height: 24px; border-radius: 50%;">
                <span>${this.user.name}</span>
            `;
            authBtn.removeEventListener('click', this.showAuthModal);
            authBtn.addEventListener('click', () => this.showUserMenu());
        }
    }

    showUserMenu() {
        // Implementation for user menu dropdown
        this.showToast('User menu coming soon!', 'info');
    }

    async loadUserData() {
        try {
            // Load user preferences, progress, etc.
            this.loadUserState();
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }

    // Animations
    initializeAnimations() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale');
        
        animatedElements.forEach(element => {
            this.observeElement(element, () => {
                element.classList.add('in-view');
            });
        });
    }

    setupHoverAnimations() {
        // Add hover animations to interactive elements
        const interactiveElements = document.querySelectorAll('.btn-primary, .btn-secondary, .app-card, .feature-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-2px)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }

    // Intersection Observer
    observeElement(element, callback, options = {}) {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
            once: false,
            ...options
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry);
                    if (defaultOptions.once) {
                        observer.unobserve(element);
                    }
                }
            });
        }, defaultOptions);
        
        observer.observe(element);
        this.observers.set(element, observer);
    }

    setupIntersectionObservers() {
        // Observe sections for navigation highlighting
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            this.observeElement(section, (entry) => {
                // Section is in view
            });
        });
    }

    // Toast Notifications
    showToast(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i data-lucide="${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i data-lucide="x"></i>
            </button>
        `;
        
        container.appendChild(toast);
        
        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
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

    // Preloader
    hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => preloader.remove(), 500);
            }, 1000);
        }
    }

    // Utility Functions
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

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    adjustLayoutForScreenSize() {
        // Handle responsive adjustments
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth < 1024;
        
        // Adjust animations for performance on mobile
        if (isMobile) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    getApplicationsData() {
        return [
            {
                name: 'VS Code',
                description: 'Powerful code editor with extensive shortcut support',
                category: 'development',
                icon: 'code',
                url: 'Visual Studio.html',
                shortcutCount: 150,
                keywords: ['vscode', 'visual studio code', 'editor', 'programming']
            },
            {
                name: 'Photoshop',
                description: 'Professional image editing with creative shortcuts',
                category: 'design',
                icon: 'image',
                url: 'Adobe PhotoShop.html',
                shortcutCount: 200,
                keywords: ['adobe', 'photo', 'image', 'design']
            },
            {
                name: 'Chrome',
                description: 'Browse efficiently with powerful keyboard shortcuts',
                category: 'browser',
                icon: 'globe',
                url: 'Google Chrome.html',
                shortcutCount: 80,
                keywords: ['browser', 'google', 'web']
            },
            {
                name: 'Microsoft Word',
                description: 'Document creation and editing made faster',
                category: 'productivity',
                icon: 'file-text',
                url: 'Microsoft Word.htm',
                shortcutCount: 120,
                keywords: ['word', 'document', 'office', 'writing']
            },
            {
                name: 'Excel',
                description: 'Spreadsheet mastery with essential shortcuts',
                category: 'productivity',
                icon: 'grid-3x3',
                url: 'Microsoft Excell.htm',
                shortcutCount: 100,
                keywords: ['excel', 'spreadsheet', 'data', 'office']
            },
            {
                name: 'Slack',
                description: 'Team communication shortcuts for productivity',
                category: 'productivity',
                icon: 'message-square',
                url: 'Slack.htm',
                shortcutCount: 50,
                keywords: ['slack', 'chat', 'team', 'communication']
            }
        ];
    }

    // Cleanup
    destroy() {
        // Clean up observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Clear animations
        this.animations.clear();
        
        // Remove event listeners
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('submit', this.handleSubmit);
        document.removeEventListener('input', this.handleInput);
        document.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        this.initialized = false;
        console.log('🧹 Shortcut Sensei - Cleaned up');
    }
    
    setupFooter() {
        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSignup(e.target);
            });
        }
        
        // Back to top button
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        // Language selector
        const languageSelect = document.querySelector('.language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
        
        // Footer theme toggle
        const footerThemeToggle = document.getElementById('footer-theme-toggle');
        if (footerThemeToggle) {
            footerThemeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
    
    handleNewsletterSignup(form) {
        const email = form.querySelector('.newsletter-input').value;
        
        if (!this.validateEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate API call
        this.showToast('Processing subscription...', 'info');
        
        setTimeout(() => {
            this.showToast('Successfully subscribed to newsletter! 🎉', 'success');
            form.reset();
        }, 1500);
    }
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    changeLanguage(language) {
        // Store language preference
        localStorage.setItem('language', language);
        this.showToast(`Language changed to ${this.getLanguageName(language)}`, 'success');
        
        // In a real app, this would trigger language switching
        console.log(`Language changed to: ${language}`);
    }
    
    getLanguageName(code) {
        const languages = {
            'en': 'English',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch',
            'ja': '日本語',
            'zh': '中文'
        };
        return languages[code] || code;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.shortcutSensei = new ShortcutSensei();
    });
} else {
    window.shortcutSensei = new ShortcutSensei();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShortcutSensei;
}
