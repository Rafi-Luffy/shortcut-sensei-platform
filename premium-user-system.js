// Premium User System & Community Features
class PremiumUserSystem {
    constructor() {
        this.currentUser = this.loadUserProfile();
        this.preferences = this.loadUserPreferences();
        this.friends = this.loadFriends();
        this.notifications = [];
        this.isOnboarding = !this.currentUser;
        this.init();
    }

    init() {
        this.setupUserInterface();
        this.setupCommunityFeatures();
        this.setupNotificationSystem();
        this.setupRealTimeUpdates();
        
        if (this.isOnboarding) {
            this.startOnboarding();
        }
    }

    // === USER ONBOARDING & PREFERENCES ===
    startOnboarding() {
        const onboardingSteps = [
            {
                title: "Welcome to Shortcut Sensei! 🎉",
                content: this.createWelcomeStep(),
                action: "next"
            },
            {
                title: "Tell us about yourself",
                content: this.createProfileStep(),
                action: "profile"
            },
            {
                title: "What are your interests?",
                content: this.createInterestsStep(),
                action: "interests"
            },
            {
                title: "Choose your skill level",
                content: this.createSkillLevelStep(),
                action: "skill"
            },
            {
                title: "Perfect! Let's get started! 🚀",
                content: this.createCompletionStep(),
                action: "complete"
            }
        ];

        this.showOnboardingModal(onboardingSteps);
    }

    createWelcomeStep() {
        return `
            <div class="onboarding-welcome">
                <div class="welcome-animation">
                    <div class="floating-orbs">
                        <div class="orb orb-1"></div>
                        <div class="orb orb-2"></div>
                        <div class="orb orb-3"></div>
                    </div>
                </div>
                <h2 class="animated-gradient-text">Welcome to the Future of Productivity!</h2>
                <p>Join over 2.5 million users who have transformed their workflow with keyboard shortcuts.</p>
                <div class="welcome-stats">
                    <div class="stat">
                        <span class="number">15,000+</span>
                        <span class="label">Shortcuts</span>
                    </div>
                    <div class="stat">
                        <span class="number">30+</span>
                        <span class="label">Applications</span>
                    </div>
                    <div class="stat">
                        <span class="number">500%</span>
                        <span class="label">Faster Workflow</span>
                    </div>
                </div>
            </div>
        `;
    }

