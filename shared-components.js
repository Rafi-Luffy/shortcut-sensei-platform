/* Shared Components for Shortcut Sensei */

class SharedComponents {
    static getHeader(activePage = '') {
        return `
        <header class="main-header" id="main-header">
            <div class="container">
                <div class="logo">
                    <a href="index.html">
                        <i class="fas fa-keyboard"></i>
                        <span>Shortcut Sensei</span>
                    </a>
                </div>
                
                <nav class="main-nav" id="main-nav">
                    <ul>
                        <li><a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a></li>
                        <li class="dropdown">
                            <a href="all-applications-enhanced.html" class="${activePage === 'applications' ? 'active' : ''}">
                                Applications <i class="fas fa-chevron-down"></i>
                            </a>
                            <ul class="dropdown-menu">
                                <li><a href="Google Chrome.html"><i class="fab fa-chrome"></i> Google Chrome</a></li>
                                <li><a href="Visual Studio.html"><i class="fas fa-code"></i> Visual Studio Code</a></li>
                                <li><a href="Microsoft Excell.htm"><i class="fas fa-file-excel"></i> Microsoft Excel</a></li>
                                <li><a href="Microsoft Word.htm"><i class="fas fa-file-word"></i> Microsoft Word</a></li>
                                <li><a href="Adobe PhotoShop.html"><i class="fas fa-paint-brush"></i> Adobe Photoshop</a></li>
                                <li><a href="Windows_11.html"><i class="fab fa-windows"></i> Windows 11</a></li>
                                <li><a href="Discord.html"><i class="fab fa-discord"></i> Discord</a></li>
                                <li><a href="Spotify.html"><i class="fab fa-spotify"></i> Spotify</a></li>
                                <div class="dropdown-divider"></div>
                                <li><a href="all-applications-enhanced.html"><i class="fas fa-th-large"></i> View All Applications</a></li>
                            </ul>
                        </li>
                        <li><a href="quiz-enhanced.html" class="${activePage === 'quiz' ? 'active' : ''}">Quiz</a></li>
                        <li><a href="community-enhanced.html" class="${activePage === 'community' ? 'active' : ''}">Community</a></li>
                        <li><a href="blogs.html" class="${activePage === 'blogs' ? 'active' : ''}">Blog</a></li>
                        <li><a href="About-enhanced.html" class="${activePage === 'about' ? 'active' : ''}">About</a></li>
                    </ul>
                </nav>

                <div class="header-actions">
                    <div class="search-container">
                        <input type="text" id="main-search" placeholder="Search shortcuts..." data-tooltip="Press Ctrl+K to focus">
                        <button class="search-btn" data-tooltip="Search">
                            <i class="fas fa-search"></i>
                        </button>
                        <div class="search-results-dropdown" id="search-results"></div>
                    </div>
                    <button class="theme-toggle" id="theme-toggle" data-tooltip="Toggle dark mode">
                        <i class="fas fa-moon"></i>
                    </button>
                    <div class="user-menu">
                        <button class="login-btn" id="login-btn" data-tooltip="Sign in to track progress">
                            <i class="fas fa-user"></i>
                            <span class="login-text">Sign In</span>
                        </button>
                        <div class="user-dropdown" id="user-dropdown" style="display: none;">
                            <a href="#"><i class="fas fa-user-circle"></i> Profile</a>
                            <a href="#"><i class="fas fa-cog"></i> Settings</a>
                            <a href="community-enhanced.html"><i class="fas fa-users"></i> Community</a>
                            <div class="dropdown-divider"></div>
                            <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                        </div>
                    </div>
                    <a href="all-applications-enhanced.html" class="cta-button">
                        <i class="fas fa-rocket"></i>
                        <span>Start Learning</span>
                    </a>
                    <button class="menu-toggle" id="menu-toggle" data-tooltip="Menu">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
        </header>`;
    }

