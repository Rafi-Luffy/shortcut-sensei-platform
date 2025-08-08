// Homepage Specific JavaScript

class HomepageManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupHeroAnimations();
        this.setupQuizPreview();
        this.setupScrollEffects();
        console.log('🏠 Homepage manager initialized');
    }

    setupHeroAnimations() {
        // Animate floating cards
        const cards = document.querySelectorAll('.floating-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.5}s`;
        });

        // Add parallax effect to floating cards
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            cards.forEach((card, index) => {
                const speed = (index + 1) * 0.1;
                card.style.transform = `translateY(${rate * speed}px)`;
            });
        });
    }

    setupQuizPreview() {
        const quizOptions = document.querySelectorAll('.quiz-option');
        let hasAnswered = false;

        quizOptions.forEach(option => {
            option.addEventListener('click', () => {
                if (hasAnswered) return;
                
                hasAnswered = true;
                
                // Remove hover effects
                quizOptions.forEach(opt => opt.style.pointerEvents = 'none');
                
                // Show correct/incorrect
                if (option.dataset.answer === 'correct') {
                    option.classList.add('correct');
                    window.shortcutSensei.showToast('Correct! Great job! 🎉', 'success');
                } else {
                    option.classList.add('incorrect');
                    document.querySelector('[data-answer="correct"]').classList.add('correct');
                    window.shortcutSensei.showToast('Not quite right. Try again!', 'warning');
                }

                // Update progress
                setTimeout(() => {
                    const progressFill = document.querySelector('.progress-fill');
                    progressFill.style.width = '40%';
                    
                    const progressText = document.querySelector('.progress-text');
                    progressText.textContent = 'Question 4 of 10';
                }, 1000);

                // Reset after 3 seconds
                setTimeout(() => {
                    quizOptions.forEach(opt => {
                        opt.classList.remove('correct', 'incorrect');
                        opt.style.pointerEvents = 'auto';
                    });
                    hasAnswered = false;
                    
                    // Reset progress
                    const progressFill = document.querySelector('.progress-fill');
                    progressFill.style.width = '30%';
                    
                    const progressText = document.querySelector('.progress-text');
                    progressText.textContent = 'Question 3 of 10';
                }, 3000);
            });
        });
    }

    setupScrollEffects() {
        // Smooth scroll for navigation links
        document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    
                    // Stagger animations for grids
                    if (entry.target.classList.contains('apps-grid')) {
                        const cards = entry.target.querySelectorAll('.app-card');
                        cards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('fade-in-up');
                            }, index * 100);
                        });
                    }
                }
            });
        }, observerOptions);

        // Observe sections and grids
        document.querySelectorAll('section, .apps-grid, .gamification-grid').forEach(el => {
            scrollObserver.observe(el);
        });
    }

    // Interactive Demo Features
    simulateBattleAction() {
        const healthBars = document.querySelectorAll('.health-fill');
        const question = document.querySelector('.battle-question p');
        
        const questions = [
            "Quick! What's the shortcut for 'Save As'?",
            "What does Ctrl + Shift + N do?",
            "How do you open DevTools in Chrome?",
            "What's the shortcut for 'Find and Replace'?"
        ];

        // Simulate battle progression
        let currentQuestion = 0;
        const battleInterval = setInterval(() => {
            // Update question
            question.textContent = questions[currentQuestion % questions.length];
            
            // Simulate health changes
            const player1Health = Math.max(20, Math.random() * 100);
            const player2Health = Math.max(20, Math.random() * 100);
            
            healthBars[0].style.width = `${player1Health}%`;
            healthBars[1].style.width = `${player2Health}%`;
            
            currentQuestion++;
            
            if (currentQuestion >= 4) {
                clearInterval(battleInterval);
                // Reset to original state
                setTimeout(() => {
                    question.textContent = "Quick! What's the shortcut for 'Save As'?";
                    healthBars[0].style.width = '80%';
                    healthBars[1].style.width = '60%';
                }, 2000);
            }
        }, 2000);
    }

    // Achievement Animation
    animateAchievements() {
        const achievements = document.querySelectorAll('.achievement');
        
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                achievement.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    achievement.style.transform = 'scale(1)';
                }, 200);
            }, index * 300);
        });
    }

    // Productivity Tips Carousel
    startProductivityTips() {
        const tips = [
            "💡 Tip: Use Ctrl+Shift+T to reopen closed tabs",
            "⚡ Pro Tip: Win+V opens clipboard history in Windows",
            "🎯 Master Tip: Ctrl+Shift+P opens command palette in most editors",
            "🚀 Speed Tip: Alt+Tab cycles through open applications"
        ];

        let currentTip = 0;
        const tipElement = document.createElement('div');
        tipElement.className = 'productivity-tip';
        tipElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            border-radius: var(--border-radius);
            padding: var(--space-sm) var(--space-md);
            color: var(--text-primary);
            font-size: 14px;
            max-width: 300px;
            transform: translateY(100%);
            transition: transform var(--transition-normal);
            z-index: 1000;
        `;

        document.body.appendChild(tipElement);

        const showTip = () => {
            tipElement.textContent = tips[currentTip];
            tipElement.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                tipElement.style.transform = 'translateY(100%)';
            }, 4000);
            
            currentTip = (currentTip + 1) % tips.length;
        };

        // Show first tip after 5 seconds
        setTimeout(showTip, 5000);
        
        // Then show tips every 10 seconds
        setInterval(showTip, 10000);
    }
}

// Initialize homepage manager
document.addEventListener('DOMContentLoaded', () => {
    const homepageManager = new HomepageManager();
    
    // Start productivity tips after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            homepageManager.startProductivityTips();
        }, 3000);
    });

    // Demo battle simulation
    setTimeout(() => {
        homepageManager.simulateBattleAction();
    }, 8000);

    // Achievement animation on scroll
    const achievementsSection = document.querySelector('.achievements-preview');
    if (achievementsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    homepageManager.animateAchievements();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(achievementsSection);
    }
});