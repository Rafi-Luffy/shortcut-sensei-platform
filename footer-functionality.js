/* Footer Functionality - Professional Features */

// Newsletter Subscription
function subscribeNewsletter() {
    const input = document.querySelector('.newsletter-input');
    const email = input.value.trim();
    
    if (!email) {
        showToast('Please enter your email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate API call
    const btn = document.querySelector('.newsletter-btn');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = `
        <span>
            <i data-lucide="loader" class="animate-spin"></i>
            Subscribing...
        </span>
    `;
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        input.value = '';
        showToast('Successfully subscribed! Check your email for confirmation.', 'success');
        
        // Track subscription
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_subscription', {
                'email': email,
                'source': 'footer'
            });
        }
    }, 2000);
}

// Social Media Functions
function openSocial(platform) {
    const urls = {
        twitter: 'https://twitter.com/shortcutsensei',
        linkedin: 'https://linkedin.com/company/shortcut-sensei',
        discord: 'https://discord.gg/shortcutsensei',
        github: 'https://github.com/shortcut-sensei',
        youtube: 'https://youtube.com/@shortcutsensei'
    };
    
    if (urls[platform]) {
        window.open(urls[platform], '_blank', 'noopener,noreferrer');
        
        // Track social media clicks
        if (typeof gtag !== 'undefined') {
            gtag('event', 'social_media_click', {
                'platform': platform,
                'source': 'footer'
            });
        }
    }
}

// Print Page Function
function printPage() {
    // Hide unnecessary elements before printing
    const elementsToHide = [
        '.nav-sticky',
        '.footer-modern',
        '.floating-shortcuts',
        '.particle-container',
        '.premium-loader'
    ];
    
    elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.display = 'none';
        });
    });
    
    // Add print-friendly styles
    const printStyle = document.createElement('style');
    printStyle.textContent = `
        @media print {
            body { 
                background: white !important; 
                color: black !important; 
            }
            .hero-section {
                background: white !important;
                color: black !important;
            }
            .premium-card {
                background: white !important;
                border: 1px solid #ccc !important;
                color: black !important;
            }
        }
    `;
    document.head.appendChild(printStyle);
    
    // Print
    window.print();
    
    // Restore elements after printing
    setTimeout(() => {
        elementsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = '';
            });
        });
        document.head.removeChild(printStyle);
    }, 1000);
    
    showToast('Print dialog opened', 'info');
    
    // Track print action
    if (typeof gtag !== 'undefined') {
        gtag('event', 'print_page', {
            'page': window.location.pathname
        });
    }
}

