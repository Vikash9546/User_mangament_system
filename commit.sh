#!/bin/bash
git add backend/package.json backend/package-lock.json backend/tsconfig.json backend/jest.config.js
git commit -m "chore: initialize backend project and dependencies"

git add backend/prisma/schema.prisma backend/.env
git commit -m "feat: setup prisma schema and database configuration"

git add backend/src/config
git commit -m "feat: add backend configuration and swagger setup"

git add backend/src/utils
git commit -m "feat: add utilities for logging, response, and cursor"

git add backend/src/middleware
git commit -m "feat: add error and validation middlewares"

git add backend/src/modules/users/user.types.ts backend/src/modules/users/user.validation.ts
git commit -m "feat: add user types and zod validation schemas"

git add backend/src/modules/users/user.repository.ts
git commit -m "feat: implement user repository"

git add backend/src/modules/users/user.service.ts
git commit -m "feat: implement user service with business logic"

git add backend/src/modules/users/user.controller.ts backend/src/modules/users/user.routes.ts
git commit -m "feat: add user controller and routes"

git add backend/src/app.ts backend/src/server.ts
git commit -m "feat: setup express application and server entry point"

git add backend/tests
git commit -m "test: add user service unit tests"

git add frontend/package.json frontend/package-lock.json frontend/tailwind.config.js frontend/postcss.config.js frontend/src/index.css frontend/src/main.tsx frontend/src/App.tsx
git commit -m "chore: initialize frontend react app with tailwind css"

git add frontend/src/api
git commit -m "feat: add frontend api services for users"

git add frontend/src/pages/UsersPage.tsx
git commit -m "feat: implement users dashboard with cursor pagination"

git add frontend/src/pages/CreateUserPage.tsx frontend/src/pages/EditUserPage.tsx frontend/src/pages/UserDetailsPage.tsx
git commit -m "feat: add pages for user creation, editing, and details"

git add README.md
git commit -m "docs: add project documentation"

git add .
git commit -m "chore: commit remaining setup and artifact files"

git push origin main
