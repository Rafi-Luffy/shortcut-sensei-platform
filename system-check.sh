#!/bin/bash

# Shortcut Sensei System Verification Script
# Comprehensive testing of all system components

echo "🚀 Starting Shortcut Sensei S# Test new homepage files
print_test "Homepage HTML" "index-new.html"
test_file "index-new.html" && passed_tests=$((passed_tests + 1)) || failed_tests=$((failed_tests + 1))
total_tests=$((total_tests + 1))

print_test "Homepage Styles" "homepage-styles.css"
test_file "homepage-styles.css" && passed_tests=$((passed_tests + 1)) || failed_tests=$((failed_tests + 1))
total_tests=$((total_tests + 1))

print_test "Homepage Script" "homepage-script.js"
test_file "homepage-script.js" && passed_tests=$((passed_tests + 1)) || failed_tests=$((failed_tests + 1))
total_tests=$((total_tests + 1))

# Test homepage content
print_test "Hero Section" "Hero section in index-new.html"
if test_file "index-new.html" && grep -q "hero-section" "index-new.html"; then
    echo "   ✅ Hero section found"
    passed_tests=$((passed_tests + 1))
else
    echo "   ❌ Hero section missing"
    failed_tests=$((failed_tests + 1))
fi
total_tests=$((total_tests + 1))

print_test "Sticky Navigation" "Sticky navigation in index-new.html"
if test_file "index-new.html" && grep -q "sticky-nav" "index-new.html"; then
    echo "   ✅ Sticky navigation found"
    passed_tests=$((passed_tests + 1))
else
    echo "   ❌ Sticky navigation missing"
    failed_tests=$((failed_tests + 1))
fi
total_tests=$((total_tests + 1))

print_test "Statistics Section" "Statistics section in index-new.html"
if test_file "index-new.html" && grep -q "stats-section" "index-new.html"; then
    echo "   ✅ Statistics section found"
    passed_tests=$((passed_tests + 1))
else
    echo "   ❌ Statistics section missing"
    failed_tests=$((failed_tests + 1))
fi
total_tests=$((total_tests + 1))

echo "📊 System Check Results:"
echo "Total Tests: $total_tests"
echo "Passed: $passed_tests"
echo "Failed: $failed_tests"
echo "Success Rate: $success_rate%"

# Add timestamp
echo ""
echo "🕒 Check completed at: $(date)"
echo "=========================="rification..."
echo "=================================================="

# Initialize counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo "✅ PASSED"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo "❌ FAILED"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# File existence tests
echo -e "\n📁 File Existence Tests"
echo "------------------------"

run_test "Firebase Config" "test -f firebase-config.js"
run_test "Error Manager" "test -f error-manager.js" 
run_test "Main Navigation" "test -f main-nav.js"
run_test "Main Styles" "test -f main-styles.css"
run_test "Service Worker" "test -f sw.js"
run_test "Firebase JSON" "test -f firebase.json"
run_test "Favicon" "test -f favicon.ico"

# Core page tests
echo -e "\n📄 Core Page Tests"
echo "-------------------"

run_test "Index Page" "test -f index.html"
run_test "App Test Page" "test -f app-test.html"
run_test "All Applications" "test -f all-applications.html"
run_test "Blogs Page" "test -f blogs.html"
run_test "About Page" "test -f About.htm"
run_test "User Community" "test -f user_com.htm"

# Application page tests (sample)
echo -e "\n🖥️  Application Page Tests"
echo "---------------------------"

run_test "Google Chrome" "test -f 'Google Chrome.html'"
run_test "Visual Studio" "test -f 'Visual Studio.html'"
run_test "Microsoft Excel" "test -f 'Microsoft Excell.htm'"
run_test "Discord" "test -f 'Discord.html'"
run_test "Windows 11" "test -f 'Windows_11.html'"

# Image asset tests
echo -e "\n🖼️  Image Asset Tests"
echo "---------------------"

