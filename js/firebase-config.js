// Firebase Configuration and Setup
// Handles Firebase initialization, authentication, and database operations

// Firebase Configuration - Development Mode
const firebaseConfig = {
    // Development/Demo configuration - replace with your actual Firebase config for production
    apiKey: "demo-api-key",
    authDomain: "shortcut-sensei-demo.firebaseapp.com",
    projectId: "shortcut-sensei-demo",
    storageBucket: "shortcut-sensei-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "demo-app-id",
    // Use local emulator for development
    useEmulator: true
};

class FirebaseManager {
    constructor() {
        this.initialized = false;
        this.auth = null;
        this.db = null;
        this.storage = null;
        this.init();
    }

    async init() {
        try {
            // Check if Firebase is available
            if (typeof firebase !== 'undefined') {
                // Initialize Firebase
                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                }
                
                this.auth = firebase.auth();
                this.db = firebase.firestore();
                this.storage = firebase.storage();
                
                // Set up auth state listener
                this.auth.onAuthStateChanged((user) => {
                    this.handleAuthStateChange(user);
                });
                
                this.initialized = true;
                console.log('🔥 Firebase initialized successfully');
            } else {
                console.warn('Firebase not available, using local storage fallback');
                this.initializeFallback();
            }
        } catch (error) {
            console.error('Firebase initialization error:', error);
            this.initializeFallback();
        }
    }

    initializeFallback() {
        // Fallback for when Firebase is not available
        this.initialized = false;
        console.log('Using local storage fallback for data persistence');
    }

    handleAuthStateChange(user) {
        if (user) {
            // User is signed in
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email.split('@')[0],
                photoURL: user.photoURL,
                emailVerified: user.emailVerified
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            if (typeof shortcutSensei !== 'undefined') {
                shortcutSensei.updateUserInterface(userData);
                shortcutSensei.showNotification(`Welcome back, ${userData.displayName}!`, 'success');
            }
        } else {
            // User is signed out
            localStorage.removeItem('currentUser');
            
            if (typeof shortcutSensei !== 'undefined') {
                shortcutSensei.updateUserInterface(null);
            }
        }
    }

    // Authentication Methods
    async signUp(email, password, displayName) {
        try {
            if (this.initialized && this.auth) {
                const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // Update profile
                await user.updateProfile({
                    displayName: displayName
                });
                
                // Create user document in Firestore
                await this.createUserDocument(user, { displayName });
                
                return { success: true, user };
            } else {
                // Fallback registration
                const userData = {
                    uid: Date.now().toString(),
                    email,
                    displayName,
                    createdAt: new Date().toISOString()
                };
                
                localStorage.setItem('currentUser', JSON.stringify(userData));
                return { success: true, user: userData };
            }
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    async signIn(email, password) {
        try {
            if (this.initialized && this.auth) {
                const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
                return { success: true, user: userCredential.user };
            } else {
                // Fallback sign in
                const userData = {
                    uid: Date.now().toString(),
                    email,
                    displayName: email.split('@')[0],
                    signedInAt: new Date().toISOString()
                };
                
                localStorage.setItem('currentUser', JSON.stringify(userData));
                return { success: true, user: userData };
            }
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        try {
            if (this.initialized && this.auth) {
                await this.auth.signOut();
            } else {
                localStorage.removeItem('currentUser');
                if (typeof shortcutSensei !== 'undefined') {
                    shortcutSensei.updateUserInterface(null);
                    shortcutSensei.showNotification('Signed out successfully', 'info');
                }
            }
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    async resetPassword(email) {
        try {
            if (this.initialized && this.auth) {
                await this.auth.sendPasswordResetEmail(email);
                return { success: true };
            } else {
                // Fallback - just show message
                return { success: true, message: 'Password reset email sent (demo mode)' };
            }
        } catch (error) {
            console.error('Password reset error:', error);
            return { success: false, error: error.message };
        }
    }

    // Database Methods
    async saveUserProgress(userId, appName, shortcuts) {
        try {
            if (this.initialized && this.db) {
                await this.db.collection('userProgress').doc(userId).set({
                    [appName]: {
                        shortcuts: shortcuts,
                        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                    }
                }, { merge: true });
            } else {
                // Fallback to localStorage
                const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
                progress[appName] = {
                    shortcuts: shortcuts,
                    lastUpdated: new Date().toISOString()
                };
                localStorage.setItem('userProgress', JSON.stringify(progress));
            }
            return { success: true };
        } catch (error) {
            console.error('Save progress error:', error);
            return { success: false, error: error.message };
        }
    }

    async getUserProgress(userId) {
        try {
            if (this.initialized && this.db) {
                const doc = await this.db.collection('userProgress').doc(userId).get();
                return doc.exists ? doc.data() : {};
            } else {
                // Fallback to localStorage
                return JSON.parse(localStorage.getItem('userProgress') || '{}');
            }
        } catch (error) {
            console.error('Get progress error:', error);
            return {};
        }
    }

    async createUserDocument(user, additionalData = {}) {
        if (!this.initialized || !this.db) return;
        
        try {
            const userRef = this.db.collection('users').doc(user.uid);
            const snapShot = await userRef.get();
            
            if (!snapShot.exists) {
                const { displayName, email } = user;
                const createdAt = new Date();
                
                await userRef.set({
                    displayName,
                    email,
                    createdAt,
                    ...additionalData
                });
            }
        } catch (error) {
            console.error('Create user document error:', error);
        }
    }

    // Analytics
    async trackEvent(eventName, parameters = {}) {
        try {
            if (this.initialized && typeof gtag !== 'undefined') {
                gtag('event', eventName, parameters);
            } else {
                console.log('Analytics event:', eventName, parameters);
            }
        } catch (error) {
            console.error('Analytics error:', error);
        }
    }

    // Get current user
    getCurrentUser() {
        if (this.initialized && this.auth) {
            return this.auth.currentUser;
        } else {
            return JSON.parse(localStorage.getItem('currentUser'));
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        const user = this.getCurrentUser();
        return !!user;
    }
}

// Initialize Firebase Manager
window.firebaseManager = new FirebaseManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirebaseManager;
}
