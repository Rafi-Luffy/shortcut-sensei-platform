// Applications Page JavaScript

class ApplicationsManager {
    constructor() {
        this.apps = this.loadApplicationsData();
        this.filteredApps = [...this.apps];
        this.currentView = 'grid';
        this.currentFilter = 'all';
        this.currentSort = 'popular';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderApplications();
        this.updateResultsCount();
        console.log('📱 Applications manager initialized');
    }

    loadApplicationsData() {
        return [
            {
                id: 'chrome',
                name: 'Google Chrome',
                category: 'browsers',
                shortcuts: 120,
                users: 1200000,
                rating: 4.9,
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg',
                description: 'Master browser shortcuts for lightning-fast web navigation and tab management.',
                bookmarked: false,
                popularity: 100,
                dateAdded: '2024-01-15'
            },
            {
                id: 'vscode',
                name: 'Visual Studio Code',
                category: 'editors',
                shortcuts: 200,
                users: 950000,
                rating: 4.8,
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
                description: 'Boost your coding productivity with essential editor shortcuts and commands.',
                bookmarked: false,
                popularity: 95,
                dateAdded: '2024-01-10'
            },
            {
                id: 'photoshop',
                name: 'Adobe Photoshop',
                category: 'design',
                shortcuts: 150,
                users: 800000,
                rating: 4.7,
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg',
                description: 'Speed up your design workflow with professional photo editing shortcuts.',
                bookmarked: false,
                popularity: 90,
                dateAdded: '2024-01-20'
            },
            {
                id: 'figma',
                name: 'Figma',
                category: 'design',
                shortcuts: 80,
                users: 600000,
                rating: 4.6,
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
                description: 'Design faster with collaborative interface design shortcuts.',
                bookmarked: false,
                popularity: 85,
                dateAdded: '2024-02-01'
            },
            {
                id: 'excel',
                name: 'Microsoft Excel',
                category: 'productivity',
                shortcuts: 180,
                users: 1100000,
                rating: 4.5,
                icon: 'https://img.icons8.com/color/48/microsoft-excel-2019.png',
                description: 'Master spreadsheet shortcuts for data analysis and financial modeling.',
                bookmarked: false,
                popularity: 88,
                dateAdded: '2024-01-05'
            },
            {
                id: 'slack',
                name: 'Slack',
                category: 'communication',
                shortcuts: 60,
                users: 700000,
                rating: 4.4,
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg',
                description: 'Streamline team communication with efficient messaging shortcuts.',
                bookmarked: false,
                popularity: 75,
                dateAdded: '2024-01-25'
            },
            {
                id: 'discord',
                name: 'Discord',
                category: 'communication',
                shortcuts: 45,
                users: 500000,
                rating: 4.3,
                icon: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png',
                description: 'Navigate gaming and community chats with powerful keyboard shortcuts.',
                bookmarked: false,
                popularity: 70,
                dateAdded: '2024-02-05'
            },
            {
                id: 'spotify',
                name: 'Spotify',
                category: 'productivity',
                shortcuts: 35,
                users: 400000,
                rating: 4.2,
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spotify/spotify-original.svg',
                description: 'Control your music seamlessly while working with media shortcuts.',
                bookmarked: false,
                popularity: 65,
                dateAdded: '2024-02-10'
            }
        ];
    }

