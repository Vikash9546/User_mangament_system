# User Management System

A production-quality User Management System built with Node.js, Express, Prisma, MySQL, React, and Vite.

## Architecture

This is a monorepo containing:
- `backend/`: Node.js Express API.
- `frontend/`: React Vite SPA.

### Backend Architecture
- **Layered Architecture**: Controller -> Service -> Repository.
- **Validation**: Zod schema validation.
- **Database**: Prisma ORM with MySQL.
- **Pagination**: Cursor-based pagination.
- **Security**: Helmet, Express-Rate-Limit, CORS.
- **Logging**: Winston logger.
- **API Docs**: Swagger UI.

### Frontend Architecture
- **Framework**: React with Vite.
- **State Management**: TanStack Query (React Query) for data fetching, caching, and infinite loading.
- **Styling**: Tailwind CSS.
- **Routing**: React Router.

## Setup Instructions

### Backend Setup
1. `cd backend`
2. `npm install`
3. The `.env` file should contain your `DATABASE_URL`.
4. `npx prisma generate` (Assuming DB is already pushed or migrated)
5. `npm run dev` to start the server.

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev` to start the UI.

## Testing
- Run `cd backend && npm test` to execute Jest unit tests with Supertest API tests.

## API Documentation
Once the backend is running, visit:
`http://localhost:5000/api-docs`

## Pagination Strategy
We use cursor-based pagination for high-performance listing of large datasets. The frontend uses `useInfiniteQuery` to handle infinite scrolling/loading of next pages automatically.
