# fixIT – Fullstack Asset Management System

A professional **SPA + REST API** platform built in a **Monorepo** architecture, emphasizing clean architecture, security, and scalability.

## 🚀 Key Features & Architecture

*   **Fullstack TypeScript**: Full type consistency across the entire project.
*   **Repository Pattern**: Database abstraction allowing seamless switching between **MongoDB (Mongoose)** and **PostgreSQL (Prisma)**.
*   **Single Source of Truth**: Shared **Zod** schemas and **DTOs** in the `shared` folder – one validation definition for both frontend and backend.
*   **RBAC Permissions System**: Full Role-Based Access Control with dedicated Guards on the frontend and middleware role validator on backend.
*   **JWT Authentication**: Secure Access & Refresh Token flow utilizing **HttpOnly** cookies.
*   **Cloudinary Integration**: Support for image uploads (Multer) with cloud-based hosting.
*   **Modern UI/UX**: Responsive **MaterialUI** interface, Dark Mode toggle, interactive notifications (Toasts), and advanced form states.

---

## 🛠️ Tech Stack

### Backend (Express)
*   **Databases**: MongoDB (Mongoose) / PostgreSQL (Prisma)
*   **Security**: Helmet, CORS, Bcrypt, HttpOnly Cookies
*   **Validation**: Zod (Schema-based validation)
*   **Logic**: Repository Pattern, Services, DTOs

### Frontend (React + Vite)
*   **State Management**: Zustand
*   **Data Fetching**: TanStack Query + Axios
*   **Forms**: React Hook Form + Zod integration
*   **UI**: Material UI 
*   **Routing**: React Router (Protected Routes/Guards)

### DevOps & Testing
*   **Containerization**: Docker Compose
*   **Testing**: Cypress (E2E)

---

## 🏗️ Project Structure (Monorepo)

```text
├── backend/          # Express API (Controllers, Services, Repositories)
├── fixIT-frontend/   # React SPA (Vite)
└── shared/           # Zod schemas, Types, DTOs (Single source of truth)
```

---

## ⚡ Quickstart

### 1. Environment Variables Configuration
Create a `.env` file in the `/backend` folder based on the following example:

```env
# CLOUDINARY
cloud_name=your_cloud_name_here
api_key=your_api_key_here
api_secret=your_api_secret_here

# DATABASE
# Options: mongo / sql
DB_TYPE=mongo   
MONGO_URI=your_mongodb_connection_string
DATABASE_URL=postgresql://user:password@localhost:5432/fixIT?schema=public

# JWT
SECRET_ACCESS_KEY=your_very_long_random_access_token_secret
SECRET_REFRESH_KEY=your_very_long_random_refresh_token_secret

# GENERAL
DEBUG_MODE=FALSE
PORT=5000
```

### 2. Running with Docker
The project is fully containerized. To run the entire environment (Frontend, Backend, DB):

```bash
docker-compose up --build
```

---
