// Enhanced Quiz System with Live Features
class EnhancedQuizSystem {
    constructor() {
        this.currentQuiz = null;
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = 30;
        this.timer = null;
        this.powerUps = {
            extraTime: 2,
            hint: 1,
            skip: 1
        };
        this.liveParticipants = [];
        this.leaderboard = [];
        this.init();
    }

    init() {
        this.setupQuizInterface();
        this.loadQuizData();
        this.setupLiveFeatures();
        this.setupEventListeners();
    }

    setupQuizInterface() {
        const quizContainer = document.createElement('div');
        quizContainer.innerHTML = `
            <div class="quiz-selection-screen" id="quizSelectionScreen">
                <div class="quiz-hero">
                    <div class="floating-orbs">
                        <div class="orb orb-1"></div>
                        <div class="orb orb-2"></div>
                        <div class="orb orb-3"></div>
                    </div>
                    <h1 class="animated-gradient-text">Challenge Your Knowledge</h1>
                    <p>Test your shortcut mastery in real-time with thousands of players worldwide</p>
                </div>

                <div class="quiz-modes">
                    <div class="quiz-mode-card premium-card" data-mode="quick">
                        <div class="mode-icon">⚡</div>
                        <h3>Quick Challenge</h3>
                        <p>5 random questions, 30 seconds each</p>
                        <div class="mode-stats">
                            <span>🏃‍♂️ 2-3 minutes</span>
                            <span>👥 847 playing now</span>
                        </div>
                        <button class="start-quiz-btn magnetic-btn">
                            <span>Start Quick Quiz</span>
                        </button>
                    </div>

                    <div class="quiz-mode-card premium-card" data-mode="daily">
                        <div class="mode-icon">🏆</div>
                        <h3>Daily Challenge</h3>
                        <p>Today's featured quiz with global leaderboard</p>
                        <div class="mode-stats">
                            <span>⏱️ 10 minutes</span>
                            <span>🌟 2.1k completed today</span>
                        </div>
                        <button class="start-quiz-btn magnetic-btn">
                            <span>Join Daily Challenge</span>
                        </button>
                    </div>

                    <div class="quiz-mode-card premium-card" data-mode="multiplayer">
                        <div class="mode-icon">👥</div>
                        <h3>Live Multiplayer</h3>
                        <p>Compete with friends in real-time</p>
                        <div class="mode-stats">
                            <span>🎮 Real-time</span>
                            <span>⚔️ 156 battles active</span>
                        </div>
                        <button class="start-quiz-btn magnetic-btn">
                            <span>Find Match</span>
                        </button>
                    </div>

                    <div class="quiz-mode-card premium-card" data-mode="custom">
                        <div class="mode-icon">⚙️</div>
                        <h3>Custom Quiz</h3>
                        <p>Create your own quiz or browse community quizzes</p>
                        <div class="mode-stats">
                            <span>🎯 Personalized</span>
                            <span>📚 500+ community quizzes</span>
                        </div>
                        <button class="start-quiz-btn magnetic-btn">
                            <span>Browse Quizzes</span>
                        </button>
                    </div>
                </div>

                <div class="recent-scores">
                    <h3>Your Recent Performance</h3>
                    <div class="score-timeline">
                        <div class="score-point" data-score="85">
                            <div class="score-dot"></div>
                            <div class="score-info">
                                <span class="score-value">85%</span>
                                <span class="score-date">VS Code Quiz</span>
                            </div>
                        </div>
                        <div class="score-point" data-score="92">
                            <div class="score-dot"></div>
                            <div class="score-info">
                                <span class="score-value">92%</span>
                                <span class="score-date">Photoshop Quiz</span>
                            </div>
                        </div>
                        <div class="score-point" data-score="78">
                            <div class="score-dot"></div>
                            <div class="score-info">
                                <span class="score-value">78%</span>
                                <span class="score-date">Chrome Quiz</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Live Quiz Interface will be inserted here -->
        `;

        // Don't auto-append quiz content to avoid appearing after footer
        // Only append when explicitly requested via quiz button
        // document.body.appendChild(quizContainer);
    }

