const mongoose = require('mongoose');
const Application = require('./models/Application');
const Shortcut = require('./models/Shortcut');
const User = require('./models/User');
require('dotenv').config();

// Sample data
const applications = [
    {
        name: 'Google Chrome',
        slug: 'google-chrome',
        description: 'Fast, secure browser for browsing the web with powerful shortcuts',
        category: 'browser',
        icon: 'fab fa-chrome',
        platforms: ['windows', 'macos', 'linux'],
        tags: ['browser', 'web', 'google', 'internet'],
        popularity: 100
    },
    {
        name: 'Visual Studio Code',
        slug: 'visual-studio-code',
        description: 'Lightweight but powerful source code editor with rich shortcuts',
        category: 'development',
        icon: 'fas fa-code',
        platforms: ['windows', 'macos', 'linux'],
        tags: ['editor', 'code', 'development', 'microsoft'],
        popularity: 95
    },
    {
        name: 'Windows 11',
        slug: 'windows-11',
        description: 'Essential Windows 11 system shortcuts for navigation and productivity',
        category: 'general',
        icon: 'fab fa-windows',
        platforms: ['windows'],
        tags: ['windows', 'system', 'os', 'navigation'],
        popularity: 90
    },
    {
        name: 'Adobe Photoshop',
        slug: 'adobe-photoshop',
        description: 'Professional image editing shortcuts for digital design and photography',
        category: 'design',
        icon: 'fas fa-image',
        platforms: ['windows', 'macos'],
        tags: ['adobe', 'photoshop', 'design', 'editing'],
        popularity: 85
    },
    {
        name: 'Microsoft Word',
        slug: 'microsoft-word',
        description: 'Document editing shortcuts for efficient word processing',
        category: 'office',
        icon: 'fas fa-file-word',
        platforms: ['windows', 'macos'],
        tags: ['microsoft', 'word', 'office', 'document'],
        popularity: 80
    },
    {
        name: 'Discord',
        slug: 'discord',
        description: 'Communication shortcuts for gaming and community chat',
        category: 'communication',
        icon: 'fab fa-discord',
        platforms: ['windows', 'macos', 'linux', 'web'],
        tags: ['discord', 'chat', 'gaming', 'communication'],
        popularity: 75
    },
    {
        name: 'Slack',
        slug: 'slack',
        description: 'Team collaboration shortcuts for workplace communication',
        category: 'communication',
        icon: 'fab fa-slack',
        platforms: ['windows', 'macos', 'linux', 'web'],
        tags: ['slack', 'team', 'work', 'communication'],
        popularity: 70
    },
    {
        name: 'Spotify',
        slug: 'spotify',
        description: 'Music streaming shortcuts for audio control and navigation',
        category: 'media',
        icon: 'fab fa-spotify',
        platforms: ['windows', 'macos', 'linux', 'web'],
        tags: ['spotify', 'music', 'audio', 'streaming'],
        popularity: 65
    }
];

const sampleShortcuts = [
    // Chrome shortcuts
    {
        title: 'New Tab',
        description: 'Open a new tab in the current window',
        keyboardShortcut: {
            windows: { primary: 'Ctrl + T' },
            macos: { primary: 'Cmd + T' },
            linux: { primary: 'Ctrl + T' }
        },
        category: 'navigation',
        difficulty: 'beginner',
        tags: ['tab', 'new', 'navigation']
    },
    {
        title: 'Close Tab',
        description: 'Close the current tab',
        keyboardShortcut: {
            windows: { primary: 'Ctrl + W' },
            macos: { primary: 'Cmd + W' },
            linux: { primary: 'Ctrl + W' }
        },
        category: 'navigation',
        difficulty: 'beginner',
        tags: ['tab', 'close', 'navigation']
    },
    {
        title: 'Reopen Closed Tab',
        description: 'Reopen the most recently closed tab',
        keyboardShortcut: {
            windows: { primary: 'Ctrl + Shift + T' },
            macos: { primary: 'Cmd + Shift + T' },
            linux: { primary: 'Ctrl + Shift + T' }
        },
        category: 'navigation',
        difficulty: 'intermediate',
        tags: ['tab', 'reopen', 'restore']
    },
    // VS Code shortcuts
    {
        title: 'Command Palette',
        description: 'Open the command palette to access all VS Code commands',
        keyboardShortcut: {
            windows: { primary: 'Ctrl + Shift + P' },
            macos: { primary: 'Cmd + Shift + P' },
            linux: { primary: 'Ctrl + Shift + P' }
        },
        category: 'general',
        difficulty: 'beginner',
        tags: ['command', 'palette', 'search']
    },
    {
        title: 'Quick File Open',
        description: 'Quickly open files by name',
        keyboardShortcut: {
            windows: { primary: 'Ctrl + P' },
            macos: { primary: 'Cmd + P' },
            linux: { primary: 'Ctrl + P' }
        },
        category: 'file-management',
        difficulty: 'beginner',
        tags: ['file', 'open', 'quick']
    },
    // Windows shortcuts
    {
        title: 'Show Desktop',
        description: 'Show or hide the desktop',
        keyboardShortcut: {
            windows: { primary: 'Win + D' },
            macos: { primary: 'F11' },
            linux: { primary: 'Super + D' }
        },
        category: 'window-management',
        difficulty: 'beginner',
        tags: ['desktop', 'show', 'hide']
    },
    {
        title: 'Lock Screen',
        description: 'Lock the computer screen',
        keyboardShortcut: {
            windows: { primary: 'Win + L' },
            macos: { primary: 'Cmd + Ctrl + Q' },
            linux: { primary: 'Super + L' }
        },
        category: 'general',
        difficulty: 'beginner',
        tags: ['lock', 'security', 'screen']
    },
    {
        title: 'Task Manager',
        description: 'Open Windows Task Manager',
        keyboardShortcut: {
            windows: { primary: 'Ctrl + Shift + Esc' },
            macos: { primary: 'Cmd + Option + Esc' },
            linux: { primary: 'Ctrl + Alt + T' }
        },
        category: 'general',
        tags: ['task', 'manager', 'system']
    }
];

