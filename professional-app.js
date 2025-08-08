// Professional Application Controller
class ShortcutSenseiApp {
    constructor() {
        this.isLoaded = false;
        this.notifications = [];
        this.analytics = {
            pageViews: 0,
            interactions: 0,
            timeSpent: 0
        };
        this.init();
    }

    init() {
        this.showLoadingScreen();
        this.setupPerformanceOptimizations();
        this.setupScrollAnimations();
        this.setupAdvancedSearch();
        this.setupNotificationSystem();
        this.setupAnalytics();
        this.setupKeyboardNavigation();
        this.hideLoadingScreen();
    }

    showLoadingScreen() {
        const loadingHTML = `
            <div class="loading-overlay" id="loadingOverlay">
                <div class="loading-content">
                    <div class="loading-logo">
                        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#667eea"/>
                                    <stop offset="100%" style="stop-color:#764ba2"/>
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            <path d="M50 5L85 20V50L75 80L50 95L25 80L15 50V20L50 5Z" fill="url(#logoGradient)" filter="url(#glow)"/>
                            <circle cx="50" cy="30" r="5" fill="white" opacity="0.9"/>
                            <circle cx="35" cy="45" r="3" fill="white" opacity="0.7"/>
                            <circle cx="65" cy="45" r="3" fill="white" opacity="0.7"/>
                            <rect x="35" y="60" width="8" height="8" rx="1" fill="white" opacity="0.6"/>
                            <rect x="46" y="60" width="8" height="8" rx="1" fill="white" opacity="0.6"/>
                            <rect x="57" y="60" width="8" height="8" rx="1" fill="white" opacity="0.6"/>
                        </svg>
                    </div>
                    <div class="loading-text">Shortcut Sensei</div>
                    <div class="loading-subtext">Loading the future of productivity...</div>
                    <div class="loading-spinner"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.add('fade-out');
                setTimeout(() => overlay.remove(), 500);
            }
            this.isLoaded = true;
            this.analytics.pageViews++;
        }, 1500);
    }

    setupPerformanceOptimizations() {
        // Optimize images with lazy loading
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Optimize heavy DOM operations
        this.debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }

    setupAdvancedSearch() {
        const searchContainer = document.querySelector('.hero-search') || document.querySelector('.search-container');
        if (!searchContainer) return;

        const searchInput = searchContainer.querySelector('input') || searchContainer.querySelector('.search-input');
        if (!searchInput) return;

        // Enhanced search with autocomplete
        const suggestions = [
            'VS Code shortcuts', 'Photoshop shortcuts', 'Chrome shortcuts',
            'Windows shortcuts', 'Mac shortcuts', 'Excel shortcuts',
            'Word shortcuts', 'PowerPoint shortcuts', 'Outlook shortcuts',
            'Figma shortcuts', 'Slack shortcuts', 'Zoom shortcuts'
        ];

        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        suggestionsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        `;
        searchContainer.appendChild(suggestionsContainer);

        const debouncedSearch = this.debounce((value) => {
            if (value.length < 2) {
                suggestionsContainer.style.display = 'none';
                return;
            }

            const filtered = suggestions.filter(s => 
                s.toLowerCase().includes(value.toLowerCase())
            );

            if (filtered.length > 0) {
                suggestionsContainer.innerHTML = filtered.map(suggestion => 
                    `<div class="suggestion-item" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">
                        ${suggestion}
                    </div>`
                ).join('');
                suggestionsContainer.style.display = 'block';

                // Add click handlers
                suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                    item.addEventListener('click', () => {
                        searchInput.value = item.textContent.trim();
                        suggestionsContainer.style.display = 'none';
                        this.performSearch(item.textContent.trim());
                    });
                });
            } else {
                suggestionsContainer.style.display = 'none';
            }
        }, 300);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(searchInput.value);
                suggestionsContainer.style.display = 'none';
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                suggestionsContainer.style.display = 'none';
            }
        });
    }

    performSearch(query) {
        this.analytics.interactions++;
        this.showNotification(`Searching for "${query}"...`, 'info');
        
        // Simulate search delay
        setTimeout(() => {
            this.showNotification(`Found results for "${query}"`, 'success');
        }, 1000);
    }

    setupNotificationSystem() {
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.id = 'notificationContainer';
        document.body.appendChild(this.notificationContainer);
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: 10px;">×</button>
            </div>
        `;

        this.notificationContainer.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    setupAnalytics() {
        // Track time spent
        this.startTime = Date.now();
        
        // Track interactions
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                this.analytics.interactions++;
            }
        });

        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.analytics.timeSpent += Date.now() - this.startTime;
            } else {
                this.startTime = Date.now();
            }
        });

        // Send analytics on page unload
        window.addEventListener('beforeunload', () => {
            this.analytics.timeSpent += Date.now() - this.startTime;
            console.log('Session Analytics:', this.analytics);
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('.search-input') || document.querySelector('input[type="search"]');
                if (searchInput) {
                    searchInput.focus();
                    this.showNotification('Search activated!', 'info', 1000);
                }
            }

            // Escape to close modals/notifications
            if (e.key === 'Escape') {
                const notifications = document.querySelectorAll('.notification');
                notifications.forEach(n => n.remove());
                
                const modals = document.querySelectorAll('.modal.show');
                modals.forEach(m => m.classList.remove('show'));
            }

            // Arrow keys for navigation
            if (e.key === 'ArrowLeft' && e.altKey) {
                window.history.back();
            }
            
            if (e.key === 'ArrowRight' && e.altKey) {
                window.history.forward();
            }
        });

        // Show keyboard shortcuts help
        this.showNotification('Tip: Press Ctrl+K to search, Alt+← to go back!', 'info', 5000);
    }

    // Professional progress tracking
    updateProgress(current, total) {
        const progressBars = document.querySelectorAll('.progress-bar');
        const percentage = (current / total) * 100;
        
        progressBars.forEach(bar => {
            bar.style.width = `${percentage}%`;
        });
    }

    // Theme management
    toggleTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        this.showNotification(`Switched to ${isDark ? 'light' : 'dark'} theme`, 'success');
    }

    // Initialize theme from localStorage
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

// Auto-initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.shortcutSenseiApp = new ShortcutSenseiApp();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShortcutSenseiApp;
}
