# FIFA Tracker

A full-stack application for tracking FIFA match results, player statistics, and tournaments with ELO rating system.

## Tech Stack

- **Frontend**: Next.js 15.4, React 19, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.12+
- **Database**: MongoDB Atlas
- **Authentication**: JWT + Google OAuth

## Prerequisites

- **Node.js** 20+ and npm
- **Python** 3.12+
- **uv** (Python package manager) - [Install here](https://docs.astral.sh/uv/)
- **MongoDB Atlas** account (or local MongoDB)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fifa-tracker
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
uv sync
```

This will create a virtual environment and install all dependencies from `pyproject.toml`.

#### Configure Environment Variables

Create two environment files (`.env.dev` and `.env.prod`) in the root directory:

```bash
# Copy the example file to create development and production environment files
cp .env.example .env.dev
cp .env.example .env.prod
```

Edit `.env.dev` and `.env.prod` and configure the following variables in each file:

```env
# Environment
ENVIRONMENT=development

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT Secret (generate a secure key)
SECRET_KEY=your_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=INFO
```

> **Tip**: Generate a secure SECRET_KEY:
> ```bash
> python backend/scripts/generate_secret_key.py
> ```

#### Start the Backend Server

```bash
# Make sure you're in the backend directory
cd backend

# Activate the virtual environment (if using uv)
source .venv/bin/activate  # On macOS/Linux
# or
.venv\Scripts\activate  # On Windows

# Start the server with auto-reload
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`

- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Debug Mode
NEXT_PUBLIC_DEBUG_MODE=false

# API Base URL
NEXT_PUBLIC_API_BASE_URL_LOCAL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL_NGROK=

# Environment
NEXT_PUBLIC_ENVIRONMENT=development
```

#### Start the Frontend Server

```bash
# Make sure you're in the frontend directory
cd frontend

# Start the development server with Turbopack
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Quick Start (Both Services)

If you want to start both backend and frontend together:

```bash
# Terminal 1 - Backend
cd backend
source .venv/bin/activate
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Docker Setup (Alternative)

### Option 1: Development with Hot-Reload (Recommended for Active Development)

This setup mounts your code into containers and automatically reloads when you make changes:

```bash
# Start all services with hot-reload enabled
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop all services
docker-compose -f docker-compose.dev.yml down
```

**Benefits:**
- Code changes automatically reload (no rebuild needed)
- FastAPI hot-reload on Python changes
- Next.js hot-reload on React/TypeScript changes
- Great for active development

### Option 2: Production Build (For Testing Production Setup)

This setup builds production images:

```bash
# Start all services (MongoDB, Backend, Frontend)
docker-compose -f docker-compose.local.yml up -d

# View logs
docker-compose -f docker-compose.local.yml logs -f

# Stop all services
docker-compose -f docker-compose.local.yml down
```

**When to rebuild:**
```bash
# After code changes, rebuild specific service
docker-compose -f docker-compose.local.yml up -d --build backend
docker-compose -f docker-compose.local.yml up -d --build frontend

# Or rebuild all
docker-compose -f docker-compose.local.yml up -d --build
```

> **Note**: If you're running services locally (with `uvicorn` or `npm`), stop the Docker containers first:
> ```bash
> docker stop fifa-tracker-backend fifa-tracker-frontend
> # or
> docker-compose -f docker-compose.dev.yml down
> ```

## Project Structure

```
fifa-tracker/
├── backend/
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── models/        # Data models
│   │   ├── utils/         # Utilities (auth, logging, etc.)
│   │   └── config.py      # Configuration
│   ├── scripts/           # Utility scripts
│   ├── main.py           # FastAPI application
│   └── pyproject.toml    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js app directory
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── lib/          # Utilities and API client
│   │   └── types/        # TypeScript types
│   ├── package.json      # Node dependencies
│   └── .env.local        # Frontend environment variables
├── .env.example          # Environment variables template
├── .env.dev              # Development environment variables
├── .env.prod             # Production environment variables
└── docker-compose.local.yml
```

## Available Scripts

### Backend

```bash
# Run tests
uv run pytest

# Generate secret key
python scripts/generate_secret_key.py

# Create admin user
python scripts/create_admin_user.py
```

### Frontend

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Type check
npm run type-check

# Run all checks (lint + type-check)
npm run code-quality
```

## Troubleshooting

### Port Already in Use

If you get "Address already in use" error:

1. Check if Docker containers are running:
   ```bash
   docker ps
   ```

2. Stop the conflicting container:
   ```bash
   docker stop fifa-tracker-backend
   # or
   docker-compose -f docker-compose.local.yml down
   ```

3. Or run on a different port:
   ```bash
   uvicorn main:app --reload --port 8001
   ```

### MongoDB Connection Issues

- Ensure your IP is whitelisted in MongoDB Atlas
- Check your connection string in `.env.dev` or `.env.prod` (depending on your environment)
- Verify network connectivity

### Frontend API Connection Issues

- Ensure backend is running on `http://localhost:8000`
- Check `NEXT_PUBLIC_API_BASE_URL_LOCAL` in `.env.local`
- Clear browser cache and cookies

## Features

- User authentication (JWT + Google OAuth)
- Match tracking and statistics
- Tournament management
- Player ELO ratings
- Head-to-head statistics
- Team performance tracking
- Real-time updates

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and tests
4. Submit a pull request

## License

[Your License Here]
