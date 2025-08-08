/* Applications Page JavaScript */

class ApplicationsManager {
    constructor() {
        this.applications = [];
        this.filteredApplications = [];
        this.currentFilter = 'all';
        this.currentSort = 'popular';
        this.bookmarkedApps = JSON.parse(localStorage.getItem('bookmarkedApps') || '[]');
        this.init();
    }

    init() {
        this.loadApplications();
        this.setupEventListeners();
        this.setupSearch();
        this.renderApplications();
        this.updateBookmarkStates();
    }

    loadApplications() {
        this.applications = [
            {
                name: 'Google Chrome',
                file: 'Google Chrome.html',
                icon: 'fab fa-chrome',
                category: 'productivity',
                description: 'Master browser shortcuts for faster web navigation and productivity',
                shortcuts: 120,
                learners: '2M',
                popularity: 10,
                rating: 4.9,
                tags: ['Browser', 'Navigation', 'Tabs'],
                color: 'chrome'
            },
            {
                name: 'Visual Studio Code',
                file: 'Visual Studio.html',
                icon: 'fas fa-code',
                category: 'development',
                description: 'Essential shortcuts for developers to code faster and more efficiently',
                shortcuts: 200,
                learners: '1.5M',
                popularity: 9,
                rating: 4.8,
                tags: ['IDE', 'Coding', 'Debugging'],
                color: 'vscode'
            },
            {
                name: 'Microsoft Excel',
                file: 'Microsoft Excell.htm',
                icon: 'fas fa-file-excel',
                category: 'productivity',
                description: 'Powerful spreadsheet shortcuts for data analysis and calculations',
                shortcuts: 180,
                learners: '1.2M',
                popularity: 8,
                rating: 4.7,
                tags: ['Spreadsheet', 'Data', 'Formula'],
                color: 'excel'
            },
            {
                name: 'Adobe Photoshop',
                file: 'Adobe PhotoShop.html',
                icon: 'fas fa-paint-brush',
                category: 'creative',
                description: 'Professional photo editing shortcuts for designers and photographers',
                shortcuts: 250,
                learners: '800K',
                popularity: 7,
                rating: 4.6,
                tags: ['Design', 'Photo', 'Tools'],
                color: 'photoshop'
            },
            {
                name: 'Microsoft Word',
                file: 'Microsoft Word.htm',
                icon: 'fas fa-file-word',
                category: 'productivity',
                description: 'Document editing shortcuts for faster writing and formatting',
                shortcuts: 150,
                learners: '1M',
                popularity: 6,
                rating: 4.5,
                tags: ['Document', 'Writing', 'Format'],
                color: 'word'
            },
            {
                name: 'Windows 11',
                file: 'Windows_11.html',
                icon: 'fab fa-windows',
                category: 'system',
                description: 'Master Windows shortcuts for faster system navigation and control',
                shortcuts: 300,
                learners: '1.8M',
                popularity: 9,
                rating: 4.8,
                tags: ['OS', 'Windows', 'System'],
                color: 'windows'
            },
            {
                name: 'Discord',
                file: 'Discord.html',
                icon: 'fab fa-discord',
                category: 'communication',
                description: 'Chat and voice communication shortcuts for gamers and communities',
                shortcuts: 50,
                learners: '600K',
                popularity: 5,
                rating: 4.4,
                tags: ['Chat', 'Voice', 'Gaming'],
                color: 'discord'
            },
            {
                name: 'Spotify',
                file: 'Spotify.html',
                icon: 'fab fa-spotify',
                category: 'creative',
                description: 'Music control shortcuts for seamless listening experience',
                shortcuts: 75,
                learners: '500K',
                popularity: 4,
                rating: 4.3,
                tags: ['Music', 'Audio', 'Media'],
                color: 'spotify'
            },
            {
                name: 'Microsoft PowerPoint',
                file: 'Microsoft PowerPoint.htm',
                icon: 'fas fa-file-powerpoint',
                category: 'productivity',
                description: 'Presentation shortcuts for creating impactful slides',
                shortcuts: 130,
                learners: '900K',
                popularity: 5,
                rating: 4.4,
                tags: ['Presentation', 'Slides', 'Design'],
                color: 'powerpoint'
            },
            {
                name: 'Microsoft Outlook',
                file: 'Microsoft Outlook.html',
                icon: 'fas fa-envelope',
                category: 'productivity',
                description: 'Email management shortcuts for efficient communication',
                shortcuts: 100,
                learners: '700K',
                popularity: 4,
                rating: 4.2,
                tags: ['Email', 'Calendar', 'Tasks'],
                color: 'outlook'
            }
        ];

        this.filteredApplications = [...this.applications];
    }

