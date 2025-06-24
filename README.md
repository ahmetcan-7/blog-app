# Personal Blog API

A NestJS-based backend API for a personal blog application with PostgreSQL, Redis caching, and Keycloak authentication.

## Features

- 🏗️ Clean Architecture with NestJS
- 🔐 Keycloak Authentication & Authorization
- 💾 PostgreSQL Database with TypeORM
- 🚀 Redis Caching
- 📝 Blog Posts Management
- 👤 User Management
- 🛠️ CLI Tools
- 📚 Swagger API Documentation

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- Redis
- Keycloak Server
- pnpm

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd personal-blog
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=personal_blog

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Keycloak
KEYCLOAK_AUTH_SERVER_URL=http://localhost:8080/auth
KEYCLOAK_REALM=personal-blog
KEYCLOAK_CLIENT_ID=blog-api
KEYCLOAK_SECRET=your-secret-key

# Security
JWT_SECRET=your-jwt-secret
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

4. Start the development server:

```bash
pnpm run start:dev
```

## API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/api
```

## CLI Commands

The application includes several CLI commands for managing content:

```bash
# Generate a new blog post
pnpm run cli generate:post

# List all posts
pnpm run cli list:posts

# Generate a new project
pnpm run cli generate:project

# List all projects
pnpm run cli list:projects
```

## Project Structure

```
src/
├── auth/           # Authentication & Authorization
├── blog/           # Blog-related features
│   ├── posts/     # Blog posts
│   ├── projects/  # Projects
│   └── users/     # User management
├── cache/         # Redis caching
├── cli/           # CLI commands
├── common/        # Shared utilities
└── config/        # Configuration
```

## Development

- Run tests: `pnpm run test`
- Run e2e tests: `pnpm run test:e2e`
- Build: `pnpm run build`
- Start production: `pnpm run start:prod`

## License

MIT