    startQuiz(mode) {
        this.currentQuiz = mode;
        this.loadQuestions(mode);
        this.showLiveQuizInterface();
        this.startLiveSession();
    }

    showLiveQuizInterface() {
        const quizInterface = document.createElement('div');
        quizInterface.className = 'live-quiz-interface show';
        quizInterface.id = 'liveQuizInterface';
        quizInterface.innerHTML = this.createLiveQuizHTML();
        
        // Don't auto-append quiz interface to avoid appearing after footer
        // Only show when quiz is started
        // document.body.appendChild(quizInterface);
        this.startQuestion();
    }

    createLiveQuizHTML() {
        return `
            <div class="quiz-header">
                <div class="quiz-info">
                    <h2 class="quiz-title">VS Code Shortcuts Challenge</h2>
                    <div class="quiz-meta">
                        <span class="difficulty">Intermediate</span>
                        <span class="participants" id="participantCount">847 players</span>
                        <span class="time-left" id="timeLeft">30s</span>
                    </div>
                </div>
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill" style="width: 0%"></div>
                    </div>
                    <span class="question-number" id="questionNumber">1/10</span>
                </div>
                <button class="quiz-close" onclick="this.closeQuiz()">
                    <i data-lucide="x"></i>
                </button>
            </div>

            <div class="quiz-content">
                <div class="question-section">
                    <div class="question-text">
                        <h3 id="questionText">Loading question...</h3>
                        <div class="question-hint" id="questionHint" style="display: none;">
                            <i data-lucide="lightbulb"></i>
                            <span id="hintText"></span>
                        </div>
                    </div>
                    <div class="options-grid" id="optionsGrid">
                        <!-- Options will be populated -->
                    </div>
                </div>

                <div class="quiz-sidebar">
                    <div class="live-scoreboard">
                        <h4>Live Leaderboard</h4>
                        <div class="top-players" id="topPlayers">
                            <!-- Leaderboard will be populated -->
                        </div>
                    </div>

                    <div class="live-chat">
                        <h4>Live Chat</h4>
                        <div class="chat-messages" id="chatMessages">
                            <div class="chat-message">
                                <span class="username">Alex_Dev:</span>
                                <span class="message">Good luck everyone! 🚀</span>
                            </div>
                            <div class="chat-message">
                                <span class="username">Sarah_Designer:</span>
                                <span class="message">This is intense! 💪</span>
                            </div>
                        </div>
                        <div class="chat-input">
                            <input type="text" placeholder="Send a message..." id="chatInput">
                            <button onclick="this.sendChatMessage()">
                                <i data-lucide="send"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="quiz-footer">
                <div class="power-ups">
                    <button class="power-up" data-type="time" title="Extra Time (+15s)" onclick="this.usePowerUp('time')">
                        <i data-lucide="clock"></i>
                        <span>×${this.powerUps.extraTime}</span>
                    </button>
                    <button class="power-up" data-type="hint" title="Show Hint" onclick="this.usePowerUp('hint')">
                        <i data-lucide="lightbulb"></i>
                        <span>×${this.powerUps.hint}</span>
                    </button>
                    <button class="power-up" data-type="skip" title="Skip Question" onclick="this.usePowerUp('skip')">
                        <i data-lucide="skip-forward"></i>
                        <span>×${this.powerUps.skip}</span>
                    </button>
                </div>
                <div class="quiz-actions">
                    <button class="submit-btn magnetic-btn" id="submitBtn" onclick="this.submitAnswer()">
                        <span>Submit Answer</span>
                    </button>
                </div>
            </div>

            <!-- Results Modal -->
            <div class="quiz-results-modal" id="quizResultsModal" style="display: none;">
                <div class="results-content">
                    <div class="results-header">
                        <div class="results-score">
                            <div class="score-circle">
                                <span class="score-percentage" id="finalScore">85%</span>
                            </div>
                            <h2>Excellent Work!</h2>
                            <p>You scored better than 73% of players</p>
                        </div>
                    </div>
                    
                    <div class="results-breakdown">
                        <div class="result-stat">
                            <div class="stat-icon">✅</div>
                            <div class="stat-info">
                                <span class="stat-value" id="correctAnswers">8</span>
                                <span class="stat-label">Correct</span>
                            </div>
                        </div>
                        <div class="result-stat">
                            <div class="stat-icon">⚡</div>
                            <div class="stat-info">
                                <span class="stat-value" id="avgTime">12s</span>
                                <span class="stat-label">Avg Time</span>
                            </div>
                        </div>
                        <div class="result-stat">
                            <div class="stat-icon">🏆</div>
                            <div class="stat-info">
                                <span class="stat-value" id="finalRank">#24</span>
                                <span class="stat-label">Rank</span>
                            </div>
                        </div>
                    </div>

                    <div class="results-actions">
                        <button class="btn-primary magnetic-btn" onclick="this.playAgain()">
                            <span>Play Again</span>
                        </button>
                        <button class="btn-outline" onclick="this.shareResults()">
                            <span>Share Results</span>
                        </button>
                        <button class="btn-outline" onclick="this.viewAnalytics()">
                            <span>View Analytics</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    loadQuestions(mode) {
        // Sample questions for different modes
        const questionSets = {
            quick: [
                {
                    question: "What keyboard shortcut opens the command palette in VS Code?",
                    options: ["Ctrl + Shift + P", "Ctrl + P", "Ctrl + Alt + P", "Ctrl + Shift + O"],
                    correct: 0,
                    hint: "Think about the most common way to access all VS Code commands"
                },
                {
                    question: "Which shortcut duplicates the current line in VS Code?",
                    options: ["Ctrl + D", "Ctrl + Shift + D", "Alt + Shift + Down", "Ctrl + C, Ctrl + V"],
                    correct: 2,
                    hint: "It involves the Alt key and arrow keys"
                },
                {
                    question: "What's the shortcut to comment/uncomment code in VS Code?",
                    options: ["Ctrl + /", "Ctrl + Shift + /", "Ctrl + K + C", "Alt + /"],
                    correct: 0,
                    hint: "The simplest shortcut for toggling comments"
                },
                {
                    question: "Which shortcut opens the integrated terminal in VS Code?",
                    options: ["Ctrl + `", "Ctrl + T", "Ctrl + Shift + `", "F12"],
                    correct: 0,
                    hint: "It uses the backtick character"
                },
                {
                    question: "What shortcut formats the entire document in VS Code?",
                    options: ["Ctrl + Shift + F", "Alt + Shift + F", "Ctrl + K + F", "F12"],
                    correct: 1,
                    hint: "It involves Alt and Shift keys"
                }
            ],
            daily: this.generateDailyQuestions(),
            multiplayer: this.generateMultiplayerQuestions(),
            custom: this.generateCustomQuestions()
        };

        this.questions = questionSets[mode] || questionSets.quick;
    }

    startQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.endQuiz();
            return;
        }

        const question = this.questions[this.currentQuestion];
        this.updateQuestionDisplay(question);
        this.startTimer();
        this.updateProgress();
    }

    updateQuestionDisplay(question) {
        document.getElementById('questionText').textContent = question.question;
        document.getElementById('questionNumber').textContent = `${this.currentQuestion + 1}/${this.questions.length}`;
        
        const optionsGrid = document.getElementById('optionsGrid');
        optionsGrid.innerHTML = question.options.map((option, index) => `
            <button class="option-btn" data-option="${index}" onclick="window.enhancedQuiz.selectOption(${index})">
                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                <span class="option-text">${option}</span>
            </button>
        `).join('');

        // Store hint
        this.currentHint = question.hint;
    }

    selectOption(optionIndex) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => btn.classList.remove('selected'));
        buttons[optionIndex].classList.add('selected');
        this.selectedOption = optionIndex;
    }

    submitAnswer() {
        if (this.selectedOption === undefined) return;

        clearInterval(this.timer);
        
        const question = this.questions[this.currentQuestion];
        const isCorrect = this.selectedOption === question.correct;
        
        if (isCorrect) {
            this.score += this.calculateScore();
        }

        this.showAnswerFeedback(isCorrect, question.correct);
        
        setTimeout(() => {
            this.currentQuestion++;
            this.selectedOption = undefined;
            this.startQuestion();
        }, 2000);
    }

    showAnswerFeedback(isCorrect, correctIndex) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons[correctIndex].classList.add('correct');
        
        if (!isCorrect) {
            buttons[this.selectedOption].classList.add('incorrect');
        }

        // Show celebration or encouragement
        if (isCorrect) {
            this.showFeedbackMessage("Correct! Great job! 🎉", 'success');
        } else {
            this.showFeedbackMessage("Not quite right, keep going! 💪", 'info');
        }
    }

    usePowerUp(type) {
        if (this.powerUps[type] <= 0) return;

        switch(type) {
            case 'time':
                this.timeLeft += 15;
                this.powerUps.extraTime--;
                this.showFeedbackMessage("+15 seconds added! ⏰", 'success');
                break;
            case 'hint':
                document.getElementById('questionHint').style.display = 'block';
                document.getElementById('hintText').textContent = this.currentHint;
                this.powerUps.hint--;
                this.showFeedbackMessage("Hint revealed! 💡", 'info');
                break;
            case 'skip':
                this.powerUps.skip--;
                this.showFeedbackMessage("Question skipped! ⏭️", 'info');
                this.currentQuestion++;
                this.startQuestion();
                break;
        }

        this.updatePowerUpDisplay();
    }

    startLiveSession() {
        // Simulate live participants
        this.simulateLiveParticipants();
        this.updateLeaderboard();
        this.setupRealTimeUpdates();
    }

    simulateLiveParticipants() {
        const names = ['Alex_Dev', 'Sarah_Designer', 'Mike_PM', 'Lisa_Writer', 'John_Student', 'Emma_Entrepreneur'];
        this.liveParticipants = names.map((name, index) => ({
            name,
            score: Math.floor(Math.random() * 10000) + 5000,
            rank: index + 1,
            avatar: `https://ui-avatars.com/api/?name=${name.split('_')[0]}&background=${this.getRandomColor()}&color=fff`
        }));
    }

    updateLeaderboard() {
        const topPlayers = document.getElementById('topPlayers');
        if (!topPlayers) return;

        const top5 = this.liveParticipants.slice(0, 5);
        topPlayers.innerHTML = top5.map((player, index) => `
            <div class="player-item ${index === 2 ? 'current-user' : ''}">
                <div class="rank">#${player.rank}</div>
                <div class="player-info">
                    <img src="${player.avatar}" alt="${player.name}">
                    <span>${player.name}</span>
                </div>
                <div class="score">${player.score.toLocaleString()}</div>
            </div>
        `).join('');
    }

    endQuiz() {
        const finalPercentage = Math.round((this.score / (this.questions.length * 1000)) * 100);
        this.showResults(finalPercentage);
    }

    showResults(percentage) {
        const modal = document.getElementById('quizResultsModal');
        modal.style.display = 'flex';
        
        // Update score display
        const scoreElement = document.getElementById('finalScore');
        scoreElement.textContent = `${percentage}%`;
        
        // Apply score-based animations and styling
        const resultsContent = modal.querySelector('.results-content');
        const scoreCircle = modal.querySelector('.score-circle');
        
        // Remove existing score classes
        scoreCircle.classList.remove('score-excellent', 'score-good', 'score-average', 'score-poor');
        resultsContent.classList.remove('score-celebration');
        
        // Add appropriate animation class based on score
        if (percentage >= 90) {
            scoreCircle.classList.add('score-excellent');
            resultsContent.classList.add('score-celebration');
            this.createFireworks(modal);
            this.createConfetti(modal);
            this.showScoreMessage('🏆 Outstanding! You\'re a true Shortcut Master!', 'excellent');
        } else if (percentage >= 75) {
            scoreCircle.classList.add('score-good');
            resultsContent.classList.add('score-celebration');
            this.showScoreMessage('🥈 Great job! You\'re getting really good at this!', 'good');
        } else if (percentage >= 60) {
            scoreCircle.classList.add('score-average');
            resultsContent.classList.add('score-celebration');
            this.showScoreMessage('🥉 Good work! Keep practicing to improve!', 'average');
        } else {
            scoreCircle.classList.add('score-poor');
            resultsContent.classList.add('score-celebration');
            this.showScoreMessage('💪 Don\'t give up! Practice makes perfect!', 'encourage');
        }
        
        // Update other stats
        document.getElementById('correctAnswers').textContent = Math.floor(percentage / 10);
        document.getElementById('avgTime').textContent = `${Math.floor(Math.random() * 10) + 8}s`;
        document.getElementById('finalRank').textContent = `#${Math.floor(Math.random() * 50) + 10}`;
        
        // Animate the modal appearance
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    }

    createFireworks(container) {
        const fireworksContainer = document.createElement('div');
        fireworksContainer.className = 'fireworks-container';
        
        // Create multiple firework particles
        for (let i = 0; i < 15; i++) {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 100 + '%';
            fireworksContainer.appendChild(firework);
        }
        
        container.appendChild(fireworksContainer);
        
        // Remove fireworks after animation
        setTimeout(() => {
            fireworksContainer.remove();
        }, 3000);
    }

    createConfetti(container) {
        const confettiCount = 20;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }
    }

    showScoreMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `score-message score-message-${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: 600;
            z-index: 10001;
            animation: messageSlide 4s ease-in-out forwards;
        `;
        
        document.body.appendChild(messageElement);
        
        // Remove message after animation
        setTimeout(() => {
            messageElement.remove();
        }, 4000);
    }

    // Utility methods
    startTimer() {
        this.timeLeft = 30;
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timeLeft').textContent = `${this.timeLeft}s`;
            
            if (this.timeLeft <= 0) {
                this.submitAnswer();
            }
        }, 1000);
    }

    calculateScore() {
        const baseScore = 1000;
        const timeBonus = this.timeLeft * 10;
        return baseScore + timeBonus;
    }

    updateProgress() {
        const progress = ((this.currentQuestion) / this.questions.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }

    showFeedbackMessage(message, type) {
        if (window.premiumUserSystem) {
            window.premiumUserSystem.showToast(message, type, 2000);
        }
    }

    getRandomColor() {
        const colors = ['6366f1', '8b5cf6', 'ec4899', '06b6d4', '10b981', 'f59e0b'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Generate different question sets
    generateDailyQuestions() {
        return [
            {
                question: "Today's Challenge: Which Photoshop shortcut creates a new layer?",
                options: ["Ctrl + Shift + N", "Ctrl + N", "Ctrl + L", "Shift + N"],
                correct: 0,
                hint: "It's similar to creating a new file, but with Shift"
            }
            // Add more daily questions...
        ];
    }

    generateMultiplayerQuestions() {
        return [
            {
                question: "Speed Round: Chrome's shortcut to open a new incognito window?",
                options: ["Ctrl + Shift + N", "Ctrl + N", "Ctrl + Shift + P", "Ctrl + I"],
                correct: 0,
                hint: "Think 'New' with 'Shift' for privacy"
            }
            // Add more multiplayer questions...
        ];
    }

    generateCustomQuestions() {
        return [
            {
                question: "Custom: What's your preferred way to switch between VS Code tabs?",
                options: ["Ctrl + Tab", "Ctrl + PageUp/Down", "Alt + Number", "Mouse click"],
                correct: 0,
                hint: "The most universal tab switching method"
            }
            // Add more custom questions...
        ];
    }
}

// Initialize Enhanced Quiz System
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedQuiz = new EnhancedQuizSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedQuizSystem;
}
