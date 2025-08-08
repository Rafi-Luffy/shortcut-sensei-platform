// Shortcut Sensei - Main Application Logic

class ShortcutSensei {
    constructor() {
        this.user = this.loadUser();
        this.apps = this.loadApplications();
        this.searchIndex = this.buildSearchIndex();
        this.init();
    }

    init() {
        this.initializeIcons();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.updateUserInterface();
        this.generateActivityHeatmap();
        console.log('🚀 Shortcut Sensei initialized');
    }

    initializeIcons() {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('submit', this.handleSubmit.bind(this));
        document.addEventListener('input', this.handleInput.bind(this));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Scroll events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Resize events
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleClick(e) {
        const action = e.target.closest('[data-action]')?.dataset.action;
        if (!action) return;

        e.preventDefault();
        
        switch (action) {
            case 'toggle-search':
                this.toggleSearch();
                break;
            case 'toggle-profile':
                this.toggleProfileMenu();
                break;
            case 'toggle-mobile-menu':
                this.toggleMobileMenu();
                break;
            case 'start-learning':
            case 'explore-apps':
                this.scrollToSection('applications');
                break;
            case 'take-quiz':
                this.scrollToSection('quiz');
                break;
            case 'start-quiz':
                this.startQuiz();
                break;
            case 'battle-mode':
            case 'start-battle':
                this.startBattle();
                break;
            case 'view-achievements':
                this.scrollToSection('profile');
                break;
            case 'sign-up':
                this.showAuthModal('signup');
                break;
            case 'close-modal':
                this.closeModal();
                break;
            case 'like-post':
                this.likePost(e.target.closest('[data-action="like-post"]'));
                break;
            case 'reply-post':
                this.showToast('Reply feature coming soon!', 'info');
                break;
            case 'share-post':
                this.sharePost();
                break;
        }
    }

    handleSubmit(e) {
        const form = e.target.closest('[data-form]');
        if (!form) return;

        e.preventDefault();
        const formType = form.dataset.form;
        
        if (formType === 'signup') {
            this.handleSignup(form);
        } else if (formType === 'login') {
            this.handleLogin(form);
        }
    }

    handleInput(e) {
        const input = e.target.closest('[data-input]');
        if (!input) return;

        const inputType = input.dataset.input;
        
        if (inputType === 'global-search') {
            this.performSearch(input.value);
        }
    }

    handleKeydown(e) {
        // Global keyboard shortcuts
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.toggleSearch();
        }
        
        if (e.key === 'Escape') {
            this.closeModal();
            this.closeSearch();
        }
    }

    handleScroll() {
        // Update active navigation based on scroll position
        this.updateActiveNavigation();
    }

    handleResize() {
        // Handle responsive behavior
        this.updateResponsiveElements();
    }

    // Navigation Methods
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    updateActiveNavigation() {
        const sections = ['home', 'applications', 'quiz', 'community', 'profile'];
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = 'home';
        
        for (const sectionId of sections) {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    currentSection = sectionId;
                    break;
                }
            }
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Search Functionality
    toggleSearch() {
        const overlay = document.querySelector('[data-element="search-overlay"]');
        const input = document.querySelector('[data-input="global-search"]');
        
        overlay.classList.toggle('active');
        
        if (overlay.classList.contains('active')) {
            setTimeout(() => input.focus(), 100);
        }
    }

    closeSearch() {
        const overlay = document.querySelector('[data-element="search-overlay"]');
        overlay.classList.remove('active');
    }

