#!/bin/bash

# Production Deployment Script for Shortcut Sensei
# This script prepares the application for production deployment

echo "🚀 Starting Shortcut Sensei Production Deployment..."
echo "=================================================="

# Set production variables
PRODUCTION_URL="https://shortcutsensei.com"
BUILD_DIR="dist"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create build directory
echo "📁 Creating build directory..."
mkdir -p $BUILD_DIR

# Copy all HTML files and update URLs for production
echo "📄 Processing HTML files..."
for file in *.html *.htm; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        # Replace localhost URLs with production URLs
        sed "s|http://localhost:[0-9]*|$PRODUCTION_URL|g" "$file" > "$BUILD_DIR/$file"
        
        # Minify HTML (remove extra whitespace and comments)
        # Note: This is a basic minification. For production, consider using proper tools
        sed -i.bak '/<!--.*-->/d' "$BUILD_DIR/$file" && rm "$BUILD_DIR/$file.bak"
    fi
done

# Copy and optimize CSS files
echo "🎨 Processing CSS files..."
for file in *.css; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        cp "$file" "$BUILD_DIR/"
    fi
done

# Copy and optimize JavaScript files
echo "⚡ Processing JavaScript files..."
for file in *.js; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        cp "$file" "$BUILD_DIR/"
    fi
done

# Copy static assets
echo "🖼️  Copying static assets..."
cp *.png *.jpg *.jpeg *.gif *.webp *.ico "$BUILD_DIR/" 2>/dev/null || true

# Copy Firebase configuration
echo "🔥 Copying Firebase configuration..."
cp firebase.json firestore.* "$BUILD_DIR/" 2>/dev/null || true

# Create production environment file
echo "⚙️  Creating production environment..."
cat > "$BUILD_DIR/.env.production" << EOF
NODE_ENV=production
FIREBASE_PROJECT_ID=shortcut-sensei-prod
FIREBASE_API_KEY=your-production-api-key
ANALYTICS_ID=your-analytics-id
CDN_URL=$PRODUCTION_URL
EOF

# Generate sitemap.xml
echo "🗺️  Generating sitemap..."
cat > "$BUILD_DIR/sitemap.xml" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>$PRODUCTION_URL/</loc>
        <lastmod>$(date -Iseconds)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>$PRODUCTION_URL/Applications.htm</loc>
        <lastmod>$(date -Iseconds)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>$PRODUCTION_URL/Google%20Chrome.html</loc>
        <lastmod>$(date -Iseconds)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>$PRODUCTION_URL/Visual%20Studio.html</loc>
        <lastmod>$(date -Iseconds)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>$PRODUCTION_URL/quizs/index.html</loc>
        <lastmod>$(date -Iseconds)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>$PRODUCTION_URL/About.htm</loc>
        <lastmod>$(date -Iseconds)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
</urlset>
EOF

# Generate robots.txt
echo "🤖 Generating robots.txt..."
cat > "$BUILD_DIR/robots.txt" << EOF
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /*.json$
Disallow: /test-*

Sitemap: $PRODUCTION_URL/sitemap.xml
EOF

# Create .htaccess for Apache servers
echo "⚙️  Creating .htaccess..."
cat > "$BUILD_DIR/.htaccess" << EOF
# Shortcut Sensei Production Configuration

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.gstatic.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https:;"
</IfModule>

# Friendly URLs
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([^.]+)$ $1.html [NC,L]

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
EOF

# Performance audit
echo "🔍 Running performance audit..."
echo "Checking file sizes..."
find "$BUILD_DIR" -type f -name "*.html" -exec wc -c {} + | sort -n
find "$BUILD_DIR" -type f -name "*.css" -exec wc -c {} + | sort -n
find "$BUILD_DIR" -type f -name "*.js" -exec wc -c {} + | sort -n

# Security audit
echo "🔒 Running security audit..."
echo "Checking for exposed sensitive data..."
if grep -r "password\|secret\|key" "$BUILD_DIR" --exclude-dir=.git; then
    echo "⚠️  WARNING: Potential sensitive data found!"
else
    echo "✅ No exposed sensitive data found"
fi

# Create deployment package
echo "📦 Creating deployment package..."
cd "$BUILD_DIR"
tar -czf "../shortcut-sensei-$TIMESTAMP.tar.gz" .
cd ..

# Generate deployment report
echo "📊 Generating deployment report..."
cat > "deployment-report-$TIMESTAMP.md" << EOF
# Shortcut Sensei Deployment Report

**Generated:** $(date)
**Build:** $TIMESTAMP
**Target:** Production

## Files Processed
- HTML Files: $(ls $BUILD_DIR/*.html $BUILD_DIR/*.htm 2>/dev/null | wc -l)
- CSS Files: $(ls $BUILD_DIR/*.css 2>/dev/null | wc -l)
- JavaScript Files: $(ls $BUILD_DIR/*.js 2>/dev/null | wc -l)
- Image Assets: $(ls $BUILD_DIR/*.png $BUILD_DIR/*.jpg $BUILD_DIR/*.jpeg $BUILD_DIR/*.gif $BUILD_DIR/*.webp 2>/dev/null | wc -l)

## Package Size
$(ls -lh shortcut-sensei-$TIMESTAMP.tar.gz | awk '{print $5}')

## Next Steps
1. Upload \`shortcut-sensei-$TIMESTAMP.tar.gz\` to your web server
2. Extract files to your web root directory
3. Update Firebase configuration with production keys
4. Configure your web server with SSL certificate
5. Update DNS settings to point to your server
6. Test all functionality in production environment

## Production Checklist
- [ ] SSL Certificate installed
- [ ] Firebase production config updated
- [ ] Analytics tracking configured
- [ ] CDN configured (optional)
- [ ] Backup strategy implemented
- [ ] Monitoring setup
- [ ] Error logging configured

## Performance Recommendations
- Enable Gzip compression
- Configure browser caching
- Optimize images further if needed
- Consider implementing a CDN
- Monitor Core Web Vitals

## Security Recommendations
- Implement Content Security Policy
- Configure proper CORS headers
- Regular security updates
- Monitor for vulnerabilities
- Implement rate limiting

EOF

echo ""
echo "✅ Production deployment preparation complete!"
echo "=================================================="
echo "📦 Package: shortcut-sensei-$TIMESTAMP.tar.gz"
echo "📊 Report: deployment-report-$TIMESTAMP.md"
echo "📁 Build files: $BUILD_DIR/"
echo ""
echo "🚀 Ready for production deployment!"
echo "Next: Upload the package to your web server and follow the deployment report."