    setupEventListeners() {
        // Category filters
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.addEventListener('click', () => {
                this.filterByCategory(filter.dataset.filter);
            });
        });

        // Quick filters
        document.querySelectorAll('.quick-filter').forEach(filter => {
            filter.addEventListener('click', () => {
                this.applyQuickFilter(filter.dataset.quickFilter);
            });
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleView(btn.dataset.view);
            });
        });

        // Sort dropdown
        const sortSelect = document.querySelector('[data-sort="apps"]');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.sortApplications(sortSelect.value);
            });
        }

        // App search
        const searchInput = document.querySelector('[data-input="app-search"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchApplications(e.target.value);
            });
        }

        // Load more button
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="load-more"]')) {
                this.loadMoreApplications();
            }
        });
    }

    filterByCategory(category) {
        this.currentFilter = category;
        
        // Update active filter button
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${category}"]`).classList.add('active');
        
        // Filter applications
        if (category === 'all') {
            this.filteredApps = [...this.apps];
        } else {
            this.filteredApps = this.apps.filter(app => app.category === category);
        }
        
        this.renderApplications();
        this.updateResultsCount();
    }

    applyQuickFilter(filterType) {
        // Update active quick filter
        document.querySelectorAll('.quick-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-quick-filter="${filterType}"]`).classList.add('active');
        
        switch (filterType) {
            case 'bookmarked':
                this.filteredApps = this.apps.filter(app => app.bookmarked);
                break;
            case 'popular':
                this.filteredApps = [...this.apps].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
                break;
            case 'recent':
                this.filteredApps = [...this.apps].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)).slice(0, 6);
                break;
        }
        
        this.renderApplications();
        this.updateResultsCount();
    }

    sortApplications(sortType) {
        this.currentSort = sortType;
        
        switch (sortType) {
            case 'popular':
                this.filteredApps.sort((a, b) => b.popularity - a.popularity);
                break;
            case 'name':
                this.filteredApps.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'shortcuts':
                this.filteredApps.sort((a, b) => b.shortcuts - a.shortcuts);
                break;
            case 'recent':
                this.filteredApps.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
        }
        
        this.renderApplications();
    }

    searchApplications(query) {
        if (!query.trim()) {
            this.filterByCategory(this.currentFilter);
            return;
        }

        const searchTerm = query.toLowerCase();
        this.filteredApps = this.apps.filter(app => 
            app.name.toLowerCase().includes(searchTerm) ||
            app.description.toLowerCase().includes(searchTerm) ||
            app.category.toLowerCase().includes(searchTerm)
        );
        
        this.renderApplications();
        this.updateResultsCount();
    }

    toggleView(viewType) {
        this.currentView = viewType;
        
        // Update active view button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewType}"]`).classList.add('active');
        
        // Update grid class
        const grid = document.querySelector('[data-element="apps-grid"]');
        if (viewType === 'list') {
            grid.classList.add('list-view');
        } else {
            grid.classList.remove('list-view');
        }
    }

    renderApplications() {
        const container = document.querySelector('[data-element="apps-grid"]');
        
        if (this.filteredApps.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i data-lucide="search-x"></i>
                    <h3>No applications found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                    <button class="btn-secondary" data-action="clear-filters">Clear Filters</button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredApps.map((app, index) => `
            <div class="app-card fade-in-up" style="animation-delay: ${index * 0.1}s" data-app="${app.id}">
                <button class="app-bookmark ${app.bookmarked ? 'bookmarked' : ''}" 
                        data-action="toggle-bookmark" data-app="${app.id}">
                    <i data-lucide="bookmark"></i>
                </button>
                
                <div class="app-header">
                    <div class="app-icon">
                        <img src="${app.icon}" alt="${app.name}" loading="lazy">
                    </div>
                    <div class="app-info">
                        <h3>${app.name}</h3>
                        <span class="app-category">${this.formatCategory(app.category)}</span>
                    </div>
                </div>
                
                <p class="app-description">${app.description}</p>
                
                <div class="app-stats">
                    <span class="app-shortcuts">${app.shortcuts}+ shortcuts</span>
                    <div class="app-rating">
                        <i data-lucide="star"></i>
                        <span>${app.rating}</span>
                    </div>
                </div>
                
                <div class="app-actions">
                    <button class="btn-primary" data-action="learn-app" data-app="${app.id}">
                        <i data-lucide="play"></i>
                        Learn
                    </button>
                    <button class="btn-secondary" data-action="preview-app" data-app="${app.id}">
                        <i data-lucide="eye"></i>
                        Preview
                    </button>
                </div>
            </div>
        `).join('');

        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Setup card interactions
        this.setupCardInteractions();
    }

    setupCardInteractions() {
        const container = document.querySelector('[data-element="apps-grid"]');
        
        container.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.dataset.action;
            const appId = e.target.closest('[data-app]')?.dataset.app;
            
            if (!action) return;
            e.preventDefault();
            
            switch (action) {
                case 'toggle-bookmark':
                    this.toggleBookmark(appId);
                    break;
                case 'learn-app':
                    this.startLearning(appId);
                    break;
                case 'preview-app':
                    this.previewApp(appId);
                    break;
                case 'clear-filters':
                    this.clearAllFilters();
                    break;
            }
        });
    }

    toggleBookmark(appId) {
        const app = this.apps.find(a => a.id === appId);
        if (!app) return;
        
        app.bookmarked = !app.bookmarked;
        this.saveAppsData();
        
        // Update UI
        const button = document.querySelector(`[data-app="${appId}"][data-action="toggle-bookmark"]`);
        button.classList.toggle('bookmarked');
        
        // Show feedback
        window.shortcutSensei.showToast(
            app.bookmarked ? `${app.name} bookmarked! 📌` : `${app.name} removed from bookmarks`,
            app.bookmarked ? 'success' : 'info'
        );
        
        // Update progress sidebar if bookmarked filter is active
        if (this.currentFilter === 'bookmarked') {
            this.applyQuickFilter('bookmarked');
        }
    }

    startLearning(appId) {
        const app = this.apps.find(a => a.id === appId);
        if (!app) return;
        
        // Simulate starting learning session
        window.shortcutSensei.showToast(`Starting ${app.name} learning session! 🚀`, 'success');
        
        // TODO: Navigate to app-specific learning page
        setTimeout(() => {
            window.shortcutSensei.showToast('Learning page coming soon!', 'info');
        }, 1500);
    }

    previewApp(appId) {
        const app = this.apps.find(a => a.id === appId);
        if (!app) return;
        
        this.showAppPreviewModal(app);
    }

    showAppPreviewModal(app) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal app-preview-modal">
                <div class="modal-header">
                    <h3>${app.name} Preview</h3>
                    <button class="modal-close" data-action="close-modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="modal-content">
                    <div class="preview-header">
                        <img src="${app.icon}" alt="${app.name}" class="preview-icon">
                        <div class="preview-info">
                            <h4>${app.name}</h4>
                            <p>${app.description}</p>
                            <div class="preview-stats">
                                <span><i data-lucide="keyboard"></i> ${app.shortcuts}+ shortcuts</span>
                                <span><i data-lucide="users"></i> ${this.formatNumber(app.users)} learners</span>
                                <span><i data-lucide="star"></i> ${app.rating}/5</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="preview-shortcuts">
                        <h4>Popular Shortcuts</h4>
                        <div class="shortcuts-list">
                            ${this.getPreviewShortcuts(app.id).map(shortcut => `
                                <div class="shortcut-item">
                                    <div class="shortcut-keys">
                                        ${shortcut.keys.split('+').map(key => `<kbd>${key.trim()}</kbd>`).join('+')}
                                    </div>
                                    <div class="shortcut-description">${shortcut.description}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="preview-actions">
                        <button class="btn-primary" data-action="start-learning" data-app="${app.id}">
                            <i data-lucide="play"></i>
                            Start Learning
                        </button>
                        <button class="btn-secondary" data-action="add-to-bookmarks" data-app="${app.id}">
                            <i data-lucide="bookmark"></i>
                            ${app.bookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Setup close functionality
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('[data-action="close-modal"]')) {
                modal.remove();
            }
        });
        
        // Setup action buttons
        modal.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.dataset.action;
            const appId = e.target.closest('[data-app]')?.dataset.app;
            
            if (action === 'start-learning') {
                modal.remove();
                this.startLearning(appId);
            } else if (action === 'add-to-bookmarks') {
                this.toggleBookmark(appId);
                modal.remove();
            }
        });
    }

    getPreviewShortcuts(appId) {
        const shortcuts = {
            chrome: [
                { keys: 'Ctrl + T', description: 'Open new tab' },
                { keys: 'Ctrl + Shift + T', description: 'Reopen closed tab' },
                { keys: 'Ctrl + L', description: 'Focus address bar' },
                { keys: 'Ctrl + Shift + N', description: 'Open incognito window' }
            ],
            vscode: [
                { keys: 'Ctrl + Shift + P', description: 'Open command palette' },
                { keys: 'Ctrl + P', description: 'Quick file open' },
                { keys: 'Ctrl + `', description: 'Toggle terminal' },
                { keys: 'Ctrl + Shift + E', description: 'Show explorer' }
            ],
            photoshop: [
                { keys: 'V', description: 'Move tool' },
                { keys: 'B', description: 'Brush tool' },
                { keys: 'Ctrl + Z', description: 'Undo' },
                { keys: 'Ctrl + T', description: 'Free transform' }
            ]
        };
        
        return shortcuts[appId] || [
            { keys: 'Ctrl + C', description: 'Copy' },
            { keys: 'Ctrl + V', description: 'Paste' },
            { keys: 'Ctrl + S', description: 'Save' },
            { keys: 'Ctrl + Z', description: 'Undo' }
        ];
    }

    loadMoreApplications() {
        // Simulate loading more apps
        window.shortcutSensei.showToast('Loading more applications...', 'info');
        
        setTimeout(() => {
            window.shortcutSensei.showToast('All applications loaded!', 'success');
            
            // Hide load more button
            const loadMoreBtn = document.querySelector('[data-action="load-more"]');
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
        }, 1500);
    }

    clearAllFilters() {
        // Reset all filters
        this.currentFilter = 'all';
        this.filteredApps = [...this.apps];
        
        // Update UI
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-filter="all"]').classList.add('active');
        
        document.querySelectorAll('.quick-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Clear search
        const searchInput = document.querySelector('[data-input="app-search"]');
        if (searchInput) {
            searchInput.value = '';
        }
        
        this.renderApplications();
        this.updateResultsCount();
        
        window.shortcutSensei.showToast('Filters cleared!', 'info');
    }

    updateResultsCount() {
        const countElement = document.querySelector('.results-count');
        if (countElement) {
            const count = this.filteredApps.length;
            countElement.innerHTML = `Showing <strong>${count}</strong> application${count !== 1 ? 's' : ''}`;
        }
    }

    formatCategory(category) {
        const categories = {
            browsers: 'Browser',
            editors: 'Code Editor',
            design: 'Design Tool',
            productivity: 'Productivity',
            communication: 'Communication'
        };
        return categories[category] || category;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    }

    saveAppsData() {
        localStorage.setItem('shortcut-sensei-apps', JSON.stringify(this.apps));
    }

    // Demo functionality for learning progress
    updateLearningProgress() {
        const progressItems = document.querySelectorAll('.progress-item');
        progressItems.forEach(item => {
            const progressBar = item.querySelector('.mini-progress-fill');
            const currentWidth = parseInt(progressBar.style.width);
            const newWidth = Math.min(100, currentWidth + Math.random() * 10);
            
            progressBar.style.width = `${newWidth}%`;
            item.querySelector('.progress-percent').textContent = `${Math.floor(newWidth)}%`;
        });
    }
}

