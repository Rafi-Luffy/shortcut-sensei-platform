#!/usr/bin/env python3
"""
Script to update all HTML files with consistent navigation and functionality
"""
import os
import re
from pathlib import Path

class HeaderUpdater:
    def __init__(self):
        self.base_path = Path(__file__).parent
        self.header_template = self.load_header_template()
        self.files_updated = 0
        
    def load_header_template(self):
        header_file = self.base_path / "header-template.html"
        if header_file.exists():
            return header_file.read_text()
        return ""
        
    def get_html_files(self):
        """Get all HTML files that need updating"""
        html_files = []
        
        # Application-specific HTML files
        app_files = [
            "Google Chrome.html", "Visual Studio.html", "File Explorer.htm",
            "Microsoft Excell.htm", "Microsoft Word.htm", "Microsoft PowerPoint.htm",
            "Microsoft Outlook.html", "Microsoft Teams.html", "Adobe PhotoShop.html",
            "Discord.html", "Slack.htm", "Spotify.html", "Zoom.html",
            "Windows_11.html", "Skype.html", "Telegram.html", "Whatsapp.html",
            "VLC Media Player.html", "WinRAR.html", "7-zip.html",
            "Acrobat Adobe Reader.html", "Microsoft Edge.html", "Mozilla Thunderbird.html",
            "Microsoft OneDrive.html", "Microsoft OneNote.html", "Adobe Creative Cloud.html",
            "Audacity.html", "Trello.html"
        ]
        
        # Navigation pages
        nav_files = [
            "Applications.htm", "blogs.html", "About.htm", 
            "user_com.htm", "user_profile.htm", "home-page.html",
            "home-page-after_signup.html"
        ]
        
        all_files = app_files + nav_files
        
        for filename in all_files:
            file_path = self.base_path / filename
            if file_path.exists():
                html_files.append(file_path)
                
        return html_files
    
    def update_file_links(self, content, filename):
        """Update CSS and JS links in HTML files"""
        # Add main-styles.css if not present
        if 'main-styles.css' not in content:
            # Find existing CSS links and add our main styles
            css_pattern = r'(<link[^>]*stylesheet[^>]*>)'
            if re.search(css_pattern, content):
                content = re.sub(
                    r'(</head>)',
                    r'    <link rel="stylesheet" href="main-styles.css">\n\1',
                    content
                )
        
        # Add main-nav.js if not present
        if 'main-nav.js' not in content:
            # Add before closing body tag
            content = re.sub(
                r'(</body>)',
                r'    <script src="main-nav.js"></script>\n\1',
                content
            )
        
        return content
    
    def update_header(self, content, filename):
        """Replace existing header with standardized header"""
        if not self.header_template:
            return content
            
        # Find and replace header section
        header_patterns = [
            r'<header[^>]*>.*?</header>',
            r'<!-- Header -->.*?</header>',
            r'<header.*?</header>'
        ]
        
        for pattern in header_patterns:
            if re.search(pattern, content, re.DOTALL | re.IGNORECASE):
                content = re.sub(
                    pattern,
                    self.header_template,
                    content,
                    flags=re.DOTALL | re.IGNORECASE
                )
                break
        
        # Update specific active navigation based on filename
        content = self.update_active_nav(content, filename)
        
        return content
    
    def update_active_nav(self, content, filename):
        """Set the active navigation item based on current file"""
        # Remove existing active classes
        content = re.sub(r' class="active"', '', content)
        
        # Add active class based on filename
        nav_mapping = {
            'index.html': 'Home',
            'all-applications.html': 'Applications',
            'Applications.htm': 'Applications', 
            'blogs.html': 'Blogs',
            'About.htm': 'About',
            'user_com.htm': 'Community',
            'user_profile.htm': 'Profile'
        }
        
        filename_str = str(filename.name)
        
        # Set active for specific app pages
        if filename_str in nav_mapping:
            active_text = nav_mapping[filename_str]
            content = re.sub(
                f'(<a href="[^"]*">{active_text}</a>)',
                r'<a href="\1" class="active">\2</a>',
                content
            )
        elif filename_str.endswith('.html') or filename_str.endswith('.htm'):
            # For application-specific pages, mark Applications as active
            content = re.sub(
                r'(<a href="all-applications.html">Applications)',
                r'\1 class="active"',
                content
            )
        
        return content
    
    def update_title(self, content, filename):
        """Update page titles to be consistent"""
        filename_str = str(filename.name)
        
        # Map filenames to proper titles
        title_mapping = {
            'Google Chrome.html': 'Google Chrome Shortcuts - Shortcut Sensei',
            'Visual Studio.html': 'Visual Studio Code Shortcuts - Shortcut Sensei',
            'File Explorer.htm': 'File Explorer Shortcuts - Shortcut Sensei',
            'Microsoft Excell.htm': 'Microsoft Excel Shortcuts - Shortcut Sensei',
            'Microsoft Word.htm': 'Microsoft Word Shortcuts - Shortcut Sensei',
            'Microsoft PowerPoint.htm': 'Microsoft PowerPoint Shortcuts - Shortcut Sensei',
            'Microsoft Outlook.html': 'Microsoft Outlook Shortcuts - Shortcut Sensei',
            'Microsoft Teams.html': 'Microsoft Teams Shortcuts - Shortcut Sensei',
            'Adobe PhotoShop.html': 'Adobe Photoshop Shortcuts - Shortcut Sensei',
            'Discord.html': 'Discord Shortcuts - Shortcut Sensei',
            'Slack.htm': 'Slack Shortcuts - Shortcut Sensei',
            'Spotify.html': 'Spotify Shortcuts - Shortcut Sensei',
            'Zoom.html': 'Zoom Shortcuts - Shortcut Sensei',
            'Windows_11.html': 'Windows 11 Shortcuts - Shortcut Sensei',
            'Applications.htm': 'All Applications - Shortcut Sensei',
            'blogs.html': 'Blogs - Shortcut Sensei',
            'About.htm': 'About - Shortcut Sensei',
            'user_com.htm': 'Community - Shortcut Sensei',
            'user_profile.htm': 'User Profile - Shortcut Sensei'
        }
        
        if filename_str in title_mapping:
            new_title = title_mapping[filename_str]
            content = re.sub(
                r'<title>.*?</title>',
                f'<title>{new_title}</title>',
                content,
                flags=re.IGNORECASE
            )
        
        return content
    
    def process_file(self, file_path):
        """Process a single HTML file"""
        try:
            content = file_path.read_text(encoding='utf-8')
            original_content = content
            
            # Update various parts
            content = self.update_title(content, file_path)
            content = self.update_file_links(content, file_path.name)
            content = self.update_header(content, file_path)
            
            # Only write if content changed
            if content != original_content:
                file_path.write_text(content, encoding='utf-8')
                print(f"✅ Updated: {file_path.name}")
                self.files_updated += 1
                return True
            else:
                print(f"⏭️  No changes needed: {file_path.name}")
                return False
                
        except Exception as e:
            print(f"❌ Error processing {file_path.name}: {e}")
            return False
    
    def run(self):
        """Run the header update process"""
        print("🚀 Starting HTML file updates...")
        print(f"📂 Working directory: {self.base_path}")
        
        html_files = self.get_html_files()
        print(f"📄 Found {len(html_files)} HTML files to process")
        
        if not self.header_template:
            print("⚠️  Warning: No header template found. Creating basic header...")
            self.create_basic_header_template()
        
        for file_path in html_files:
            self.process_file(file_path)
        
        print(f"\n✨ Update complete!")
        print(f"📊 Files updated: {self.files_updated}/{len(html_files)}")
        print(f"🎯 All files now have consistent navigation and functionality!")
    
    def create_basic_header_template(self):
        """Create a basic header template if none exists"""
        basic_header = '''<!-- Standardized Header for Shortcut Sensei -->
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
                <li><a href="all-applications.html">Applications</a></li>
                <li><a href="blogs.html">Blogs</a></li>
                <li><a href="About.htm">About</a></li>
                <li><a href="user_com.htm">Community</a></li>
            </ul>
        </nav>

        <div class="header-actions">
            <div class="search-container">
                <input type="text" placeholder="Search shortcuts...">
                <button class="search-btn">
                    <i class="fas fa-search"></i>
                </button>
            </div>
            <button class="theme-toggle" id="theme-toggle">
                <i class="fas fa-moon"></i>
            </button>
            <div class="user-menu">
                <button class="login-btn" id="login-btn">
                    <i class="fas fa-user"></i>
                    Login
                </button>
                <div class="user-dropdown" id="user-dropdown" style="display: none;">
                    <a href="user_profile.htm"><i class="fas fa-user-circle"></i> Profile</a>
                    <a href="user_com.htm"><i class="fas fa-users"></i> Community</a>
                    <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
            <button class="menu-toggle" id="menu-toggle">
                <i class="fas fa-bars"></i>
            </button>
        </div>
    </div>
</header>'''
        self.header_template = basic_header

if __name__ == "__main__":
    updater = HeaderUpdater()
    updater.run()
