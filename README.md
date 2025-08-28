# ChatApp

## Overview

ChatApp is a real‑time messaging application built with a **Node.js/Express** backend, **MongoDB** for data storage, **Socket.io** for live communication, and a **React + Vite** frontend styled with **Tailwind CSS**. Users can register, verify their email, log in, and chat one‑on‑one with other users. The app also supports profile picture uploads via Cloudinary, online/offline status tracking, and a searchable user directory.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Socket Events](#socket-events)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication** – Register with email verification (OTP), login, logout, password reset.
- **Profile Management** – Update username, bio, and profile picture (Cloudinary).
- **Real‑time Chat** – One‑to‑one conversations with live message delivery via Socket.io.
- **Online Presence** – Shows online users and last‑seen timestamps.
- **Search** – Find other users by username (case‑insensitive, limited results).
- **Responsive UI** – Built with React, Tailwind CSS, and Vite for fast development.
- **State Management** – Redux Toolkit for auth, chat selection, and online user state.
- **Error Handling & Validation** – Secure password hashing, disposable‑email checks, JWT protection.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js, Express, Mongoose, JWT, Bcrypt, Cloudinary, Multer, Nodemailer |
| **Realtime** | Socket.io |
| **Database** | MongoDB |
| **Frontend** | React 19, Vite, Tailwind CSS, Redux Toolkit, React Query, React Router |
| **Testing / Linting** | ESLint, React Hooks ESLint plugin |
| **Package Managers** | npm (both backend & frontend) |
| **Deployment** | Render (example URLs in code) |

## Project Structure

```
.
├── backend
│   ├── config          # DB & Cloudinary config
│   ├── controller      # Business logic (auth, message, search, user)
│   ├── middlewares     # Auth guard, Multer upload
│   ├── models          # Mongoose schemas (User, Message, Conversation, OTP)
│   ├── routes          # Express routers
│   ├── socket          # Socket.io handler (online users, rooms)
│   ├── utils           # Helper functions (email validator, send email)
│   └── index.js        # Server entry point
│
├── frontend
│   ├── src
│   │   ├── api         # Axios instance
│   │   ├── components  # UI components (chat, sidebar, common)
│   │   ├── config      # Form schema for auth pages
│   │   ├── hooks       # Custom hook for socket connection
│   │   ├── pages       # Route pages (Home, Chat, Login/Signup)
│   │   ├── routes      # Private route wrapper
│   │   ├── store       # Redux slices (auth, chat, online)
│   │   └── main.jsx    # React entry point
│   ├── public          # Static assets (vite.svg, render.yaml)
│   └── vite.config.js
└── .gitignore
```

## Setup & Installation

### Prerequisites

- **Node.js** (v20 or later)
- **npm** (v10 or later)
- **MongoDB** instance (local or cloud, e.g., Atlas)
- Cloudinary account (for image uploads)
- Gmail account (or any SMTP) for sending verification OTPs

### 1. Clone the repository

```bash
git clone https://github.com/Aloksharmatech/chatApp.git
cd chatApp
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
EMAIL=your_gmail_address
EMAIL_PASS=your_gmail_app_password
ORIGIN=http://localhost:5173   # Frontend origin for CORS
PORT=5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` (optional) if you want to override the default API base URL in `src/api/axios.js`.

### 4. Run the application

#### Development mode (both parts)

- **Backend**

  ```bash
  cd backend
  npm run start   # nodemon watches for changes
  ```

- **Frontend**

  ```bash
  cd frontend
  npm run dev
  ```

Open `http://localhost:5173` in your browser. The frontend talks to the backend at the URL defined in `axios.js` (`https://chatapp-backend-1s9x.onrender.com/api/` by default). Adjust if you run locally.

## API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/api/auth/register` | Register a new user (sends OTP) | ❌ |
| `POST` | `/api/auth/verifyRegister` | Verify OTP & create account | ❌ |
| `POST` | `/api/auth/login` | Login & receive JWT (set as cookie) | ❌ |
| `POST` | `/api/auth/logout` | Clear auth cookie | ✅ |
| `POST` | `/api/auth/forgot-password` | Request password reset OTP | ❌ |
| `POST` | `/api/auth/reset-password` | Reset password with OTP | ❌ |
| `GET`  | `/api/auth/me` | Get current user profile | ✅ |
| `PUT`  | `/api/user/update-profile` | Update username, bio, or profile picture | ✅ (multipart) |
| `GET`  | `/api/search/users?query=...` | Search other users (max 10) | ✅ |
| `POST` | `/api/message/start` | Start a new conversation + first message | ✅ |
| `POST` | `/api/message/:conversationId` | Send a message in an existing conversation | ✅ |
| `GET`  | `/api/message/` | Get all conversations for logged‑in user | ✅ |
| `GET`  | `/api/message/:conversationId/:id` | Get all messages of a conversation | ✅ |

## Socket.io Events

- **Client → Server**

  - `joinConversation` (payload: `conversationId`) – join a room for a specific chat.

- **Server → Client**

  - `onlineUsers` – broadcasts current online users map and lastSeen timestamps.
  - `message` (custom, emitted from your own message controller) – you can extend to push new messages to participants.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `CLOUD_NAME`, `API_KEY`, `API_SECRET` | Cloudinary credentials |
| `EMAIL`, `EMAIL_PASS` | Gmail credentials for OTP emails |
| `ORIGIN` | Frontend URL for CORS |
| `PORT` | Backend listening port |

## Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Commit your changes with clear messages.
4. Open a Pull Request describing the changes.

Please follow the existing code style (ESLint for frontend, standard Node style for backend) and include tests where applicable.
--- 

*Happy coding! 🎉*