    createProfileStep() {
        return `
            <div class="profile-setup">
                <div class="avatar-section">
                    <div class="avatar-upload" id="avatarUpload">
                        <div class="avatar-placeholder">
                            <i data-lucide="user-plus"></i>
                            <span>Add Photo</span>
                        </div>
                    </div>
                </div>
                <div class="profile-form">
                    <div class="form-group">
                        <label>Display Name</label>
                        <input type="text" id="displayName" placeholder="Enter your name" class="premium-input">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="email" placeholder="your@email.com" class="premium-input">
                    </div>
                    <div class="form-group">
                        <label>Role/Profession</label>
                        <select id="profession" class="premium-select">
                            <option value="">Select your role</option>
                            <option value="developer">Software Developer</option>
                            <option value="designer">Designer</option>
                            <option value="writer">Content Writer</option>
                            <option value="manager">Project Manager</option>
                            <option value="student">Student</option>
                            <option value="entrepreneur">Entrepreneur</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    createInterestsStep() {
        const categories = [
            { id: 'development', name: 'Development', icon: 'code', apps: ['VS Code', 'Git', 'Terminal'] },
            { id: 'design', name: 'Design', icon: 'palette', apps: ['Photoshop', 'Figma', 'Illustrator'] },
            { id: 'productivity', name: 'Productivity', icon: 'briefcase', apps: ['Excel', 'Word', 'Notion'] },
            { id: 'browser', name: 'Web Browsing', icon: 'globe', apps: ['Chrome', 'Firefox', 'Safari'] },
            { id: 'media', name: 'Media', icon: 'music', apps: ['Audacity', 'VLC', 'Spotify'] },
            { id: 'communication', name: 'Communication', icon: 'message-circle', apps: ['Slack', 'Discord', 'Teams'] }
        ];

        return `
            <div class="interests-selection">
                <p>Select your areas of interest to get personalized shortcut recommendations:</p>
                <div class="categories-grid">
                    ${categories.map(category => `
                        <div class="category-card" data-category="${category.id}">
                            <div class="category-icon">
                                <i data-lucide="${category.icon}"></i>
                            </div>
                            <h3>${category.name}</h3>
                            <div class="category-apps">
                                ${category.apps.map(app => `<span class="app-tag">${app}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    createSkillLevelStep() {
        return `
            <div class="skill-level-selection">
                <p>What's your current experience with keyboard shortcuts?</p>
                <div class="skill-levels">
                    <div class="skill-card" data-level="beginner">
                        <div class="skill-icon">🌱</div>
                        <h3>Beginner</h3>
                        <p>I'm just starting to learn shortcuts</p>
                        <div class="skill-features">
                            <span>• Basic shortcuts</span>
                            <span>• Step-by-step guides</span>
                            <span>• Practice mode</span>
                        </div>
                    </div>
                    <div class="skill-card" data-level="intermediate">
                        <div class="skill-icon">🚀</div>
                        <h3>Intermediate</h3>
                        <p>I know some shortcuts but want to learn more</p>
                        <div class="skill-features">
                            <span>• Advanced shortcuts</span>
                            <span>• Productivity tips</span>
                            <span>• Custom combinations</span>
                        </div>
                    </div>
                    <div class="skill-card" data-level="expert">
                        <div class="skill-icon">⚡</div>
                        <h3>Expert</h3>
                        <p>I'm a power user looking for the latest shortcuts</p>
                        <div class="skill-features">
                            <span>• Cutting-edge shortcuts</span>
                            <span>• Workflow optimization</span>
                            <span>• Community contributions</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createCompletionStep() {
        return `
            <div class="onboarding-completion">
                <div class="success-animation">
                    <div class="checkmark-circle">
                        <div class="checkmark"></div>
                    </div>
                </div>
                <h2>You're all set! 🎉</h2>
                <p>Based on your preferences, we've curated personalized shortcut recommendations just for you.</p>
                <div class="completion-features">
                    <div class="feature">
                        <i data-lucide="target"></i>
                        <span>Personalized Learning Path</span>
                    </div>
                    <div class="feature">
                        <i data-lucide="users"></i>
                        <span>Connect with Community</span>
                    </div>
                    <div class="feature">
                        <i data-lucide="trophy"></i>
                        <span>Track Your Progress</span>
                    </div>
                </div>
            </div>
        `;
    }

    // === USER PROFILE SYSTEM ===
    createUserProfile() {
        return `
            <div class="user-profile-panel" id="userProfilePanel">
                <div class="profile-header">
                    <div class="profile-banner">
                        <div class="banner-gradient"></div>
                    </div>
                    <div class="profile-info">
                        <div class="avatar-container">
                            <img src="${this.currentUser?.avatar || 'https://ui-avatars.com/api/?name=' + (this.currentUser?.name || 'User') + '&background=6366f1&color=fff'}" alt="Profile" class="profile-avatar">
                            <div class="status-indicator online"></div>
                        </div>
                        <div class="user-details">
                            <h2 class="user-name">${this.currentUser?.name || 'User'}</h2>
                            <p class="user-title">${this.currentUser?.profession || 'Shortcut Enthusiast'}</p>
                            <div class="user-stats">
                                <div class="stat">
                                    <span class="value">${this.currentUser?.shortcuts_learned || 0}</span>
                                    <span class="label">Shortcuts Learned</span>
                                </div>
                                <div class="stat">
                                    <span class="value">${this.currentUser?.streak || 0}</span>
                                    <span class="label">Day Streak</span>
                                </div>
                                <div class="stat">
                                    <span class="value">${this.currentUser?.rank || 'Novice'}</span>
                                    <span class="label">Rank</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="profile-nav">
                    <button class="nav-btn active" data-tab="dashboard">Dashboard</button>
                    <button class="nav-btn" data-tab="progress">Progress</button>
                    <button class="nav-btn" data-tab="friends">Friends</button>
                    <button class="nav-btn" data-tab="achievements">Achievements</button>
                    <button class="nav-btn" data-tab="settings">Settings</button>
                </div>

                <div class="profile-content">
                    <div class="tab-content active" id="dashboard-tab">
                        ${this.createDashboardTab()}
                    </div>
                    <div class="tab-content" id="progress-tab">
                        ${this.createProgressTab()}
                    </div>
                    <div class="tab-content" id="friends-tab">
                        ${this.createFriendsTab()}
                    </div>
                    <div class="tab-content" id="achievements-tab">
                        ${this.createAchievementsTab()}
                    </div>
                    <div class="tab-content" id="settings-tab">
                        ${this.createSettingsTab()}
                    </div>
                </div>
            </div>
        `;
    }

    // === REAL-TIME COMMUNITY FEATURES ===
    setupCommunityFeatures() {
        this.createCommunityPanel();
        this.setupFriendSystem();
        this.setupRealTimeChat();
        this.setupLiveLeaderboard();
    }

    createCommunityPanel() {
        const communityPanel = `
            <div class="community-panel" id="communityPanel">
                <div class="community-header">
                    <h3>Live Community</h3>
                    <div class="online-count">
                        <div class="pulse-dot"></div>
                        <span id="onlineCount">2,847</span> online
                    </div>
                </div>
                
                <div class="community-tabs">
                    <button class="community-tab active" data-tab="friends">Friends</button>
                    <button class="community-tab" data-tab="leaderboard">Leaderboard</button>
                    <button class="community-tab" data-tab="chat">Global Chat</button>
                    <button class="community-tab" data-tab="groups">Groups</button>
                </div>

                <div class="community-content">
                    <div class="community-tab-content active" id="friends-content">
                        ${this.createFriendsContent()}
                    </div>
                    <div class="community-tab-content" id="leaderboard-content">
                        ${this.createLeaderboardContent()}
                    </div>
                    <div class="community-tab-content" id="chat-content">
                        ${this.createChatContent()}
                    </div>
                    <div class="community-tab-content" id="groups-content">
                        ${this.createGroupsContent()}
                    </div>
                </div>
            </div>
        `;

        // Add to page
        const container = document.createElement('div');
        container.innerHTML = communityPanel;
        document.body.appendChild(container.firstElementChild);
    }

    // === LIVE QUIZ INTERFACE ===
    createLiveQuizInterface() {
        return `
            <div class="live-quiz-interface" id="liveQuizInterface">
                <div class="quiz-header">
                    <div class="quiz-info">
                        <h2 class="quiz-title">VS Code Shortcuts Challenge</h2>
                        <div class="quiz-meta">
                            <span class="difficulty">Intermediate</span>
                            <span class="participants">847 players</span>
                            <span class="time-left">2:34</span>
                        </div>
                    </div>
                    <div class="quiz-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 60%"></div>
                        </div>
                        <span class="question-number">6/10</span>
                    </div>
                </div>

                <div class="quiz-content">
                    <div class="question-section">
                        <div class="question-text">
                            <h3>What keyboard shortcut opens the command palette in VS Code?</h3>
                        </div>
                        <div class="options-grid">
                            <button class="option-btn" data-option="A">
                                <span class="option-letter">A</span>
                                <span class="option-text">Ctrl + Shift + P</span>
                            </button>
                            <button class="option-btn" data-option="B">
                                <span class="option-letter">B</span>
                                <span class="option-text">Ctrl + P</span>
                            </button>
                            <button class="option-btn" data-option="C">
                                <span class="option-letter">C</span>
                                <span class="option-text">Ctrl + Alt + P</span>
                            </button>
                            <button class="option-btn" data-option="D">
                                <span class="option-letter">D</span>
                                <span class="option-text">Ctrl + Shift + O</span>
                            </button>
                        </div>
                    </div>

                    <div class="live-scoreboard">
                        <h4>Live Scoreboard</h4>
                        <div class="top-players">
                            <div class="player-item">
                                <div class="rank">#1</div>
                                <div class="player-info">
                                    <img src="https://ui-avatars.com/api/?name=Alex&background=10b981&color=fff" alt="Alex">
                                    <span>Alex_Dev</span>
                                </div>
                                <div class="score">9,540</div>
                            </div>
                            <div class="player-item">
                                <div class="rank">#2</div>
                                <div class="player-info">
                                    <img src="https://ui-avatars.com/api/?name=Sarah&background=6366f1&color=fff" alt="Sarah">
                                    <span>Sarah_Designer</span>
                                </div>
                                <div class="score">9,120</div>
                            </div>
                            <div class="player-item current-user">
                                <div class="rank">#24</div>
                                <div class="player-info">
                                    <img src="https://ui-avatars.com/api/?name=You&background=ec4899&color=fff" alt="You">
                                    <span>You</span>
                                </div>
                                <div class="score">7,890</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="quiz-footer">
                    <div class="power-ups">
                        <button class="power-up" data-type="time" title="Extra Time">
                            <i data-lucide="clock"></i>
                            <span>×2</span>
                        </button>
                        <button class="power-up" data-type="hint" title="Hint">
                            <i data-lucide="lightbulb"></i>
                            <span>×1</span>
                        </button>
                        <button class="power-up" data-type="skip" title="Skip Question">
                            <i data-lucide="skip-forward"></i>
                            <span>×1</span>
                        </button>
                    </div>
                    <div class="quiz-actions">
                        <button class="submit-btn magnetic-btn">
                            <span>Submit Answer</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // === NOTIFICATION SYSTEM ===
    setupNotificationSystem() {
        this.createNotificationCenter();
        this.setupNotificationTypes();
    }

    createNotificationCenter() {
        const notificationCenter = `
            <div class="notification-center" id="notificationCenter">
                <div class="notification-header">
                    <h3>Notifications</h3>
                    <div class="notification-actions">
                        <button class="mark-all-read">Mark all read</button>
                        <button class="notification-settings">
                            <i data-lucide="settings"></i>
                        </button>
                    </div>
                </div>
                <div class="notification-tabs">
                    <button class="notification-tab active" data-type="all">All</button>
                    <button class="notification-tab" data-type="friends">Friends</button>
                    <button class="notification-tab" data-type="achievements">Achievements</button>
                    <button class="notification-tab" data-type="challenges">Challenges</button>
                </div>
                <div class="notification-list" id="notificationList">
                    <!-- Notifications will be populated here -->
                </div>
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = notificationCenter;
        document.body.appendChild(container.firstElementChild);
    }

    // === FRIEND SYSTEM ===
    setupFriendSystem() {
        this.friendRequests = [];
        this.friendsList = this.loadFriends();
    }

    sendFriendRequest(userId) {
        const notification = {
            id: Date.now(),
            type: 'friend_request_sent',
            title: 'Friend Request Sent',
            message: `Friend request sent to user ${userId}`,
            timestamp: new Date(),
            read: false
        };
        
        this.addNotification(notification);
        this.showToast('Friend request sent!', 'success');
    }

    acceptFriendRequest(requestId) {
        const notification = {
            id: Date.now(),
            type: 'friend_request_accepted',
            title: 'Friend Request Accepted',
            message: 'You have a new friend!',
            timestamp: new Date(),
            read: false
        };
        
        this.addNotification(notification);
        this.showToast('Friend request accepted!', 'success');
        this.updateFriendsList();
    }

    // === REAL-TIME FEATURES ===
    setupRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateOnlineCount();
            this.updateLiveScoreboard();
            this.simulateNewMessages();
        }, 5000);

        // Simulate friend activities
        setInterval(() => {
            this.simulateFriendActivity();
        }, 15000);
    }

    // === PERSONALIZED RECOMMENDATIONS ===
    generatePersonalizedRecommendations() {
        const userInterests = this.preferences?.interests || [];
        const skillLevel = this.preferences?.skillLevel || 'beginner';
        
        const recommendations = [];
        
        userInterests.forEach(interest => {
            const shortcuts = this.getShortcutsForCategory(interest, skillLevel);
            recommendations.push(...shortcuts.slice(0, 3));
        });

        return recommendations;
    }

    // === UTILITY METHODS ===
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `premium-toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    <i data-lucide="${this.getToastIcon(type)}"></i>
                </div>
                <div class="toast-message">${message}</div>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i data-lucide="x"></i>
                </button>
            </div>
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, duration);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'alert-circle',
            info: 'info',
            warning: 'alert-triangle'
        };
        return icons[type] || 'info';
    }

    loadUserProfile() {
        return JSON.parse(localStorage.getItem('shortcutSensei_user')) || null;
    }

    saveUserProfile(profile) {
        localStorage.setItem('shortcutSensei_user', JSON.stringify(profile));
        this.currentUser = profile;
    }

    loadUserPreferences() {
        return JSON.parse(localStorage.getItem('shortcutSensei_preferences')) || {};
    }

    saveUserPreferences(preferences) {
        localStorage.setItem('shortcutSensei_preferences', JSON.stringify(preferences));
        this.preferences = preferences;
    }

    loadFriends() {
        return JSON.parse(localStorage.getItem('shortcutSensei_friends')) || [];
    }

    saveFriends(friends) {
        localStorage.setItem('shortcutSensei_friends', JSON.stringify(friends));
        this.friends = friends;
    }
}

// Auto-initialize the premium user system
document.addEventListener('DOMContentLoaded', () => {
    window.premiumUserSystem = new PremiumUserSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiumUserSystem;
}
