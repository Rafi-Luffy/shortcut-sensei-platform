/* Dynamic Community System */

class CommunitySystem {
    constructor() {
        this.activityFeed = document.getElementById('activityFeed');
        this.topPerformers = document.getElementById('topPerformers');
        this.risingStars = document.getElementById('risingStars');
        this.challengesGrid = document.getElementById('challengesGrid');
        
        this.activities = [];
        this.leaderboard = {};
        this.challenges = [];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.startLiveUpdates();
        this.animateCounters();
    }
    
    setupEventListeners() {
        // Activity filters
        document.querySelectorAll('.activity-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.activity-filter').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterActivities(e.target.dataset.filter);
            });
        });
        
        // Leaderboard tabs
        document.querySelectorAll('.leaderboard-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.leaderboard-tab').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.loadLeaderboard(e.target.dataset.period);
            });
        });
        
        // Forum categories
        document.querySelectorAll('.forum-category').forEach(category => {
            category.addEventListener('click', () => {
                this.showToast('Forum launching soon! 🚀', 'info');
            });
        });
    }
    
    loadInitialData() {
        this.generateMockActivities();
        this.generateMockLeaderboard();
        this.generateMockChallenges();
        this.renderActivities();
        this.renderLeaderboard();
        this.renderChallenges();
    }
    
    generateMockActivities() {
        const users = ['Alex Chen', 'Sarah Kim', 'Mike Johnson', 'Emma Davis', 'Ryan Lee', 'Lisa Zhang', 'David Smith', 'Maria Garcia'];
        const achievements = ['VS Code Master', 'Photoshop Pro', 'Excel Wizard', 'Shortcut Speedster', 'Power User'];
        const apps = ['VS Code', 'Photoshop', 'Excel', 'Chrome', 'Figma', 'Slack'];
        
        for (let i = 0; i < 20; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const activityType = Math.random() > 0.5 ? 'achievement' : 'challenge';
            
            if (activityType === 'achievement') {
                this.activities.push({
                    id: i,
                    type: 'achievement',
                    user: user,
                    achievement: achievements[Math.floor(Math.random() * achievements.length)],
                    timestamp: new Date(Date.now() - Math.random() * 3600000),
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user)}&background=6366f1&color=fff`
                });
            } else {
                this.activities.push({
                    id: i,
                    type: 'challenge',
                    user: user,
                    app: apps[Math.floor(Math.random() * apps.length)],
                    score: Math.floor(Math.random() * 1000) + 500,
                    timestamp: new Date(Date.now() - Math.random() * 3600000),
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user)}&background=8b5cf6&color=fff`
                });
            }
        }
        
        this.activities.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    generateMockLeaderboard() {
        const users = ['Alex Chen', 'Sarah Kim', 'Mike Johnson', 'Emma Davis', 'Ryan Lee', 'Lisa Zhang', 'David Smith', 'Maria Garcia', 'John Doe', 'Jane Smith'];
        
        this.leaderboard.weekly = users.map((user, index) => ({
            rank: index + 1,
            user: user,
            score: Math.floor(Math.random() * 5000) + 2000,
            change: Math.floor(Math.random() * 10) - 5,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user)}&background=6366f1&color=fff`
        })).sort((a, b) => b.score - a.score);
        
        this.leaderboard.monthly = [...this.leaderboard.weekly].map(user => ({
            ...user,
            score: user.score * 4 + Math.floor(Math.random() * 2000)
        })).sort((a, b) => b.score - a.score);
        
        this.leaderboard.alltime = [...this.leaderboard.weekly].map(user => ({
            ...user,
            score: user.score * 12 + Math.floor(Math.random() * 10000)
        })).sort((a, b) => b.score - a.score);
    }
    
    generateMockChallenges() {
        this.challenges = [
            {
                id: 1,
                title: 'VS Code Speed Challenge',
                description: 'Complete 20 VS Code shortcuts in under 2 minutes',
                participants: 247,
                timeLeft: '2h 34m',
                difficulty: 'Medium',
                reward: '150 XP'
            },
            {
                id: 2,
                title: 'Photoshop Master Class',
                description: 'Master advanced Photoshop shortcuts',
                participants: 89,
                timeLeft: '1d 5h',
                difficulty: 'Hard',
                reward: '300 XP'
            },
            {
                id: 3,
                title: 'Excel Formula Sprint',
                description: 'Quick Excel shortcuts and formulas challenge',
                participants: 156,
                timeLeft: '45m',
                difficulty: 'Easy',
                reward: '75 XP'
            }
        ];
    }
    
    renderActivities() {
        if (!this.activityFeed) return;
        
        const html = this.activities.slice(0, 10).map(activity => {
            if (activity.type === 'achievement') {
                return `
                    <div class="activity-item" data-type="achievement">
                        <img src="${activity.avatar}" alt="${activity.user}" class="activity-avatar">
                        <div class="activity-content">
                            <p><strong>${activity.user}</strong> earned the <span class="achievement-badge">${activity.achievement}</span> badge</p>
                            <span class="activity-time">${this.timeAgo(activity.timestamp)}</span>
                        </div>
                        <div class="activity-icon achievement">🏆</div>
                    </div>
                `;
            } else {
                return `
                    <div class="activity-item" data-type="challenge">
                        <img src="${activity.avatar}" alt="${activity.user}" class="activity-avatar">
                        <div class="activity-content">
                            <p><strong>${activity.user}</strong> scored ${activity.score} points in ${activity.app} challenge</p>
                            <span class="activity-time">${this.timeAgo(activity.timestamp)}</span>
                        </div>
                        <div class="activity-icon challenge">⚡</div>
                    </div>
                `;
            }
        }).join('');
        
        this.activityFeed.innerHTML = html;
    }
    
    renderLeaderboard() {
        if (!this.topPerformers || !this.risingStars) return;
        
        const weekly = this.leaderboard.weekly;
        
        // Top Performers
        const topHtml = weekly.slice(0, 5).map((user, index) => `
            <div class="leaderboard-item">
                <div class="rank">#${index + 1}</div>
                <img src="${user.avatar}" alt="${user.user}" class="leaderboard-avatar">
                <div class="leaderboard-info">
                    <span class="username">${user.user}</span>
                    <span class="score">${user.score.toLocaleString()} pts</span>
                </div>
                <div class="change ${user.change > 0 ? 'positive' : user.change < 0 ? 'negative' : 'neutral'}">
                    ${user.change > 0 ? '+' : ''}${user.change}
                </div>
            </div>
        `).join('');
        
        // Rising Stars (users with highest positive change)
        const risingHtml = weekly
            .filter(user => user.change > 0)
            .sort((a, b) => b.change - a.change)
            .slice(0, 5)
            .map((user, index) => `
                <div class="leaderboard-item">
                    <div class="rank">#${index + 1}</div>
                    <img src="${user.avatar}" alt="${user.user}" class="leaderboard-avatar">
                    <div class="leaderboard-info">
                        <span class="username">${user.user}</span>
                        <span class="score">${user.score.toLocaleString()} pts</span>
                    </div>
                    <div class="change positive">+${user.change}</div>
                </div>
            `).join('');
        
        this.topPerformers.innerHTML = topHtml;
        this.risingStars.innerHTML = risingHtml;
    }
    
    renderChallenges() {
        if (!this.challengesGrid) return;
        
        const html = this.challenges.map(challenge => `
            <div class="challenge-card">
                <div class="challenge-header">
                    <h3>${challenge.title}</h3>
                    <div class="difficulty ${challenge.difficulty.toLowerCase()}">${challenge.difficulty}</div>
                </div>
                <p>${challenge.description}</p>
                <div class="challenge-stats">
                    <div class="stat">
                        <span class="label">Participants</span>
                        <span class="value">${challenge.participants}</span>
                    </div>
                    <div class="stat">
                        <span class="label">Time Left</span>
                        <span class="value">${challenge.timeLeft}</span>
                    </div>
                    <div class="stat">
                        <span class="label">Reward</span>
                        <span class="value">${challenge.reward}</span>
                    </div>
                </div>
                <button class="join-challenge-btn" onclick="communitySystem.joinChallenge(${challenge.id})">
                    Join Challenge
                </button>
            </div>
        `).join('');
        
        this.challengesGrid.innerHTML = html;
    }
    
    filterActivities(filter) {
        const items = document.querySelectorAll('.activity-item');
        items.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'flex';
            } else {
                item.style.display = item.dataset.type === filter ? 'flex' : 'none';
            }
        });
    }
    
    loadLeaderboard(period) {
        const data = this.leaderboard[period];
        if (!data) return;
        
        // Update top performers with new data
        const topHtml = data.slice(0, 5).map((user, index) => `
            <div class="leaderboard-item">
                <div class="rank">#${index + 1}</div>
                <img src="${user.avatar}" alt="${user.user}" class="leaderboard-avatar">
                <div class="leaderboard-info">
                    <span class="username">${user.user}</span>
                    <span class="score">${user.score.toLocaleString()} pts</span>
                </div>
                <div class="change ${user.change > 0 ? 'positive' : user.change < 0 ? 'negative' : 'neutral'}">
                    ${user.change > 0 ? '+' : ''}${user.change}
                </div>
            </div>
        `).join('');
        
        if (this.topPerformers) {
            this.topPerformers.innerHTML = topHtml;
        }
    }
    
    joinChallenge(challengeId) {
        this.showToast('Challenge feature launching soon! 🎮', 'info');
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString();
                }
            }, 16);
        });
    }
    
    startLiveUpdates() {
        // Simulate live activity updates
        setInterval(() => {
            this.addRandomActivity();
        }, 10000); // Add new activity every 10 seconds
        
        // Update online count
        setInterval(() => {
            const onlineCounter = document.querySelector('[data-count="847"]');
            if (onlineCounter) {
                const newCount = 847 + Math.floor(Math.random() * 20) - 10;
                onlineCounter.textContent = newCount.toLocaleString();
            }
        }, 5000);
    }
    
    addRandomActivity() {
        const users = ['Alex Chen', 'Sarah Kim', 'Mike Johnson', 'Emma Davis', 'Ryan Lee'];
        const user = users[Math.floor(Math.random() * users.length)];
        const activityType = Math.random() > 0.5 ? 'achievement' : 'challenge';
        
        const newActivity = {
            id: Date.now(),
            type: activityType,
            user: user,
            timestamp: new Date(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user)}&background=6366f1&color=fff`
        };
        
        if (activityType === 'achievement') {
            newActivity.achievement = 'Speed Demon';
        } else {
            newActivity.app = 'VS Code';
            newActivity.score = Math.floor(Math.random() * 500) + 200;
        }
        
        this.activities.unshift(newActivity);
        this.activities = this.activities.slice(0, 20); // Keep only latest 20
        this.renderActivities();
    }
    
    timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `community-toast community-toast-${type}`;
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

// Initialize community system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.communitySystem = new CommunitySystem();
});

// Export for global access
window.CommunitySystem = CommunitySystem;
