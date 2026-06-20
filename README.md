# User Management System

A production-ready, full-stack User Management application featuring a highly responsive frontend and a robust, secure backend architecture.

Built with React, Vite, Node.js, Express, Prisma, and MySQL.

![User Management System Demo](https://github.com/Vikash9546/User_mangament_system/assets/placeholder)

## System Design

The application follows a strictly layered, decoupled architecture to ensure separation of concerns, scalability, and maintainability.

```mermaid
graph TD
    Client[React SPA Frontend]
    
    subgraph Backend API
        Router[Express Routers]
        Controller[Controllers - Request Handling]
        Validator[Zod Schema Validators]
        Service[Services - Business Logic]
        Repository[Repositories - Data Access]
    end
    
    Database[(MySQL Database)]
    Prisma[Prisma ORM]

    Client -->|REST over HTTP/HTTPS| Router
    Router --> Controller
    Controller --> Validator
    Validator --> Controller
    Controller --> Service
    Service --> Repository
    Repository --> Prisma
    Prisma <--> Database
```

## Backend Architecture Detail

The backend is built with Node.js and Express, heavily focusing on performance, data integrity, and strict validation.

### Layered Architecture
- **Controllers**: Responsible strictly for receiving HTTP requests, passing data to the service layer, and returning the standardized HTTP response.
- **Services**: Contains the core business logic. This layer computes data, enforces business rules, and remains entirely agnostic of the HTTP context.
- **Repositories**: Encapsulates all database queries. The service layer interacts with the repository layer rather than calling Prisma directly, making the system highly testable and loosely coupled.

### Advanced Validation and Security
- **Verhoeff Algorithm**: Aadhaar numbers are not merely validated via regular expressions. The system implements the mathematical Verhoeff checksum algorithm to ensure the structural integrity of the submitted Aadhaar number.
- **Zod Schema Validation**: All incoming request payloads (body, query parameters) are strictly validated against complex Zod schemas before reaching the controller.
- **Sensitive Data Masking**: Personally Identifiable Information such as Aadhaar and PAN numbers are masked at the service level before being returned to the client. Full numbers are never exposed over public APIs (e.g., XXXXXXXX9012).
- **Secure Logging**: Winston logger is configured to prevent logging sensitive fields in plain text.

### Performance and Data Handling
- **Cursor-Based Pagination**: Instead of offset-based pagination (which degrades in performance over large datasets), the system utilizes cursor-based pagination for rapid retrieval of sequential user records.
- **Prisma ORM**: Type-safe database interactions with comprehensive schema management and migrations.

## Technology Stack

### Backend
- Node.js & Express
- TypeScript
- Prisma ORM
- MySQL
- Zod (Validation)
- Jest & Supertest (Testing)
- Winston (Logging)
- Swagger (API Documentation)

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- TanStack React Query
- React Router v6

## Setup Instructions

### 1. Database Setup
Ensure you have a MySQL instance running. You can use a local server or a cloud provider.

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a .env file in the backend directory:
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
PORT=5000
```
Run migrations and start the server:
```bash
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a .env file in the frontend directory:
```env
VITE_API_URL="http://localhost:5000"
```
Start the development server:
```bash
npm run dev
```

## API Documentation

Once the backend server is running, interactive API documentation is automatically generated using Swagger UI.
Visit: http://localhost:5000/api-docs

## Security Considerations

- **Transport Security**: It is strongly recommended to enforce HTTPS / TLS 1.2+ in production environments to protect data in transit.
- **Rate Limiting & Helmet**: The API is protected with Express-Rate-Limit to prevent abuse, and Helmet to secure HTTP headers.

## Testing
The backend is fully covered with unit tests and API integration tests using Jest and Supertest.
```bash
cd backend
npm test
```
