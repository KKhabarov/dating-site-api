# ConnectHub - Professional Networking API

A complete backend API for ConnectHub, a professional networking platform built with Node.js, Express, TypeScript, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Security**: Helmet.js, CORS, Rate Limiting

## Features

- 🔐 JWT-based authentication with secure password hashing
- 👥 User profile management with interests, skills, and goals
- 🤝 Connection system (send, accept, decline connection requests)
- 💬 Real-time messaging between connected users
- ❤️ Like/unlike user profiles
- 📸 Photo management with custom ordering
- 🎯 Smart matching algorithm based on shared interests and skills
- 🔍 User search and discovery
- 🛡️ Security features including rate limiting and CORS
- ✅ Input validation on all endpoints
- 📄 Comprehensive error handling

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd dating-site-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/connecthub?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3000"
```

## Database Setup

1. **Create PostgreSQL database**

```bash
createdb connecthub
```

Or using PostgreSQL CLI:

```sql
CREATE DATABASE connecthub;
```

2. **Run Prisma migrations**

```bash
npm run db:migrate
```

This will create all the necessary tables in your database.

3. **Generate Prisma Client**

```bash
npx prisma generate
```

4. **Seed the database (optional)**

Add sample data for testing:

```bash
npm run db:seed
```

This creates 10 sample users with:
- Email: `alice@example.com`, `bob@example.com`, etc.
- Password: `password123` (for all test users)

## Running the Server

**Development mode** (with hot reload):

```bash
npm run dev
```

**Production mode**:

```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or the PORT specified in .env).

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Returns: `{ user, token }`

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### User Endpoints

All user endpoints require authentication (Bearer token).

#### Browse Users
```http
GET /api/users?page=1&limit=20&interests=coding,hiking&skills=JavaScript
Authorization: Bearer <token>
```

Query parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `interests` (optional): Comma-separated list of interests
- `skills` (optional): Comma-separated list of skills

#### Get User Profile
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update Own Profile
```http
PUT /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "bio": "Software engineer...",
  "location": "San Francisco, CA",
  "interests": ["coding", "hiking"],
  "skills": ["JavaScript", "TypeScript"],
  "goals": "Looking to connect with other developers"
}
```

#### Get Suggested Matches
```http
GET /api/users/matches?limit=10
Authorization: Bearer <token>
```

Matching algorithm score calculation:
- Shared interests: 10 points each
- Shared skills: 15 points each
- Location match: 5 points

#### Search Users
```http
GET /api/users/search?q=engineer&page=1&limit=20
Authorization: Bearer <token>
```

### Connection Endpoints

#### Get Connections
```http
GET /api/connections?status=ACCEPTED
Authorization: Bearer <token>
```

Query parameters:
- `status` (optional): Filter by status (PENDING, ACCEPTED, DECLINED)

#### Send Connection Request
```http
POST /api/connections
Authorization: Bearer <token>
Content-Type: application/json

{
  "toUserId": "user-uuid"
}
```

#### Accept/Decline Connection
```http
PUT /api/connections/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "ACCEPTED"  // or "DECLINED"
}
```

#### Delete Connection
```http
DELETE /api/connections/:id
Authorization: Bearer <token>
```

### Message Endpoints

#### Get All Conversations
```http
GET /api/messages/conversations
Authorization: Bearer <token>
```

Returns conversations with unread counts.

#### Get Conversation with User
```http
GET /api/messages/:userId?page=1&limit=50
Authorization: Bearer <token>
```

#### Send Message
```http
POST /api/messages/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello! How are you?"
}
```

#### Mark Message as Read
```http
PUT /api/messages/:id/read
Authorization: Bearer <token>
```

### Like Endpoints

#### Like User
```http
POST /api/likes/:userId
Authorization: Bearer <token>
```

#### Unlike User
```http
DELETE /api/likes/:userId
Authorization: Bearer <token>
```

#### Get Likes Given
```http
GET /api/likes/given
Authorization: Bearer <token>
```

#### Get Likes Received
```http
GET /api/likes/received
Authorization: Bearer <token>
```

### Photo Endpoints

#### Upload Photo
```http
POST /api/photos
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://example.com/photo.jpg",
  "filename": "photo.jpg"
}
```

#### Delete Photo
```http
DELETE /api/photos/:id
Authorization: Bearer <token>
```

#### Reorder Photos
```http
PUT /api/photos/reorder
Authorization: Bearer <token>
Content-Type: application/json

{
  "photoIds": ["photo-uuid-1", "photo-uuid-2", "photo-uuid-3"]
}
```

## Response Format

### Success Response
```json
{
  "status": "success",
  "data": {
    // response data
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

## HTTP Status Codes

- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST (resource created)
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: 7-day token expiration
- **Rate Limiting**: 5 authentication attempts per 15 minutes
- **CORS**: Configurable origin whitelist
- **Helmet.js**: Security headers
- **Input Validation**: Zod schemas for all inputs

## Project Structure

```
dating-site-api/
├── src/
│   ├── controllers/       # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── connection.controller.ts
│   │   ├── message.controller.ts
│   │   ├── like.controller.ts
│   │   └── photo.controller.ts
│   ├── routes/           # Route definitions
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── connection.routes.ts
│   │   ├── message.routes.ts
│   │   ├── like.routes.ts
│   │   └── photo.routes.ts
│   ├── services/         # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── connection.service.ts
│   │   ├── message.service.ts
│   │   ├── like.service.ts
│   │   └── matching.service.ts
│   ├── middleware/       # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── utils/           # Utility functions
│   │   ├── errors.ts
│   │   └── validators.ts
│   ├── config/          # Configuration
│   │   └── database.ts
│   ├── types/           # TypeScript types
│   │   └── express.d.ts
│   └── index.ts         # Application entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seed script
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json        # TypeScript configuration
├── .eslintrc.json       # ESLint configuration
├── .prettierrc          # Prettier configuration
└── README.md
```

## Database Schema

### User
- id (UUID, Primary Key)
- email (String, Unique)
- passwordHash (String)
- name (String)
- avatar (String, Optional)
- bio (String, Optional)
- location (String, Optional)
- interests (String[])
- skills (String[])
- goals (String, Optional)
- createdAt (DateTime)
- updatedAt (DateTime)

### Connection
- id (UUID, Primary Key)
- fromUserId (UUID, Foreign Key)
- toUserId (UUID, Foreign Key)
- status (PENDING | ACCEPTED | DECLINED)
- createdAt (DateTime)
- updatedAt (DateTime)

### Message
- id (UUID, Primary Key)
- fromUserId (UUID, Foreign Key)
- toUserId (UUID, Foreign Key)
- content (String)
- read (Boolean)
- createdAt (DateTime)

### Like
- id (UUID, Primary Key)
- fromUserId (UUID, Foreign Key)
- toUserId (UUID, Foreign Key)
- createdAt (DateTime)

### Photo
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- url (String)
- filename (String)
- order (Int)
- createdAt (DateTime)

## Development Tools

### Prisma Studio

Explore and edit your database with a visual interface:

```bash
npm run db:studio
```

Opens at `http://localhost:5555`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.
