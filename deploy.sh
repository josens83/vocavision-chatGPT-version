#!/bin/bash

# VocaVision Deployment Script
# This script deploys the VocaVision application using Docker Compose

set -e

echo "🚀 VocaVision Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please copy .env.example to .env and configure your environment variables"
    echo "  cp .env.example .env"
    echo "  nano .env  # Edit with your values"
    exit 1
fi

echo -e "${GREEN}✅ Environment file found${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose installed${NC}"

# Parse command line arguments
COMMAND=${1:-up}

case $COMMAND in
    up)
        echo -e "${YELLOW}🔨 Building and starting containers...${NC}"
        docker-compose up -d --build
        echo ""
        echo -e "${GREEN}✅ Deployment complete!${NC}"
        echo ""
        echo "Services are now running:"
        echo "  - Web Frontend: http://localhost:3000"
        echo "  - Backend API:  http://localhost:3001"
        echo "  - Database:     postgresql://localhost:5432/vocavision"
        echo ""
        echo "To view logs:    ./deploy.sh logs"
        echo "To stop:         ./deploy.sh down"
        ;;

    down)
        echo -e "${YELLOW}🛑 Stopping containers...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ Containers stopped${NC}"
        ;;

    restart)
        echo -e "${YELLOW}🔄 Restarting containers...${NC}"
        docker-compose restart
        echo -e "${GREEN}✅ Containers restarted${NC}"
        ;;

    logs)
        SERVICE=${2:-}
        if [ -z "$SERVICE" ]; then
            docker-compose logs -f
        else
            docker-compose logs -f $SERVICE
        fi
        ;;

    ps)
        echo -e "${YELLOW}📋 Container status:${NC}"
        docker-compose ps
        ;;

    clean)
        echo -e "${YELLOW}🧹 Cleaning up...${NC}"
        echo "This will stop and remove all containers, networks, and volumes."
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v
            echo -e "${GREEN}✅ Cleanup complete${NC}"
        else
            echo "Cleanup cancelled"
        fi
        ;;

    migrate)
        echo -e "${YELLOW}🔄 Running database migrations...${NC}"
        docker-compose exec backend npx prisma migrate deploy
        echo -e "${GREEN}✅ Migrations complete${NC}"
        ;;

    seed)
        echo -e "${YELLOW}🌱 Seeding database...${NC}"
        docker-compose exec backend npm run seed
        echo -e "${GREEN}✅ Database seeded${NC}"
        ;;

    shell)
        SERVICE=${2:-backend}
        echo -e "${YELLOW}🐚 Opening shell in $SERVICE container...${NC}"
        docker-compose exec $SERVICE sh
        ;;

    *)
        echo "Usage: ./deploy.sh [command] [options]"
        echo ""
        echo "Commands:"
        echo "  up          Build and start all containers (default)"
        echo "  down        Stop and remove containers"
        echo "  restart     Restart all containers"
        echo "  logs        View logs (optional: specify service name)"
        echo "  ps          Show container status"
        echo "  clean       Stop containers and remove volumes (destructive)"
        echo "  migrate     Run database migrations"
        echo "  seed        Seed the database with initial data"
        echo "  shell       Open a shell in a container (default: backend)"
        echo ""
        echo "Examples:"
        echo "  ./deploy.sh up"
        echo "  ./deploy.sh logs backend"
        echo "  ./deploy.sh shell web"
        exit 1
        ;;
esac
