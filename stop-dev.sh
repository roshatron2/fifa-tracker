#!/bin/bash

# FIFA Tracker - Stop Development Environment
echo "🛑 FIFA Tracker - Stopping Development Environment"
echo "==================================================="

# Check if docker-compose is available
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
else
    echo "❌ Error: docker-compose or docker compose is not installed"
    exit 1
fi

# Stop and remove containers
echo "🐳 Stopping Docker containers..."
$DOCKER_COMPOSE_CMD -f docker-compose.dev.yml down

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Development environment stopped"
else
    echo "❌ Failed to stop containers"
    exit 1
fi
