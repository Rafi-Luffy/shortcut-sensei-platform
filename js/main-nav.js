// Enhanced Main Navigation JavaScript for Shortcut Sensei
// Handles all interactive features: search, auth, theme, mobile menu, etc.

class ShortcutSensei {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.isLoggedIn = !!this.currentUser;
        this.searchIndex = [];
        this.init();
    }

    init() {
        this.initializeSearch();
        this.initializeAuth();
        this.initializeTheme();
        this.initializeMobileMenu();
        this.initializeUserInterface();
        this.initializeCommunityFeatures();
        this.buildSearchIndex();
        this.setActiveNavigation();
        console.log('🚀 Shortcut Sensei initialized successfully!');
    }

    // Search Functionality
    initializeSearch() {
        const searchInputs = document.querySelectorAll('.search-container input, #app-search, #search-input');
        const searchButtons = document.querySelectorAll('.search-btn');
        
        searchInputs.forEach(input => {
            // Real-time search
            input.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
            
            // Enter key search
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        });

        searchButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const input = e.target.closest('.search-container').querySelector('input') || 
                             document.querySelector('#app-search') || 
                             document.querySelector('#search-input');
                if (input) {
                    this.performSearch(input.value);
                }
            });
        });

        // Search toggle functionality
        const searchToggle = document.getElementById('search-toggle');
        if (searchToggle) {
            searchToggle.addEventListener('click', () => {
                this.toggleSearchBar();
            });
        }
    }

    performSearch(query) {
        if (!query.trim()) {
            this.hideSearchResults();
            return;
        }

        const results = this.searchIndex.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );

        this.displaySearchResults(results, query);
    }

    buildSearchIndex() {
        this.searchIndex = [
            // Applications
            { title: 'Google Chrome', url: 'Google Chrome.html', category: 'Browser', content: 'web browser shortcuts navigation tabs bookmarks' },
            { title: 'Visual Studio Code', url: 'Visual Studio.html', category: 'Development', content: 'code editor programming shortcuts debugging' },
            { title: 'Microsoft Word', url: 'Microsoft Word.htm', category: 'Office', content: 'document writing text formatting' },
            { title: 'Microsoft Excel', url: 'Microsoft Excell.htm', category: 'Office', content: 'spreadsheet data analysis formulas' },
            { title: 'Microsoft PowerPoint', url: 'Microsoft PowerPoint.htm', category: 'Office', content: 'presentation slides' },
            { title: 'Microsoft Outlook', url: 'Microsoft Outlook.html', category: 'Email', content: 'email calendar contacts' },
            { title: 'File Explorer', url: 'File Explorer.htm', category: 'System', content: 'file management windows explorer' },
            { title: 'Discord', url: 'Discord.html', category: 'Communication', content: 'gaming chat voice messaging' },
            { title: 'Slack', url: 'Slack.htm', category: 'Communication', content: 'team communication workspace' },
            { title: 'Zoom', url: 'Zoom.html', category: 'Communication', content: 'video conferencing meetings' },
            { title: 'Spotify', url: 'Spotify.html', category: 'Media', content: 'music streaming playlists' },
            { title: 'Adobe Photoshop', url: 'Adobe PhotoShop.html', category: 'Design', content: 'photo editing graphics design' },
            { title: 'Windows 11', url: 'Windows_11.html', category: 'System', content: 'operating system windows shortcuts' },
            // Pages
            { title: 'All Applications', url: 'all-applications.html', category: 'Navigation', content: 'complete app directory' },
            { title: 'Blogs', url: 'blogs.html', category: 'Content', content: 'articles tips tutorials' },
            { title: 'About', url: 'About.htm', category: 'Info', content: 'about us information' },
            { title: 'Community', url: 'user_com.htm', category: 'Social', content: 'user community forums' }
        ];
    }

    displaySearchResults(results, query) {
        let searchResultsContainer = document.getElementById('search-results');
        
        if (!searchResultsContainer) {
            searchResultsContainer = document.createElement('div');
            searchResultsContainer.id = 'search-results';
            searchResultsContainer.className = 'search-results-dropdown';
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer) {
                searchContainer.appendChild(searchResultsContainer);
            }
        }

        if (results.length === 0) {
            searchResultsContainer.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>No results found for "${query}"</p>
                    <small>Try searching for apps like "Chrome", "Word", or "Photoshop"</small>
                </div>
            `;
        } else {
            const resultsHTML = results.slice(0, 8).map(result => `
                <div class="search-result-item" onclick="window.location.href='${result.url}'">
                    <div class="search-result-icon">
                        <i class="fas ${this.getIconForCategory(result.category)}"></i>
                    </div>
                    <div class="search-result-content">
                        <h4>${result.title}</h4>
                        <p>${result.category} • ${result.content.substring(0, 50)}...</p>
                    </div>
                </div>
            `).join('');

            searchResultsContainer.innerHTML = `
                <div class="search-results-header">
                    <span>Found ${results.length} result${results.length !== 1 ? 's' : ''}</span>
                    <button onclick="shortcutSensei.hideSearchResults()" class="search-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                ${resultsHTML}
                ${results.length > 8 ? `<div class="search-more">+${results.length - 8} more results</div>` : ''}
            `;
        }

        searchResultsContainer.style.display = 'block';
    }

    getIconForCategory(category) {
        const icons = {
            'Browser': 'fa-globe',
            'Development': 'fa-code',
            'Office': 'fa-file-alt',
            'Email': 'fa-envelope',
            'System': 'fa-cog',
            'Communication': 'fa-comments',
            'Media': 'fa-play',
            'Design': 'fa-paint-brush',
            'Navigation': 'fa-compass',
            'Content': 'fa-blog',
            'Info': 'fa-info-circle',
            'Social': 'fa-users'
        };
        return icons[category] || 'fa-file';
    }

    hideSearchResults() {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }

    toggleSearchBar() {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.classList.toggle('active');
            const searchInput = searchContainer.querySelector('input');
            if (searchInput && searchContainer.classList.contains('active')) {
                searchInput.focus();
            }
        }
    }

    // Authentication System with Firebase Integration
    initializeAuth() {
        const loginBtn = document.getElementById('login-btn');
        const userDropdown = document.getElementById('user-dropdown');
        const logoutBtn = document.getElementById('logout-btn');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                if (this.isLoggedIn) {
                    this.toggleUserDropdown();
                } else {
                    this.showLoginModal();
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.logout();
            });
        }

        // Wait for Firebase to initialize before updating UI
        this.waitForFirebase().then(() => {
            this.updateAuthUI();
        });
    }

    async waitForFirebase() {
        let attempts = 0;
        const maxAttempts = 50;
        
        while (attempts < maxAttempts) {
            if (window.firebaseManager) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.firebaseManager) {
            console.warn('Firebase manager not found, using fallback authentication');
        }
    }

    showLoginModal() {
        const modal = this.createLoginModal();
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    createLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <div class="auth-modal-header">
                    <h2><i class="fas fa-keyboard"></i> Welcome to Shortcut Sensei</h2>
                    <button class="auth-modal-close" onclick="this.closest('.auth-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">Login</button>
                    <button class="auth-tab" data-tab="signup">Sign Up</button>
                </div>
                
                <div class="auth-tab-content" id="login-tab">
                    <form class="auth-form" id="login-form">
                        <div class="form-group">
                            <label for="login-email"><i class="fas fa-envelope"></i> Email</label>
                            <input type="email" id="login-email" required placeholder="Enter your email">
                        </div>
                        <div class="form-group">
                            <label for="login-password"><i class="fas fa-lock"></i> Password</label>
                            <input type="password" id="login-password" required placeholder="Enter your password">
                        </div>
                        <button type="submit" class="auth-submit-btn">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                        <div class="auth-options">
                            <a href="#" class="forgot-password">Forgot Password?</a>
                        </div>
                    </form>
                </div>
                
                <div class="auth-tab-content" id="signup-tab" style="display: none;">
                    <form class="auth-form" id="signup-form">
                        <div class="form-group">
                            <label for="signup-name"><i class="fas fa-user"></i> Full Name</label>
                            <input type="text" id="signup-name" required placeholder="Enter your full name">
                        </div>
                        <div class="form-group">
                            <label for="signup-email"><i class="fas fa-envelope"></i> Email</label>
                            <input type="email" id="signup-email" required placeholder="Enter your email">
                        </div>
                        <div class="form-group">
                            <label for="signup-password"><i class="fas fa-lock"></i> Password</label>
                            <input type="password" id="signup-password" required placeholder="Create a password">
                        </div>
                        <div class="form-group">
                            <label for="signup-confirm"><i class="fas fa-lock"></i> Confirm Password</label>
                            <input type="password" id="signup-confirm" required placeholder="Confirm your password">
                        </div>
                        <button type="submit" class="auth-submit-btn">
                            <i class="fas fa-user-plus"></i> Sign Up
                        </button>
                    </form>
                </div>
                
                <div class="auth-divider">
                    <span>Or continue with</span>
                </div>
                
                <div class="social-auth">
                    <button class="social-btn google-btn" onclick="shortcutSensei.socialLogin('google')">
                        <i class="fab fa-google"></i> Google
                    </button>
                    <button class="social-btn github-btn" onclick="shortcutSensei.socialLogin('github')">
                        <i class="fab fa-github"></i> GitHub
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Tab switching
        modal.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchAuthTab(modal, tabName);
            });
        });

        // Form submissions
        modal.querySelector('#login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(modal);
        });

        modal.querySelector('#signup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup(modal);
        });

        // Forgot password link
        modal.querySelector('.forgot-password').addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPasswordModal();
        });

        return modal;
    }

    switchAuthTab(modal, tabName) {
        modal.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
        modal.querySelectorAll('.auth-tab-content').forEach(content => content.style.display = 'none');
        
        modal.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        modal.querySelector(`#${tabName}-tab`).style.display = 'block';
    }

    handleLogin(modal) {
        const email = modal.querySelector('#login-email').value;
        const password = modal.querySelector('#login-password').value;

        // Basic validation
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate login process
        this.showLoadingState(modal.querySelector('#login-form button'));
        
        setTimeout(() => {
            const user = {
                name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                email: email,
                avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=06a3be&color=fff`,
                loginTime: new Date().toISOString(),
                preferences: {
                    theme: localStorage.getItem('theme') || 'light',
                    favoriteApps: []
                }
            };

            this.login(user);
            modal.remove();
            this.showNotification('Welcome back! You\'ve successfully logged in.', 'success');
        }, 1500);
    }

    handleSignup(modal) {
        const name = modal.querySelector('#signup-name').value;
        const email = modal.querySelector('#signup-email').value;
        const password = modal.querySelector('#signup-password').value;
        const confirm = modal.querySelector('#signup-confirm').value;

        // Basic validation
        if (!name || !email || !password || !confirm) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters long', 'error');
            return;
        }

        if (password !== confirm) {
            this.showNotification('Passwords do not match!', 'error');
            return;
        }

        this.showLoadingState(modal.querySelector('#signup-form button'));
        
        setTimeout(() => {
            const user = {
                name: name,
                email: email,
                avatar: `https://ui-avatars.com/api/?name=${name}&background=9c27b0&color=fff`,
                signupTime: new Date().toISOString(),
                preferences: {
                    theme: localStorage.getItem('theme') || 'light',
                    favoriteApps: []
                }
            };

            this.login(user);
            modal.remove();
            this.showNotification(`Welcome ${name}! Your account has been created successfully.`, 'success');
        }, 1500);
    }

    socialLogin(provider) {
        this.showNotification(`${provider} login will be available soon!`, 'info');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async login(user, password = null) {
        try {
            let result;
            
            if (window.firebaseManager && password) {
                // Use Firebase authentication
                result = await window.firebaseManager.signIn(user.email || user, password);
                if (!result.success) {
                    this.showNotification(result.error, 'error');
                    return;
                }
                user = result.user;
            }
            
            this.currentUser = {
                id: user.uid || user.id || Date.now(),
                name: user.displayName || user.name || user.email?.split('@')[0] || 'User',
                email: user.email || '',
                avatar: user.photoURL || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.name || 'User')}&background=06a3be&color=fff`
            };
            
            this.isLoggedIn = true;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateAuthUI();
            this.showNotification(`Welcome back, ${this.currentUser.name}!`, 'success');
            
            // Track login event
            if (window.firebaseManager) {
                window.firebaseManager.trackEvent('login', { method: password ? 'email' : 'demo' });
            }
            
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Login failed. Please try again.', 'error');
        }
    }

    async logout() {
        try {
            if (window.firebaseManager) {
                const result = await window.firebaseManager.signOut();
                if (!result.success) {
                    this.showNotification(result.error, 'error');
                    return;
                }
            }
            
            const userName = this.currentUser?.name || 'User';
            this.currentUser = null;
            this.isLoggedIn = false;
            localStorage.removeItem('currentUser');
            this.updateAuthUI();
            this.showNotification(`Goodbye, ${userName}! You've been logged out.`, 'info');
            
            // Track logout event
            if (window.firebaseManager) {
                window.firebaseManager.trackEvent('logout');
            }
            
        } catch (error) {
            console.error('Logout error:', error);
            this.showNotification('Logout failed. Please try again.', 'error');
        }
    }

    async registerUser(userData) {
        try {
            if (window.firebaseManager) {
                const result = await window.firebaseManager.signUp(
                    userData.email, 
                    userData.password, 
                    userData.fullName || userData.name
                );
                
                if (!result.success) {
                    this.showNotification(result.error, 'error');
                    return;
                }
                
                await this.login(result.user);
                this.showNotification('Account created successfully!', 'success');
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } else {
                // Fallback registration
                const user = {
                    id: Date.now(),
                    name: userData.fullName || userData.name,
                    email: userData.email,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName || userData.name)}&background=06a3be&color=fff`
                };
                
                await this.login(user);
                this.showNotification('Demo account created successfully!', 'success');
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showNotification('Registration failed. Please try again.', 'error');
        }
    }

    updateAuthUI() {
        const loginBtn = document.getElementById('login-btn');
        const userDropdown = document.getElementById('user-dropdown');

        if (!loginBtn) return;

        if (this.isLoggedIn && this.currentUser) {
            loginBtn.innerHTML = `
                <img src="${this.currentUser.avatar}" alt="Profile" class="user-avatar">
                <span>${this.currentUser.name}</span>
                <i class="fas fa-chevron-down"></i>
            `;
            loginBtn.classList.add('logged-in');

            if (userDropdown) {
                userDropdown.innerHTML = `
                    <a href="user_profile.htm"><i class="fas fa-user-circle"></i> Profile</a>
                    <a href="#" onclick="shortcutSensei.showSettings()"><i class="fas fa-cog"></i> Settings</a>
                    <a href="user_com.htm"><i class="fas fa-users"></i> Community</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                `;
                
                // Re-attach logout event
                userDropdown.querySelector('#logout-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
        } else {
            loginBtn.innerHTML = `
                <i class="fas fa-user"></i>
                Login
            `;
            loginBtn.classList.remove('logged-in');
        }
    }

    toggleUserDropdown() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
            
            // Close dropdown when clicking outside
            if (!isVisible) {
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.user-menu')) {
                        dropdown.style.display = 'none';
                    }
                }, { once: true });
            }
        }
    }

    showLoadingState(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1500);
    }

    showForgotPasswordModal() {
        // Close existing auth modal
        const existingModal = document.querySelector('.auth-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content forgot-password-modal">
                <div class="auth-modal-header">
                    <h2><i class="fas fa-key"></i> Reset Your Password</h2>
                    <button class="auth-modal-close" onclick="this.closest('.auth-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="forgot-password-content">
                    <p class="reset-description">
                        <i class="fas fa-info-circle"></i>
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                    
                    <form class="auth-form" id="forgot-password-form">
                        <div class="form-group">
                            <label for="reset-email"><i class="fas fa-envelope"></i> Email Address</label>
                            <input type="email" id="reset-email" required placeholder="Enter your email address">
                        </div>
                        <button type="submit" class="auth-submit-btn">
                            <i class="fas fa-paper-plane"></i> Send Reset Link
                        </button>
                    </form>
                    
                    <div class="auth-options">
                        <a href="#" class="back-to-login">
                            <i class="fas fa-arrow-left"></i> Back to Login
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Form submission
        modal.querySelector('#forgot-password-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword(modal);
        });

        // Back to login
        modal.querySelector('.back-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            modal.remove();
            this.showLoginModal();
        });

        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    handleForgotPassword(modal) {
        const email = modal.querySelector('#reset-email').value;
        const submitBtn = modal.querySelector('#forgot-password-form button');
        
        this.showLoadingState(submitBtn);
        
        setTimeout(() => {
            // Simulate password reset email sent
            modal.innerHTML = `
                <div class="auth-modal-content forgot-password-success">
                    <div class="auth-modal-header">
                        <h2><i class="fas fa-check-circle" style="color: #28a745;"></i> Reset Link Sent!</h2>
                        <button class="auth-modal-close" onclick="this.closest('.auth-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="success-content">
                        <div class="success-icon">
                            <i class="fas fa-envelope-circle-check"></i>
                        </div>
                        <p class="success-message">
                            We've sent a password reset link to <strong>${email}</strong>
                        </p>
                        <p class="success-instructions">
                            Check your email and click the link to reset your password. 
                            The link will expire in 1 hour for security reasons.
                        </p>
                        
                        <div class="success-actions">
                            <button class="auth-submit-btn" onclick="this.closest('.auth-modal').remove()">
                                <i class="fas fa-check"></i> Got it!
                            </button>
                            <a href="#" class="back-to-login" onclick="this.closest('.auth-modal').remove(); shortcutSensei.showLoginModal();">
                                <i class="fas fa-arrow-left"></i> Back to Login
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            this.showNotification('Password reset link sent to your email!', 'success');
        }, 1500);
    }

    // Theme System
    initializeTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        this.setTheme(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        }
    }

    setTheme(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            if (themeToggle) {
                themeToggle.querySelector('i').className = 'fas fa-sun';
            }
        } else {
            document.body.classList.remove('dark-mode');
            if (themeToggle) {
                themeToggle.querySelector('i').className = 'fas fa-moon';
            }
        }
        
        localStorage.setItem('theme', theme);
    }

    // Mobile Menu
    initializeMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mainNav = document.getElementById('main-nav');
        
        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', () => {
                mainNav.classList.toggle('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                }
            });
        }
    }

    // Community Features
    initializeCommunityFeatures() {
        // Initialize community-related functionality
        this.initializeNotifications();
        this.initializeFavorites();
    }

    initializeNotifications() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icons[type] || icons.info}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(notification);

        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    }

    initializeFavorites() {
        const favoriteButtons = document.querySelectorAll('.favorite-btn, .bookmark-btn');
        favoriteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFavorite(btn);
            });
        });
    }

    toggleFavorite(button) {
        if (!this.isLoggedIn) {
            this.showNotification('Please log in to save favorites!', 'warning');
            return;
        }

        const isFavorited = button.classList.contains('favorited');
        const appName = button.dataset.app || document.title.split(' - ')[0];
        
        if (isFavorited) {
            button.classList.remove('favorited');
            button.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
            this.removeFavorite(appName);
            this.showNotification(`Removed from favorites`, 'info');
        } else {
            button.classList.add('favorited');
            button.innerHTML = '<i class="fas fa-heart"></i> Favorited';
            this.addFavorite(appName);
            this.showNotification(`Added to favorites`, 'success');
        }
    }

    addFavorite(appName) {
        if (!this.currentUser) return;
        
        if (!this.currentUser.preferences.favoriteApps.includes(appName)) {
            this.currentUser.preferences.favoriteApps.push(appName);
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    removeFavorite(appName) {
        if (!this.currentUser) return;
        
        const index = this.currentUser.preferences.favoriteApps.indexOf(appName);
        if (index > -1) {
            this.currentUser.preferences.favoriteApps.splice(index, 1);
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    // User Interface Features
    initializeUserInterface() {
        this.initializeTooltips();
        this.initializeScrollEffects();
        this.initializeKeyboardShortcuts();
    }

    initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
        tooltip.style.opacity = '1';
    }

    hideTooltip() {
        const tooltip = document.querySelector('.custom-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    initializeScrollEffects() {
        // Back to top button
        const backToTop = document.querySelector('.back-to-top') || this.createBackToTopButton();
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    createBackToTopButton() {
        const button = document.createElement('button');
        button.className = 'back-to-top';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.setAttribute('data-tooltip', 'Back to top');
        document.body.appendChild(button);
        return button;
    }

    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.focusSearch();
            }
            
            // Escape to close modals/dropdowns
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    focusSearch() {
        const searchInput = document.querySelector('.search-container input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    closeAllModals() {
        // Close search results
        this.hideSearchResults();
        
        // Close user dropdown
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
        
        // Close auth modal
        const authModal = document.querySelector('.auth-modal');
        if (authModal) {
            authModal.remove();
        }
    }

    // Navigation helpers
    setActiveNavigation() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.main-nav a');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath || 
                (currentPath === '' && linkPath === 'index.html') ||
                (currentPath.includes(linkPath) && linkPath !== '#')) {
                link.classList.add('active');
            }
        });
    }

    showSettings() {
        this.showNotification('Settings panel coming soon!', 'info');
    }
}

