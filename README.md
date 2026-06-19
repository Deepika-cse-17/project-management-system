# ProjectHub — Project Management System

A full-stack web application for managing projects and tasks. Built with React, Node.js, Express, MySQL, and deployed on Render.

**Live URL:** https://project-management-system-4862.onrender.com

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Architecture](#architecture)
6. [Database Schema](#database-schema)
7. [Getting Started](#getting-started)
8. [Environment Variables](#environment-variables)
9. [Deployment](#deployment)
10. [API Reference](#api-reference)
11. [Security](#security)
12. [Design System](#design-system)

---

## Overview

ProjectHub lets users create and manage projects, organize tasks by priority and deadline, and track progress from a central dashboard. It includes a full authentication flow (register, login, forgot/reset password via OTP), email notifications, and a contact form.

---

## Features

### Authentication
- Register with name, email, and strong password
- Login with JWT session (7-day expiry)
- Remember Me option persists email across sessions
- Forgot Password — sends a 6-digit OTP to the user's registered email
- Reset Password — validates OTP (10-minute window) and sets new password
- Auto-logout on token expiry (401 interceptor)

### Projects
- Create, read, update, delete projects
- Fields: name, description, status, start date, end date
- Status tracking: Not Started → In Progress → Completed
- Cascade delete removes all tasks when a project is deleted

### Tasks
- Create tasks inside projects
- Priority levels: Low, Medium, High
- Status tracking: Pending → In Progress → Completed
- Due date assignment

### Dashboard
- Total projects, projects in progress
- Total tasks, completed tasks, pending tasks
- Quick navigation to all projects

### Email Notifications
- Welcome email on successful registration
- OTP email for password reset
- Contact form submission forwarded to support inbox
- Provider: Resend API (primary) with Gmail SMTP fallback

### Public Pages
- Home — hero section and feature preview
- Features — detailed feature breakdown
- About — mission and values
- Contact — contact form

### Responsive Design
- Mobile-first layout
- Custom hamburger menu with animated drawer on mobile
- Active link highlighting in navbar
- Bootstrap 5 grid for page layouts

---

## Tech Stack

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.6 | UI library |
| React Router DOM | 7.18.0 | Client-side routing |
| Axios | 1.18.0 | HTTP client with JWT interceptors |
| Bootstrap | 5.3.8 | Grid and utility classes |
| Vite | 8.0.12 | Build tool |

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| Express | 5.2.1 | Web framework |
| Sequelize | 6.37.8 | ORM |
| MySQL2 | 3.22.5 | Database driver |
| jsonwebtoken | 9.0.3 | JWT generation and verification |
| bcrypt | 6.0.0 | Password hashing (10 salt rounds) |
| express-validator | 7.3.2 | Input validation |
| express-rate-limit | 8.5.2 | Rate limiting |
| Resend | 6.14.0 | Email delivery (primary) |
| Nodemailer | 9.0.1 | Gmail SMTP fallback |
| Morgan | 1.11.0 | HTTP request logging |
| dotenv | 17.4.2 | Environment variable loading |

### Database

- MySQL 8.0+
- Sequelize auto-sync with `alter: true`

### Deployment

| Service | Purpose |
|---------|---------|
| Render | Backend hosting (Node.js web service) |
| Render / Vercel / Netlify | Frontend hosting (static site) |
| PlanetScale / Railway / Aiven | Managed MySQL |
| Resend | Transactional email |

---

## Project Structure

```
project-management-system/
├── backend/
│   ├── config/
│   │   └── db.js                   # Sequelize connection
│   ├── controllers/
│   │   ├── authController.js       # Register, login, OTP flow
│   │   ├── projectController.js    # CRUD for projects
│   │   ├── taskController.js       # CRUD for tasks
│   │   ├── dashboardController.js  # Aggregate stats
│   │   └── contactController.js    # Contact form email
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   └── rateLimiter.js          # express-rate-limit config
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── index.js                # Associations
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── contactRoutes.js
│   ├── utils/
│   │   └── email.js                # Resend + Gmail SMTP
│   ├── server.js                   # Express app entry point
│   ├── package.json
│   └── .env                        # Local only — not committed
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx          # Responsive navbar with mobile drawer
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── ProjectDetails.jsx
│   │   ├── services/
│   │   │   └── api.js              # Axios instance with interceptors
│   │   ├── App.jsx                 # Routes + PrivateRoute / PublicRoute
│   │   ├── index.css               # Design system, navbar, loading overlay
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── docker-compose.yml
├── render.yaml
├── README.md
└── API_DOCUMENTATION.md
```

---

## Architecture

```
Browser (React SPA)
        │  HTTPS / REST JSON
        ▼
Express API  ──► JWT Middleware ──► Controllers
        │                                │
        │                          Sequelize ORM
        │                                │
        ▼                                ▼
  Rate Limiter                       MySQL DB
        │
        ▼
  Email (Resend API / Gmail SMTP)
```

### Key flows

**Registration**
```
POST /api/auth/register
→ Validate input → Check duplicate email → Hash password
→ Create User row → Send welcome email (non-blocking) → 201
```

**Login**
```
POST /api/auth/login
→ Find user → bcrypt.compare → Sign JWT (7d) → 200 {token, user}
```

**Forgot Password**
```
POST /api/auth/forgot-password
→ Find user → Generate 6-digit OTP → Save with 10-min expiry
→ Send OTP email → 200
(failure to send email returns 500 with message)
```

**Reset Password**
```
POST /api/auth/reset-password
→ Find user → Verify OTP → Check expiry → Hash new password
→ Clear OTP fields → 200
```

**Protected Requests**
```
Request + Authorization: Bearer <token>
→ authMiddleware verifies JWT → attaches req.user → controller runs
```

---

## Database Schema

### Users
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | Auto increment |
| full_name | VARCHAR(255) | Not null |
| email | VARCHAR(255) | Unique, not null |
| password | VARCHAR(255) | Bcrypt hash |
| password_reset_token | VARCHAR(10) | 6-digit OTP |
| password_reset_expires | DATETIME | 10 min from request |
| createdAt | TIMESTAMP | Auto |
| updatedAt | TIMESTAMP | Auto |

### Projects
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | Auto increment |
| project_name | VARCHAR(255) | Not null |
| description | TEXT | Optional |
| status | ENUM | Not Started / In Progress / Completed |
| start_date | DATE | Optional |
| end_date | DATE | Optional |
| user_id | INT FK | → Users.id CASCADE DELETE |
| createdAt | TIMESTAMP | Auto |
| updatedAt | TIMESTAMP | Auto |

### Tasks
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | Auto increment |
| task_name | VARCHAR(255) | Not null |
| description | TEXT | Optional |
| priority | ENUM | Low / Medium / High |
| status | ENUM | Pending / In Progress / Completed |
| due_date | DATE | Optional |
| project_id | INT FK | → Projects.id CASCADE DELETE |
| createdAt | TIMESTAMP | Auto |
| updatedAt | TIMESTAMP | Auto |

### Associations
- User → Projects: one-to-many
- Project → Tasks: one-to-many
- Deleting a user cascades to projects, which cascades to tasks

---

## Getting Started

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- npm

### 1. Clone
```bash
git clone https://github.com/yourusername/project-management-system.git
cd project-management-system
```

### 2. Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=project_management

JWT_SECRET=your_long_random_secret_min_32_chars

# Email — option A (recommended for production)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# Email — option B (local development)
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_16_char_app_password

PORT=5000
```

Start:
```bash
npm run dev        # development (nodemon)
npm start          # production
```

Database tables are created automatically via `sequelize.sync({ alter: true })`.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`. API base URL is set in `src/services/api.js`.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_HOST` | Yes | MySQL host |
| `DB_USER` | Yes | MySQL username |
| `DB_PASS` | Yes | MySQL password |
| `DB_NAME` | Yes | Database name |
| `JWT_SECRET` | Yes | Secret for signing JWTs (min 32 chars) |
| `RESEND_API_KEY` | Recommended | Resend API key — works on all cloud hosts |
| `EMAIL_USER` | Fallback | Gmail address for SMTP fallback |
| `EMAIL_PASS` | Fallback | Gmail App Password (16 chars, no spaces) |
| `PORT` | No | Server port (default 5000) |

**Email priority:** `RESEND_API_KEY` is used first. If not set, falls back to Gmail SMTP using `EMAIL_USER` + `EMAIL_PASS`.

To get a Resend API key: sign up free at [resend.com](https://resend.com) → API Keys → Create.

---

## Deployment

### Backend on Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repository
3. Settings:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
4. Add all environment variables in the **Environment** tab (no quotes around values)
5. Add `app.set('trust proxy', 1)` is already in `server.js` — required for Render

### Frontend on Render / Vercel / Netlify

```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

Or connect the repository to Vercel/Netlify with:
- Root: `frontend`
- Build: `npm run build`
- Output: `dist`

### Email on Render

Gmail SMTP port 465 uses IPv6 which Render's free tier blocks. Use **Resend** instead:

1. Sign up at [resend.com](https://resend.com) — free tier is 3,000 emails/month
2. Create an API key
3. Add `RESEND_API_KEY=re_...` to Render's environment variables
4. Redeploy — email will work immediately

### Test email after deploy
```
GET https://project-management-system-4862.onrender.com/api/test-email?to=your@email.com
```
Returns `{"success": true}` when working.

---

## API Reference

Full reference: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, get JWT |
| POST | `/api/auth/logout` | — | Client-side logout |
| POST | `/api/auth/forgot-password` | — | Send OTP to email |
| POST | `/api/auth/reset-password` | — | Reset with OTP |
| GET | `/api/dashboard` | JWT | Stats summary |
| GET | `/api/projects` | JWT | List projects |
| POST | `/api/projects` | JWT | Create project |
| GET | `/api/projects/:id` | JWT | Project + tasks |
| PUT | `/api/projects/:id` | JWT | Update project |
| DELETE | `/api/projects/:id` | JWT | Delete project |
| GET | `/api/tasks` | JWT | List tasks |
| POST | `/api/tasks` | JWT | Create task |
| PUT | `/api/tasks/:id` | JWT | Update task |
| DELETE | `/api/tasks/:id` | JWT | Delete task |
| POST | `/api/contact` | — | Contact form |
| GET | `/api/test-email` | — | Diagnose email |

---

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWTs signed with `JWT_SECRET`, expire in 7 days
- All protected routes verified via `authMiddleware`
- Rate limiting on auth and contact endpoints (100 req / 15 min per IP)
- `app.set('trust proxy', 1)` set for correct IP detection behind Render's proxy
- `.env` in `.gitignore` — credentials never committed
- Input validated server-side with `express-validator`
- OTP expires after 10 minutes and is cleared after use

---

## Design System

### Colors
| Token | Value | Use |
|-------|-------|-----|
| `--color-text-dark` | `#1a1a1a` | Headings, body |
| `--color-text-light` | `#666` | Secondary text |
| `--color-text-muted` | `#999` | Placeholders |
| `--color-bg-white` | `#fff` | Cards, forms |
| `--color-bg-light` | `#f8f8f8` | Page backgrounds |
| `--color-border` | `#e0e0e0` | Dividers, inputs |
| `--color-error` | `#d32f2f` | Errors |
| `--color-success` | `#388e3c` | Success messages |

### Typography
- Headings: **Poppins** (600)
- Body / UI: **Inter** (400, 500)

### Breakpoints
- Mobile menu activates at `< 992px`
- Auth layout collapses at `< 768px`
- Container max-width: `1200px`

---

**Version:** 1.1.0  
**Last Updated:** June 2026
