/* Authentication System - Login/Signup Modal */

class AuthenticationSystem {
    constructor() {
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateAuthState();
        this.createCommunityPage();
        this.createUserProfilePage();
    }

    setupEventListeners() {
        // Auth button click
        const authBtn = document.getElementById('authBtn');
        if (authBtn) {
            authBtn.addEventListener('click', () => this.openAuthModal());
        }

        // Modal close
        const authModalClose = document.getElementById('authModalClose');
        const authModalOverlay = document.getElementById('authModalOverlay');
        
        if (authModalClose) {
            authModalClose.addEventListener('click', () => this.closeAuthModal());
        }
        
        if (authModalOverlay) {
            authModalOverlay.addEventListener('click', (e) => {
                if (e.target === authModalOverlay) {
                    this.closeAuthModal();
                }
            });
        }

        // Tab switching
        const signinTab = document.getElementById('signinTab');
        const signupTab = document.getElementById('signupTab');
        
        if (signinTab) {
            signinTab.addEventListener('click', () => this.switchTab('signin'));
        }
        
        if (signupTab) {
            signupTab.addEventListener('click', () => this.switchTab('signup'));
        }

        // Form submissions
        const signinForm = document.getElementById('signinForm');
        const signupForm = document.getElementById('signupForm');
        
        if (signinForm) {
            signinForm.addEventListener('submit', (e) => this.handleSignin(e));
        }
        
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Social auth buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.google-btn')) {
                this.handleSocialAuth('google');
            } else if (e.target.closest('.github-btn')) {
                this.handleSocialAuth('github');
            } else if (e.target.closest('.discord-btn')) {
                this.handleSocialAuth('discord');
            }
        });

        // User profile button
        const userProfileBtn = document.getElementById('userProfileBtn');
        if (userProfileBtn) {
            userProfileBtn.addEventListener('click', () => this.showUserProfile());
        }

        // Navigation links
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (navLink && navLink.getAttribute('data-nav') === 'community') {
                e.preventDefault();
                this.showCommunityPage();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAuthModal();
            }
        });
    }

    openAuthModal() {
        const overlay = document.getElementById('authModalOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            setTimeout(() => {
                overlay.classList.add('active');
            }, 10);
        }
    }

    closeAuthModal() {
        const overlay = document.getElementById('authModalOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 250);
        }
    }

    switchTab(tab) {
        const signinTab = document.getElementById('signinTab');
        const signupTab = document.getElementById('signupTab');
        const signinForm = document.getElementById('signinForm');
        const signupForm = document.getElementById('signupForm');
        const modalTitle = document.getElementById('authModalTitle');
        const modalSubtitle = document.getElementById('authModalSubtitle');

        if (tab === 'signin') {
            signinTab.classList.add('active');
            signupTab.classList.remove('active');
            signinForm.style.display = 'block';
            signupForm.style.display = 'none';
            modalTitle.textContent = 'Welcome Back!';
            modalSubtitle.textContent = 'Sign in to continue your learning journey';
        } else {
            signupTab.classList.add('active');
            signinTab.classList.remove('active');
            signupForm.style.display = 'block';
            signinForm.style.display = 'none';
            modalTitle.textContent = 'Join Shortcut Sensei';
            modalSubtitle.textContent = 'Create an account to start mastering shortcuts';
        }
    }

    async handleSignin(e) {
        e.preventDefault();
        
        const email = document.getElementById('signinEmail').value;
        const password = document.getElementById('signinPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        // Simulate API call
        this.showLoading(e.target);
        
        setTimeout(() => {
            // Mock successful login
            const userData = {
                id: Date.now(),
                name: email.split('@')[0],
                email: email,
                avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=6366f1&color=fff`,
                level: Math.floor(Math.random() * 20) + 1,
                xp: Math.floor(Math.random() * 10000),
                streak: Math.floor(Math.random() * 50) + 1,
                totalQuizzes: Math.floor(Math.random() * 100) + 10,
                averageScore: Math.floor(Math.random() * 30) + 70
            };

            this.login(userData, rememberMe);
            this.hideLoading(e.target);
            this.closeAuthModal();
            this.showToast('Welcome back! Successfully signed in.', 'success');
        }, 2000);
    }

    async handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        if (!name || !email || !password || !confirmPassword) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }

        if (!agreeTerms) {
            this.showToast('Please agree to the terms and conditions', 'error');
            return;
        }

        // Simulate API call
        this.showLoading(e.target);
        
        setTimeout(() => {
            // Mock successful signup
            const userData = {
                id: Date.now(),
                name: name,
                email: email,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
                level: 1,
                xp: 0,
                streak: 0,
                totalQuizzes: 0,
                averageScore: 0
            };

            this.login(userData, true);
            this.hideLoading(e.target);
            this.closeAuthModal();
            this.showToast('Account created successfully! Welcome to Shortcut Sensei.', 'success');
        }, 2000);
    }

    handleSocialAuth(provider) {
        this.showToast(`${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication coming soon!`, 'info');
        
        // Mock social auth success after delay
        setTimeout(() => {
            const userData = {
                id: Date.now(),
                name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
                email: `user@${provider}.com`,
                avatar: `https://ui-avatars.com/api/?name=${provider}&background=6366f1&color=fff`,
                level: Math.floor(Math.random() * 10) + 1,
                xp: Math.floor(Math.random() * 5000),
                streak: Math.floor(Math.random() * 25) + 1,
                totalQuizzes: Math.floor(Math.random() * 50) + 5,
                averageScore: Math.floor(Math.random() * 20) + 75
            };

            this.login(userData, true);
            this.closeAuthModal();
            this.showToast(`Successfully signed in with ${provider}!`, 'success');
        }, 1500);
    }

    login(userData, rememberMe) {
        this.isLoggedIn = true;
        this.currentUser = userData;
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        if (rememberMe) {
            localStorage.setItem('rememberUser', 'true');
        }
        
        this.updateAuthState();
    }

    logout() {
        this.isLoggedIn = false;
        this.currentUser = {};
        
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberUser');
        
        this.updateAuthState();
        this.showToast('Successfully logged out', 'info');
    }

    updateAuthState() {
        const authBtn = document.getElementById('authBtn');
        const userProfileBtn = document.getElementById('userProfileBtn');
        
        if (this.isLoggedIn && this.currentUser.name) {
            // Show user profile button, hide auth button
            if (authBtn) authBtn.style.display = 'none';
            if (userProfileBtn) {
                userProfileBtn.style.display = 'flex';
                const userAvatar = userProfileBtn.querySelector('.user-avatar-small');
                const userName = userProfileBtn.querySelector('.user-name-small');
                
                if (userAvatar) userAvatar.src = this.currentUser.avatar;
                if (userName) userName.textContent = this.currentUser.name;
            }
        } else {
            // Show auth button, hide user profile button
            if (authBtn) authBtn.style.display = 'flex';
            if (userProfileBtn) userProfileBtn.style.display = 'none';
        }
    }

    showUserProfile() {
        const profileModal = this.createUserProfileModal();
        document.body.appendChild(profileModal);
        
        setTimeout(() => {
            profileModal.classList.add('active');
        }, 10);
    }

    createUserProfileModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal-overlay';
        modal.innerHTML = `
            <div class="auth-modal" style="max-width: 600px;">
                <div class="auth-modal-header">
                    <div class="auth-modal-title">
                        <h2>User Profile</h2>
                        <p>Manage your account and track your progress</p>
                    </div>
                    <button class="auth-modal-close" onclick="this.closest('.auth-modal-overlay').remove()">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="auth-modal-content">
                    <div class="user-profile-content">
                        <div class="profile-header">
                            <img src="${this.currentUser.avatar}" alt="${this.currentUser.name}" class="profile-avatar">
                            <div class="profile-info">
                                <h3>${this.currentUser.name}</h3>
                                <p>${this.currentUser.email}</p>
                                <div class="profile-stats">
                                    <span class="stat">Level ${this.currentUser.level}</span>
                                    <span class="stat">${this.currentUser.xp} XP</span>
                                    <span class="stat">${this.currentUser.streak} day streak</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="profile-metrics">
                            <div class="metric">
                                <h4>Total Quizzes</h4>
                                <span>${this.currentUser.totalQuizzes}</span>
                            </div>
                            <div class="metric">
                                <h4>Average Score</h4>
                                <span>${this.currentUser.averageScore}%</span>
                            </div>
                            <div class="metric">
                                <h4>Current Streak</h4>
                                <span>${this.currentUser.streak} days</span>
                            </div>
                        </div>
                        
                        <div class="profile-actions">
                            <button class="auth-submit-btn" onclick="window.authSystem.logout(); this.closest('.auth-modal-overlay').remove();">
                                <i data-lucide="log-out"></i>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize Lucide icons in the modal
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);
        
        return modal;
    }

    createCommunityPage() {
        // This will be used when community link is clicked
        this.communityContent = `
            <section class="community-section">
                <div class="container">
                    <div class="coming-soon">
                        <h1>Community Hub</h1>
                        <p>Connect with fellow shortcut enthusiasts, compete in challenges, and share your progress!</p>
                        
                        <div class="coming-soon-features">
                            <div class="coming-soon-feature">
                                <i data-lucide="users"></i>
                                <h3>Global Leaderboards</h3>
                                <p>Compete with users worldwide and climb the rankings</p>
                            </div>
                            <div class="coming-soon-feature">
                                <i data-lucide="message-circle"></i>
                                <h3>Discussion Forums</h3>
                                <p>Share tips, ask questions, and learn from the community</p>
                            </div>
                            <div class="coming-soon-feature">
                                <i data-lucide="trophy"></i>
                                <h3>Weekly Challenges</h3>
                                <p>Take part in themed challenges and win exclusive badges</p>
                            </div>
                            <div class="coming-soon-feature">
                                <i data-lucide="star"></i>
                                <h3>Achievement System</h3>
                                <p>Unlock achievements and showcase your expertise</p>
                            </div>
                        </div>
                        
                        <button class="auth-submit-btn" onclick="window.authSystem.showToast('Community features launching soon! 🚀', 'info')">
                            <i data-lucide="bell"></i>
                            Get Notified When Available
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    showCommunityPage() {
        // Navigate to the community page
        window.location.href = 'community-enhanced.html';
    }

    createUserProfilePage() {
        // This will be enhanced in future updates
    }

    showLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <i data-lucide="loader-2" style="animation: spin 1s linear infinite;"></i>
                Processing...
            `;
        }
    }

    hideLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            const isSignup = form.id === 'signupForm';
            submitBtn.innerHTML = `
                <i data-lucide="${isSignup ? 'user-plus' : 'log-in'}"></i>
                ${isSignup ? 'Create Account' : 'Sign In'}
            `;
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `auth-toast auth-toast-${type}`;
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
        }, 4000);
    }
}

// CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .profile-header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--border);
    }
    
    .profile-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 3px solid var(--accent-primary);
    }
    
    .profile-info h3 {
        color: var(--text-primary);
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
    }
    
    .profile-info p {
        color: var(--text-secondary);
        margin-bottom: 1rem;
    }
    
    .profile-stats {
        display: flex;
        gap: 1rem;
    }
    
    .profile-stats .stat {
        background: var(--bg-tertiary);
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--accent-primary);
    }
    
    .profile-metrics {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .metric {
        text-align: center;
        background: var(--bg-tertiary);
        padding: 1.5rem;
        border-radius: 1rem;
        border: 1px solid var(--border);
    }
    
    .metric h4 {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    .metric span {
        color: var(--text-primary);
        font-size: 1.5rem;
        font-weight: 700;
    }
    
    .user-avatar-small {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 0.5rem;
    }
    
    .user-profile-btn {
        display: flex;
        align-items: center;
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: var(--radius-full);
        padding: 0.5rem 1rem;
        color: var(--text-primary);
        cursor: pointer;
        transition: all var(--transition-fast);
    }
    
    .user-profile-btn:hover {
        background: var(--bg-tertiary);
        transform: translateY(-1px);
    }
    
    .user-name-small {
        font-weight: 500;
        font-size: 0.9rem;
    }
    
    .page-overlay .nav-modern {
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border);
    }
    
    @media (max-width: 640px) {
        .profile-header {
            flex-direction: column;
            text-align: center;
        }
        
        .profile-metrics {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .profile-stats {
            justify-content: center;
            flex-wrap: wrap;
        }
    }
`;
document.head.appendChild(style);

// Initialize the authentication system
window.authSystem = new AuthenticationSystem();

// Export for global access
window.AuthenticationSystem = AuthenticationSystem;