run_test "Chrome Image" "test -f Google_Chrome.jpg"
run_test "VS Code Image" "test -f vscode.png"
run_test "Excel Image" "test -f excell1.jpg"
run_test "Photoshop Image" "test -f ps.jpg"
run_test "Discord Image" "test -f discord.jpg"

# Content validation tests
echo -e "\n📝 Content Validation Tests"
echo "----------------------------"

run_test "Firebase Config Content" "grep -q 'FirebaseManager' firebase-config.js"
run_test "Error Manager Content" "grep -q 'ErrorManager' error-manager.js"
run_test "Main Nav Content" "grep -q 'ShortcutSensei' main-nav.js"
run_test "Service Worker Content" "grep -q 'shortcut-sensei' sw.js"
run_test "Index Firebase Integration" "grep -q 'firebase-config.js' index.html"

# JavaScript syntax tests
echo -e "\n⚙️  JavaScript Syntax Tests"
echo "----------------------------"

if command -v node >/dev/null 2>&1; then
    run_test "Firebase Config Syntax" "node -c firebase-config.js"
    run_test "Error Manager Syntax" "node -c error-manager.js"
    run_test "Main Nav Syntax" "node -c main-nav.js"
else
    echo "⚠️  Node.js not available - skipping syntax tests"
fi

# CSS validation tests
echo -e "\n🎨 CSS Validation Tests"
echo "------------------------"

run_test "CSS Variables" "grep -q ':root' main-styles.css"
run_test "Error Styles" "grep -q 'error-boundary' main-styles.css"
run_test "Notification Styles" "grep -q 'simple-notification' main-styles.css"
run_test "Dark Mode Support" "grep -q 'dark-mode' main-styles.css"

# Configuration tests
echo -e "\n⚙️  Configuration Tests"
echo "------------------------"

run_test "Firebase Hosting Config" "grep -q 'hosting' firebase.json"
run_test "Firebase Firestore Config" "grep -q 'firestore' firebase.json"
run_test "Service Worker Cache" "grep -q 'urlsToCache' sw.js"

# Security tests
echo -e "\n🔐 Security Tests"
echo "------------------"

run_test "No Hardcoded Passwords" "! grep -i 'password.*=' *.js *.html"
run_test "No API Keys Exposed" "! grep -E 'api[_-]?key.*[0-9a-zA-Z]{20}' *.js *.html"
run_test "HTTPS References" "grep -q 'https://' index.html"

# Performance tests
echo -e "\n⚡ Performance Tests"
echo "--------------------"

INDEX_SIZE=$(wc -c < index.html)
CSS_SIZE=$(wc -c < main-styles.css)
JS_SIZE=$(wc -c < main-nav.js)

run_test "Index Size Reasonable" "test $INDEX_SIZE -lt 100000"
run_test "CSS Size Reasonable" "test $CSS_SIZE -lt 200000"
run_test "JS Size Reasonable" "test $JS_SIZE -lt 150000"

# Accessibility tests
echo -e "\n♿ Accessibility Tests"
echo "----------------------"

run_test "Alt Text Present" "grep -q 'alt=' index.html"
run_test "ARIA Labels Present" "grep -q 'aria-' main-styles.css"
run_test "Focus Styles" "grep -q ':focus' main-styles.css"
run_test "High Contrast Support" "grep -q 'prefers-contrast' main-styles.css"

# Generate report
echo -e "\n📊 Test Report"
echo "==============="
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS ✅"
echo "Failed: $FAILED_TESTS ❌"

PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
echo "Pass Rate: $PASS_RATE%"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n🎉 ALL TESTS PASSED! System is ready for production."
    exit 0
elif [ $PASS_RATE -ge 90 ]; then
    echo -e "\n✅ System is in good shape with minor issues."
    exit 0
elif [ $PASS_RATE -ge 75 ]; then
    echo -e "\n⚠️  System has some issues that should be addressed."
    exit 1
else
    echo -e "\n❌ System has critical issues that must be fixed."
    exit 1
fi