// Initialize applications manager
document.addEventListener('DOMContentLoaded', () => {
    window.applicationsManager = new ApplicationsManager();
    
    // Demo: Update learning progress every 10 seconds
    setInterval(() => {
        window.applicationsManager.updateLearningProgress();
    }, 10000);
});

// Additional CSS for modal styles
const additionalStyles = `
.app-preview-modal {
    max-width: 600px;
    width: 95%;
}

.preview-header {
    display: flex;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--border-color);
}

.preview-icon {
    width: 64px;
    height: 64px;
    border-radius: var(--border-radius);
    flex-shrink: 0;
}

.preview-info h4 {
    margin: 0 0 var(--space-xs) 0;
    color: var(--text-primary);
}

.preview-info p {
    margin: 0 0 var(--space-sm) 0;
    color: var(--text-secondary);
    font-size: 14px;
}

.preview-stats {
    display: flex;
    gap: var(--space-md);
    font-size: 12px;
    color: var(--text-secondary);
}

.preview-stats span {
    display: flex;
    align-items: center;
    gap: 4px;
}

.preview-shortcuts h4 {
    margin-bottom: var(--space-md);
    color: var(--text-primary);
}

.shortcuts-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
}

.shortcut-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-sm);
    background: var(--bg-primary);
    border-radius: var(--border-radius);
}

.shortcut-keys {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 120px;
}

.shortcut-keys kbd {
    background: var(--border-color);
    color: var(--text-primary);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-family: monospace;
}

.shortcut-description {
    color: var(--text-secondary);
    font-size: 14px;
}

.preview-actions {
    display: flex;
    gap: var(--space-sm);
}

.no-results {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--space-2xl);
    color: var(--text-secondary);
}

.no-results i {
    font-size: 48px;
    margin-bottom: var(--space-md);
    opacity: 0.5;
}

.no-results h3 {
    color: var(--text-primary);
    margin-bottom: var(--space-sm);
}

.no-results p {
    margin-bottom: var(--space-lg);
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);