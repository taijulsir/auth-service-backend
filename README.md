# Auth Boilerplate - Backend

This is the backend repository for the Authentication Boilerplate. It is a secure Node.js/Express API handling JWT authentication, refresh token rotation, and RBAC.

## Features

- **JWT Authentication**: Short-lived Access Tokens (15m), Long-lived Refresh Tokens (7d).
- **Secure Cookies**: Refresh tokens stored in HTTP-Only, Secure, SameSite=None cookies.
- **Token Rotation**: Refresh tokens are rotated on use. Reuse detection invalidates all user tokens.
- **RBAC**: Role-Based Access Control middleware.
- **Security**: 
  - `bcrypt` for password hashing.
  - `cors` with credentials support.
  - `helmet` (recommended, not installed by default in this boilerplate to keep it simple, but good practice).

## Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or Atlas)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Duplicate `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```
   *Note: `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` should be generated using `openssl rand -hex 64` in production.*

3. **Run the Server**
   ```bash
   # Development (requires nodemon)
   npm run dev
   
   # Production
   npm start
   ```
   Server runs on `http://localhost:3500`.

## API Endpoints

- `POST /auth/register` - { user, pwd }
- `POST /auth/login` - { user, pwd }
- `GET /auth/refresh` - Refresh access token (requires cookie)
- `GET /auth/logout` - Logout (clears cookie)
- `GET /users` - Get all users (Admin only)
