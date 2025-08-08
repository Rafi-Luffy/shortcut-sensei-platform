#!/usr/bin/env python3
"""
Update all HTML pages with consistent header and footer
"""

import os
import re
import glob

def read_file(filepath):
    """Read file content"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return None

def write_file(filepath, content):
    """Write content to file"""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    except Exception as e:
        print(f"Error writing {filepath}: {e}")
        return False

def get_standard_header():
    """Get the standard header HTML"""
    return '''    <!-- Header -->
    <header class="main-header" id="main-header">
        <div class="container">
            <div class="logo">
                <a href="index.html">
                    <i class="fas fa-keyboard"></i>
                    Shortcut Sensei
                </a>
            </div>
            
            <nav class="main-nav" id="main-nav">
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li class="dropdown">
                        <a href="all-applications.html">Applications <i class="fas fa-chevron-down"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="Google Chrome.html">Google Chrome</a></li>
                            <li><a href="Visual Studio.html">Visual Studio Code</a></li>
                            <li><a href="File Explorer.htm">File Explorer</a></li>
                            <li><a href="Microsoft Excell.htm">Microsoft Excel</a></li>
                            <li><a href="Microsoft Word.htm">Microsoft Word</a></li>
                            <li><a href="Microsoft PowerPoint.htm">PowerPoint</a></li>
                            <li><a href="Microsoft Outlook.html">Outlook</a></li>
                            <li><a href="Microsoft Teams.html">Teams</a></li>
                            <li><a href="Adobe PhotoShop.html">Photoshop</a></li>
                            <li><a href="Discord.html">Discord</a></li>
                            <li><a href="Slack.htm">Slack</a></li>
                            <li><a href="Spotify.html">Spotify</a></li>
                            <li><a href="Zoom.html">Zoom</a></li>
                            <li><a href="Windows_11.html">Windows 11</a></li>
                            <li><a href="all-applications.html">View All Apps</a></li>
                        </ul>
                    </li>
                    <li><a href="blogs.html">Blogs</a></li>
                    <li><a href="quizs/index.html">Quiz</a></li>
                    <li><a href="About.htm">About</a></li>
                    <li><a href="user_com.htm">Community</a></li>
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
                    <button class="login-btn" id="login-btn" data-tooltip="Login or view profile">
                        <i class="fas fa-user"></i>
                        Login
                    </button>
                    <div class="user-dropdown" id="user-dropdown" style="display: none;">
                        <a href="user_profile.htm"><i class="fas fa-user-circle"></i> Profile</a>
                        <a href="#" onclick="shortcutSensei.showSettings()"><i class="fas fa-cog"></i> Settings</a>
                        <a href="user_com.htm"><i class="fas fa-users"></i> Community</a>
                        <div class="dropdown-divider"></div>
                        <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
                <button class="menu-toggle" id="menu-toggle" data-tooltip="Menu">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
    </header>'''

def get_standard_footer():
    """Get the standard footer HTML"""
    return '''    <!-- Footer -->
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
                            Your journey to becoming a true keyboard sensei starts here.
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
                            <li><a href="all-applications.html"><i class="fas fa-th-large"></i> All Applications</a></li>
                            <li><a href="blogs.html"><i class="fas fa-blog"></i> Blogs & Tips</a></li>
                            <li><a href="quizs/index.html"><i class="fas fa-question-circle"></i> Practice Quiz</a></li>
                            <li><a href="About.htm"><i class="fas fa-info-circle"></i> About Us</a></li>
                            <li><a href="user_com.htm"><i class="fas fa-users"></i> Community</a></li>
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
                            <li><a href="#"><i class="fas fa-download"></i> Cheat Sheets</a></li>
                            <li><a href="#"><i class="fas fa-mobile-alt"></i> Mobile App</a></li>
                            <li><a href="#"><i class="fas fa-rss"></i> RSS Feed</a></li>
                            <li><a href="#"><i class="fas fa-envelope"></i> Newsletter</a></li>
                            <li><a href="#"><i class="fas fa-headset"></i> Support</a></li>
                            <li><a href="#"><i class="fas fa-bug"></i> Report Bug</a></li>
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
                        <a href="#" id="back-to-top" onclick="scrollToTop()">
                            <i class="fas fa-arrow-up"></i> Back to Top
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>'''

def get_footer_scripts():
    """Get footer JavaScript"""
    return '''    <!-- Scripts -->
    <script>
        // Footer JavaScript
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Newsletter form handling
        document.addEventListener('DOMContentLoaded', function() {
            const newsletterForm = document.getElementById('newsletter-form');
            if (newsletterForm) {
                newsletterForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const email = this.querySelector('input[type="email"]').value;
                    if (typeof shortcutSensei !== 'undefined') {
                        shortcutSensei.showNotification(`Thanks for subscribing with ${email}!`, 'success');
                        this.reset();
                    } else {
                        alert('Thanks for subscribing!');
                        this.reset();
                    }
                });
            }
        });
    </script>
    <script src="main-nav.js"></script>'''

def update_html_page(filepath):
    """Update a single HTML page with consistent header and footer"""
    print(f"Updating: {filepath}")
    
    content = read_file(filepath)
    if not content:
        return False
    
    # Skip if already updated (contains main-footer)
    if 'main-footer' in content:
        print(f"  Already updated, skipping")
        return True
    
    # Replace header
    header_pattern = r'<header[^>]*>.*?</header>'
    new_header = get_standard_header()
    content = re.sub(header_pattern, new_header, content, flags=re.DOTALL)
    
    # Add footer before closing body tag
    footer_html = get_standard_footer()
    footer_scripts = get_footer_scripts()
    
    # Find the position before </body>
    body_end_pattern = r'(\s*</body>)'
    if re.search(body_end_pattern, content):
        # Add footer and scripts before </body>
        replacement = f'\n{footer_html}\n\n    <!-- Notification Container -->\n    <div class="notification-container" id="notification-container"></div>\n\n{footer_scripts}\n</body>'
        content = re.sub(body_end_pattern, replacement, content)
    
    # Ensure main-nav.js is included
    if 'main-nav.js' not in content:
        content = content.replace('</body>', '    <script src="main-nav.js"></script>\n</body>')
    
    # Ensure main-styles.css is included
    if 'main-styles.css' not in content:
        head_pattern = r'(<head>.*?</head>)'
        def add_css_link(match):
            head_content = match.group(1)
            if 'main-styles.css' not in head_content:
                head_content = head_content.replace('</head>', 
                    '    <link rel="stylesheet" href="main-styles.css">\n</head>')
            return head_content
        content = re.sub(head_pattern, add_css_link, content, flags=re.DOTALL)
    
    return write_file(filepath, content)

def main():
    """Main function"""
    print("🔄 Updating all HTML pages with consistent header and footer...")
    
    # Get all HTML files in current directory
    html_files = glob.glob("*.html") + glob.glob("*.htm")
    
    # Skip certain files
    skip_files = ['header-template.html', 'footer-template.html', 'header-template-standard.html']
    html_files = [f for f in html_files if os.path.basename(f) not in skip_files]
    
    updated_count = 0
    failed_count = 0
    
    for filepath in html_files:
        try:
            if update_html_page(filepath):
                updated_count += 1
            else:
                failed_count += 1
        except Exception as e:
            print(f"Error updating {filepath}: {e}")
            failed_count += 1
    
    print(f"\n✅ Update complete!")
    print(f"📊 Successfully updated: {updated_count} files")
    print(f"❌ Failed to update: {failed_count} files")
    print(f"📝 Total files processed: {len(html_files)}")

if __name__ == "__main__":
    main()
