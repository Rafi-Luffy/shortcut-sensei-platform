/* Homepage JavaScript Functionality for Shortcut Sensei */

class HomepageManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupStickyNavigation();
        this.setupSmoothScrolling();
        this.setupScrollAnimations();
        this.setupStatisticsCounters();
        this.setupInteractiveQuiz();
        this.setupUserProfile();
        this.setupThemeToggle();
        this.setupPageLoadAnimations();
    }

    // Sticky Navigation
    setupStickyNavigation() {
        const navbar = document.querySelector('.sticky-nav');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!navbar) return;

        // Handle scroll for sticky navbar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Update active nav link based on scroll position
            this.updateActiveNavLink();
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });
        }
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Hero scroll indicator
        const scrollIndicator = document.querySelector('.scroll-arrow');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const applicationsSection = document.getElementById('applications');
                if (applicationsSection) {
                    applicationsSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    // Scroll Animations
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.app-card, .stat-card, .quiz-card, .community-card, .profile-card, .team-member');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Statistics Counters
    setupStatisticsCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => {
            counterObserver.observe(stat);
        });
    }

    animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-count')) || 0;
        const suffix = element.getAttribute('data-suffix') || '';
        const prefix = element.getAttribute('data-prefix') || '';
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = prefix + this.formatNumber(Math.floor(current)) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = prefix + this.formatNumber(target) + suffix;
                element.classList.add('counter-animate');
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

    // Interactive Quiz
    setupInteractiveQuiz() {
        const quizOptions = document.querySelectorAll('.quiz-option');
        const progressFill = document.querySelector('.progress-fill');
        let selectedAnswer = null;

        quizOptions.forEach((option, index) => {
            option.addEventListener('click', () => {
                // Remove previous selections
                quizOptions.forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));
                
                // Add selected class
                option.classList.add('selected');
                selectedAnswer = index;

                // Simulate answer checking after a delay
                setTimeout(() => {
                    this.checkQuizAnswer(option, index);
                    this.updateQuizProgress();
                }, 500);
            });
        });

        // Quiz CTA buttons
        const startQuizBtn = document.querySelector('.start-quiz-btn');
        if (startQuizBtn) {
            startQuizBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Here you would typically redirect to the quiz page
                this.showNotification('Quiz feature coming soon!', 'info');
            });
        }
    }

    checkQuizAnswer(selectedOption, answerIndex) {
        // For demo purposes, let's say the correct answer is index 1 (Ctrl+C)
        const correctAnswer = 1;
        
        if (answerIndex === correctAnswer) {
            selectedOption.classList.add('correct');
            this.showNotification('Correct! Great job!', 'success');
        } else {
            selectedOption.classList.add('incorrect');
            // Show correct answer
            const correctOption = document.querySelectorAll('.quiz-option')[correctAnswer];
            correctOption.classList.add('correct');
            this.showNotification('Not quite right. The correct answer is highlighted.', 'info');
        }
    }

    updateQuizProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            progressFill.style.width = '25%';
            progressText.textContent = 'Question 1 of 4 completed';
        }
    }

    // User Profile
    setupUserProfile() {
        const profileCard = document.querySelector('.profile-card');
        const getStartedBtns = document.querySelectorAll('.get-started-btn, .cta-button.primary');

        // Check if user is logged in (simplified)
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        
        if (isLoggedIn) {
            this.updateProfileDisplay();
        }

        // Handle get started buttons
        getStartedBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!isLoggedIn) {
                    e.preventDefault();
                    this.showAuthModal();
                }
            });
        });

        // Profile actions
        const profileActions = document.querySelectorAll('.profile-action');
        profileActions.forEach(action => {
            action.addEventListener('click', (e) => {
                e.preventDefault();
                const actionType = action.getAttribute('data-action');
                this.handleProfileAction(actionType);
            });
        });
    }

    updateProfileDisplay() {
        // Update profile with sample data
        const profileName = document.querySelector('.profile-info h3');
        const profileEmail = document.querySelector('.profile-info p');
        const statValues = document.querySelectorAll('.profile-stats .stat-value');

        if (profileName) profileName.textContent = 'Alex Johnson';
        if (profileEmail) profileEmail.textContent = 'alex.johnson@example.com';
        
        // Update stats with sample data
        if (statValues.length >= 3) {
            statValues[0].textContent = '1,250';
            statValues[1].textContent = '85%';
            statValues[2].textContent = '15';
        }
    }

    handleProfileAction(actionType) {
        switch (actionType) {
            case 'view-progress':
                this.showNotification('Progress tracking coming soon!', 'info');
                break;
            case 'achievements':
                this.showNotification('Achievements system coming soon!', 'info');
                break;
            case 'settings':
                this.showNotification('Settings panel coming soon!', 'info');
                break;
            default:
                console.log('Unknown profile action:', actionType);
        }
    }

    showAuthModal() {
        // Simple auth modal (in a real app, this would be more sophisticated)
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Get Started with Shortcut Sensei</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Sign up to track your progress and access personalized features!</p>
                    <div class="auth-buttons">
                        <button class="auth-btn primary">Sign Up</button>
                        <button class="auth-btn secondary">Log In</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Auth buttons (simplified)
        const authBtns = modal.querySelectorAll('.auth-btn');
        authBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                localStorage.setItem('userLoggedIn', 'true');
                document.body.removeChild(modal);
                this.updateProfileDisplay();
                this.showNotification('Welcome to Shortcut Sensei!', 'success');
            });
        });
    }

    // Theme Toggle
    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        // Apply saved theme
        document.body.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.body.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.body.setAttribute('data-theme', newTheme);
                document.body.classList.toggle('dark-mode');
                localStorage.setItem('theme', newTheme);
                
                // Update theme toggle icon
                const icon = themeToggle.querySelector('i');
                if (icon) {
                    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                }
            });
        }
    }

    // Page Load Animations
    setupPageLoadAnimations() {
        window.addEventListener('load', () => {
            // Animate hero content
            const heroElements = document.querySelectorAll('.hero-content > *');
            heroElements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('fade-in-up');
                }, index * 200);
            });

            // Animate floating cards
            const floatingCards = document.querySelectorAll('.shortcut-card');
            floatingCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 1000 + (index * 300));
            });
        });
    }

    // Utility Functions
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

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000);

        // Close button
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(notification);
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

    // App Card Interactions
    setupAppCardInteractions() {
        const appCards = document.querySelectorAll('.app-card:not(.view-all-card)');
        
        appCards.forEach(card => {
            card.addEventListener('click', () => {
                const appName = card.querySelector('h3').textContent;
                // In a real app, this would navigate to the app's shortcut page
                this.showNotification(`${appName} shortcuts coming soon!`, 'info');
            });

            // Add keyboard navigation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });

            // Make cards focusable
            card.setAttribute('tabindex', '0');
        });

        // View all applications card
        const viewAllCard = document.querySelector('.view-all-card');
        if (viewAllCard) {
            viewAllCard.addEventListener('click', () => {
                this.showNotification('Applications directory coming soon!', 'info');
            });
        }
    }

    // Community Features
    setupCommunityFeatures() {
        const forumPost = document.querySelector('.forum-post');
        const actionBtns = document.querySelectorAll('.action-btn');

        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.querySelector('span').textContent.toLowerCase();
                
                switch (action) {
                    case 'like':
                        this.handleLike(btn);
                        break;
                    case 'reply':
                        this.showNotification('Community features coming soon!', 'info');
                        break;
                    case 'share':
                        this.handleShare();
                        break;
                }
            });
        });
    }

    handleLike(btn) {
        const countSpan = btn.querySelector('span');
        let count = parseInt(countSpan.textContent.match(/\d+/)[0]);
        
        if (btn.classList.contains('liked')) {
            count--;
            btn.classList.remove('liked');
        } else {
            count++;
            btn.classList.add('liked');
        }
        
        countSpan.textContent = `Like ${count}`;
    }

    handleShare() {
        if (navigator.share) {
            navigator.share({
                title: 'Shortcut Sensei',
                text: 'Master keyboard shortcuts with Shortcut Sensei!',
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Link copied to clipboard!', 'success');
            });
        }
    }

    // Performance Optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize homepage functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const homepage = new HomepageManager();
    
    // Setup app card interactions
    homepage.setupAppCardInteractions();
    
    // Setup community features
    homepage.setupCommunityFeatures();
    
    // Add scroll performance optimization
    const optimizedScrollHandler = homepage.throttle(() => {
        homepage.updateActiveNavLink();
    }, 16);
    
    window.addEventListener('scroll', optimizedScrollHandler);
});