async function setupDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shortcut-sensei');
        console.log('📊 Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            Application.deleteMany({}),
            Shortcut.deleteMany({}),
            User.deleteMany({})
        ]);
        console.log('🧹 Cleared existing data');

        // Create default admin user
        const adminUser = new User({
            firebaseUid: 'admin-setup-user',
            email: 'admin@shortcutsensei.com',
            username: 'admin',
            displayName: 'Admin User',
            bio: 'System administrator and content creator',
            stats: {
                reputation: 1000,
                shortcutsLearned: 50,
                questionsAsked: 10,
                answersGiven: 25
            }
        });
        await adminUser.save();
        console.log('👤 Created admin user');

        // Create applications
        const createdApps = [];
        for (const appData of applications) {
            const app = new Application({
                ...appData,
                createdBy: adminUser._id
            });
            await app.save();
            createdApps.push(app);
            console.log(`📱 Created application: ${app.name}`);
        }

        // Create shortcuts
        let shortcutIndex = 0;
        for (const app of createdApps) {
            // Get shortcuts for this app (simplified mapping)
            const appShortcuts = sampleShortcuts.filter((_, index) => {
                if (app.name === 'Google Chrome') return index < 3;
                if (app.name === 'Visual Studio Code') return index >= 3 && index < 5;
                if (app.name === 'Windows 11') return index >= 5;
                return false;
            });

            for (const shortcutData of appShortcuts) {
                const shortcut = new Shortcut({
                    ...shortcutData,
                    applicationId: app._id,
                    createdBy: adminUser._id,
                    usage: {
                        learntBy: Math.floor(Math.random() * 100) + 10,
                        savedBy: Math.floor(Math.random() * 50) + 5
                    }
                });
                await shortcut.save();
                shortcutIndex++;
            }

            // Update application shortcut count
            const shortcutCount = await Shortcut.countDocuments({ applicationId: app._id });
            app.shortcutCount = shortcutCount;
            await app.save();
        }

        console.log(`⌨️  Created ${shortcutIndex} shortcuts`);

        // Create some sample questions and answers for community
        const sampleQuestions = [
            {
                title: 'What is the fastest way to switch between tabs in Chrome?',
                content: 'I often have many tabs open and need to switch between them quickly. What are the best keyboard shortcuts for tab navigation in Google Chrome?',
                category: 'application-specific',
                difficulty: 'beginner',
                tags: ['chrome', 'tabs', 'navigation'],
                applicationId: createdApps.find(app => app.name === 'Google Chrome')._id,
                author: adminUser._id,
                views: 45
            },
            {
                title: 'How to quickly open the command palette in VS Code?',
                content: 'I am new to Visual Studio Code and want to learn the most essential shortcuts. How do I access all commands quickly?',
                category: 'shortcut-help',
                difficulty: 'beginner',
                tags: ['vscode', 'command-palette', 'beginner'],
                applicationId: createdApps.find(app => app.name === 'Visual Studio Code')._id,
                author: adminUser._id,
                views: 67
            },
            {
                title: 'Best Windows shortcuts for productivity?',
                content: 'I want to become more productive on Windows 11. What are the must-know keyboard shortcuts that will save me the most time?',
                category: 'general',
                difficulty: 'intermediate',
                tags: ['windows', 'productivity', 'shortcuts'],
                applicationId: createdApps.find(app => app.name === 'Windows 11')._id,
                author: adminUser._id,
                views: 123
            }
        ];

        const Question = require('./models/Question');
        const Answer = require('./models/Answer');

        for (const questionData of sampleQuestions) {
            const question = new Question(questionData);
            await question.save();

            // Add sample answer
            const answer = new Answer({
                questionId: question._id,
                content: `Great question! Here are some helpful shortcuts:\n\n1. Use Ctrl+Tab to cycle through tabs\n2. Ctrl+1-9 to jump to specific tab positions\n3. Ctrl+Shift+T to reopen closed tabs\n\nThese will definitely speed up your workflow!`,
                author: adminUser._id,
                votes: {
                    upvotes: [{ user: adminUser._id }]
                }
            });
            await answer.save();

            // Mark answer as accepted
            question.acceptedAnswer = answer._id;
            question.status = 'answered';
            question.answerCount = 1;
            await question.save();
        }

        console.log('❓ Created sample questions and answers');

        console.log('\n🎉 Database setup completed successfully!');
        console.log('\n📋 Setup Summary:');
        console.log(`   • ${createdApps.length} applications created`);
        console.log(`   • ${shortcutIndex} shortcuts created`);
        console.log(`   • ${sampleQuestions.length} community questions created`);
        console.log(`   • 1 admin user created`);
        console.log('\n🚀 Your application is ready to run!');
        
    } catch (error) {
        console.error('❌ Setup failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

// Run setup
if (require.main === module) {
    setupDatabase();
}

module.exports = setupDatabase;
