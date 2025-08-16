/* Enhanced Search System with Real-time Results */

class EnhancedSearchSystem {
    constructor() {
        this.searchToggle = document.getElementById('search-toggle');
        this.searchOverlay = document.getElementById('search-overlay');
        this.searchInput = document.getElementById('search-input');
        this.searchClose = document.getElementById('search-close');
        this.searchResults = document.getElementById('search-results');
        
        this.searchIndex = this.buildSearchIndex();
        this.recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.preloadSearchData();
    }
    
    setupEventListeners() {
        // Search toggle
        if (this.searchToggle) {
            this.searchToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.openSearch();
            });
        }
        
        // Close search
        if (this.searchClose) {
            this.searchClose.addEventListener('click', () => this.closeSearch());
        }
        
        // Overlay click to close
        if (this.searchOverlay) {
            this.searchOverlay.addEventListener('click', (e) => {
                if (e.target === this.searchOverlay) {
                    this.closeSearch();
                }
            });
        }
        
        // Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });
            
            this.searchInput.addEventListener('keydown', (e) => {
                this.handleKeyDown(e);
            });
            
            this.searchInput.addEventListener('focus', () => {
                if (!this.searchInput.value.trim()) {
                    this.showSuggestions();
                }
            });
        }
        
        // Results interaction
        if (this.searchResults) {
            this.searchResults.addEventListener('click', (e) => {
                this.handleResultClick(e);
            });
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Cmd+K or Ctrl+K to open search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
            
            // Escape to close search
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSearch();
            }
            
            // Forward slash to open search
            if (e.key === '/' && !this.isOpen && !this.isInputFocused()) {
                e.preventDefault();
                this.openSearch();
            }
        });
    }
    
    isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' || 
            activeElement.tagName === 'TEXTAREA' || 
            activeElement.contentEditable === 'true'
        );
    }
    
    openSearch() {
        if (this.searchOverlay) {
            this.isOpen = true;
            this.searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus input after animation
            setTimeout(() => {
                if (this.searchInput) {
                    this.searchInput.focus();
                    this.showSuggestions();
                }
            }, 150);
            
            // Track search open
            this.trackEvent('search_opened');
        }
    }
    
    closeSearch() {
        if (this.searchOverlay) {
            this.isOpen = false;
            this.searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Clear input and results
            if (this.searchInput) {
                this.searchInput.value = '';
            }
            this.clearResults();
        }
    }
    
    handleSearchInput(query) {
        const trimmedQuery = query.trim();
        
        if (!trimmedQuery) {
            this.showSuggestions();
            return;
        }
        
        // Debounce search
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.performSearch(trimmedQuery);
        }, 150);
    }
    
    handleKeyDown(e) {
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                this.selectFirstResult();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateResults('down');
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateResults('up');
                break;
        }
    }
    
    performSearch(query) {
        const results = this.searchInIndex(query);
        this.displayResults(results, query);
        
        // Track search
        this.trackEvent('search_performed', { query, results_count: results.length });
    }
    
    searchInIndex(query) {
        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(' ').filter(word => word.length > 0);
        
        return this.searchIndex
            .map(item => {
                let score = 0;
                const searchableText = [
                    item.title,
                    item.description,
                    item.category,
                    ...(item.keywords || [])
                ].join(' ').toLowerCase();
                
                // Exact title match gets highest score
                if (item.title.toLowerCase().includes(queryLower)) {
                    score += 100;
                }
                
                // Category match
                if (item.category.toLowerCase().includes(queryLower)) {
                    score += 50;
                }
                
                // Keyword matches
                queryWords.forEach(word => {
                    if (searchableText.includes(word)) {
                        score += 10;
                    }
                });
                
                // Description match
                if (item.description.toLowerCase().includes(queryLower)) {
                    score += 25;
                }
                
                return { ...item, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);
    }
    
    displayResults(results, query) {
        if (!this.searchResults) return;
        
        if (results.length === 0) {
            this.showNoResults(query);
            return;
        }
        
        const groupedResults = this.groupResults(results);
        let html = `
            <div class="search-results-header">
                <span class="results-count">Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"</span>
                <button class="clear-search" onclick="searchSystem.clearSearch()">
                    <i data-lucide="x"></i>
                </button>
            </div>
        `;
        
        Object.entries(groupedResults).forEach(([category, items]) => {
            if (items.length === 0) return;
            
            html += `
                <div class="result-category">
                    <h4 class="category-title">
                        <i data-lucide="${this.getCategoryIcon(category)}"></i>
                        ${this.formatCategoryName(category)}
                    </h4>
                    <div class="result-items">
                        ${items.map(item => this.createResultItem(item)).join('')}
                    </div>
                </div>
            `;
        });
        
        this.searchResults.innerHTML = html;
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Add recent search
        this.addRecentSearch(query);
    }
    
    createResultItem(item) {
        return `
            <div class="result-item" data-url="${item.url}" data-type="${item.type}">
                <div class="result-icon">
                    <i data-lucide="${item.icon || this.getTypeIcon(item.type)}"></i>
                </div>
                <div class="result-content">
                    <div class="result-title">${this.highlightQuery(item.title)}</div>
                    <div class="result-description">${this.highlightQuery(item.description)}</div>
                    ${item.shortcutCount ? `<div class="result-meta">${item.shortcutCount}+ shortcuts</div>` : ''}
                </div>
                <div class="result-action">
                    <i data-lucide="arrow-right"></i>
                </div>
            </div>
        `;
    }
    
    highlightQuery(text) {
        if (!this.searchInput || !this.searchInput.value) return text;
        
        const query = this.searchInput.value.trim();
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    showNoResults(query) {
        this.searchResults.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">
                    <i data-lucide="search-x"></i>
                </div>
                <h4>No results found</h4>
                <p>We couldn't find anything matching "${query}"</p>
                <div class="search-suggestions-alt">
                    <h5>Try searching for:</h5>
                    <div class="suggestion-chips">
                        <span class="suggestion-chip" onclick="searchSystem.searchFor('VS Code')">VS Code</span>
                        <span class="suggestion-chip" onclick="searchSystem.searchFor('Photoshop')">Photoshop</span>
                        <span class="suggestion-chip" onclick="searchSystem.searchFor('Chrome')">Chrome</span>
                        <span class="suggestion-chip" onclick="searchSystem.searchFor('Copy')">Copy</span>
                        <span class="suggestion-chip" onclick="searchSystem.searchFor('Paste')">Paste</span>
                    </div>
                </div>
            </div>
        `;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    showSuggestions() {
        if (!this.searchResults) return;
        
        let html = `
            <div class="search-suggestions-container">
        `;
        
        // Recent searches
        if (this.recentSearches.length > 0) {
            html += `
                <div class="suggestion-category">
                    <h4>
                        <i data-lucide="clock"></i>
                        Recent Searches
                    </h4>
                    <div class="recent-searches">
                        ${this.recentSearches.slice(0, 5).map(search => `
                            <div class="recent-search-item" onclick="searchSystem.searchFor('${search}')">
                                <i data-lucide="clock"></i>
                                <span>${search}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        // Popular searches
        html += `
            <div class="suggestion-category">
                <h4>
                    <i data-lucide="trending-up"></i>
                    Popular Searches
                </h4>
                <div class="suggestions">
                    <span class="suggestion" onclick="searchSystem.searchFor('VS Code')">VS Code</span>
                    <span class="suggestion" onclick="searchSystem.searchFor('Photoshop')">Photoshop</span>
                    <span class="suggestion" onclick="searchSystem.searchFor('Chrome')">Chrome</span>
                    <span class="suggestion" onclick="searchSystem.searchFor('Copy')">Copy</span>
                    <span class="suggestion" onclick="searchSystem.searchFor('Paste')">Paste</span>
                    <span class="suggestion" onclick="searchSystem.searchFor('Save')">Save</span>
                    <span class="suggestion" onclick="searchSystem.searchFor('Undo')">Undo</span>
                    <span class="suggestion" onclick="searchSystem.searchFor('Excel')">Excel</span>
                </div>
            </div>
        `;
        
        // Quick actions
        html += `
            <div class="suggestion-category">
                <h4>
                    <i data-lucide="zap"></i>
                    Quick Actions
                </h4>
                <div class="quick-actions">
                    <div class="quick-action" onclick="window.location.href='quiz-integrated.html'">
                        <i data-lucide="brain"></i>
                        <span>Take a Quiz</span>
                    </div>
                    <div class="quick-action" onclick="window.location.href='all-applications.html'">
                        <i data-lucide="grid-3x3"></i>
                        <span>Browse Apps</span>
                    </div>
                    <div class="quick-action" onclick="window.location.href='community-ultimate.html'">
                        <i data-lucide="users"></i>
                        <span>Join Community</span>
                    </div>
                </div>
            </div>
            </div>
        `;
        
        this.searchResults.innerHTML = html;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    handleResultClick(e) {
        const resultItem = e.target.closest('.result-item');
        const quickAction = e.target.closest('.quick-action');
        const recentSearch = e.target.closest('.recent-search-item');
        
        if (resultItem) {
            const url = resultItem.dataset.url;
            const type = resultItem.dataset.type;
            
            if (url && url !== '#') {
                this.trackEvent('search_result_clicked', { url, type });
                this.closeSearch();
                
                setTimeout(() => {
                    window.location.href = url;
                }, 100);
            }
        } else if (quickAction) {
            // Quick actions are handled by their onclick attributes
            this.closeSearch();
        } else if (recentSearch) {
            // Recent searches are handled by their onclick attributes
        }
    }
    
    searchFor(query) {
        if (this.searchInput) {
            this.searchInput.value = query;
            this.performSearch(query);
        }
    }
    
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.searchInput.focus();
            this.showSuggestions();
        }
    }
    
    selectFirstResult() {
        const firstResult = this.searchResults?.querySelector('.result-item');
        if (firstResult) {
            firstResult.click();
        }
    }
    
    navigateResults(direction) {
        const results = this.searchResults?.querySelectorAll('.result-item');
        if (!results || results.length === 0) return;
        
        const currentActive = this.searchResults.querySelector('.result-item.active');
        let newIndex = 0;
        
        if (currentActive) {
            const currentIndex = Array.from(results).indexOf(currentActive);
            newIndex = direction === 'down' 
                ? Math.min(currentIndex + 1, results.length - 1)
                : Math.max(currentIndex - 1, 0);
            currentActive.classList.remove('active');
        }
        
        results[newIndex].classList.add('active');
        results[newIndex].scrollIntoView({ block: 'nearest' });
    }
    
    buildSearchIndex() {
        return [
            // Applications
            {
                type: 'application',
                title: 'Visual Studio Code',
                description: 'Powerful code editor with extensive shortcut support',
                category: 'Development',
                url: 'Visual Studio.html',
                icon: 'code',
                keywords: ['vscode', 'editor', 'programming', 'development'],
                shortcutCount: 150
            },
            {
                type: 'application',
                title: 'Adobe Photoshop',
                description: 'Professional image editing and design software',
                category: 'Design',
                url: 'Adobe PhotoShop.html',
                icon: 'image',
                keywords: ['adobe', 'photo', 'design', 'graphics'],
                shortcutCount: 200
            },
            {
                type: 'application',
                title: 'Google Chrome',
                description: 'Fast and secure web browser',
                category: 'Browser',
                url: 'Google Chrome.html',
                icon: 'globe',
                keywords: ['browser', 'web', 'google', 'internet'],
                shortcutCount: 80
            },
            {
                type: 'application',
                title: 'Microsoft Excel',
                description: 'Powerful spreadsheet application',
                category: 'Productivity',
                url: 'Microsoft Excell.htm',
                icon: 'grid-3x3',
                keywords: ['excel', 'spreadsheet', 'data', 'office'],
                shortcutCount: 120
            },
            {
                type: 'application',
                title: 'Microsoft Word',
                description: 'Document creation and editing',
                category: 'Productivity',
                url: 'Microsoft Word.htm',
                icon: 'file-text',
                keywords: ['word', 'document', 'writing', 'office'],
                shortcutCount: 100
            },
            {
                type: 'application',
                title: 'Discord',
                description: 'Voice, video and text communication',
                category: 'Communication',
                url: 'Discord.html',
                icon: 'message-circle',
                keywords: ['discord', 'chat', 'gaming', 'communication'],
                shortcutCount: 50
            },
            {
                type: 'application',
                title: 'Slack',
                description: 'Team collaboration and messaging',
                category: 'Communication',
                url: 'Slack.htm',
                icon: 'message-square',
                keywords: ['slack', 'team', 'work', 'messaging'],
                shortcutCount: 45
            },
            {
                type: 'application',
                title: 'Spotify',
                description: 'Music streaming and playlist management',
                category: 'Media',
                url: 'Spotify.html',
                icon: 'music',
                keywords: ['spotify', 'music', 'audio', 'streaming'],
                shortcutCount: 30
            },
            {
                type: 'application',
                title: 'Windows 11',
                description: 'Operating system shortcuts and navigation',
                category: 'System',
                url: 'Windows_11.html',
                icon: 'monitor',
                keywords: ['windows', 'system', 'os', 'navigation'],
                shortcutCount: 100
            },
            {
                type: 'application',
                title: 'File Explorer',
                description: 'File and folder management',
                category: 'System',
                url: 'File Explorer.htm',
                icon: 'folder',
                keywords: ['files', 'folders', 'explorer', 'navigation'],
                shortcutCount: 60
            },
            
            // Common shortcuts
            {
                type: 'shortcut',
                title: 'Copy',
                description: 'Copy selected text or items',
                category: 'General',
                shortcut: 'Ctrl+C / Cmd+C',
                keywords: ['copy', 'duplicate', 'clipboard']
            },
            {
                type: 'shortcut',
                title: 'Paste',
                description: 'Paste from clipboard',
                category: 'General',
                shortcut: 'Ctrl+V / Cmd+V',
                keywords: ['paste', 'insert', 'clipboard']
            },
            {
                type: 'shortcut',
                title: 'Cut',
                description: 'Cut selected text or items',
                category: 'General',
                shortcut: 'Ctrl+X / Cmd+X',
                keywords: ['cut', 'move', 'clipboard']
            },
            {
                type: 'shortcut',
                title: 'Undo',
                description: 'Undo the last action',
                category: 'General',
                shortcut: 'Ctrl+Z / Cmd+Z',
                keywords: ['undo', 'revert', 'back']
            },
            {
                type: 'shortcut',
                title: 'Redo',
                description: 'Redo the last undone action',
                category: 'General',
                shortcut: 'Ctrl+Y / Cmd+Shift+Z',
                keywords: ['redo', 'forward', 'repeat']
            },
            {
                type: 'shortcut',
                title: 'Select All',
                description: 'Select all content',
                category: 'General',
                shortcut: 'Ctrl+A / Cmd+A',
                keywords: ['select', 'all', 'everything']
            },
            {
                type: 'shortcut',
                title: 'Find',
                description: 'Open find dialog',
                category: 'General',
                shortcut: 'Ctrl+F / Cmd+F',
                keywords: ['find', 'search', 'locate']
            },
            {
                type: 'shortcut',
                title: 'Save',
                description: 'Save current document',
                category: 'General',
                shortcut: 'Ctrl+S / Cmd+S',
                keywords: ['save', 'store', 'preserve']
            },
            
            // Pages
            {
                type: 'page',
                title: 'All Applications',
                description: 'Browse all available applications and their shortcuts',
                category: 'Navigation',
                url: 'all-applications.html',
                icon: 'grid-3x3',
                keywords: ['apps', 'applications', 'browse', 'directory']
            },
            {
                type: 'page',
                title: 'Interactive Quiz',
                description: 'Test your knowledge with interactive quizzes',
                category: 'Learning',
                url: 'quiz-integrated.html',
                icon: 'brain',
                keywords: ['quiz', 'test', 'challenge', 'practice']
            },
            {
                type: 'page',
                title: 'Community',
                description: 'Join the community and compete with others',
                category: 'Social',
                url: 'community-ultimate.html',
                icon: 'users',
                keywords: ['community', 'social', 'compete', 'leaderboard']
            },
            {
                type: 'page',
                title: 'About',
                description: 'Learn more about Shortcut Sensei',
                category: 'Information',
                url: 'about.html',
                icon: 'info',
                keywords: ['about', 'information', 'company', 'story']
            }
        ];
    }
    
    groupResults(results) {
        return results.reduce((groups, item) => {
            const category = item.category || 'Other';
            if (!groups[category]) groups[category] = [];
            groups[category].push(item);
            return groups;
        }, {});
    }
    
    getCategoryIcon(category) {
        const icons = {
            'Development': 'code',
            'Design': 'palette',
            'Browser': 'globe',
            'Productivity': 'briefcase',
            'Communication': 'message-circle',
            'Media': 'music',
            'System': 'monitor',
            'General': 'command',
            'Navigation': 'compass',
            'Learning': 'book-open',
            'Social': 'users',
            'Information': 'info'
        };
        return icons[category] || 'file';
    }
    
    getTypeIcon(type) {
        const icons = {
            'application': 'app-window',
            'shortcut': 'command',
            'page': 'file-text'
        };
        return icons[type] || 'file';
    }
    
    formatCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    addRecentSearch(query) {
        if (!this.recentSearches.includes(query)) {
            this.recentSearches.unshift(query);
            this.recentSearches = this.recentSearches.slice(0, 10); // Keep only 10 recent searches
            localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
        }
    }
    
    clearResults() {
        if (this.searchResults) {
            this.searchResults.innerHTML = '';
        }
    }
    
    preloadSearchData() {
        // Preload popular application data for faster search
        const popularApps = ['Visual Studio Code', 'Adobe Photoshop', 'Google Chrome', 'Microsoft Excel'];
        popularApps.forEach(app => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = this.searchIndex.find(item => item.title === app)?.url;
            if (link.href) {
                document.head.appendChild(link);
            }
        });
    }
    
    trackEvent(eventName, data = {}) {
        // Track search events for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'search',
                ...data
            });
        }
        
        console.log('Search Event:', eventName, data);
    }
    
    // Public API
    search(query) {
        this.openSearch();
        if (this.searchInput) {
            this.searchInput.value = query;
            this.performSearch(query);
        }
    }
    
    clearRecentSearches() {
        this.recentSearches = [];
        localStorage.removeItem('recentSearches');
        this.showSuggestions();
    }
}

// Initialize search system
document.addEventListener('DOMContentLoaded', () => {
    window.searchSystem = new EnhancedSearchSystem();
});

// Add search-specific CSS
const searchCSS = `
<style>
.search-results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--space-md);
    margin-bottom: var(--space-md);
    border-bottom: 1px solid var(--border);
}

.results-count {
    font-size: var(--font-sm);
    color: var(--text-secondary);
    font-weight: 500;
}

.clear-search {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--space-xs);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
}

.clear-search:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.result-category {
    margin-bottom: var(--space-lg);
}

.category-title {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-size: var(--font-sm);
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: var(--space-md);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.result-items {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
}

.result-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
    border: 1px solid transparent;
}

.result-item:hover,
.result-item.active {
    background: var(--bg-secondary);
    border-color: var(--primary);
    transform: translateX(4px);
}

.result-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    flex-shrink: 0;
}

.result-content {
    flex: 1;
    min-width: 0;
}

.result-title {
    font-size: var(--font-sm);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-xs);
}

.result-title mark {
    background: rgba(99, 102, 241, 0.2);
    color: var(--primary);
    padding: 0 2px;
    border-radius: 2px;
}

.result-description {
    font-size: var(--font-xs);
    color: var(--text-secondary);
    line-height: var(--line-height-normal);
    margin-bottom: var(--space-xs);
}

.result-description mark {
    background: rgba(99, 102, 241, 0.1);
    color: var(--primary);
    padding: 0 2px;
    border-radius: 2px;
}

.result-meta {
    font-size: var(--font-xs);
    color: var(--primary);
    font-weight: 500;
}

.result-action {
    color: var(--text-tertiary);
    transition: all var(--transition-fast);
}

.result-item:hover .result-action {
    color: var(--primary);
    transform: translateX(2px);
}

.no-results {
    text-align: center;
    padding: var(--space-2xl);
}

.no-results-icon {
    width: 64px;
    height: 64px;
    background: var(--bg-secondary);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-md);
    color: var(--text-secondary);
}