// Download Content Function
function downloadContent() {
    const pageTitle = document.title;
    const currentUrl = window.location.href;
    const timestamp = new Date().toISOString().split('T')[0];
    
    // Create downloadable content
    const content = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle} - Downloaded Copy</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            line-height: 1.6; 
        }
        .header { 
            text-align: center; 
            border-bottom: 2px solid #6366f1; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
        }
        .shortcuts-list { 
            display: grid; 
            gap: 15px; 
        }
        .shortcut-item { 
            padding: 15px; 
            border: 1px solid #ddd; 
            border-radius: 8px; 
            background: #f9f9f9; 
        }
        .shortcut-key { 
            font-family: monospace; 
            background: #333; 
            color: white; 
            padding: 2px 6px; 
            border-radius: 4px; 
            font-weight: bold; 
        }
        .download-info { 
            margin-top: 30px; 
            padding: 20px; 
            background: #e3f2fd; 
            border-radius: 8px; 
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 Shortcut Sensei - Productivity Guide</h1>
        <p>Your comprehensive keyboard shortcuts reference</p>
        <p><strong>Downloaded on:</strong> ${timestamp}</p>
        <p><strong>Source:</strong> <a href="${currentUrl}">${currentUrl}</a></p>
    </div>

    <div class="shortcuts-list">
        <div class="shortcut-item">
            <h3>Essential VS Code Shortcuts</h3>
            <p><span class="shortcut-key">Ctrl + Shift + P</span> - Command Palette</p>
            <p><span class="shortcut-key">Ctrl + P</span> - Quick File Open</p>
            <p><span class="shortcut-key">Alt + Shift + ↓</span> - Duplicate Line</p>
            <p><span class="shortcut-key">Ctrl + D</span> - Select Next Occurrence</p>
        </div>
        
        <div class="shortcut-item">
            <h3>Chrome Browser Shortcuts</h3>
            <p><span class="shortcut-key">Ctrl + T</span> - New Tab</p>
            <p><span class="shortcut-key">Ctrl + Shift + T</span> - Reopen Closed Tab</p>
            <p><span class="shortcut-key">Ctrl + L</span> - Focus Address Bar</p>
            <p><span class="shortcut-key">Ctrl + Shift + Delete</span> - Clear Browsing Data</p>
        </div>
        
        <div class="shortcut-item">
            <h3>System Shortcuts (Windows)</h3>
            <p><span class="shortcut-key">Win + D</span> - Show Desktop</p>
            <p><span class="shortcut-key">Win + L</span> - Lock Computer</p>
            <p><span class="shortcut-key">Alt + Tab</span> - Switch Applications</p>
            <p><span class="shortcut-key">Win + R</span> - Run Dialog</p>
        </div>
        
        <div class="shortcut-item">
            <h3>Adobe Photoshop Shortcuts</h3>
            <p><span class="shortcut-key">V</span> - Move Tool</p>
            <p><span class="shortcut-key">B</span> - Brush Tool</p>
            <p><span class="shortcut-key">Ctrl + Z</span> - Undo</p>
            <p><span class="shortcut-key">Ctrl + Shift + Alt + E</span> - Flatten Layers</p>
        </div>
    </div>

    <div class="download-info">
        <h3>💡 Pro Tips for Mastering Shortcuts</h3>
        <ul>
            <li>Practice 5-10 shortcuts daily instead of trying to learn everything at once</li>
            <li>Use the same shortcuts consistently across different applications</li>
            <li>Create custom shortcuts for frequently used actions</li>
            <li>Take regular quizzes to test your knowledge and retention</li>
            <li>Join our community for tips, challenges, and support</li>
        </ul>
        
        <h3>📚 Additional Resources</h3>
        <p>Visit <a href="${currentUrl}">Shortcut Sensei</a> for:</p>
        <ul>
            <li>Interactive quizzes and challenges</li>
            <li>Comprehensive application coverage</li>
            <li>Progress tracking and achievements</li>
            <li>Community leaderboards</li>
            <li>Regular updates and new shortcuts</li>
        </ul>
    </div>
</body>
</html>
    `;
    
    // Create and download file
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shortcut-sensei-guide-${timestamp}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Guide downloaded successfully!', 'success');
    
    // Track download
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download_content', {
            'content_type': 'shortcut_guide',
            'page': window.location.pathname
        });
    }
}

// Bookmark Page Function
function bookmarkPage() {
    const title = document.title;
    const url = window.location.href;
    
    if (window.sidebar && window.sidebar.addPanel) {
        // Firefox
        window.sidebar.addPanel(title, url, '');
        showToast('Bookmark added to sidebar', 'success');
    } else if (window.external && ('AddFavorite' in window.external)) {
        // Internet Explorer
        window.external.AddFavorite(url, title);
        showToast('Bookmark added to favorites', 'success');
    } else {
        // Modern browsers
        if (navigator.userAgent.indexOf('Mac') !== -1) {
            showToast('Press Cmd+D to bookmark this page', 'info');
        } else {
            showToast('Press Ctrl+D to bookmark this page', 'info');
        }
        
        // Fallback: copy URL to clipboard
        copyToClipboard(url);
        setTimeout(() => {
            showToast('Page URL copied to clipboard as backup', 'info');
        }, 1500);
    }
    
    // Track bookmark action
    if (typeof gtag !== 'undefined') {
        gtag('event', 'bookmark_page', {
            'page': window.location.pathname
        });
    }
}

// Share Content Function
function shareContent() {
    const title = document.title;
    const url = window.location.href;
    const text = 'Check out Shortcut Sensei - the ultimate productivity platform for mastering keyboard shortcuts!';
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url,
        }).then(() => {
            showToast('Content shared successfully!', 'success');
        }).catch((error) => {
            console.log('Error sharing:', error);
            fallbackShare(title, url, text);
        });
    } else {
        fallbackShare(title, url, text);
    }
    
    // Track share action
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share_content', {
            'method': navigator.share ? 'native' : 'fallback',
            'page': window.location.pathname
        });
    }
}

// Fallback Share Function
function fallbackShare(title, url, text) {
    const shareModal = document.createElement('div');
    shareModal.className = 'share-modal';
    shareModal.innerHTML = `
        <div class="share-modal-content">
            <div class="share-modal-header">
                <h3>Share this page</h3>
                <button class="share-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="share-options">
                <button class="share-option" onclick="shareToTwitter('${encodeURIComponent(text)}', '${encodeURIComponent(url)}')">
                    <i data-lucide="twitter"></i>
                    Twitter
                </button>
                <button class="share-option" onclick="shareToLinkedIn('${encodeURIComponent(title)}', '${encodeURIComponent(url)}')">
                    <i data-lucide="linkedin"></i>
                    LinkedIn
                </button>
                <button class="share-option" onclick="shareToFacebook('${encodeURIComponent(url)}')">
                    <i data-lucide="facebook"></i>
                    Facebook
                </button>
                <button class="share-option" onclick="copyToClipboard('${url}')">
                    <i data-lucide="copy"></i>
                    Copy Link
                </button>
            </div>
        </div>
    `;
    
    // Add modal styles
    shareModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const modalContent = shareModal.querySelector('.share-modal-content');
    modalContent.style.cssText = `
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-lg);
        padding: var(--space-lg);
        max-width: 400px;
        width: 90%;
    `;
    
    document.body.appendChild(shareModal);
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Social Share Functions
function shareToTwitter(text, url) {
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    document.querySelector('.share-modal').remove();
    showToast('Opening Twitter...', 'info');
}

function shareToLinkedIn(title, url) {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    document.querySelector('.share-modal').remove();
    showToast('Opening LinkedIn...', 'info');
}

function shareToFacebook(url) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    document.querySelector('.share-modal').remove();
    showToast('Opening Facebook...', 'info');
}

// Theme Toggle Function
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
    
    // Update theme toggle button
    updateThemeToggle();
    
    // Track theme change
    if (typeof gtag !== 'undefined') {
        gtag('event', 'theme_change', {
            'new_theme': isDark ? 'light' : 'dark'
        });
    }
}

function updateThemeToggle() {
    const isDark = document.body.classList.contains('dark-theme');
    const lightIcon = document.querySelector('.theme-icon.light');
    const darkIcon = document.querySelector('.theme-icon.dark');
    
    if (lightIcon && darkIcon) {
        if (isDark) {
            lightIcon.style.opacity = '0';
            darkIcon.style.opacity = '1';
        } else {
            lightIcon.style.opacity = '1';
            darkIcon.style.opacity = '0';
        }
    }
}

// Footer Click Tracking
function trackFooterClick(section) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'footer_navigation', {
            'section': section,
            'page': window.location.pathname
        });
    }
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Copied to clipboard!', 'success');
    } catch (err) {
        showToast('Failed to copy to clipboard', 'error');
    }
    
    document.body.removeChild(textArea);
}

function showToast(message, type = 'info') {
    // Use existing toast system or create a simple one
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 10001;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    updateThemeToggle();
    
    // Add newsletter form submit handler
    const newsletterInput = document.querySelector('.newsletter-input');
    if (newsletterInput) {
        newsletterInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                subscribeNewsletter();
            }
        });
    }
});

// Add CSS animations for toasts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .share-option {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        width: 100%;
        padding: var(--space-sm) var(--space-md);
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        color: var(--text-primary);
        cursor: pointer;
        transition: var(--transition-normal);
        margin-bottom: var(--space-sm);
    }
    
    .share-option:hover {
        background: var(--accent-primary);
        color: white;
    }
    
    .share-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-lg);
    }
    
    .share-modal-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: var(--transition-normal);
    }
    
    .share-modal-close:hover {
        background: var(--bg-primary);
        color: var(--text-primary);
    }
`;
document.head.appendChild(style);