    static getFooter() {
        return `
        <footer class="main-footer" id="main-footer">
            <div class="footer-content">
                <div class="container">
                    <div class="footer-sections">
                        <!-- Brand Section -->
                        <div class="footer-section brand-section">
                            <div class="footer-logo">
                                <a href="index.html">
                                    <i class="fas fa-keyboard"></i>
                                    <span>Shortcut Sensei</span>
                                </a>
                            </div>
                            <p class="footer-description">
                                Master every keyboard shortcut and boost your productivity. 
                                Join our growing community of 100+ early users learning 5,000+ shortcuts across 30+ applications - completely FREE!
                            </p>
                            <div class="social-links">
                                <a href="#" class="social-link" data-tooltip="Follow us on Twitter">
                                    <i class="fab fa-twitter"></i>
                                </a>
                                <a href="#" class="social-link" data-tooltip="Like us on Facebook">
                                    <i class="fab fa-facebook"></i>
                                </a>
                                <a href="#" class="social-link" data-tooltip="Subscribe on YouTube">
                                    <i class="fab fa-youtube"></i>
                                </a>
                                <a href="#" class="social-link" data-tooltip="Follow us on LinkedIn">
                                    <i class="fab fa-linkedin"></i>
                                </a>
                                <a href="#" class="social-link" data-tooltip="Star us on GitHub">
                                    <i class="fab fa-github"></i>
                                </a>
                            </div>
                        </div>

                        <!-- Quick Links -->
                        <div class="footer-section">
                            <h4><i class="fas fa-bolt"></i> Quick Links</h4>
                            <ul class="footer-links">
                                <li><a href="index.html"><i class="fas fa-home"></i> Home</a></li>
                                <li><a href="Applications.htm"><i class="fas fa-th-large"></i> Applications</a></li>
                                <li><a href="quizs/index.html"><i class="fas fa-question-circle"></i> Quiz</a></li>
                                <li><a href="user_com.htm"><i class="fas fa-users"></i> Community</a></li>
                                <li><a href="user_profile.htm"><i class="fas fa-user"></i> Profile</a></li>
                                <li><a href="About.htm"><i class="fas fa-info-circle"></i> About</a></li>
                            </ul>
                        </div>

                        <!-- Popular Applications -->
                        <div class="footer-section">
                            <h4><i class="fas fa-star"></i> Popular Apps</h4>
                            <ul class="footer-links">
                                <li><a href="Google Chrome.html"><i class="fab fa-chrome"></i> Google Chrome</a></li>
                                <li><a href="Visual Studio.html"><i class="fas fa-code"></i> VS Code</a></li>
                                <li><a href="Microsoft Excell.htm"><i class="fas fa-file-excel"></i> Microsoft Excel</a></li>
                                <li><a href="Microsoft Word.htm"><i class="fas fa-file-word"></i> Microsoft Word</a></li>
                                <li><a href="Adobe PhotoShop.html"><i class="fas fa-paint-brush"></i> Photoshop</a></li>
                                <li><a href="Discord.html"><i class="fab fa-discord"></i> Discord</a></li>
                            </ul>
                        </div>

                        <!-- Resources -->
                        <div class="footer-section">
                            <h4><i class="fas fa-graduation-cap"></i> Resources</h4>
                            <ul class="footer-links">
                                <li><a href="blogs.html"><i class="fas fa-blog"></i> Blog & Tips</a></li>
                                <li><a href="Html Cheat Sheet.html"><i class="fas fa-download"></i> HTML Cheat Sheet</a></li>
                                <li><a href="#"><i class="fas fa-mobile-alt"></i> Mobile App</a></li>
                                <li><a href="#"><i class="fas fa-rss"></i> RSS Feed</a></li>
                                <li><a href="#"><i class="fas fa-envelope"></i> Newsletter</a></li>
                                <li><a href="test-minimal.html"><i class="fas fa-cog"></i> System Test</a></li>
                            </ul>
                        </div>

                        <!-- Contact & Support -->
                        <div class="footer-section">
                            <h4><i class="fas fa-envelope"></i> Contact</h4>
                            <ul class="footer-contact">
                                <li>
                                    <i class="fas fa-envelope"></i>
                                    <a href="mailto:hello@shortcutsensei.com">hello@shortcutsensei.com</a>
                                </li>
                                <li>
                                    <i class="fas fa-globe"></i>
                                    <a href="https://shortcutsensei.com">shortcutsensei.com</a>
                                </li>
                                <li>
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span>Global Community</span>
                                </li>
                            </ul>
                            
                            <!-- Newsletter Signup -->
                            <div class="newsletter-signup">
                                <h5><i class="fas fa-bell"></i> Stay Updated</h5>
                                <form class="newsletter-form" id="newsletter-form">
                                    <div class="newsletter-input-group">
                                        <input type="email" placeholder="Enter your email" required>
                                        <button type="submit">
                                            <i class="fas fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <div class="container">
                    <div class="footer-bottom-content">
                        <div class="copyright">
                            <p>&copy; 2025 Shortcut Sensei. All rights reserved. Made with <i class="fas fa-heart"></i> for productivity enthusiasts.</p>
                        </div>
                        <div class="footer-bottom-links">
                            <a href="#" onclick="shortcutSensei.showPrivacyPolicy()">Privacy Policy</a>
                            <a href="#" onclick="shortcutSensei.showTermsOfService()">Terms of Service</a>
                            <a href="#" onclick="shortcutSensei.showCookiePolicy()">Cookie Policy</a>
                            <a href="index.html" id="back-to-top">
                                <i class="fas fa-arrow-up"></i> Back to Top
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>`;
    }