// Additional CSS for dynamic elements
const additionalStyles = `
    .auth-modal {
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

    .modal-content {
        background: var(--card-background);
        border-radius: 15px;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    }

    .dark-mode .modal-content {
        background: var(--dark-card);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-color);
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .close-modal:hover {
        background: rgba(6, 163, 190, 0.1);
        color: var(--primary-color);
    }

    .auth-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 1.5rem;
    }

    .auth-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        flex: 1;
    }

    .auth-btn.primary {
        background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
        color: white;
    }

    .auth-btn.secondary {
        background: transparent;
        color: var(--text-color);
        border: 2px solid var(--primary-color);
    }

    .auth-btn:hover {
        transform: translateY(-2px);
    }

    .notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        z-index: 10001;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    }

    .notification-content {
        background: var(--card-background);
        border-radius: 10px;
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        border-left: 4px solid var(--primary-color);
    }

    .dark-mode .notification-content {
        background: var(--dark-card);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .notification.success .notification-content {
        border-left-color: var(--success-color);
    }

    .notification.error .notification-content {
        border-left-color: var(--error-color);
    }

    .notification.warning .notification-content {
        border-left-color: var(--warning-color);
    }

    .close-notification {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: var(--text-color);
        opacity: 0.7;
        transition: opacity 0.3s ease;
        margin-left: auto;
    }

    .close-notification:hover {
        opacity: 1;
    }

    .quiz-option.selected {
        background: rgba(6, 163, 190, 0.3);
        border-color: var(--primary-color);
        transform: scale(1.02);
    }

    .quiz-option.correct {
        background: rgba(40, 167, 69, 0.2);
        border-color: var(--success-color);
        color: var(--success-color);
    }

    .quiz-option.incorrect {
        background: rgba(220, 53, 69, 0.2);
        border-color: var(--error-color);
        color: var(--error-color);
    }

    .action-btn.liked {
        color: var(--primary-color);
        background: rgba(6, 163, 190, 0.1);
    }

    .shortcut-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideInRight {
        from { 
            opacity: 0;
            transform: translateX(100%);
        }
        to { 
            opacity: 1;
            transform: translateX(0);
        }
    }

    /* Mobile menu styles */
    .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    }

    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: block;
        }

        .nav-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.95);
            flex-direction: column;
            padding: 1rem;
            border-radius: 0 0 15px 15px;
        }

        .nav-menu.active {
            display: flex;
        }

        .notification {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            max-width: none;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
