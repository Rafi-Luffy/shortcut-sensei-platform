#!/bin/bash

# Simple deployment script for Shortcut Sensei
echo "🚀 Deploying Shortcut Sensei..."

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "Starting development server with Python..."
    python3 start-server.py
elif command -v python &> /dev/null; then
    echo "Starting development server with Python..."
    python start-server.py
else
    echo "Python not found. Using simple HTTP server..."
    if command -v npx &> /dev/null; then
        npx http-server -p 8000
    else
        echo "Please install Python or Node.js to run the server"
        exit 1
    fi
fi