    performSearch(query) {
        if (!query.trim()) {
            this.clearSearchResults();
            return;
        }

        const results = this.searchIndex.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );

        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        const container = document.querySelector('[data-element="search-results"]');
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="search-result">
                    <p>No results found. Try searching for "Chrome", "VS Code", or "shortcuts".</p>
                </div>
            `;
            return;
        }

        container.innerHTML = results.slice(0, 8).map(result => `
            <div class="search-result" data-action="navigate" data-target="${result.id}">
                <h4>${result.title}</h4>
                <p>${result.description}</p>
            </div>
        `).join('');
    }

    clearSearchResults() {
        const container = document.querySelector('[data-element="search-results"]');
        container.innerHTML = '';
    }

    buildSearchIndex() {
        return [
            {
                id: 'chrome',
                title: 'Google Chrome',
                description: 'Browser shortcuts for faster web navigation',
                tags: ['browser', 'web', 'google', 'tabs']
            },
            {
                id: 'vscode',
                title: 'Visual Studio Code',
                description: 'Code editor shortcuts for developers',
                tags: ['editor', 'code', 'development', 'programming']
            },
            {
                id: 'photoshop',
                title: 'Adobe Photoshop',
                description: 'Design shortcuts for photo editing',
                tags: ['design', 'photo', 'editing', 'adobe']
            },
            {
                id: 'windows',
                title: 'Windows 11',
                description: 'System shortcuts for Windows navigation',
                tags: ['windows', 'system', 'os', 'navigation']
            },
            {
                id: 'excel',
                title: 'Microsoft Excel',
                description: 'Spreadsheet shortcuts for data analysis',
                tags: ['excel', 'spreadsheet', 'data', 'microsoft']
            }
        ];
    }

    // Applications Management
    loadApplications() {
        return [
            {
                id: 'chrome',
                name: 'Google Chrome',
                category: 'browsers',
                shortcuts: 120,
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg',
                bookmarked: false
            },
            {
                id: 'vscode',
                name: 'Visual Studio Code',
                category: 'editors',
                shortcuts: 200,
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
                bookmarked: false
            },
            {
                id: 'photoshop',
                name: 'Adobe Photoshop',
                category: 'design',
                shortcuts: 150,
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg',
                bookmarked: false
            },
            {
                id: 'figma',
                name: 'Figma',
                category: 'design',
                shortcuts: 80,
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
                bookmarked: false
            },
            {
                id: 'excel',
                name: 'Microsoft Excel',
                category: 'productivity',
                shortcuts: 180,
                icon: 'https://img.icons8.com/color/48/microsoft-excel-2019.png',
                bookmarked: false
            },
            {
                id: 'slack',
                name: 'Slack',
                category: 'productivity',
                shortcuts: 60,
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg',
                bookmarked: false
            },
            {
                id: 'discord',
                name: 'Discord',
                category: 'productivity',
                shortcuts: 45,
                icon: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png',
                bookmarked: false
            },
            {
                id: 'spotify',
                name: 'Spotify',
                category: 'productivity',
                shortcuts: 35,
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spotify/spotify-original.svg',
                bookmarked: false
            }
        ];
    }

    renderApplications(filter = 'all') {
        const container = document.querySelector('[data-element="apps-grid"]');
        const filteredApps = filter === 'all' 
            ? this.apps 
            : this.apps.filter(app => app.category === filter);

        container.innerHTML = filteredApps.map((app, index) => `
            <div class="app-card fade-in-up" style="animation-delay: ${index * 0.1}s" data-app="${app.id}">
                <button class="app-bookmark ${app.bookmarked ? 'bookmarked' : ''}" 
                        data-action="toggle-bookmark" data-app="${app.id}">
                    <i data-lucide="bookmark"></i>
                </button>
                <div class="app-icon">
                    <img src="${app.icon}" alt="${app.name}" loading="lazy">
                </div>
                <h3 class="app-name">${app.name}</h3>
                <p class="app-shortcuts">${app.shortcuts}+ shortcuts</p>
            </div>
        `).join('');

        // Re-initialize icons for new content
        this.initializeIcons();
        
        // Add click handlers for bookmark buttons
        container.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="toggle-bookmark"]')) {
                const appId = e.target.closest('[data-action="toggle-bookmark"]').dataset.app;
                this.toggleBookmark(appId);
            }
        });
    }

    filterApplications(category) {
        // Update active filter button
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${category}"]`).classList.add('active');
        
        // Render filtered apps
        this.renderApplications(category);
    }

    toggleBookmark(appId) {
        const app = this.apps.find(a => a.id === appId);
        if (app) {
            app.bookmarked = !app.bookmarked;
            this.saveApps();
            
            const button = document.querySelector(`[data-app="${appId}"][data-action="toggle-bookmark"]`);
            button.classList.toggle('bookmarked');
            
            this.showToast(
                app.bookmarked ? 'Added to bookmarks!' : 'Removed from bookmarks',
                'success'
            );
        }
    }

    // User Management
    loadUser() {
        const saved = localStorage.getItem('shortcut-sensei-user');
        return saved ? JSON.parse(saved) : {
            name: 'Productivity Ninja',
            level: 15,
            xp: 2450,
            streak: 12,
            stats: {
                shortcutsMastered: 156,
                quizAverage: 89,
                battleWins: 23
            },
            achievements: ['first-steps', 'week-warrior'],
            bookmarks: []
        };
    }

    saveUser() {
        localStorage.setItem('shortcut-sensei-user', JSON.stringify(this.user));
    }

    saveApps() {
        localStorage.setItem('shortcut-sensei-apps', JSON.stringify(this.apps));
    }

    updateUserInterface() {
        // Update streak counter
        const streakElement = document.querySelector('.streak-count');
        if (streakElement) {
            streakElement.textContent = this.user.streak;
        }

        // Update XP ring
        const xpProgress = document.querySelector('.xp-progress');
        if (xpProgress) {
            const progress = (this.user.xp % 100); // Assuming 100 XP per level
            xpProgress.style.strokeDasharray = `${progress}, 100`;
        }

        // Update level
        const levelElement = document.querySelector('.user-level');
        if (levelElement) {
            levelElement.textContent = `Lvl ${this.user.level}`;
        }

        // Update profile stats
        this.updateProfileStats();
    }

    updateProfileStats() {
        const stats = document.querySelectorAll('.profile-stats .stat-value');
        if (stats.length >= 3) {
            stats[0].textContent = this.user.stats.shortcutsMastered;
            stats[1].textContent = `${this.user.stats.quizAverage}%`;
            stats[2].textContent = this.user.stats.battleWins;
        }
    }

    // Authentication
    showAuthModal(tab = 'signup') {
        const modal = document.querySelector('[data-modal="auth"]');
        modal.classList.add('active');
        
        // Switch to correct tab
        this.switchAuthTab(tab);
    }

    switchAuthTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-content').forEach(c => c.style.display = 'none');
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.querySelector(`[data-content="${tab}"]`).style.display = 'block';
    }

    handleSignup(form) {
        const formData = new FormData(form);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        // Simulate signup process
        this.showLoading(form.querySelector('button'));
        
        setTimeout(() => {
            this.user.name = userData.name;
            this.saveUser();
            this.updateUserInterface();
            this.closeModal();
            this.showToast('Welcome to Shortcut Sensei! 🎉', 'success');
            this.hideLoading(form.querySelector('button'));
        }, 1500);
    }

    handleLogin(form) {
        const formData = new FormData(form);
        const userData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        // Simulate login process
        this.showLoading(form.querySelector('button'));
        
        setTimeout(() => {
            this.updateUserInterface();
            this.closeModal();
            this.showToast('Welcome back! 👋', 'success');
            this.hideLoading(form.querySelector('button'));
        }, 1500);
    }

    closeModal() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Quiz System
    startQuiz() {
        this.showToast('Quiz system launching soon! 🚀', 'info');
        // TODO: Implement full quiz system
    }

    startBattle() {
        this.showToast('1v1 Battle mode coming soon! ⚔️', 'info');
        // TODO: Implement battle system
    }

    // Mobile Menu
    toggleMobileMenu() {
        const menu = document.querySelector('.nav-menu');
        menu.classList.toggle('mobile-active');
    }

    toggleProfileMenu() {
        // TODO: Implement profile dropdown
        this.showToast('Profile menu coming soon!', 'info');
    }

    // Social Features
    likePost(button) {
        const countSpan = button.querySelector('span');
        let count = parseInt(countSpan.textContent);
        
        if (button.classList.contains('liked')) {
            count--;
            button.classList.remove('liked');
            this.showToast('Like removed', 'info');
        } else {
            count++;
            button.classList.add('liked');
            this.showToast('Post liked! ❤️', 'success');
        }
        
        countSpan.textContent = count;
    }

    sharePost() {
        if (navigator.share) {
            navigator.share({
                title: 'Shortcut Sensei',
                text: 'Check out this amazing productivity platform!',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            this.showToast('Link copied to clipboard!', 'success');
        }
    }

    // Utility Methods
    showToast(message, type = 'info') {
        const container = document.querySelector('[data-element="toast-container"]');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'x-circle' : 
                    type === 'warning' ? 'alert-triangle' : 'info';
        
        toast.innerHTML = `
            <i data-lucide="${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        this.initializeIcons();
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showLoading(element) {
        element.classList.add('loading');
        element.disabled = true;
    }

    hideLoading(element) {
        element.classList.remove('loading');
        element.disabled = false;
    }

    // Animation and Visual Effects
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateCounter(entry.target);
                    }
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, { threshold: 0.1 });

        // Observe stat numbers and other animated elements
        document.querySelectorAll('.stat-number, .app-card, .stat-card').forEach(el => {
            observer.observe(el);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = this.formatNumber(Math.floor(current));
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = this.formatNumber(target);
            }
        };

        updateCounter();
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    generateActivityHeatmap() {
        const container = document.querySelector('[data-element="activity-heatmap"]');
        if (!container) return;

        const days = 28; // 4 weeks
        let html = '';
        
        for (let i = 0; i < days; i++) {
            const activity = Math.floor(Math.random() * 5); // 0-4 activity levels
            const className = activity > 0 ? `heatmap-day active-${activity}` : 'heatmap-day';
            html += `<div class="${className}" data-tooltip="Day ${i + 1}"></div>`;
        }
        
        container.innerHTML = html;
    }

    updateResponsiveElements() {
        // Handle responsive behavior on resize
        const width = window.innerWidth;
        
        if (width <= 768) {
            // Mobile adjustments
            document.querySelector('.nav-center').style.display = 'none';
        } else {
            // Desktop adjustments
            document.querySelector('.nav-center').style.display = 'block';
            document.querySelector('.nav-menu').classList.remove('mobile-active');
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.shortcutSensei = new ShortcutSensei();
});

// Global utility functions
window.addEventListener('load', () => {
    // Initialize category filters
    document.querySelectorAll('.category-filter').forEach(filter => {
        filter.addEventListener('click', () => {
            const category = filter.dataset.filter;
            window.shortcutSensei.filterApplications(category);
        });
    });

    // Initialize auth tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            window.shortcutSensei.switchAuthTab(tabName);
        });
    });

    // Render initial applications
    window.shortcutSensei.renderApplications();
});