# Smart Hostel/Mess Management System

A complete MERN stack application for managing hostel mess operations with role-based access control.

## Features

- **Role-Based Access Control (RBAC)**: Student, Mess Manager, Admin/Warden
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Menu Management**: Daily/weekly menu creation and viewing
- **Meal Planning**: Students can confirm meals in advance
- **Attendance Tracking**: Meal-wise attendance marking and reporting
- **Billing System**: Automated monthly bill generation
- **Complaints Management**: Track and resolve student complaints
- **Notices**: Admin announcements with pinned notices
- **Feedback System**: Meal ratings and analytics

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router v6
- Axios
- Context API

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt
- Zod Validation

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repo-url>
cd smart-hostel-mess
```

2. Install all dependencies

```bash
npm run install:all
```

3. Configure environment variables

**Server (.env)**

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

**Client (.env)**

```bash
cd client
cp .env.example .env
# Edit .env with your API URL
```

4. Seed initial admin and manager users

```bash
npm run seed
```

5. Start development servers

```bash
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Default Users (After Seeding)

### Admin

- Email: admin@hostel.com
- Password: Admin@123

### Mess Manager

- Email: manager@hostel.com
- Password: Manager@123

### Test Student

- Email: student@hostel.com
- Password: Student@123

## API Documentation

Base URL: `http://localhost:5000/api/v1`

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Menus

- `GET /menus?date=YYYY-MM-DD` - Get menus
- `POST /menus` - Create menu (Manager)
- `PUT /menus/:id` - Update menu (Manager)

### Meal Plans

- `POST /meal-plans` - Confirm meal (Student)
- `GET /meal-plans/me?month=MM&year=YYYY` - Get my meal plans

### Attendance

- `POST /attendance/mark` - Mark attendance (Manager)
- `GET /attendance/report?date=YYYY-MM-DD` - Get attendance report

### Billing

- `POST /billing/generate?month=MM&year=YYYY` - Generate bills (Admin)
- `GET /billing/me?month=MM&year=YYYY` - Get my bill (Student)

### Complaints

- `POST /complaints` - Create complaint (Student)
- `GET /complaints` - Get all complaints (Admin)
- `PATCH /complaints/:id/status` - Update status (Admin)

### Notices

- `POST /notices` - Create notice (Admin)
- `GET /notices` - Get all notices

### Feedback

- `POST /feedback` - Submit feedback (Student)
- `GET /feedback/summary` - Get feedback analytics (Manager)

## Project Structure

```
smart-hostel-mess/
├── client/          # React frontend
├── server/          # Express backend
├── package.json     # Root workspace
└── README.md
```

## License

MIT
