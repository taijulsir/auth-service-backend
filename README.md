# Auth Backend API

A secure, production-ready authentication backend built with Node.js, Express, TypeScript, and MongoDB. Implements JWT-based authentication with access and refresh token rotation, role-based access control (RBAC), and comprehensive security middleware.

## Features

### 🔐 Security
- **JWT Authentication**: Short-lived Access Tokens (15m), Long-lived Refresh Tokens (7d)
- **Secure Cookies**: Refresh tokens stored in httpOnly, Secure, SameSite=None cookies
- **Token Rotation**: Refresh tokens rotated on use with reuse detection
- **Rate Limiting**: Auth endpoints protected (10 req/15min per IP)
- **Helmet**: Security headers enabled
- **Password Hashing**: bcrypt with appropriate cost factor
- **Environment Validation**: Required secrets validated at startup
- **Request Tracing**: Correlation IDs for debugging

### 🎯 Authentication & Authorization
- User registration and login
- Role-based access control (User, Editor, Admin)
- Token refresh mechanism
- Secure logout with token invalidation

### 🛠️ Code Quality & DevOps
- TypeScript for type safety
- Comprehensive test suite (Jest + Supertest)
- Integration and unit tests with coverage
- ESLint for code quality
- CI/CD pipeline with GitHub Actions
- Health and readiness endpoints (`/health`, `/health/ready`)
- Structured JSON logging (Winston)

## Prerequisites

- Node.js (v18+ or v20+)
- MongoDB (v5.0+, running locally or Atlas)
- npm

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   
   Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```
   
   Required variables:
   ```bash
   PORT=3500
   NODE_ENV=development
   DATABASE_URI=mongodb://localhost:27017/auth-db
   ACCESS_TOKEN_SECRET=your-access-secret-here
   REFRESH_TOKEN_SECRET=your-refresh-secret-here
   ```
   
   **Generate secure secrets:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Run the Server**
   ```bash
   # Development (with hot-reload)
   npm run dev
   
   # Production
   npm run build
   npm start
   ```
   
   Server runs on `http://localhost:3500`.

## Testing

```bash
# Run all tests with coverage
npm test

# Watch mode for development
npm run test:watch

# CI mode (for GitHub Actions)
npm run test:ci
```

## Code Quality

```bash
# Lint code
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Type checking
npm run typecheck

# Build
npm run build
```

## API Endpoints

### Health
- `GET /health` - Basic health check
- `GET /health/ready` - Readiness check (DB status)

### Consumer Auth (Public)
- `POST /api/v1/consumer/auth/register` - Register new user
- `POST /api/v1/consumer/auth/login` - Login (email, pwd)
- `POST /api/v1/consumer/auth/refresh` - Refresh access token
- `POST /api/v1/consumer/auth/logout` - Logout

### Admin Auth (Public)
- `POST /api/v1/admin/auth/login` - Admin login
- `POST /api/v1/admin/auth/refresh` - Admin refresh
- `POST /api/v1/admin/auth/logout` - Admin logout

### Protected Admin Routes
- `GET /api/v1/admin/users` - Get all users (Admin only)

**Note**: All auth endpoints are rate-limited.

## Project Structure

```
backend/
├── src/
│   ├── config/          # Config (DB, CORS, roles)
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Middleware (auth, rate limit, helmet)
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── utils/           # Logger, env validation
├── tests/               # Test suites
│   ├── setup.ts
│   ├── auth.integration.test.ts
│   └── env.unit.test.ts
├── .eslintrc.cjs        # ESLint config
├── jest.config.ts       # Jest config
├── tsconfig.json        # TypeScript config
└── package.json
```

## CI/CD

GitHub Actions runs on push/PR to `main`/`develop`:
1. Install dependencies
2. Lint
3. Type check
4. Run tests with coverage
5. Build

## Security Notes

- Never commit `.env` file
- Use strong random JWT secrets (64+ chars)
- Enable HTTPS in production
- Configure CORS for your domain
- Rotate secrets regularly
- Monitor rate limits and logs

## Troubleshooting

**MongoDB connection issues:**
```bash
# Check MongoDB is running
mongosh

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

**Port in use:**
```bash
lsof -i :3500
kill -9 <PID>
# Or change PORT in .env
```

## Future Enhancements

- OpenAPI/Swagger docs
- Password reset flow
- Email verification
- Sentry error tracking
- Prometheus metrics
- Redis caching
- Docker & Kubernetes manifests
- `GET /users` - Get all users (Admin only)
