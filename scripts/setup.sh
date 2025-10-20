#!/bin/bash

# ProdMind Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up ProdMind Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm and try again."
    exit 1
fi

print_success "npm $(npm -v) detected"

# Install frontend dependencies
print_status "Installing frontend dependencies..."
npm install
print_success "Frontend dependencies installed"

# Install backend dependencies
print_status "Installing backend dependencies..."
cd server
npm install
cd ..
print_success "Backend dependencies installed"

# Copy environment files if they don't exist
if [ ! -f .env ]; then
    print_status "Creating frontend .env file..."
    cp .env.example .env
    print_success "Frontend .env file created"
else
    print_warning "Frontend .env file already exists"
fi

if [ ! -f server/.env ]; then
    print_status "Creating backend .env file..."
    # Create a basic server .env file
    cat > server/.env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development
API_VERSION=v1

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/productive-content
DB_MAX_POOL_SIZE=10
DB_TIMEOUT_MS=30000

# Security Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS=false

# API Keys (Replace with your actual keys)
YOUTUBE_API_KEY=your_youtube_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# External APIs
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
GOOGLE_SEARCH_API_KEY=your_google_search_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
NEWS_API_KEY=your_news_api_key_here

# Logging
LOG_LEVEL=info
LOG_FORMAT=combined

# Performance
REQUEST_TIMEOUT=30000
BODY_LIMIT=10mb

# Health Check
HEALTH_CHECK_INTERVAL=30000
EOF
    print_success "Backend .env file created"
else
    print_warning "Backend .env file already exists"
fi

# Check if MongoDB is running
print_status "Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; then
        print_success "MongoDB is running"
    else
        print_warning "MongoDB is not running. You can start it with Docker:"
        echo "  docker-compose -f docker-compose.dev.yml up -d mongodb"
    fi
elif command -v mongo &> /dev/null; then
    if mongo --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; then
        print_success "MongoDB is running"
    else
        print_warning "MongoDB is not running. You can start it with Docker:"
        echo "  docker-compose -f docker-compose.dev.yml up -d mongodb"
    fi
else
    print_warning "MongoDB client not found. Install MongoDB or use Docker:"
    echo "  docker-compose -f docker-compose.dev.yml up -d mongodb"
fi

# Create logs directory
print_status "Creating logs directory..."
mkdir -p server/logs
print_success "Logs directory created"

# Check if Docker is available
if command -v docker &> /dev/null; then
    print_success "Docker detected - you can use docker-compose for services"
    echo "  Development: docker-compose -f docker-compose.dev.yml up -d"
    echo "  Production: docker-compose up -d"
else
    print_warning "Docker not found - manual service setup required"
fi

echo ""
print_success "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update API keys in server/.env file"
echo "2. Start MongoDB (locally or with Docker)"
echo "3. Run the development servers:"
echo "   Frontend: npm run dev"
echo "   Backend:  cd server && npm run dev"
echo "   Both:     npm run dev:full"
echo ""
echo "4. Visit http://localhost:5173 to see the application"
echo "5. API health check: http://localhost:5000/api/health"
echo ""
print_status "Happy coding! 🚀"