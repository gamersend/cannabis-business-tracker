#!/bin/bash

# Cannabis Business Tracker - Docker Startup Script
echo "🌿 Starting Cannabis Business Tracker..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please copy .env.example to .env.local and configure your settings."
    exit 1
fi

# Load environment variables
export $(cat .env.local | grep -v '^#' | xargs)

# Validate required environment variables
if [ -z "$OPENROUTER_API_KEY" ]; then
    echo "❌ OPENROUTER_API_KEY is not set in .env.local"
    exit 1
fi

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ DB_PASSWORD is not set in .env.local"
    exit 1
fi

echo "✅ Environment variables loaded"

# Build and start services
echo "🐳 Building Docker containers..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services started successfully!"
    echo ""
    echo "🌿 Cannabis Business Tracker is now running:"
    echo "   📱 Web App: http://localhost:3000"
    echo "   🗄️  Database: localhost:5432"
    echo "   🔧 pgAdmin: http://localhost:8080 (optional)"
    echo ""
    echo "🤖 AI Models available:"
    echo "   • Claude 3.5 Sonnet (Premium)"
    echo "   • GPT-4o (Balanced)"
    echo "   • GPT-4o Mini (Fast & Cheap)"
    echo "   • Gemini Flash (Ultra Fast)"
    echo "   • Llama 3.1 8B (FREE!)"
    echo ""
    echo "💡 Your historic $15,500+ profit data is ready!"
    echo "🎯 Start with: 'Jay 325' or 'Sold 1 oz cookies to Leveny for $325'"
else
    echo "❌ Failed to start services"
    docker-compose logs
    exit 1
fi