    static getMetaTags(title, description, keywords = '') {
        return `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - Shortcut Sensei</title>
        <meta name="description" content="${description}">
        <meta name="keywords" content="${keywords}, keyboard shortcuts, productivity, shortcuts">
        <meta name="author" content="Shortcut Sensei">
        <meta property="og:title" content="${title} - Shortcut Sensei">
        <meta property="og:description" content="${description}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://shortcutsensei.com">
        <meta property="og:image" content="shortcut-sensei-og.jpg">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title} - Shortcut Sensei">
        <meta name="twitter:description" content="${description}">
        <link rel="icon" href="favicon.ico" type="image/x-icon">
        <link rel="canonical" href="https://shortcutsensei.com">`;
    }

    static getCommonScripts() {
        return `
        <!-- Firebase Configuration -->
        <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
        <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
        <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
        <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js"></script>
        
        <!-- Service Worker Registration -->
        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                        .then(function(registration) {
                            console.log('ServiceWorker registration successful');
                        }, function(err) {
                            console.log('ServiceWorker registration failed: ', err);
                        });
                });
            }
        </script>
        
        <!-- Common Scripts -->
        <script src="error-manager.js"></script>
        <script src="firebase-config.js"></script>
        <script src="main-nav.js"></script>`;
    }

    static getCommonStyles() {
        return `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link rel="stylesheet" href="main-styles.css">`;
    }
}

// Initialize shared components when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Set active page based on current file
    const currentPage = window.location.pathname.split('/').pop();
    let activePage = '';
    
    if (currentPage === 'index.html' || currentPage === '') activePage = 'home';
    else if (currentPage === 'Applications.htm') activePage = 'applications';
    else if (currentPage.includes('quiz')) activePage = 'quiz';
    else if (currentPage === 'user_com.htm') activePage = 'community';
    else if (currentPage === 'blogs.html') activePage = 'blogs';
    else if (currentPage === 'About.htm') activePage = 'about';
    
    // Update header if it exists
    const headerContainer = document.getElementById('main-header');
    if (headerContainer) {
        headerContainer.outerHTML = SharedComponents.getHeader(activePage);
    }
    
    // Update footer if it exists
    const footerContainer = document.getElementById('main-footer');
    if (footerContainer) {
        footerContainer.outerHTML = SharedComponents.getFooter();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SharedComponents;
}
