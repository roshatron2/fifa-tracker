#!/bin/bash

# FIFA Tracker - Development Environment Startup Script
echo "🚀 FIFA Tracker - Starting Development Environment"
echo "=================================================="

# Check if docker-compose is available
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
else
    echo "❌ Error: docker-compose or docker compose is not installed"
    exit 1
fi

# Check if docker is running
if ! docker info &> /dev/null; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Parse command line arguments
DETACHED=false
BUILD=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--detached)
            DETACHED=true
            shift
            ;;
        -b|--build)
            BUILD=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -d, --detached    Start containers in detached mode (background)"
            echo "  -b, --build       Rebuild images before starting"
            echo "  -h, --help        Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                Start in foreground (follow logs)"
            echo "  $0 -d             Start in background"
            echo "  $0 -b             Rebuild and start in foreground"
            echo "  $0 -d -b          Rebuild and start in background"
            exit 0
            ;;
        *)
            echo "❌ Unknown option: $1"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

# Build images if requested
if [ "$BUILD" = true ]; then
    echo "🔨 Building Docker images..."
    $DOCKER_COMPOSE_CMD -f docker-compose.dev.yml build
    if [ $? -ne 0 ]; then
        echo "❌ Failed to build images"
        exit 1
    fi
    echo "✅ Images built successfully"
    echo ""
fi

# Start services
echo "🐳 Starting Docker containers..."
if [ "$DETACHED" = true ]; then
    $DOCKER_COMPOSE_CMD -f docker-compose.dev.yml up -d
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Development environment started in background"
        echo ""
        echo "Services:"
        echo "  📊 MongoDB:    http://localhost:27017"
        echo "  🔧 Backend:    http://localhost:8000"
        echo "  🎨 Frontend:   http://localhost:3000"
        echo ""
        echo "To view logs, run: $DOCKER_COMPOSE_CMD -f docker-compose.dev.yml logs -f"
        echo "To stop, run: $DOCKER_COMPOSE_CMD -f docker-compose.dev.yml down"
    else
        echo "❌ Failed to start containers"
        exit 1
    fi
else
    echo "📋 Following logs (press Ctrl+C to stop)..."
    echo ""
    $DOCKER_COMPOSE_CMD -f docker-compose.dev.yml up
fi

