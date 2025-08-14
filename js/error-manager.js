// Error Handling and Logging System for Shortcut Sensei
// Provides comprehensive error tracking, logging, and user feedback

class ErrorManager {
    constructor() {
        this.errors = [];
        this.maxErrors = 100;
        this.init();
    }

    init() {
        this.setupGlobalErrorHandlers();
        this.setupConsoleOverrides();
        console.log('🛡️ Error Manager initialized');
    }

    setupGlobalErrorHandlers() {
        // Global JavaScript error handler
        window.addEventListener('error', (event) => {
            this.logError('JavaScript Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error?.stack
            });
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', {
                reason: event.reason,
                promise: event.promise
            });
        });

        // Resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.logError('Resource Loading Error', {
                    element: event.target.tagName,
                    source: event.target.src || event.target.href,
                    message: 'Failed to load resource'
                });
            }
        }, true);
    }

    setupConsoleOverrides() {
        const originalError = console.error;
        const originalWarn = console.warn;

        console.error = (...args) => {
            this.logError('Console Error', { message: args.join(' ') });
            originalError.apply(console, args);
        };

        console.warn = (...args) => {
            this.logWarning('Console Warning', { message: args.join(' ') });
            originalWarn.apply(console, args);
        };
    }

    logError(type, details) {
        const error = {
            id: Date.now() + Math.random(),
            type,
            details,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            level: 'error'
        };

        this.errors.unshift(error);
        
        // Keep only the most recent errors
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(0, this.maxErrors);
        }

        // Store in localStorage for persistence
        this.saveErrorsToStorage();

        // Show user-friendly notification
        this.showUserNotification(error);

        // Send to analytics if available
        this.trackError(error);

        console.group(`🚨 ${type}`);
        console.error('Details:', details);
        console.error('Full Error:', error);
        console.groupEnd();
    }

    logWarning(type, details) {
        const warning = {
            id: Date.now() + Math.random(),
            type,
            details,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            level: 'warning'
        };

        this.errors.unshift(warning);
        
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(0, this.maxErrors);
        }

        this.saveErrorsToStorage();

        console.group(`⚠️ ${type}`);
        console.warn('Details:', details);
        console.groupEnd();
    }

    showUserNotification(error) {
        // Don't overwhelm users with too many error notifications
        const recentErrors = this.errors.filter(e => 
            e.level === 'error' && 
            Date.now() - new Date(e.timestamp).getTime() < 5000
        );

        if (recentErrors.length <= 2) {
            const userMessage = this.getUserFriendlyMessage(error);
            
            if (typeof shortcutSensei !== 'undefined') {
                shortcutSensei.showNotification(userMessage, 'error');
            } else {
                // Fallback notification
                this.showSimpleNotification(userMessage, 'error');
            }
        }
    }

    getUserFriendlyMessage(error) {
        const messages = {
            'JavaScript Error': 'Something went wrong. Please refresh the page.',
            'Resource Loading Error': 'Some content failed to load. Please check your connection.',
            'Unhandled Promise Rejection': 'A background operation failed. Functionality may be limited.',
            'Firebase Error': 'Connection to our servers failed. Some features may not work.',
            'Authentication Error': 'Sign-in failed. Please try again.',
            'Network Error': 'Network connection issue. Please check your internet connection.'
        };

        return messages[error.type] || 'An unexpected error occurred. Please try refreshing the page.';
    }

    showSimpleNotification(message, type) {
        // Simple fallback notification system
        const notification = document.createElement('div');
        notification.className = `simple-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    trackError(error) {
        // Send to Firebase Analytics if available
        if (window.firebaseManager) {
            window.firebaseManager.trackEvent('error', {
                error_type: error.type,
                error_message: error.details.message || 'Unknown',
                page_url: error.url
            });
        }

        // Send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: `${error.type}: ${error.details.message || 'Unknown'}`,
                fatal: false
            });
        }
    }

    saveErrorsToStorage() {
        try {
            const errorData = {
                errors: this.errors.slice(0, 20), // Save only recent errors
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('shortcutSensei_errors', JSON.stringify(errorData));
        } catch (e) {
            console.warn('Failed to save errors to localStorage:', e);
        }
    }

    loadErrorsFromStorage() {
        try {
            const stored = localStorage.getItem('shortcutSensei_errors');
            if (stored) {
                const data = JSON.parse(stored);
                this.errors = data.errors || [];
            }
        } catch (e) {
            console.warn('Failed to load errors from localStorage:', e);
        }
    }

    getErrorReport() {
        return {
            totalErrors: this.errors.length,
            recentErrors: this.errors.slice(0, 10),
            errorsByType: this.getErrorsByType(),
            systemInfo: this.getSystemInfo()
        };
    }

    getErrorsByType() {
        const typeCount = {};
        this.errors.forEach(error => {
            typeCount[error.type] = (typeCount[error.type] || 0) + 1;
        });
        return typeCount;
    }

    getSystemInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookiesEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            timestamp: new Date().toISOString()
        };
    }

    clearErrors() {
        this.errors = [];
        localStorage.removeItem('shortcutSensei_errors');
        console.log('All errors cleared');
    }

    // Health check method
    performHealthCheck() {
        const health = {
            status: 'healthy',
            checks: {
                firebase: this.checkFirebase(),
                localStorage: this.checkLocalStorage(),
                navigation: this.checkNavigation(),
                styles: this.checkStyles(),
                scripts: this.checkScripts()
            },
            errors: this.errors.length,
            timestamp: new Date().toISOString()
        };

        // Determine overall health
        const failedChecks = Object.values(health.checks).filter(check => !check.status).length;
        if (failedChecks > 0) {
            health.status = failedChecks > 2 ? 'critical' : 'degraded';
        }

        console.group('🏥 System Health Check');
        console.log('Overall Status:', health.status);
        console.table(health.checks);
        if (this.errors.length > 0) {
            console.log('Recent Errors:', this.errors.slice(0, 5));
        }
        console.groupEnd();

        return health;
    }

    checkFirebase() {
        try {
            return {
                status: !!window.firebaseManager,
                message: window.firebaseManager ? 'Firebase manager loaded' : 'Firebase manager not found'
            };
        } catch (e) {
            return { status: false, message: 'Firebase check failed' };
        }
    }

    checkLocalStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return { status: true, message: 'LocalStorage working' };
        } catch (e) {
            return { status: false, message: 'LocalStorage not available' };
        }
    }

    checkNavigation() {
        const navElements = document.querySelectorAll('nav, .main-nav, .header-actions');
        return {
            status: navElements.length > 0,
            message: `Found ${navElements.length} navigation elements`
        };
    }

    checkStyles() {
        const styleSheets = document.styleSheets.length;
        const hasMainStyles = Array.from(document.styleSheets).some(sheet => 
            sheet.href && sheet.href.includes('main-styles.css')
        );
        return {
            status: styleSheets > 0 && hasMainStyles,
            message: `${styleSheets} stylesheets loaded, main styles: ${hasMainStyles}`
        };
    }

    checkScripts() {
        const scripts = document.querySelectorAll('script').length;
        const hasMainNav = typeof shortcutSensei !== 'undefined';
        return {
            status: scripts > 0 && hasMainNav,
            message: `${scripts} scripts loaded, main navigation: ${hasMainNav}`
        };
    }
}

// Initialize Error Manager
window.errorManager = new ErrorManager();

// Load existing errors from storage
window.errorManager.loadErrorsFromStorage();

// Expose useful methods globally
window.getErrorReport = () => window.errorManager.getErrorReport();
window.clearErrors = () => window.errorManager.clearErrors();
window.healthCheck = () => window.errorManager.performHealthCheck();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorManager;
}