// Initialize the application
let shortcutSensei;
document.addEventListener('DOMContentLoaded', function() {
    shortcutSensei = new ShortcutSensei();
    
    // Global helper functions
    window.searchShortcuts = (term) => shortcutSensei.performSearch(term);
    window.toggleTheme = () => {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        shortcutSensei.setTheme(newTheme);
    };
});

// Application data for navigation and search
const applicationData = [
    { name: 'Google Chrome', file: 'Google Chrome.html', icon: 'fab fa-chrome', category: 'Browser' },
    { name: 'Visual Studio Code', file: 'Visual Studio.html', icon: 'fas fa-code', category: 'Development' },
    { name: 'File Explorer', file: 'File Explorer.htm', icon: 'fas fa-folder', category: 'System' },
    { name: 'Microsoft Excel', file: 'Microsoft Excell.htm', icon: 'fas fa-file-excel', category: 'Office' },
    { name: 'Microsoft Word', file: 'Microsoft Word.htm', icon: 'fas fa-file-word', category: 'Office' },
    { name: 'Microsoft PowerPoint', file: 'Microsoft PowerPoint.htm', icon: 'fas fa-file-powerpoint', category: 'Office' },
    { name: 'Microsoft Outlook', file: 'Microsoft Outlook.html', icon: 'fas fa-envelope', category: 'Email' },
    { name: 'Microsoft Teams', file: 'Microsoft Teams.html', icon: 'fab fa-microsoft', category: 'Communication' },
    { name: 'Adobe Photoshop', file: 'Adobe PhotoShop.html', icon: 'fas fa-paint-brush', category: 'Design' },
    { name: 'Discord', file: 'Discord.html', icon: 'fab fa-discord', category: 'Communication' },
    { name: 'Slack', file: 'Slack.htm', icon: 'fab fa-slack', category: 'Communication' },
    { name: 'Spotify', file: 'Spotify.html', icon: 'fab fa-spotify', category: 'Media' },
    { name: 'Zoom', file: 'Zoom.html', icon: 'fas fa-video', category: 'Communication' },
    { name: 'Windows 11', file: 'Windows_11.html', icon: 'fab fa-windows', category: 'System' }
];

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShortcutSensei, applicationData };
}
