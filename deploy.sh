#!/bin/bash

# Railway Deployment Script for Temple Frontend
echo "🏛️ Starting Temple Frontend Deployment..."

# Set environment variables
export CI=false
export GENERATE_SOURCEMAP=false

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build the application
echo "🔨 Building application..."
npm run build:prod

# Start the server
echo "🚀 Starting server..."
serve -s build -p ${PORT:-3000}