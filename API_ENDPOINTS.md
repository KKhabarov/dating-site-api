# API Endpoints Reference

Base URL: `http://localhost:3000/api`

## Authentication Endpoints

### POST /api/auth/register
Register a new user
- **Body**: `{ email, password, name }`
- **Returns**: `{ user, token }`
- **Rate Limited**: 5 requests / 15 minutes

### POST /api/auth/login
Login user
- **Body**: `{ email, password }`
- **Returns**: `{ user, token }`
- **Rate Limited**: 5 requests / 15 minutes

### GET /api/auth/me
Get current user profile
- **Auth**: Required
- **Returns**: `{ user }`

### POST /api/auth/logout
Logout user
- **Auth**: Required
- **Returns**: Success message

---

## User Endpoints

All require authentication.

### GET /api/users
Browse users with filters
- **Query**: `?page=1&limit=20&interests=coding&skills=JavaScript`
- **Returns**: Paginated user list

### GET /api/users/:id
Get user profile by ID
- **Returns**: User profile with photos

### PUT /api/users/me
Update own profile
- **Body**: `{ name?, bio?, location?, interests?, skills?, goals? }`
- **Returns**: Updated user profile

### GET /api/users/matches
Get suggested matches
- **Query**: `?limit=10`
- **Returns**: Users sorted by match score

### GET /api/users/search
Search users
- **Query**: `?q=searchterm&page=1&limit=20`
- **Returns**: Paginated search results

---

## Connection Endpoints

All require authentication.

### GET /api/connections
Get user connections
- **Query**: `?status=ACCEPTED`
- **Returns**: List of connections

### POST /api/connections
Send connection request
- **Body**: `{ toUserId }`
- **Returns**: Created connection

### PUT /api/connections/:id
Accept/decline connection
- **Body**: `{ status: "ACCEPTED" | "DECLINED" }`
- **Returns**: Updated connection

### DELETE /api/connections/:id
Remove connection
- **Returns**: Success message

---

## Message Endpoints

All require authentication.

### GET /api/messages/conversations
Get all conversations
- **Returns**: Conversations with unread counts

### GET /api/messages/:userId
Get conversation with user
- **Query**: `?page=1&limit=50`
- **Returns**: Paginated messages

### POST /api/messages/:userId
Send message to user
- **Body**: `{ content }`
- **Returns**: Created message

### PUT /api/messages/:id/read
Mark message as read
- **Returns**: Updated message

---

## Like Endpoints

All require authentication.

### POST /api/likes/:userId
Like a user
- **Returns**: Created like

### DELETE /api/likes/:userId
Unlike a user
- **Returns**: Success message

### GET /api/likes/given
Get likes given by current user
- **Returns**: List of likes

### GET /api/likes/received
Get likes received by current user
- **Returns**: List of likes

---

## Photo Endpoints

All require authentication.

### POST /api/photos
Upload photo
- **Body**: `{ url, filename }`
- **Returns**: Created photo

### DELETE /api/photos/:id
Delete photo
- **Returns**: Success message

### PUT /api/photos/reorder
Reorder photos
- **Body**: `{ photoIds: ["id1", "id2", "id3"] }`
- **Returns**: Updated photos list

---

## Response Format

### Success
```json
{
  "status": "success",
  "data": { ... }
}
```

### Error
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