.no-results h4 {
    font-size: var(--font-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-xs);
}

.no-results p {
    color: var(--text-secondary);
    margin-bottom: var(--space-lg);
}

.search-suggestions-alt h5 {
    font-size: var(--font-sm);
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: var(--space-sm);
}

.suggestion-chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    justify-content: center;
}

.suggestion-chip {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-full);
    font-size: var(--font-xs);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.suggestion-chip:hover {
    background: var(--primary);
    color: var(--white);
}

.search-suggestions-container {
    padding: var(--space-md) 0;
}

.recent-searches {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
}

.recent-search-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--text-secondary);
    font-size: var(--font-sm);
}

.recent-search-item:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.quick-actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
}

.quick-action {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--text-secondary);
    font-size: var(--font-sm);
}

.quick-action:hover {
    background: var(--bg-secondary);
    color: var(--primary);
    transform: translateX(4px);
}

.quick-action i {
    color: var(--primary);
}

@media (max-width: 768px) {
    .search-container {
        margin: 60px auto 0;
        padding: var(--space-md);
    }
    
    .result-item {
        padding: var(--space-sm);
    }
    
    .result-icon {
        width: 32px;
        height: 32px;
    }
    
    .suggestion-chips {
        justify-content: flex-start;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', searchCSS);

// Export for global access
window.EnhancedSearchSystem = EnhancedSearchSystem;