    setupEventListeners() {
        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                this.filterApplications(category);
                
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Sort dropdown
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortApplications(e.target.value);
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreApplications();
            });
        }

        // Suggest app button
        document.addEventListener('click', (e) => {
            if (e.target.closest('.suggest-btn')) {
                this.showSuggestModal();
            }
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('main-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchApplications(e.target.value);
            });

            // Keyboard shortcut Ctrl+K to focus search
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    searchInput.focus();
                }
            });
        }
    }

    filterApplications(category) {
        this.currentFilter = category;
        
        if (category === 'all') {
            this.filteredApplications = [...this.applications];
        } else {
            this.filteredApplications = this.applications.filter(app => app.category === category);
        }
        
        this.sortApplications(this.currentSort);
        this.renderApplications();
    }

    sortApplications(sortBy) {
        this.currentSort = sortBy;
        
        switch (sortBy) {
            case 'popular':
                this.filteredApplications.sort((a, b) => b.popularity - a.popularity);
                break;
            case 'alphabetical':
                this.filteredApplications.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'shortcuts':
                this.filteredApplications.sort((a, b) => b.shortcuts - a.shortcuts);
                break;
            case 'recent':
                // For now, maintain current order as "recent"
                break;
        }
        
        this.renderApplications();
    }

    searchApplications(query) {
        if (!query.trim()) {
            this.filterApplications(this.currentFilter);
            return;
        }

        const searchTerm = query.toLowerCase();
        this.filteredApplications = this.applications.filter(app => {
            return app.name.toLowerCase().includes(searchTerm) ||
                   app.description.toLowerCase().includes(searchTerm) ||
                   app.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                   app.category.toLowerCase().includes(searchTerm);
        });

        this.renderApplications();
    }

    renderApplications() {
        const grid = document.getElementById('applications-grid');
        if (!grid) return;

        // Clear existing cards (except coming soon card)
        const existingCards = grid.querySelectorAll('.app-card:not(.coming-soon)');
        existingCards.forEach(card => card.remove());

        // Render filtered applications
        this.filteredApplications.forEach((app, index) => {
            const card = this.createApplicationCard(app, index);
            grid.insertBefore(card, grid.querySelector('.coming-soon'));
        });

        // Show no results message if empty
        if (this.filteredApplications.length === 0) {
            this.showNoResults();
        } else {
            this.hideNoResults();
        }
    }

    createApplicationCard(app, index) {
        const isBookmarked = this.bookmarkedApps.includes(app.name);
        
        const card = document.createElement('div');
        card.className = 'app-card';
        card.setAttribute('data-category', app.category);
        card.setAttribute('data-popularity', app.popularity);
        card.setAttribute('data-shortcuts', app.shortcuts);
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="app-card-header">
                <div class="app-icon ${app.color}">
                    <i class="${app.icon}"></i>
                </div>
                <div class="app-meta">
                    <span class="category-badge ${app.category}">${this.formatCategory(app.category)}</span>
                    <span class="popularity-badge">★ ${app.rating}</span>
                </div>
            </div>
            <div class="app-info">
                <h3>${app.name}</h3>
                <p class="app-description">${app.description}</p>
                <div class="app-stats">
                    <span class="stat"><i class="fas fa-keyboard"></i> ${app.shortcuts}+ shortcuts</span>
                    <span class="stat"><i class="fas fa-users"></i> ${app.learners}+ learners</span>
                </div>
                <div class="app-tags">
                    ${app.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="app-actions">
                <a href="${app.file}" class="btn-primary">
                    <i class="fas fa-keyboard"></i> Learn Shortcuts
                </a>
                <button class="btn-secondary bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-app="${app.name}">
                    <i class="fas fa-bookmark"></i>
                </button>
            </div>
        `;

        // Add bookmark functionality
        const bookmarkBtn = card.querySelector('.bookmark-btn');
        bookmarkBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleBookmark(app.name, bookmarkBtn);
        });

        // Add click tracking
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.app-actions')) {
                this.trackAppClick(app.name);
            }
        });

        return card;
    }

    formatCategory(category) {
        const categories = {
            'productivity': 'Productivity',
            'development': 'Development',
            'creative': 'Creative',
            'communication': 'Communication',
            'system': 'System'
        };
        return categories[category] || category;
    }

    toggleBookmark(appName, button) {
        const index = this.bookmarkedApps.indexOf(appName);
        
        if (index === -1) {
            this.bookmarkedApps.push(appName);
            button.classList.add('bookmarked');
            this.showNotification(`${appName} bookmarked!`, 'success');
        } else {
            this.bookmarkedApps.splice(index, 1);
            button.classList.remove('bookmarked');
            this.showNotification(`${appName} removed from bookmarks`, 'info');
        }
        
        localStorage.setItem('bookmarkedApps', JSON.stringify(this.bookmarkedApps));
    }

    updateBookmarkStates() {
        const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
        bookmarkBtns.forEach(btn => {
            const appName = btn.getAttribute('data-app');
            if (this.bookmarkedApps.includes(appName)) {
                btn.classList.add('bookmarked');
            }
        });
    }

    trackAppClick(appName) {
        // Track application clicks for analytics
        if (window.gtag) {
            gtag('event', 'app_click', {
                'app_name': appName,
                'page_location': window.location.href
            });
        }
    }

    showNoResults() {
        const grid = document.getElementById('applications-grid');
        let noResults = grid.querySelector('.no-results');
        
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>No applications found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                    <button class="btn-secondary clear-filters-btn">Clear All Filters</button>
                </div>
            `;
            grid.appendChild(noResults);
            
            // Add clear filters functionality
            noResults.querySelector('.clear-filters-btn').addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
        
        noResults.style.display = 'block';
    }

    hideNoResults() {
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            noResults.style.display = 'none';
        }
    }

    clearAllFilters() {
        // Reset search
        const searchInput = document.getElementById('main-search');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Reset filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-category="all"]').classList.add('active');
        
        // Reset sort
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.value = 'popular';
        }
        
        this.filterApplications('all');
    }

    loadMoreApplications() {
        // Simulate loading more applications
        this.showNotification('Loading more applications...', 'info');
        
        setTimeout(() => {
            this.showNotification('All applications loaded!', 'success');
            const loadMoreBtn = document.getElementById('load-more-btn');
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
        }, 1000);
    }

    showSuggestModal() {
        const modal = document.createElement('div');
        modal.className = 'suggest-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Suggest an Application</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form class="suggest-form" id="suggest-form">
                        <div class="form-group">
                            <label for="app-name">Application Name *</label>
                            <input type="text" id="app-name" required placeholder="e.g., Figma, Slack, etc.">
                        </div>
                        <div class="form-group">
                            <label for="app-category">Category</label>
                            <select id="app-category">
                                <option value="productivity">Productivity</option>
                                <option value="development">Development</option>
                                <option value="creative">Creative</option>
                                <option value="communication">Communication</option>
                                <option value="system">System</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="app-reason">Why this application?</label>
                            <textarea id="app-reason" placeholder="Tell us why this application would be valuable to add..."></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn-primary">Submit Suggestion</button>
                            <button type="button" class="btn-secondary close-modal">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeModal = () => {
            document.body.removeChild(modal);
        };
        
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
        
        // Form submission
        modal.querySelector('#suggest-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const appName = modal.querySelector('#app-name').value;
            this.showNotification(`Thank you for suggesting ${appName}! We'll review it.`, 'success');
            closeModal();
        });
        
        // Focus first input
        modal.querySelector('#app-name').focus();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="close-notification">&times;</button>
            </div>
        `;

        const container = document.getElementById('notification-container') || document.body;
        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (container.contains(notification)) {
                container.removeChild(notification);
            }
        }, 5000);

        // Close button
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => {
            container.removeChild(notification);
        });
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }
}

// Initialize applications manager when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const applicationsManager = new ApplicationsManager();
    
    // Make it globally available for debugging
    window.applicationsManager = applicationsManager;
});

// Additional styles for dynamic elements
const additionalStyles = `
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-color);
    }

    .no-results-content i {
        font-size: 4rem;
        opacity: 0.3;
        margin-bottom: 1rem;
    }

    .no-results-content h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }

    .no-results-content p {
        opacity: 0.7;
        margin-bottom: 2rem;
    }

    .suggest-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }

    .suggest-modal .modal-content {
        background: var(--card-background);
        border-radius: 15px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }

    .suggest-modal .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .suggest-modal .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-color);
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .suggest-modal .close-modal:hover {
        background: rgba(6, 163, 190, 0.1);
        color: var(--primary-color);
    }

    .suggest-modal .form-group {
        margin-bottom: 1.5rem;
    }

    .suggest-modal label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-color);
    }

    .suggest-modal input,
    .suggest-modal select,
    .suggest-modal textarea {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        background: var(--light-bg);
        color: var(--text-color);
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }

    .suggest-modal input:focus,
    .suggest-modal select:focus,
    .suggest-modal textarea:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    .suggest-modal textarea {
        resize: vertical;
        min-height: 100px;
    }

    .suggest-modal .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
