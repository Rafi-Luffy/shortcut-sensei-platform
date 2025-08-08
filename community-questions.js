// Community Questions System - Dynamic Q&A Management
class CommunityQuestions {
    constructor() {
        this.questions = this.generateMockQuestions();
        this.currentFilter = 'newest';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderQuestions();
        this.animateStats();
    }

    bindEvents() {
        // Question form submission
        const questionForm = document.getElementById('questionForm');
        if (questionForm) {
            questionForm.addEventListener('submit', (e) => this.handleQuestionSubmit(e));
        }

        // Sorting and filtering
        const sortSelect = document.getElementById('sortQuestions');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.handleSortChange(e));
        }

        // Search functionality
        const searchBtn = document.getElementById('searchQuestions');
        const searchInput = document.getElementById('questionSearch');
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => this.handleSearch());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearch();
            });
        }
    }

    generateMockQuestions() {
        return [
            {
                id: 1,
                title: "What's the quickest way to navigate between applications in Windows?",
                content: "I'm trying to find the most efficient way to switch between multiple applications in Windows. I know about Alt+Tab, but I'm wondering if there are better methods when you have many windows open at once. Any tips or advanced shortcuts would be appreciated.",
                author: {
                    name: "John Doe",
                    avatar: "JD",
                    badge: "Top Contributor"
                },
                timestamp: "2024-03-22T10:30:00Z",
                views: 1245,
                likes: 42,
                answers: 8,
                categories: ["Windows", "Productivity", "Navigation"],
                isBestAnswered: true,
                answers: [
                    {
                        id: 1,
                        content: `Beyond the basic Alt+Tab, here are more powerful options:

1. **Windows+Tab**: Opens Task View, which provides a persistent view of all your open apps.
2. **Alt+Tab (hold Alt)**: Shows all windows, then press Tab repeatedly to cycle through them.
3. **Windows+Number**: Switch to the app pinned in that position on your taskbar (1 for first app, 2 for second, etc.)
4. **Ctrl+Windows+Left/Right Arrow**: Switch between virtual desktops.
5. **Alt+Esc**: Cycle through windows in the order they were opened.

My personal favorite is Windows+Number because it's the most precise when you have a consistent workspace setup.`,
                        author: {
                            name: "Mark Smith",
                            avatar: "MS",
                            badge: "Moderator"
                        },
                        timestamp: "2024-03-22T11:15:00Z",
                        likes: 76,
                        isBestAnswer: true,
                        replies: [
                            {
                                content: "Thanks Mark! I didn't know about the Windows+Number shortcut. That's going to be a game-changer for me!",
                                author: {
                                    name: "John Doe",
                                    avatar: "JD",
                                    badge: "Top Contributor"
                                },
                                timestamp: "2024-03-23T09:20:00Z"
                            }
                        ]
                    },
                    {
                        id: 2,
                        content: "Don't forget about **Win+T** to cycle through taskbar items and **Alt+F4** to close the current window quickly. These are lifesavers for keyboard-only navigation!",
                        author: {
                            name: "Lisa Garcia",
                            avatar: "LG",
                            badge: "Expert"
                        },
                        timestamp: "2024-03-22T14:20:00Z",
                        likes: 23,
                        isBestAnswer: false
                    }
                ]
            },
            {
                id: 2,
                title: "Best Excel shortcuts for data analysis workflows?",
                content: "I spend hours in Excel analyzing large datasets. What are the most time-saving shortcuts for filtering, sorting, and creating pivot tables? Looking for advanced techniques beyond the basics.",
                author: {
                    name: "Sarah Chen",
                    avatar: "SC",
                    badge: "Data Analyst"
                },
                timestamp: "2024-03-21T16:45:00Z",
                views: 892,
                likes: 28,
                answers: 5,
                categories: ["Excel", "Data Analysis", "Productivity"],
                isBestAnswered: true,
                answers: [
                    {
                        id: 3,
                        content: `Here are my go-to Excel shortcuts for data analysis:

**Data Selection & Navigation:**
- **Ctrl+Shift+End**: Select from current cell to end of data
- **Ctrl+Arrow Keys**: Jump to edge of data range
- **Ctrl+Space**: Select entire column
- **Shift+Space**: Select entire row

**Filtering & Sorting:**
- **Ctrl+Shift+L**: Toggle AutoFilter
- **Alt+Down Arrow**: Open filter dropdown (when in header)
- **Alt+D+S**: Sort dialog box

**Pivot Tables:**
- **Alt+N+V**: Insert PivotTable
- **Alt+J+T**: PivotTable Tools tab
- **F4**: Repeat last action (great for formatting)

**Analysis Features:**
- **Alt+M+V**: Data Validation
- **Ctrl+Shift+F3**: Create names from selection
- **Alt+M+G+G**: Go To Special dialog`,
                        author: {
                            name: "David Rodriguez",
                            avatar: "DR",
                            badge: "Excel Expert"
                        },
                        timestamp: "2024-03-21T18:30:00Z",
                        likes: 45,
                        isBestAnswer: true
                    }
                ]
            },
            {
                id: 3,
                title: "VS Code shortcuts for faster coding?",
                content: "I'm new to VS Code and want to speed up my development workflow. What are the essential shortcuts every developer should know?",
                author: {
                    name: "Alex Thompson",
                    avatar: "AT",
                    badge: "New Member"
                },
                timestamp: "2024-03-20T09:15:00Z",
                views: 567,
                likes: 15,
                answers: 3,
                categories: ["VS Code", "Development", "IDE"],
                isBestAnswered: false,
                answers: [
                    {
                        id: 4,
                        content: `Essential VS Code shortcuts for beginners:

**File Management:**
- **Ctrl+P**: Quick Open (find files)
- **Ctrl+Shift+P**: Command Palette
- **Ctrl+N**: New file
- **Ctrl+W**: Close current tab

**Code Navigation:**
- **Ctrl+G**: Go to line
- **Ctrl+F**: Find in file
- **Ctrl+Shift+F**: Find in all files
- **F12**: Go to definition

**Editing:**
- **Ctrl+D**: Select next occurrence
- **Alt+Up/Down**: Move line up/down
- **Shift+Alt+Up/Down**: Copy line up/down
- **Ctrl+/**: Toggle comment`,
                        author: {
                            name: "Jennifer Park",
                            avatar: "JP",
                            badge: "Senior Developer"
                        },
                        timestamp: "2024-03-20T11:30:00Z",
                        likes: 31,
                        isBestAnswer: false
                    }
                ]
            },
            {
                id: 4,
                title: "macOS shortcuts for window management?",
                content: "Switching from Windows to Mac. What are the equivalent shortcuts for managing windows and switching between apps?",
                author: {
                    name: "Mike Wilson",
                    avatar: "MW",
                    badge: "Mac Newbie"
                },
                timestamp: "2024-03-19T14:20:00Z",
                views: 234,
                likes: 8,
                answers: 2,
                categories: ["macOS", "Window Management", "Switching"],
                isBestAnswered: false,
                answers: []
            },
            {
                id: 5,
                title: "Photoshop layer shortcuts for faster editing?",
                content: "Working on complex compositions with many layers. Need shortcuts to manage, organize, and edit layers more efficiently.",
                author: {
                    name: "Emma Davis",
                    avatar: "ED",
                    badge: "Designer"
                },
                timestamp: "2024-03-18T12:10:00Z",
                views: 445,
                likes: 22,
                answers: 4,
                categories: ["Photoshop", "Design", "Layers"],
                isBestAnswered: true,
                answers: [
                    {
                        id: 5,
                        content: `Layer management shortcuts in Photoshop:

**Layer Selection:**
- **Ctrl+Click**: Select layer content
- **Alt+]**: Select next layer up
- **Alt+[**: Select next layer down
- **Shift+Alt+]**: Select all layers above
- **Shift+Alt+[**: Select all layers below

**Layer Operations:**
- **Ctrl+J**: Duplicate layer
- **Ctrl+Shift+N**: New layer
- **Ctrl+E**: Merge down
- **Ctrl+Shift+E**: Merge visible
- **Ctrl+G**: Group layers

**Blending & Opacity:**
- **Shift+Plus/Minus**: Cycle blend modes
- **Number keys (1-9)**: Set opacity (1=10%, 9=90%, 0=100%)
- **Shift+Number keys**: Set fill opacity`,
                        author: {
                            name: "Carlos Martinez",
                            avatar: "CM",
                            badge: "Photoshop Expert"
                        },
                        timestamp: "2024-03-18T15:45:00Z",
                        likes: 38,
                        isBestAnswer: true
                    }
                ]
            }
        ];
    }

    renderQuestions() {
        const questionsList = document.getElementById('questionList');
        if (!questionsList) return;

        let filteredQuestions = this.filterAndSortQuestions();
        
        questionsList.innerHTML = filteredQuestions.map(question => this.createQuestionHTML(question)).join('');
        
        // Re-initialize Lucide icons for new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    filterAndSortQuestions() {
        let filtered = this.questions;

        // Apply search filter
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(q => 
                q.title.toLowerCase().includes(term) ||
                q.content.toLowerCase().includes(term) ||
                q.categories.some(cat => cat.toLowerCase().includes(term))
            );
        }

        // Apply sorting
        switch (this.currentFilter) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                break;
            case 'active':
                filtered.sort((a, b) => b.answers.length - a.answers.length);
                break;
            case 'votes':
                filtered.sort((a, b) => b.likes - a.likes);
                break;
            case 'unanswered':
                filtered = filtered.filter(q => q.answers.length === 0);
                break;
        }

        return filtered;
    }

    createQuestionHTML(question) {
        const timeAgo = this.formatTimeAgo(question.timestamp);
        const answersHTML = question.answers.length > 0 ? this.createAnswersHTML(question.answers) : '';

        return `
            <div class="question-card">
                <div class="question-title">${question.title}</div>
                <div class="question-meta">
                    <div class="question-meta-item">
                        <div class="user-avatar">${question.author.avatar}</div>
                        <span class="user-name">${question.author.name}</span>
                        <span class="user-badge">${question.author.badge}</span>
                    </div>
                    <div class="question-meta-item">
                        <i data-lucide="clock"></i>
                        <span>${timeAgo}</span>
                    </div>
                    <div class="question-meta-item">
                        <i data-lucide="eye"></i>
                        <span>${question.views.toLocaleString()} views</span>
                    </div>
                </div>
                <div class="question-content">
                    <p>${question.content}</p>
                </div>
                <div class="question-categories">
                    ${question.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                </div>
                <div class="question-actions">
                    <button class="question-action-btn" onclick="communityQuestions.toggleLike(${question.id})">
                        <i data-lucide="thumbs-up"></i>
                        <span>${question.likes} Likes</span>
                    </button>
                    <button class="question-action-btn">
                        <i data-lucide="message-circle"></i>
                        <span>${question.answers.length} Answer${question.answers.length !== 1 ? 's' : ''}</span>
                    </button>
                    <button class="question-action-btn">
                        <i data-lucide="bookmark"></i>
                        <span>Save</span>
                    </button>
                    <button class="question-action-btn">
                        <i data-lucide="share"></i>
                        <span>Share</span>
                    </button>
                </div>
                ${answersHTML}
            </div>
        `;
    }

    createAnswersHTML(answers) {
        if (answers.length === 0) return '';

        const answersHTML = answers.map(answer => {
            const timeAgo = this.formatTimeAgo(answer.timestamp);
            const repliesHTML = answer.replies ? answer.replies.map(reply => {
                const replyTimeAgo = this.formatTimeAgo(reply.timestamp);
                return `
                    <div class="reply-card" style="margin-top: 15px; padding: 12px; background: rgba(var(--primary-rgb), 0.03); border-radius: 8px; border-left: 2px solid var(--border);">
                        <div class="reply-meta" style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 0.85em; color: var(--text-secondary);">
                            <div class="user-avatar" style="width: 30px; height: 30px; font-size: 0.9em;">${reply.author.avatar}</div>
                            <span class="user-name">${reply.author.name}</span>
                            <span class="user-badge">${reply.author.badge}</span>
                            <i data-lucide="clock" style="width: 14px; height: 14px;"></i>
                            <span>${replyTimeAgo}</span>
                        </div>
                        <div class="reply-content" style="line-height: 1.6; font-size: 0.95em; color: var(--text-primary);">
                            <p>${reply.content}</p>
                        </div>
                    </div>
                `;
            }).join('') : '';

            return `
                <div class="answer-card ${answer.isBestAnswer ? 'best-answer' : ''}">
                    <div class="answer-meta" style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px; font-size: 0.9em; color: var(--text-secondary);">
                        <div class="user-avatar">${answer.author.avatar}</div>
                        <span class="user-name">${answer.author.name}</span>
                        <span class="user-badge">${answer.author.badge}</span>
                        <i data-lucide="clock"></i>
                        <span>${timeAgo}</span>
                    </div>
                    <div class="answer-content">
                        ${answer.content.split('\n').map(line => {
                            if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
                                return `<h4 style="margin: 15px 0 10px 0; color: var(--primary);">${line.replace(/\*\*/g, '')}</h4>`;
                            } else if (line.trim().startsWith('- **')) {
                                return `<p style="margin: 5px 0;"><strong style="color: var(--primary);">${line.substring(3).replace(/\*\*/g, '')}</strong></p>`;
                            } else if (line.trim()) {
                                return `<p style="margin: 10px 0;">${line}</p>`;
                            }
                            return '';
                        }).join('')}
                    </div>
                    <div class="answer-actions" style="display: flex; gap: 15px; font-size: 0.9em;">
                        <button class="question-action-btn">
                            <i data-lucide="thumbs-up"></i>
                            <span>${answer.likes} Likes</span>
                        </button>
                        <button class="question-action-btn">
                            <i data-lucide="message-circle"></i>
                            <span>Reply</span>
                        </button>
                    </div>
                    ${repliesHTML}
                </div>
            `;
        }).join('');

        return `
            <div class="answer-section">
                <h4 class="answer-count">${answers.length} Answer${answers.length !== 1 ? 's' : ''}</h4>
                <div class="answer-list">
                    ${answersHTML}
                </div>
            </div>
        `;
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        
        return time.toLocaleDateString();
    }

    handleQuestionSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        const newQuestion = {
            id: this.questions.length + 1,
            title: formData.get('questionTitle') || document.getElementById('questionTitle').value,
            content: formData.get('questionDetails') || document.getElementById('questionDetails').value,
            author: {
                name: "You", // This would come from the user system
                avatar: "YU",
                badge: "New Member"
            },
            timestamp: new Date().toISOString(),
            views: 0,
            likes: 0,
            answers: [],
            categories: [formData.get('questionCategory') || document.getElementById('questionCategory').value],
            isBestAnswered: false
        };

        this.questions.unshift(newQuestion);
        this.renderQuestions();
        form.reset();

        // Show success message
        this.showToast('Question posted successfully!', 'success');
    }

    handleSortChange(e) {
        this.currentFilter = e.target.value;
        this.renderQuestions();
    }

    handleSearch() {
        const searchInput = document.getElementById('questionSearch');
        this.searchTerm = searchInput.value.trim();
        this.renderQuestions();
    }

    toggleLike(questionId) {
        const question = this.questions.find(q => q.id === questionId);
        if (question) {
            question.likes += 1;
            this.renderQuestions();
            this.showToast('Question liked!', 'success');
        }
    }

    animateStats() {
        const animateNumber = (element, target, duration = 2000) => {
            const start = 0;
            const increment = target / (duration / 50);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current).toLocaleString();
                }
            }, 50);
        };

        // Animate community stats
        const memberCount = document.getElementById('memberCount');
        const questionCount = document.getElementById('questionCount');
        const answerCount = document.getElementById('answerCount');
        const shortcutCount = document.getElementById('shortcutCount');

        if (memberCount) animateNumber(memberCount, 5782);
        if (questionCount) animateNumber(questionCount, 2456);
        if (answerCount) animateNumber(answerCount, 12890);
        if (shortcutCount) animateNumber(shortcutCount, 1450);
    }

    showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--surface);
            color: var(--text-primary);
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: var(--shadow-lg);
            border-left: 4px solid var(--primary);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Initialize community questions system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.communityQuestions = new CommunityQuestions();
});
