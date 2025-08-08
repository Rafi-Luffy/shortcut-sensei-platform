#!/usr/bin/env python3
"""
Simple HTTP server for testing the Shortcut Sensei application
"""
import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

def start_server(port=8080):
    # Change to the application directory
    app_dir = Path(__file__).parent
    os.chdir(app_dir)
    
    # Set up the server
    PORT = port
    Handler = http.server.SimpleHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"🚀 Shortcut Sensei is running!")
            print(f"📂 Serving from: {app_dir}")
            print(f"🌐 Open in browser: http://localhost:{PORT}")
            print(f"📋 Main pages:")
            print(f"   • Home: http://localhost:{PORT}/index.html")
            print(f"   • All Apps: http://localhost:{PORT}/all-applications.html")
            print(f"   • Blogs: http://localhost:{PORT}/blogs.html")
            print(f"   • About: http://localhost:{PORT}/About.htm")
            print(f"\n⚡ Press Ctrl+C to stop the server")
            
            # Try to open the browser automatically
            try:
                webbrowser.open(f'http://localhost:{PORT}/index.html')
            except:
                pass
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n✅ Server stopped. Thanks for using Shortcut Sensei!")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {PORT} is already in use. Try a different port or stop the existing server.")
        else:
            print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    port = 8080
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Invalid port number. Using default port 8080.")
    start_server(port)
