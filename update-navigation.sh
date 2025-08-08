#!/bin/bash

# Navigation Update Script for Shortcut Sensei
# This script updates all HTML files to use consistent navigation

echo "Updating navigation for all HTML files..."

# Array of HTML files to update
html_files=(
    "Applications.htm"
    "About.htm" 
    "blogs.html"
    "user_com.htm"
    "user_profile.htm"
    "Visual Studio.html"
    "File Explorer.htm"
    "Microsoft Excell.htm"
    "Microsoft Word.htm"
    "Microsoft PowerPoint.htm"
    "Microsoft Outlook.html"
    "Microsoft Teams.html"
    "Adobe PhotoShop.html"
    "Discord.html"
    "Slack.htm"
    "Spotify.html"
    "Zoom.html"
    "Windows_11.html"
    "Skype.html"
    "Telegram.html"
    "Whatsapp.html"
    "VLC Media Player.html"
    "WinRAR.html"
    "7-zip.html"
    "Acrobat Adobe Reader.html"
    "Microsoft Edge.html"
    "Mozilla Thunderbird.html"
    "Microsoft OneDrive.html"
    "Microsoft OneNote.html"
    "Adobe Creative Cloud.html"
    "Audacity.html"
    "Trello.html"
    "home-page.html"
    "home-page-after_signup.html"
)

# Standard header navigation HTML
nav_header='    <!-- Header -->
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
                        <a href="Applications.htm">Applications <i class="fas fa-chevron-down"></i></a>
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
                        <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
                <button class="menu-toggle" id="menu-toggle">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
    </header>'

# Standard footer HTML
footer_html='    <!-- Footer -->
    <footer class="main-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Shortcut Sensei</h3>
                    <p>Master keyboard shortcuts for all your favorite applications and boost your productivity to the next level.</p>
                    <div class="social-links">
                        <a href="https://www.facebook.com/profile.php?id=100015198880002"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://twitter.com/RAFI09925204"><i class="fab fa-twitter"></i></a>
                        <a href="https://www.linkedin.com/in/rafi-s-b-m-a3492a265/"><i class="fab fa-linkedin-in"></i></a>
                        <a href="https://www.instagram.com/rafi_s_b_m/"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="Applications.htm">Applications</a></li>
                        <li><a href="blogs.html">Blogs</a></li>
                        <li><a href="About.htm">About</a></li>
                        <li><a href="user_com.htm">Community</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Popular Shortcuts</h3>
                    <ul>
                        <li><a href="Google Chrome.html">Chrome Shortcuts</a></li>
                        <li><a href="Visual Studio.html">VS Code Shortcuts</a></li>
                        <li><a href="File Explorer.htm">Windows Explorer</a></li>
                        <li><a href="Microsoft Word.htm">Word Shortcuts</a></li>
                        <li><a href="Microsoft Excell.htm">Excel Shortcuts</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Contact</h3>
                    <ul>
                        <li><a href="https://www.linkedin.com/in/rafi-s-b-m-a3492a265/">Contact Us</a></li>
                        <li><a href="https://shortcut-sensei.hashnode.dev/">Blog</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2025 Shortcut Sensei. All rights reserved. Made with ❤️ for productivity enthusiasts.</p>
            </div>
        </div>
    </footer>'

echo "Navigation update script created successfully!"
echo "Run this script to update all HTML files with consistent navigation."
