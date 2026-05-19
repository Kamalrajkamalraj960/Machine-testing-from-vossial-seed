# Taskify - Task Management System

Taskify is a modern, production-ready Task Management System built with the MERN stack (MongoDB, Express, React, Node.js). It features a premium, SaaS-inspired UI with dark mode support, real-time filtering, sorting, and full CRUD capabilities for task management.

## Features

- **Secure Authentication**: JWT-based login and registration with bcrypt password hashing.
- **Task Management**: Create, Read, Update, and Delete tasks easily.
- **Advanced Filtering & Sorting**: Filter tasks by status (Pending, In Progress, Completed) and sort by due dates or creation dates.
- **Real-time Search**: Find tasks instantly by title or description.
- **Analytics Dashboard**: Get a quick overview of your total, completed, pending, and in-progress tasks.
- **Premium UI/UX**: Built with Tailwind CSS, featuring glassmorphism, responsive design, dark mode, and smooth Framer Motion animations.
- **State Management**: Optimized global state handling using Zustand.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Zustand
- React Router DOM
- Axios
- Framer Motion
- Lucide React
- React Hot Toast

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Token (JWT)
- bcryptjs

## Prerequisites

Ensure you have the following installed on your local machine:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB server)

# Run Backend

```bash
cd server
npm install
npm run dev
```

If `npm run dev` does not work, install nodemon:

```bash
npm install -D nodemon
```

Then add this to `package.json`:

```json
"scripts": {
  "dev": "nodemon server.js"
}
```

---

# Run Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

---

# Environment Variables

Create:

```bash
server/.env
```

Add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

# Start Full Project

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

---

# Frontend URL

```txt
http://localhost:5173
```

# Backend URL

```txt
http://localhost:5000
```

## Deployment Guide

### Frontend Deployment (Vercel)

1. Push your code to GitHub.
2. Log in to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. Set the Framework Preset to **Vite**.
5. Set the Root Directory to `client`.
6. Add Environment Variables if needed (e.g., your production API URL). Note: You may need to update `client/src/api/axios.js` to point to your deployed backend URL.
7. Click **Deploy**.

### Backend Deployment (Render)

1. Log in to [Render](https://render.com/) and click **New+** -> **Web Service**.
2. Connect your GitHub repository.
3. Set the Root Directory to `server`.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure random string.
   - `NODE_ENV`: `production`
7. Click **Create Web Service**.

### Database (MongoDB Atlas)

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Database Access** and create a user with a strong password.
3. Go to **Network Access** and whitelist your IP (or allow access from anywhere `0.0.0.0/0` for Render).
4. Click **Connect** -> **Connect your application** to get the connection string (`MONGO_URI`).

## API Documentation

### Auth Routes (`/api/auth`)
- `POST /register`: Register a new user
- `POST /login`: Authenticate user and get token
- `GET /me`: Get current user data (Private)

### Task Routes (`/api/tasks`)
- `GET /`: Get all tasks for the logged-in user (Private)
  - Query Params: `status`, `search`, `sort`
- `POST /`: Create a new task (Private)
- `PUT /:id`: Update a task (Private)
- `DELETE /:id`: Delete a task (Private)

## Project Structure

```txt
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── components/     # Reusable UI components
│   │   ├── layouts/        # Page layouts (Sidebar, TopNav)
│   │   ├── pages/          # Application pages (Dashboard, Tasks, Auth)
│   │   ├── store/          # Zustand global state stores
│   │   ├── App.jsx         # Main router setup
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                 # Backend Node/Express application
    ├── config/             # Database connection
    ├── controllers/        # API route controllers
    ├── middleware/         # Auth and Error handling middleware
    ├── models/             # Mongoose schemas
    ├── routes/             # Express routers
    ├── .env                # Environment variables
    └── server.js           # Server entry point
```
