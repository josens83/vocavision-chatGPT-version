# VocaVision - Quick Start Guide

Welcome to VocaVision, your comprehensive English vocabulary learning platform! This guide will help you get started quickly.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Setup](#database-setup)
4. [Running the Application](#running-the-application)
5. [Features Overview](#features-overview)
6. [API Endpoints](#api-endpoints)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **npm** (v10 or higher)
- **PostgreSQL** (v14 or higher)
- **Git**

### Optional for Mobile Development

- **Expo CLI** (`npm install -g expo-cli`)
- **React Native** development environment
- iOS Simulator (Mac only) or Android Emulator

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/josens83/vocavision.git
cd vocavision
```

### 2. Install Dependencies

Install dependencies for all packages (backend, web, mobile):

```bash
# Install backend dependencies
cd backend
npm install

# Install web dependencies
cd ../web
npm install

# Install mobile dependencies (optional)
cd ../mobile
npm install
```

## Database Setup

### 1. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE vocavision;

# Exit psql
\q
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cat > .env << EOF
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/vocavision?schema=public"

# JWT Secret (change in production)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# OpenAI API (optional - for AI features)
OPENAI_API_KEY="your-openai-api-key"

# Stripe (optional - for payment features)
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Server
PORT=3001
NODE_ENV=development
EOF
```

Create a `.env.local` file in the `web` directory:

```bash
cd ../web
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
EOF
```

### 3. Run Database Migrations

```bash
cd backend
npx prisma migrate dev
```

### 4. Seed the Database

Populate the database with 101 vocabulary words, collections, and achievements:

```bash
npm run seed
```

You should see output like:
```
🌱 Starting extended database seed...
✅ Created word: happy
✅ Created word: friend
...
📊 Total words created: 101
📚 Collections created: 4
🏆 Achievements created: 9
```

## Running the Application

### Backend Server

```bash
cd backend
npm run dev
```

The backend API will be available at `http://localhost:3001`

### Web Application

In a new terminal:

```bash
cd web
npm run dev
```

The web app will be available at `http://localhost:3000`

### Mobile Application (Optional)

In a new terminal:

```bash
cd mobile
npm start
```

Follow the Expo CLI instructions to run on iOS Simulator or Android Emulator.

## Features Overview

### 🎯 Learning Features

1. **Flashcard Learning**
   - Interactive card flipping with smooth animations
   - Multi-tab view (Definition, Images, Mnemonics, Etymology)
   - 5-level rating system (Again, Hard, Good, Easy, Perfect)
   - Spaced repetition algorithm (SM-2)

2. **Quiz Mode**
   - 3 quiz types: Mixed, Definition→Word, Word→Definition
   - 10 random questions per quiz
   - Real-time scoring with visual feedback
   - Multiple-choice questions

3. **Word Explorer**
   - Search and filter by difficulty level
   - Browse 101 curated words (Beginner to Expert)
   - Detailed word pages with all learning methods

4. **Bookmarks**
   - Save favorite words for later review
   - Add personal notes to bookmarks
   - Quick access from dashboard

5. **Daily Goals**
   - Set personalized daily word learning targets
   - Visual progress tracking with progress bar
   - Celebration when goals are achieved

6. **Learning History**
   - View all review sessions
   - Filter by date range (Today, Week, Month, All)
   - Track learning method usage and ratings

### 📊 Progress Tracking

- **Statistics Dashboard**
  - Total words learned
  - Current streak tracking
  - Longest streak records
  - Due reviews counter

- **User Profile**
  - Profile management
  - Password changes
  - Subscription status

### 💳 Subscription Plans

- **Free Plan**: Limited features
- **Trial**: 7-day free trial
- **Monthly**: $9.99/month
- **Yearly**: $99.99/year (Save 17%)

### 🎓 Learning Methods

1. **Images**: Visual learning with curated images
2. **Videos**: Video explanations (coming soon)
3. **Rhyming**: Phonetic patterns and rhymes
4. **Mnemonics**: Memory techniques and tricks
5. **Etymology**: Word origins and evolution
6. **Spaced Repetition**: Scientifically proven SM-2 algorithm

## API Endpoints

### Authentication

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
GET    /api/auth/profile           Get user profile
PATCH  /api/users/profile          Update profile
POST   /api/users/change-password  Change password
```

### Words

```
GET    /api/words                  Get all words (with filters)
GET    /api/words/:id              Get word details
GET    /api/words/search           Search words
```

### Progress & Learning

```
GET    /api/progress               Get user progress
GET    /api/progress/due           Get due reviews
GET    /api/progress/history       Get review history
POST   /api/progress/review        Submit review
POST   /api/progress/session/start Start study session
POST   /api/progress/session/end   End study session
```

### Bookmarks

```
GET    /api/bookmarks              Get all bookmarks
POST   /api/bookmarks              Add bookmark
DELETE /api/bookmarks/:wordId      Remove bookmark
PATCH  /api/bookmarks/:wordId      Update bookmark notes
```

### Goals

```
GET    /api/goals/daily            Get daily goal status
POST   /api/goals/daily            Set daily goal
POST   /api/goals/progress         Update daily progress
```

### Subscriptions

```
GET    /api/subscriptions/status   Get subscription status
POST   /api/subscriptions/cancel   Cancel subscription
POST   /api/subscriptions/checkout Create checkout session
```

## Troubleshooting

### Database Connection Issues

**Problem**: `Error: Can't reach database server`

**Solution**:
1. Ensure PostgreSQL is running: `pg_ctl status`
2. Check your DATABASE_URL in `.env`
3. Verify database exists: `psql -U postgres -l`

### Port Already in Use

**Problem**: `EADDRINUSE: address already in use :::3001`

**Solution**:
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9
```

### Prisma Migration Errors

**Problem**: Migration fails

**Solution**:
```bash
# Reset database (WARNING: Deletes all data)
cd backend
npx prisma migrate reset

# Then seed again
npm run seed
```

### Web App Can't Connect to Backend

**Problem**: API calls failing

**Solution**:
1. Check backend is running on port 3001
2. Verify `NEXT_PUBLIC_API_URL` in `web/.env.local`
3. Check browser console for CORS errors

### Seed Script Errors

**Problem**: Duplicate key errors during seeding

**Solution**:
```bash
# Clear database and reseed
cd backend
npx prisma migrate reset --force
npm run seed
```

## Development Tips

### Hot Reload

Both backend and web support hot reload:
- **Backend**: Uses `ts-node-dev` for automatic restart
- **Web**: Next.js Fast Refresh

### Database Inspection

Use Prisma Studio to inspect your database:

```bash
cd backend
npx prisma studio
```

Opens at `http://localhost:5555`

### TypeScript Checking

```bash
# Backend
cd backend
npm run build

# Web
cd web
npm run build
```

### Linting

```bash
# Web
cd web
npm run lint
```

## Next Steps

1. **Explore the Dashboard**: Navigate to `http://localhost:3000/dashboard` after logging in
2. **Start Learning**: Click "학습 시작" to begin your first flashcard session
3. **Try a Quiz**: Test your knowledge with the quiz mode
4. **Set Daily Goals**: Customize your learning target in the daily goal widget
5. **Browse Words**: Explore all 101 words in the word explorer

## Getting Help

- **Documentation**: Check `/docs` directory for detailed docs
- **Issues**: Report bugs on GitHub Issues
- **API Docs**: Full API documentation available in `backend/README.md`

## Production Deployment

For production deployment instructions, see `DEPLOYMENT.md` (coming soon).

---

**Happy Learning! 📚✨**

VocaVision - Master English Vocabulary with AI-Powered Learning
