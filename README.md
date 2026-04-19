# DevCollab — Developer Social Platform

> A full-stack social networking platform built for developers — share what you're building, connect with engineers, and grow your network.

---

## Demo Credentials

Try the app instantly — no sign-up required:

| Field    | Value                  |
|----------|------------------------|
| **Email**    | `demo@devcollab.io`    |
| **Password** | `demo1234`             |

---

## Overview

DevCollab is a developer-first social platform where engineers share project updates, ask questions, celebrate wins, and build relationships that outlast any job title. Users create a profile with their skills and GitHub, post to a shared feed, comment on posts, follow other developers, and discover engineers by tech stack via the Explore page.

The project is built as a complete, production-grade portfolio piece — not a tutorial app — with JWT authentication, protected routes, dark/light theming, toast notifications, responsive design, and a polished component system.

---

## Features

- **Developer Feed** — Paginated feed of posts from the community. Filter by clicking any tag.
- **Post Creation** — Write posts up to 500 characters with tags. Character counter with live warnings.
- **Comments** — Add and delete comments on any post.
- **Likes** — Like/unlike posts with toggle feedback.
- **Follow System** — Follow and unfollow other developers. Follower/following counts on profiles.
- **Explore Page** — Discover all developers. Live search by name, skill, or bio. Click any skill tag to filter instantly.
- **User Profiles** — Editable name, bio, skills, and GitHub. Shows follower stats and all user posts.
- **Clickable Tags** — Post tags filter the feed. Profile skill tags search the Explore page.
- **Dark / Light Mode** — System-aware theme toggle, preference saved to localStorage.
- **Toast Notifications** — Contextual success/error feedback on every action.
- **Authentication** — JWT-based auth, 30-day token expiry, auto-logout on expiry, protected routes.
- **Responsive Design** — Fully usable on mobile, tablet, and desktop.

---

## Tech Stack

### Frontend
| Technology       | Purpose                                          |
|------------------|--------------------------------------------------|
| React 18         | UI library with hooks-based architecture         |
| Vite             | Build tool and dev server                        |
| React Router v6  | Client-side routing and protected routes         |
| Axios            | HTTP client with request/response interceptors   |
| Context API      | Global state for auth, theme, and toast          |
| Pure CSS         | Custom design system with CSS variables          |

### Backend
| Technology   | Purpose                                    |
|--------------|--------------------------------------------|
| Node.js      | Runtime environment                        |
| Express      | REST API framework                         |
| MongoDB Atlas | Cloud-hosted NoSQL database               |
| Mongoose     | ODM for schema definition and validation   |
| JSON Web Tokens | Stateless authentication               |
| bcryptjs     | Password hashing                           |

### Infrastructure
| Service        | Purpose                                          |
|----------------|--------------------------------------------------|
| GitHub         | Version control and CI/CD trigger                |
| Render         | Backend hosting (auto-deploys on push)           |
| Vercel         | Frontend hosting via global CDN                  |
| MongoDB Atlas  | Database hosting                                 |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Vercel)                      │
│   React + Vite + Pure CSS                               │
│   AuthContext · ThemeContext · ToastContext              │
│   10 Pages · Protected & Public routes                  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS (Axios)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   API Server (Render)                    │
│   Node.js + Express                                     │
│   JWT Middleware · CORS · Input Validation              │
│   /api/auth  ·  /api/posts  ·  /api/users               │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
                ┌─────────────────┐
                │  MongoDB Atlas  │
                │  Users          │
                │  Posts + Comments│
                └─────────────────┘
```

---

## Project Structure

```
devcollab/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                   # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js       # Register, login, profile
│   │   │   ├── postController.js       # Posts, likes, comments
│   │   │   └── userController.js       # Follow, search, explore
│   │   ├── middleware/
│   │   │   └── authMiddleware.js       # JWT verification
│   │   ├── models/
│   │   │   ├── User.js                 # User schema (followers, following)
│   │   │   └── Post.js                 # Post schema (comments embedded)
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       ├── postRoutes.js
│   │       └── userRoutes.js
│   ├── server.js
│   ├── seed.js                         # Database seeder
│   └── .env.example
└── frontend/
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx              # Nav with theme toggle
    │   │   ├── PostCard.jsx            # Post with likes, comments
    │   │   └── UserCard.jsx
    │   ├── context/
    │   │   ├── ThemeContext.jsx        # Dark/light mode
    │   │   └── ToastContext.jsx        # Toast notifications
    │   ├── pages/
    │   │   ├── Landing.jsx             # Marketing homepage
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Feed.jsx                # Main feed with tag filtering
    │   │   ├── Explore.jsx             # Developer search & discovery
    │   │   ├── CreatePost.jsx
    │   │   └── Profile.jsx             # User profile with follow
    │   ├── services/
    │   │   └── api.js                  # Axios instance + all API calls
    │   └── App.jsx                     # Providers + routing
    └── .env.example
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- A MongoDB Atlas account (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/devcollab.git
cd devcollab
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

```bash
npm run dev
```

### 3. Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Open `http://localhost:5173`

### 4. Seed the database (optional)

```bash
cd backend
node seed.js
```

This creates 13 sample users and posts so the feed isn't empty.

---

## API Reference

### Auth
| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| `POST` | `/api/auth/register` | Register a new user      |
| `POST` | `/api/auth/login`    | Login and receive JWT    |
| `GET`  | `/api/auth/me`       | Get current user profile |
| `PUT`  | `/api/auth/me`       | Update name, bio, skills |
| `GET`  | `/api/auth/user/:id` | Get any user by ID       |

### Posts
| Method   | Endpoint                          | Description              |
|----------|-----------------------------------|--------------------------|
| `GET`    | `/api/posts`                      | Get feed (paginated, filterable by `?tag=`) |
| `GET`    | `/api/posts/user/:userId`         | Get posts by user        |
| `POST`   | `/api/posts`                      | Create a post            |
| `DELETE` | `/api/posts/:id`                  | Delete a post            |
| `POST`   | `/api/posts/like/:id`             | Like / unlike a post     |
| `POST`   | `/api/posts/:id/comments`         | Add a comment            |
| `DELETE` | `/api/posts/:id/comments/:commentId` | Delete a comment      |

### Users
| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| `GET`  | `/api/users`          | Get all users (explore page)   |
| `GET`  | `/api/users/search`   | Search users by `?q=`          |
| `POST` | `/api/users/follow/:id` | Follow / unfollow a user     |

---

## Author

Built by **Nitin Sonu** — [nitinsonu.dev](https://nitinsonu.dev) · [LinkedIn](https://linkedin.com/in/nsdotdev) · [GitHub](https://github.com/nsdotdev)
