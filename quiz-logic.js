// Quiz System Logic

class QuizManager {
    constructor() {
        this.currentScreen = 'start';
        this.difficulty = 'easy';
        this.category = 'all';
        this.mode = 'solo';
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = 30;
        this.questions = [];
        this.userAnswers = [];
        this.startTime = null;
        this.timer = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadQuestions();
        this.generateLeaderboard();
        console.log('🧠 Quiz manager initialized');
    }

    setupEventListeners() {
        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectDifficulty(btn.dataset.difficulty);
            });
        });

        // Category selection
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectCategory(btn.dataset.category);
            });
        });

        // Quiz actions
        document.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.dataset.action;
            if (!action) return;

            switch (action) {
                case 'start-solo-quiz':
                    this.startSoloQuiz();
                    break;
                case 'start-battle':
                    this.startBattleMode();
                    break;
                case 'start-team-battle':
                    this.startTeamBattle();
                    break;
                case 'try-again':
                    this.resetQuiz();
                    break;
                case 'challenge-friend':
                    this.challengeFriend();
                    break;
                case 'view-leaderboard':
                    this.showLeaderboard();
                    break;
                case 'cancel-matchmaking':
                    this.cancelMatchmaking();
                    break;
            }
        });

        // Answer selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.answer-btn') && this.currentScreen === 'game') {
                const answerIndex = parseInt(e.target.closest('.answer-btn').dataset.answer);
                this.selectAnswer(answerIndex);
            }
        });

        // Battle answers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.battle-answer') && this.currentScreen === 'battle') {
                const answerIndex = parseInt(e.target.closest('.battle-answer').dataset.answer);
                this.selectBattleAnswer(answerIndex);
            }
        });

        // Leaderboard tabs
        document.querySelectorAll('.leaderboard-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchLeaderboardTab(tab.dataset.tab);
            });
        });

        // Keyboard shortcuts for quiz
        document.addEventListener('keydown', (e) => {
            if (this.currentScreen === 'game' || this.currentScreen === 'battle') {
                const key = e.key.toLowerCase();
                if (['a', 'b', 'c', 'd'].includes(key)) {
                    e.preventDefault();
                    const answerIndex = key.charCodeAt(0) - 97; // Convert a-d to 0-3
                    if (this.currentScreen === 'game') {
                        this.selectAnswer(answerIndex);
                    } else {
                        this.selectBattleAnswer(answerIndex);
                    }
                }
            }
        });
    }

    selectDifficulty(difficulty) {
        this.difficulty = difficulty;
        
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('active');
    }

    selectCategory(category) {
        this.category = category;
        
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
    }

    loadQuestions() {
        // Sample questions database
        this.questionBank = {
            easy: {
                all: [
                    {
                        app: 'General',
                        icon: 'https://img.icons8.com/color/48/keyboard.png',
                        question: 'What does Ctrl + C do?',
                        answers: ['Copy', 'Cut', 'Paste', 'Clear'],
                        correct: 0
                    },
                    {
                        app: 'General',
                        icon: 'https://img.icons8.com/color/48/keyboard.png',
                        question: 'What does Ctrl + V do?',
                        answers: ['Copy', 'Cut', 'Paste', 'Clear'],
                        correct: 2
                    },
                    {
                        app: 'Windows',
                        icon: 'https://img.icons8.com/color/48/windows-10.png',
                        question: 'What does Win + D do?',
                        answers: ['Open Desktop', 'Show Desktop', 'Delete File', 'Open Downloads'],
                        correct: 1
                    }
                ],
                browsers: [
                    {
                        app: 'Chrome',
                        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg',
                        question: 'What does Ctrl + T do in Chrome?',
                        answers: ['Close Tab', 'New Tab', 'Reload Tab', 'Duplicate Tab'],
                        correct: 1
                    }
                ],
                editors: [
                    {
                        app: 'VS Code',
                        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
                        question: 'What does Ctrl + Shift + P do in VS Code?',
                        answers: ['Open Command Palette', 'Open File', 'Save File', 'Close File'],
                        correct: 0
                    }
                ]
            },
            medium: {
                all: [
                    {
                        app: 'Windows',
                        icon: 'https://img.icons8.com/color/48/windows-10.png',
                        question: 'What does Win + Shift + S do?',
                        answers: ['Screenshot Tool', 'System Settings', 'Search', 'Start Menu'],
                        correct: 0
                    }
                ]
            },
            hard: {
                all: [
                    {
                        app: 'VS Code',
                        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
                        question: 'What does Ctrl + Shift + ` do in VS Code?',
                        answers: ['New Terminal', 'Toggle Terminal', 'Close Terminal', 'Split Terminal'],
                        correct: 0
                    }
                ]
            }
        };
    }

    generateQuestions() {
        const difficultyQuestions = this.questionBank[this.difficulty];
        const categoryQuestions = this.category === 'all' 
            ? Object.values(difficultyQuestions).flat()
            : difficultyQuestions[this.category] || difficultyQuestions.all;

        // Shuffle and select 10 questions
        this.questions = this.shuffleArray([...categoryQuestions]).slice(0, 10);
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    startSoloQuiz() {
        this.mode = 'solo';
        this.generateQuestions();
        this.showScreen('game');
        this.startTime = Date.now();
        this.displayQuestion();
        this.startTimer();
    }

    startBattleMode() {
        this.mode = 'battle';
        this.showScreen('matchmaking');
        
        // Simulate matchmaking
        setTimeout(() => {
            this.generateQuestions();
            this.showScreen('battle');
            this.startBattleTimer();
            this.displayBattleQuestion();
        }, 3000);
    }

    startTeamBattle() {
        window.shortcutSensei.showToast('Team battles coming soon! 🛡️', 'info');
    }

    showScreen(screenName) {
        document.querySelectorAll('.quiz-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.querySelector(`[data-screen="${screenName}"]`).classList.add('active');
        this.currentScreen = screenName;
    }

    displayQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.endQuiz();
            return;
        }

        const question = this.questions[this.currentQuestion];
        
        // Update question counter
        document.querySelector('[data-element="question-counter"]').textContent = 
            `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
        
        // Update progress bar
        const progress = ((this.currentQuestion) / this.questions.length) * 100;
        document.querySelector('[data-element="quiz-progress"]').style.width = `${progress}%`;
        
        // Update app context
        const contextIcon = document.querySelector('[data-element="app-context"] img');
        const contextName = document.querySelector('[data-element="app-context"] .context-name');
        contextIcon.src = question.icon;
        contextIcon.alt = question.app;
        contextName.textContent = question.app;
        
        // Update difficulty indicator
        const difficultyIcon = document.querySelector('[data-element="difficulty-indicator"] i');
        const difficultyText = document.querySelector('[data-element="difficulty-indicator"] span');
        difficultyIcon.setAttribute('data-lucide', this.getDifficultyIcon());
        difficultyText.textContent = this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
        
        // Update question text
        document.querySelector('[data-element="question-text"]').textContent = question.question;
        
        // Update answer options
        const answerContainer = document.querySelector('[data-element="answer-options"]');
        answerContainer.innerHTML = question.answers.map((answer, index) => `
            <button class="answer-btn" data-answer="${index}">
                <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
                <span class="answer-text">${answer}</span>
            </button>
        `).join('');
        
        // Reset timer
        this.timeLeft = 30;
        this.updateTimer();
    }

    displayBattleQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.endBattle();
            return;
        }

        const question = this.questions[this.currentQuestion];
        
        document.querySelector('[data-element="battle-question-text"]').textContent = question.question;
        
        const optionsContainer = document.querySelector('[data-element="battle-options"]');
        optionsContainer.innerHTML = question.answers.map((answer, index) => `
            <button class="battle-answer" data-answer="${index}">${answer}</button>
        `).join('');
    }

    selectAnswer(answerIndex) {
        const question = this.questions[this.currentQuestion];
        const isCorrect = answerIndex === question.correct;
        
        // Record answer
        this.userAnswers.push({
            question: question.question,
            userAnswer: question.answers[answerIndex],
            correctAnswer: question.answers[question.correct],
            isCorrect: isCorrect,
            timeSpent: 30 - this.timeLeft
        });
        
        if (isCorrect) {
            this.score++;
        }
        
        // Visual feedback - just highlight selected answer without showing correct/incorrect
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach(btn => btn.disabled = true);
        answerButtons[answerIndex].classList.add('selected');
        
        // Move to next question immediately
        setTimeout(() => {
            this.currentQuestion++;
            this.displayQuestion();
        }, 800);
    }

    selectBattleAnswer(answerIndex) {
        const question = this.questions[this.currentQuestion];
        const isCorrect = answerIndex === question.correct;
        
        // Visual feedback
        const answerButtons = document.querySelectorAll('.battle-answer');
        answerButtons.forEach(btn => btn.disabled = true);
        
        answerButtons[answerIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
        
        if (isCorrect) {
            this.score++;
            // Damage opponent
            this.updateBattleHealth('player-2', -20);
            window.shortcutSensei.showToast('Hit! 💥', 'success');
        } else {
            // Take damage
            this.updateBattleHealth('player-1', -20);
            answerButtons[question.correct].classList.add('correct');
            window.shortcutSensei.showToast('Missed! 😵', 'warning');
        }
        
        // Move to next question
        setTimeout(() => {
            this.currentQuestion++;
            this.displayBattleQuestion();
        }, 2000);
    }

    updateBattleHealth(player, damage) {
        const healthBar = document.querySelector(`[data-element="${player}-health"]`);
        const currentWidth = parseInt(healthBar.style.width);
        const newWidth = Math.max(0, currentWidth + damage);
        
        healthBar.style.width = `${newWidth}%`;
        
        // Update health text
        const healthText = healthBar.closest('.player-health').querySelector('.health-text');
        const healthPoints = Math.ceil(newWidth / 20);
        healthText.textContent = `${healthPoints}/5`;
        
        // Check for battle end
        if (newWidth <= 0) {
            setTimeout(() => {
                this.endBattle(player === 'player-1' ? 'lose' : 'win');
            }, 1000);
        }
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    startBattleTimer() {
        let battleTime = 15;
        const timerElement = document.querySelector('[data-element="battle-timer"]');
        
        const battleTimer = setInterval(() => {
            battleTime--;
            timerElement.textContent = battleTime;
            
            if (battleTime <= 5) {
                timerElement.parentElement.classList.add('urgent');
            }
            
            if (battleTime <= 0) {
                clearInterval(battleTimer);
                this.battleTimeUp();
            }
        }, 1000);
    }

    updateTimer() {
        const timerElement = document.querySelector('[data-element="quiz-timer"] .timer-text');
        timerElement.textContent = this.timeLeft;
        
        if (this.timeLeft <= 10) {
            timerElement.parentElement.classList.add('urgent');
        } else {
            timerElement.parentElement.classList.remove('urgent');
        }
    }

    timeUp() {
        clearInterval(this.timer);
        
        // Auto-select wrong answer
        this.userAnswers.push({
            question: this.questions[this.currentQuestion].question,
            userAnswer: 'No answer (time up)',
            correctAnswer: this.questions[this.currentQuestion].answers[this.questions[this.currentQuestion].correct],
            isCorrect: false,
            timeSpent: 30
        });
        
        // Show correct answer
        const correctIndex = this.questions[this.currentQuestion].correct;
        document.querySelectorAll('.answer-btn')[correctIndex].classList.add('correct');
        
        window.shortcutSensei.showToast('Time\'s up! ⏰', 'warning');
        
        setTimeout(() => {
            this.currentQuestion++;
            this.displayQuestion();
        }, 2000);
    }

    battleTimeUp() {
        // Both players lose health
        this.updateBattleHealth('player-1', -10);
        this.updateBattleHealth('player-2', -10);
        
        window.shortcutSensei.showToast('Time\'s up! Both players take damage! ⚡', 'warning');
        
        setTimeout(() => {
            this.currentQuestion++;
            this.displayBattleQuestion();
        }, 2000);
    }

    endQuiz() {
        clearInterval(this.timer);
        
        const endTime = Date.now();
        const totalTime = Math.floor((endTime - this.startTime) / 1000);
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const xpGained = this.calculateXP();
        
        this.showScreen('results');
        this.displayResults(percentage, totalTime, xpGained);
    }

    endBattle(result = 'win') {
        this.showScreen('results');
        
        const title = result === 'win' ? 'Victory!' : 'Defeat!';
        const subtitle = result === 'win' 
            ? 'You dominated the battlefield!' 
            : 'Better luck next time!';
        
        document.querySelector('[data-element="results-title"]').textContent = title;
        document.querySelector('[data-element="results-subtitle"]').textContent = subtitle;
        
        const icon = document.querySelector('[data-element="results-icon"] i');
        icon.setAttribute('data-lucide', result === 'win' ? 'trophy' : 'shield-x');
        
        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        window.shortcutSensei.showToast(
            result === 'win' ? 'Victory! 🏆' : 'Good fight! 🤝',
            result === 'win' ? 'success' : 'info'
        );
    }

    displayResults(percentage, totalTime, xpGained) {
        // Update stats
        document.querySelector('[data-element="score-percentage"]').textContent = `${percentage}%`;
        document.querySelector('[data-element="time-taken"]').textContent = this.formatTime(totalTime);
        document.querySelector('[data-element="xp-gained"]').textContent = `+${xpGained}`;
        document.querySelector('[data-element="streak-bonus"]').textContent = '+25';
        
        // Update breakdown
        const breakdownContainer = document.querySelector('[data-element="breakdown-list"]');
        breakdownContainer.innerHTML = this.userAnswers.map((answer, index) => `
            <div class="breakdown-item ${answer.isCorrect ? 'correct' : 'incorrect'}">
                <div class="breakdown-icon">
                    <i data-lucide="${answer.isCorrect ? 'check' : 'x'}"></i>
                </div>
                <div class="breakdown-content">
                    <div class="breakdown-question">${answer.question}</div>
                    <div class="breakdown-answer">
                        Your answer: ${answer.userAnswer} | 
                        Correct: ${answer.correctAnswer}
                    </div>
                </div>
            </div>
        `).join('');
        
        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Update user stats
        this.updateUserStats(percentage, xpGained);
    }

    calculateXP() {
        const baseXP = this.score * 15;
        const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 }[this.difficulty];
        const speedBonus = this.userAnswers.reduce((bonus, answer) => {
            return bonus + Math.max(0, 30 - answer.timeSpent);
        }, 0);
        
        return Math.floor(baseXP * difficultyMultiplier + speedBonus);
    }

    updateUserStats(percentage, xpGained) {
        if (window.shortcutSensei && window.shortcutSensei.user) {
            const user = window.shortcutSensei.user;
            user.xp += xpGained;
            user.stats.quizAverage = Math.round((user.stats.quizAverage + percentage) / 2);
            
            // Level up check
            const newLevel = Math.floor(user.xp / 100) + 1;
            if (newLevel > user.level) {
                user.level = newLevel;
                window.shortcutSensei.showToast(`Level up! You're now level ${newLevel}! 🎉`, 'success');
            }
            
            window.shortcutSensei.saveUser();
            window.shortcutSensei.updateUserInterface();
        }
    }

    resetQuiz() {
        this.showScreen('start');
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        clearInterval(this.timer);
    }

    challengeFriend() {
        window.shortcutSensei.showToast('Friend challenges coming soon! 👥', 'info');
    }

    showLeaderboard() {
        const modal = document.querySelector('[data-modal="leaderboard"]');
        modal.classList.add('active');
        this.displayLeaderboard('global');
    }

    switchLeaderboardTab(tab) {
        document.querySelectorAll('.leaderboard-tab').forEach(t => {
            t.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        this.displayLeaderboard(tab);
    }

    displayLeaderboard(type) {
        const container = document.querySelector('[data-element="leaderboard-list"]');
        const leaderboardData = this.getLeaderboardData(type);
        
        container.innerHTML = leaderboardData.map((player, index) => `
            <div class="leaderboard-item ${player.isCurrentUser ? 'current-user' : ''}">
                <div class="leaderboard-rank ${index < 3 ? 'top-3' : ''}">${index + 1}</div>
                <img src="${player.avatar}" alt="${player.name}" class="leaderboard-avatar">
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${player.name}</div>
                    <div class="leaderboard-score">${player.score}% avg • ${player.quizzes} quizzes</div>
                </div>
                <div class="leaderboard-points">${player.points}</div>
            </div>
        `).join('');
    }

    getLeaderboardData(type) {
        // Mock leaderboard data
        const globalData = [
            { name: 'CodeMaster_Pro', avatar: 'https://ui-avatars.com/api/?name=CodeMaster&background=2ecc71&color=fff', score: 98, quizzes: 156, points: 15420, isCurrentUser: false },
            { name: 'ShortcutNinja', avatar: 'https://ui-avatars.com/api/?name=Ninja&background=e74c3c&color=fff', score: 96, quizzes: 142, points: 14890, isCurrentUser: false },
            { name: 'ProductivityGuru', avatar: 'https://ui-avatars.com/api/?name=Guru&background=f39c12&color=fff', score: 94, quizzes: 128, points: 13650, isCurrentUser: false },
            { name: 'You', avatar: 'https://ui-avatars.com/api/?name=You&background=667eea&color=fff', score: 89, quizzes: 23, points: 2450, isCurrentUser: true },
        ];
        
        return globalData.sort((a, b) => b.points - a.points);
    }

    generateLeaderboard() {
        // Initialize leaderboard data
        this.leaderboardData = this.getLeaderboardData('global');
    }

    cancelMatchmaking() {
        this.showScreen('start');
        window.shortcutSensei.showToast('Matchmaking cancelled', 'info');
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    getDifficultyIcon() {
        const icons = {
            easy: 'circle',
            medium: 'triangle',
            hard: 'square'
        };
        return icons[this.difficulty] || 'circle';
    }
}

// Initialize quiz manager
document.addEventListener('DOMContentLoaded', () => {
    window.quizManager = new QuizManager();
});