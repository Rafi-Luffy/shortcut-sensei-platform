/* Apple-style Search System */

class SearchSystem {
    constructor() {
        this.searchToggle = document.getElementById('search-toggle');
        this.searchOverlay = document.getElementById('searchOverlay');
        this.searchClose = document.getElementById('searchClose');
        this.searchInput = document.getElementById('searchInput');
        this.searchSubmit = document.getElementById('searchSubmit');
        this.searchSuggestions = document.getElementById('searchSuggestions');
        
        this.suggestions = [
            { text: 'VS Code shortcuts', icon: 'code', url: 'Visual Studio.html' },
            { text: 'Photoshop shortcuts', icon: 'image', url: 'Adobe PhotoShop.html' },
            { text: 'Chrome shortcuts', icon: 'globe', url: 'Google Chrome.html' },
            { text: 'Word shortcuts', icon: 'file-text', url: 'Microsoft Word.htm' },
            { text: 'MacOS shortcuts', icon: 'command', url: '#' },
            { text: 'Excel shortcuts', icon: 'grid-3x3', url: 'Microsoft Excell.htm' },
            { text: 'PowerPoint shortcuts', icon: 'presentation', url: 'Microsoft PowerPoint.htm' },
            { text: 'Outlook shortcuts', icon: 'mail', url: 'Microsoft Outlook.html' },
            { text: 'Teams shortcuts', icon: 'users', url: 'Microsoft Teams.html' },
            { text: 'Discord shortcuts', icon: 'message-circle', url: 'Discord.html' }
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    }
    
    setupEventListeners() {
        // Search toggle
        if (this.searchToggle) {
            this.searchToggle.addEventListener('click', () => this.openSearch());
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
            this.searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
            this.searchInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }
        
        // Search submit
        if (this.searchSubmit) {
            this.searchSubmit.addEventListener('click', () => this.performSearch());
        }
        
        // Suggestion clicks
        if (this.searchSuggestions) {
            this.searchSuggestions.addEventListener('click', (e) => {
                const suggestion = e.target.closest('.search-suggestion');
                if (suggestion) {
                    this.selectSuggestion(suggestion);
                }
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
            if (e.key === 'Escape' && this.searchOverlay.classList.contains('active')) {
                this.closeSearch();
            }
        });
    }
    
    openSearch() {
        if (this.searchOverlay) {
            this.searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus input after animation
            setTimeout(() => {
                if (this.searchInput) {
                    this.searchInput.focus();
                }
            }, 200);
            
            this.renderSuggestions();
        }
    }
    
    closeSearch() {
        if (this.searchOverlay) {
            this.searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Clear input
            if (this.searchInput) {
                this.searchInput.value = '';
            }
        }
    }
    
    handleSearchInput(e) {
        const query = e.target.value.toLowerCase();
        this.filterSuggestions(query);
    }
    
    handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.performSearch();
        }
    }
    
    filterSuggestions(query) {
        if (!query) {
            this.renderSuggestions();
            return;
        }
        
        const filtered = this.suggestions.filter(suggestion =>
            suggestion.text.toLowerCase().includes(query)
        );
        
        this.renderSuggestions(filtered);
    }
    
    renderSuggestions(suggestions = this.suggestions) {
        if (!this.searchSuggestions) return;
        
        this.searchSuggestions.innerHTML = suggestions.map(suggestion => `
            <div class="search-suggestion" data-url="${suggestion.url}">
                <i data-lucide="${suggestion.icon}" class="search-suggestion-icon"></i>
                <span>${suggestion.text}</span>
            </div>
        `).join('');
        
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    selectSuggestion(suggestionElement) {
        const url = suggestionElement.dataset.url;
        const text = suggestionElement.querySelector('span').textContent;
        
        if (this.searchInput) {
            this.searchInput.value = text;
        }
        
        this.closeSearch();
        
        // Navigate to the URL if available
        if (url && url !== '#') {
            setTimeout(() => {
                window.location.href = url;
            }, 300);
        }
    }
    
    performSearch() {
        const query = this.searchInput?.value?.trim();
        if (!query) return;
        
        // Find matching suggestion
        const match = this.suggestions.find(s => 
            s.text.toLowerCase().includes(query.toLowerCase())
        );
        
        this.closeSearch();
        
        if (match && match.url !== '#') {
            setTimeout(() => {
                window.location.href = match.url;
            }, 300);
        } else {
            // Show toast for no results
            this.showToast(`No results found for "${query}"`, 'info');
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `search-toast search-toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            z-index: 10001;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize search system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.searchSystem = new SearchSystem();
});

// Export for global access
window.SearchSystem = SearchSystem;
