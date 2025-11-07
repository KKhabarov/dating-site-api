# Quick Start Guide

## Prerequisites
- Node.js v18+
- PostgreSQL v14+
- npm

## Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

### 3. Setup Database
```bash
# Create PostgreSQL database
createdb connecthub

# Run migrations
npm run db:migrate

# Seed sample data (optional)
npm run db:seed
```

### 4. Generate Prisma Client
```bash
npx prisma generate
```

### 5. Start Development Server
```bash
npm run dev
```

Server will start on http://localhost:3000

## Test the API

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Copy the `token` from the response and use it in subsequent requests:

### Get Current User
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Sample Data

If you ran `npm run db:seed`, you have 10 test users:
- Email: alice@example.com, bob@example.com, carol@example.com, etc.
- Password: password123 (for all)

## Development Tools

### Prisma Studio (Database GUI)
```bash
npm run db:studio
```
Opens at http://localhost:5555

### Build for Production
```bash
npm run build
npm start
```

## Next Steps
- See README.md for full API documentation
- Configure environment variables for production
- Set up proper PostgreSQL database
- Configure CORS for your frontend
