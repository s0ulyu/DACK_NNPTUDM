# Backend Implementation by Pham Tuyen

## Overview
Complete backend implementation for Task and Habit Gamification System including user authentication, authorization, and profile management.

## Features Implemented

### 1. Authentication System
- **JWT (JSON Web Token)** based authentication
- Token generation with expiration
- Secure token validation on protected routes
- Token refresh mechanisms

### 2. User Registration & Login
- POST `/api/auth/register` - User registration with bcrypt password hashing
- POST `/api/auth/login` - User login with password verification
- Email validation and uniqueness checking
- Automatic leaderboard creation on registration

### 3. Middleware Security
- **Auth Middleware** (`src/middlewares/auth.js`)
  - JWT token extraction and verification
  - Automatic user data attachment to requests
  - 401 Unauthorized error handling
  
- **Role Check Middleware** (`src/middlewares/roleCheck.js`)
  - Role-based access control (Admin/User)
  - 403 Forbidden error handling for unauthorized roles

### 4. User Management
- **GET `/api/user/profile`** - Retrieve user profile with role information
- **PUT `/api/user/profile`** - Update user information (full_name, email)
- **POST `/api/user/avatar`** - Upload user avatar with Multer
- File storage management
- Automatic cleanup of old avatar files

### 5. Database Models

#### User Model
```javascript
- id: Integer (PK)
- full_name: String (required)
- email: String (unique, required)
- password: String (hashed with bcrypt)
- avatar: String (file path)
- role_id: Integer (default: 2 = user)
- total_points: Integer (default: 0)
- level: Integer (default: 1)
- timestamps: created_at, updated_at
```

#### Role Model
```javascript
- id: Integer (PK)
- name: String (unique) - 'admin' or 'user'
```

### 6. File Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js         - Database connection
│   │   └── multer.js           - File upload configuration
│   ├── controllers/
│   │   ├── authController.js   - Auth logic (register/login in routes)
│   │   └── userController.js   - User management (profile, avatar)
│   ├── middlewares/
│   │   ├── auth.js             - JWT validation
│   │   ├── roleCheck.js        - Role authorization
│   │   └── errorHandler.js     - Global error handling
│   ├── models/
│   │   ├── User.js             - User schema
│   │   ├── Role.js             - Role schema
│   │   ├── Task.js             - Task model (for future use)
│   │   ├── Habit.js            - Habit model (for future use)
│   │   ├── Category.js         - Category model
│   │   ├── Reward.js           - Reward model
│   │   ├── PointLog.js         - Points logging
│   │   ├── Leaderboard.js      - Leaderboard model
│   │   ├── Notification.js     - Notification model
│   │   └── index.js            - Model associations
│   ├── routes/
│   │   ├── authRoutes.js       - Auth endpoints
│   │   ├── userRoutes.js       - User endpoints
│   │   └── index.js            - Route aggregation
│   ├── utils/
│   │   └── responseHelper.js   - Standard API responses
│   ├── sockets/
│   │   └── index.js            - WebSocket integration
│   └── server.js               - Express app setup
├── uploads/
│   ├── avatars/                - User avatar storage
│   └── rewards/                - Reward image storage
├── .env.example                - Environment template
├── package.json                - Dependencies
└── server.js                   - Entry point
```

### 7. Security Features
- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ JWT token with expiration
- ✅ Role-based access control
- ✅ Input validation and sanitization
- ✅ Error handling without exposing sensitive info
- ✅ File upload validation (image types only)
- ✅ File size limits (2MB for avatars, 5MB for rewards)

### 8. API Endpoints

#### Authentication Routes
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
```

#### User Routes (Protected)
```
GET    /api/user/profile       - Get user profile
PUT    /api/user/profile       - Update profile
POST   /api/user/avatar        - Upload avatar
```

### 9. Environment Variables
```
DATABASE_URL      - SQLite database path
JWT_SECRET        - JWT signing secret
JWT_EXPIRES_IN    - Token expiration time
PORT              - Server port (default: 8080)
NODE_ENV          - Environment (development/production)
```

### 10. Dependencies
- express: Web framework
- sequelize: ORM
- sqlite3: Database
- bcryptjs: Password hashing
- jsonwebtoken: JWT handling
- multer: File uploads
- dotenv: Environment variables
- cors: Cross-Origin Resource Sharing
- socket.io: Real-time communication

## Testing Endpoints

### Register
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "full_name": "Pham Tuyen",
  "email": "tuyen@example.com",
  "password": "password123"
}
```

### Login
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "tuyen@example.com",
  "password": "password123"
}
```

### Get Profile
```bash
GET http://localhost:8080/api/user/profile
Authorization: Bearer <jwt_token>
```

### Upload Avatar
```bash
POST http://localhost:8080/api/user/avatar
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

Form-data:
  avatar: <image_file>
```

## Completion Status
✅ User Authentication (Register/Login)
✅ JWT Token Management
✅ Auth Middleware
✅ Role-Based Authorization
✅ User Profile Management
✅ Avatar Upload & Management
✅ Error Handling
✅ Database Models
✅ Security Best Practices
✅ API Documentation
