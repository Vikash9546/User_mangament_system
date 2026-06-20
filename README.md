# User Management System

A production-ready, full-stack User Management application featuring a highly responsive, aesthetically stunning UI and a robust, secure backend. 

Built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, **Prisma**, and **MySQL**.

[User Management System Demo] (https://user-mangament-system.vercel.app/)

## Key Features

### Frontend (UI/UX)
- **Stunning UI**: A gorgeous, premium 30% pink and 70% white aesthetic with custom subtle background gradients on cards.
- **Dark Mode Support**: A fully functional, explicit Light/Dark mode toggle that gracefully overrides OS defaults.
- **Mobile Responsive**: Includes a dedicated sliding hamburger menu and responsive padding/font scaling for seamless mobile experiences.
- **Animated States**: Engaging, animated loading screens (with cycling emoji expressions) and sleek hover micro-interactions on tables and buttons.
- **Real-Time Validations**: Instant feedback for Aadhaar, PAN, and Mobile Number validation states.
- **Infinite Scrolling**: Cursor-based infinite scrolling implemented via TanStack Query for effortless large-scale data viewing.

### Backend (API & Security)
- **Advanced Validation**: Aadhaar numbers are mathematically validated using the **Verhoeff checksum algorithm**, not just basic Regex.
- **Data Privacy**: Strict masking of sensitive PII. Aadhaar and PAN numbers are redacted before being sent over the network (e.g., `XXXXXXXX9012`).
- **Secure Logging**: Sensitive fields are scrubbed from Winston server logs.
- **Cursor Pagination**: Highly optimized cursor-based pagination for maximum database performance at scale.
- **Layered Architecture**: Clean separation of Controller, Service, and Repository layers.

---

## Technology Stack

| Frontend | Backend |
| --- | --- |
| React (Vite) | Node.js (Express) |
| TypeScript | TypeScript |
| Tailwind CSS | Prisma ORM |
| TanStack React Query | MySQL |
| React Router v6 | Zod Validation |
| Lucide React (Icons) | Jest (Testing) |

---

## Setup Instructions

### 1. Database Setup
Ensure you have a MySQL instance running. You can use a local server or a cloud provider (like Aiven or PlanetScale).

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
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
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL="http://localhost:5000"
```
Start the development server:
```bash
npm run dev
```

---

## 📖 API Documentation

Once the backend server is running, interactive API documentation is automatically generated using Swagger UI.
Visit: `http://localhost:5000/api-docs`

---

## 🔒 Security Considerations

- **Transport Security**: It is strongly recommended to enforce HTTPS / TLS 1.2+ in production environments to protect data in transit.
- **Rate Limiting & Helmet**: The API is protected with Express-Rate-Limit to prevent abuse, and Helmet to secure HTTP headers.
- **Data Exposure Prevention**: Public APIs never expose full Aadhaar or PAN values in plain text.

---

## Testing
The backend is fully covered with unit tests and API integration tests using Jest and Supertest.
```bash
cd backend
npm test
```

---

## Deployment Notes

- **Frontend**: Optimized for seamless deployment on [Vercel](https://vercel.com).
- **Backend**: Configured for deployment on services like [Render](https://render.com) or Heroku. Note that free tiers may cause initial cold-start delays. The frontend's loading screen gracefully handles this!
