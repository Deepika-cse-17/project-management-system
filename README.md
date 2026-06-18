# ProjectHub - Professional Project Management System

A full-stack web application for managing projects and tasks with team collaboration features. Built with modern technologies and designed for seamless user experience across desktop and mobile devices.

---

## 🎯 Project Overview

**ProjectHub** is a comprehensive project management platform that enables users to:
- Create and manage projects with real-time status tracking
- Organize tasks by priority and deadline
- Track project progress with visual dashboards
- Receive email notifications for important updates
- Reset passwords securely with OTP-based authentication
- Collaborate with team members (expandable feature)

The application follows professional design patterns with a minimal, clean UI inspired by Google's design philosophy.

---

## ✨ Key Features

### 1. **User Authentication**
- Secure registration with strong password validation (6+ chars, uppercase, number, special char)
- Email-based login with "Remember Me" functionality
- JWT token-based session management (7-day expiration)
- Duplicate email detection with inline validation warnings
- Password reset via 6-digit OTP sent to registered email

### 2. **Project Management**
- Create projects with name, description, start/end dates
- Track project status (Not Started, In Progress, Completed)
- View all user projects in a responsive grid/table layout
- Real-time project statistics on dashboard

### 3. **Task Management**
- Create tasks within projects
- Set task priorities (Low, Medium, High)
- Track task status (Pending, In Progress, Completed)
- Set due dates for accountability
- Task completion tracking

### 4. **Dashboard**
- Welcome message with user name
- 5 key statistics: Total Projects, In Progress, Total Tasks, Completed, Pending
- Quick access to project/task overview
- Automatic loading and error states

### 5. **Email Features**
- **Welcome Email**: Sent on successful registration
- **Password Reset OTP**: 6-digit code valid for 10 minutes
- **Contact Form Submission**: Direct email to support team
- **Task Reminders**: (Expandable) Notifications for due tasks
- **Project Completion**: (Expandable) Alerts when all tasks completed

### 6. **Landing Pages**
- **Home**: Hero section with CTA buttons
- **Features**: Detailed feature showcase (Project Management, Task Organization, Team Collaboration)
- **About**: Company mission, values, and founder narrative
- **Contact**: Contact form with email and response time info

### 7. **Responsive Design**
- Mobile-first responsive layout
- Bootstrap 5 grid system
- Minimal, professional color scheme (black, white, grays)
- Google Fonts integration (Inter, Poppins)

---

## 🏗️ Architecture

### System Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React + Vite)                 │
│  ┌──────────────┬──────────────┬──────────────┬────────────┐ │
│  │  Pages       │  Components  │  Services    │  Utilities │ │
│  │ (Login,      │ (Navbar)     │ (API calls   │ (Styling, │ │
│  │  Register,   │              │  w/ Axios)   │  Utils)   │ │
│  │  Dashboard)  │              │              │           │ │
│  └──────────────┴──────────────┴──────────────┴────────────┘ │
└──────────────────────────┬─────────────────────────────────┘
                           │ HTTP/REST
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              Backend (Node.js + Express)                      │
│  ┌──────────────┬──────────────┬──────────────┬────────────┐ │
│  │  Routes      │  Controllers │  Middleware  │  Utils     │ │
│  │ (Auth,       │ (Business    │ (Auth,       │ (Email,    │ │
│  │  Projects,   │  logic)      │  RateLimit)  │  etc)      │ │
│  │  Tasks)      │              │              │            │ │
│  └──────────────┴──────────────┴──────────────┴────────────┘ │
│                            │                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │           Sequelize ORM + Models                        │  │
│  │  (User, Project, Task, Associations)                   │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────┬─────────────────────────────────┘
                           │ SQL
                           ▼
                    ┌──────────────┐
                    │  MySQL DB    │
                    │  (Port 3306) │
                    └──────────────┘

External Services:
  • Gmail (via Nodemailer) - Email delivery
```

### Data Flow

#### User Registration Flow
```
User Input → Frontend Validation → API POST /auth/register
→ Backend Validation → Email Check → Hash Password → Create User
→ Send Welcome Email → Return Success → Redirect to Login
```

#### Authentication Flow
```
User Credentials → POST /auth/login
→ Find User → Compare Password → Generate JWT → Return Token + User Data
→ Store Token in localStorage → Redirect to Dashboard
```

#### Forgot Password Flow
```
User Email → POST /auth/forgot-password
→ Generate 6-digit OTP → Store with 10-min expiry → Send OTP Email
→ User receives email → Enter OTP + New Password → POST /auth/reset-password
→ Verify OTP & Expiry → Hash New Password → Update User → Success
```

#### Project Management Flow
```
Create Project → Backend Validates → Stores in DB → Returns ID
→ Fetch Projects → GET /api/projects → Returns User's Projects
→ Update Project → PUT /api/projects/:id → Update DB
→ Delete Project → DELETE /api/projects/:id → Cascade delete tasks
```

---

## 🛠️ Tech Stack

### Frontend
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | React | 19.2.6 | UI library |
| **Bundler** | Vite | 8.0.12 | Fast build tool |
| **Routing** | React Router DOM | 7.18.0 | Client-side routing |
| **HTTP Client** | Axios | 1.18.0 | API requests with JWT interceptors |
| **CSS Framework** | Bootstrap | 5.3.8 | Responsive grid & components |
| **Fonts** | Google Fonts | - | Inter, Poppins |
| **Build** | Node.js | 18+ | JavaScript runtime |

### Backend
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Express.js | 5.2.1 | Web server & routing |
| **Runtime** | Node.js | 18+ | JavaScript runtime |
| **ORM** | Sequelize | 6.37.8 | Database abstraction |
| **Database Driver** | MySQL2 | 3.22.5 | MySQL connectivity |
| **Authentication** | JWT | 9.0.3 | Token generation & verification |
| **Security** | Bcrypt | 6.0.0 | Password hashing (10 salt rounds) |
| **Validation** | express-validator | 7.3.2 | Input validation |
| **Rate Limiting** | express-rate-limit | 8.5.2 | DDoS protection |
| **Email** | Nodemailer | Latest | Email delivery via Gmail SMTP |
| **Logging** | Morgan | Latest | HTTP request logging |
| **CORS** | CORS | Latest | Cross-origin requests |

### Database
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **DBMS** | MySQL | 8.0+ | Relational database |
| **ORM** | Sequelize | 6.37.8 | Model definitions & associations |
| **Port** | 3306 | - | Default MySQL port |

### Environment & DevOps
| Tool | Purpose |
|------|---------|
| dotenv | Environment variable management |
| npm | Package management |
| Git | Version control |
| GitHub | Repository hosting |

---

## 📋 Database Schema

### User Table
```sql
CREATE TABLE User (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  password_reset_token VARCHAR(10),
  password_reset_expires DATETIME,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Project Table
```sql
CREATE TABLE Project (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('Not Started', 'In Progress', 'Completed') DEFAULT 'Not Started',
  start_date DATE,
  end_date DATE,
  user_id INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
);
```

### Task Table
```sql
CREATE TABLE Task (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_name VARCHAR(255) NOT NULL,
  description TEXT,
  priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
  due_date DATE,
  project_id INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE
);
```

### Entity Relationships
- **User ↔ Project**: One-to-Many (1 user has many projects, CASCADE delete)
- **Project ↔ Task**: One-to-Many (1 project has many tasks, CASCADE delete)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ ([Download](https://nodejs.org/))
- MySQL 8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))
- npm or yarn
- Git

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/project-management-system.git
cd project-management-system
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend/` directory:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=Ayyappan@69
DB_NAME=project_management

# JWT Configuration
JWT_SECRET=someverylongrandomsecretkey123

# Email Configuration
EMAIL_USER=supportprojecthub@gmail.com
EMAIL_PASS=qgibufsbyexgapiy
EMAIL_FROM="ProjectHub <supportprojecthub@gmail.com>"

# Server Configuration
PORT=5000
```

Start backend server:
```bash
node server.js
```

Expected output:
```
Database connected and synced
Server running on port 5000
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference with all endpoints, request/response examples, and error handling.

### Quick API Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|-----------------|
| POST | `/api/auth/register` | User registration | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/forgot-password` | Request password reset OTP | ❌ |
| POST | `/api/auth/reset-password` | Reset password with OTP | ❌ |
| GET | `/api/dashboard` | Get user dashboard stats | ✅ |
| GET | `/api/projects` | List user projects | ✅ |
| POST | `/api/projects` | Create new project | ✅ |
| GET | `/api/projects/:id` | Get project details | ✅ |
| PUT | `/api/projects/:id` | Update project | ✅ |
| DELETE | `/api/projects/:id` | Delete project | ✅ |
| POST | `/api/tasks` | Create task | ✅ |
| GET | `/api/tasks` | List tasks | ✅ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |
| POST | `/api/contact` | Submit contact form | ❌ |

---

## 🔐 Security Features

### Authentication & Authorization
- **JWT-based Auth**: 7-day token expiration
- **Password Hashing**: Bcrypt with 10 salt rounds
- **Token Interceptor**: Axios auto-attaches JWT to all requests
- **Auto Logout**: 401 responses clear token and redirect to login
- **Private Routes**: Protected endpoints check authentication middleware

### Input Validation
- **Frontend**: Client-side validation for UX
- **Backend**: Express-validator chains on all inputs
- **Password Policy**: 6+ chars, 1 uppercase, 1 number, 1 special char
- **Email Validation**: RFC 5322 compliant format check

### Rate Limiting
- **Global Limiter**: 5 requests per minute per IP
- **Applied to**: Auth, forgot-password, contact endpoints
- **Returns**: 429 Too Many Requests if exceeded

### Email Security
- **Gmail App Passwords**: Never use plain Gmail password
- **OTP Expiry**: 10-minute validity window
- **Environment Variables**: Credentials never committed to repo

---

## 🎨 Design System

### Color Palette
- **Primary**: `#000000` (Black)
- **Text Dark**: `#1a1a1a`
- **Text Light**: `#666666`
- **Background White**: `#ffffff`
- **Background Light**: `#f8f8f8`
- **Border**: `#e0e0e0`

### Typography
- **Headings**: Poppins (weights: 400, 500, 600, 700)
- **Body/UI**: Inter (weights: 400, 500, 600, 700)

### Layout
- **Max Container Width**: 1200px (responsive down to mobile)
- **Grid Gaps**: 24px, 48px, 80px
- **Shadows**: Subtle rgba(0, 0, 0) with varying opacity

---

## 📁 Project Structure

```
project-management-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # Sequelize DB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth business logic
│   │   ├── projectController.js  # Project operations
│   │   ├── taskController.js     # Task operations
│   │   ├── dashboardController.js# Dashboard stats
│   │   └── contactController.js  # Contact form submission
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── rateLimiter.js        # Rate limiting
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── Project.js            # Project model
│   │   ├── Task.js               # Task model
│   │   └── index.js              # Model associations
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── projectRoutes.js      # Project endpoints
│   │   ├── taskRoutes.js         # Task endpoints
│   │   ├── dashboardRoutes.js    # Dashboard endpoints
│   │   └── contactRoutes.js      # Contact endpoints
│   ├── utils/
│   │   └── email.js              # Nodemailer setup & email send
│   ├── server.js                 # Express app & entry point
│   ├── package.json              # Backend dependencies
│   └── .env                       # Environment variables (ignored)
│
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx        # Navigation component
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Features.jsx      # Features page
│   │   │   ├── About.jsx         # About page
│   │   │   ├── Contact.jsx       # Contact form
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── ForgotPassword.jsx# Password reset request
│   │   │   ├── ResetPassword.jsx # Password reset confirmation
│   │   │   ├── Dashboard.jsx     # User dashboard
│   │   │   ├── Projects.jsx      # Projects list
│   │   │   └── ProjectDetails.jsx# Project detail view
│   │   ├── services/
│   │   │   └── api.js            # Axios HTTP client
│   │   ├── App.jsx               # Root component & routing
│   │   ├── App.css               # Global styles
│   │   ├── index.css             # Design system & utilities
│   │   └── main.jsx              # React DOM render
│   ├── index.html                # HTML entry point
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Vite configuration
│   └── eslint.config.js          # ESLint rules
│
└── README.md                     # This file
```

---

## 🔄 Workflow Overview

### User Journey

#### 1. **Registration**
```
Visit Site → Click "Sign Up" → Enter Name, Email, Password 
→ Password validation (6 chars, uppercase, number, special char)
→ Check for duplicate email → Hash password → Store in DB
→ Send welcome email → Redirect to login
```

#### 2. **Login**
```
Enter credentials → Submit → Validate → Generate JWT token
→ Store token in localStorage → Redirect to dashboard
```

#### 3. **Create Project**
```
Dashboard → "Create Project" → Fill details (name, desc, dates)
→ POST to backend → Validate → Store in DB → Show in projects list
```

#### 4. **Manage Tasks**
```
Select project → View tasks → Create task (name, priority, due date)
→ Mark progress (pending → in progress → completed)
→ Delete/Edit tasks → Real-time list updates
```

#### 5. **Password Reset**
```
Forgot password? → Enter email → GET /forgot-password
→ Generate 6-digit OTP → Send to email → User receives OTP
→ Enter OTP + new password → POST /reset-password → Verify & update
→ Redirect to login with new password
```

#### 6. **Contact Support**
```
Contact page → Fill form (name, email, subject, message)
→ POST to /api/contact → Backend sends email to supportprojecthub@gmail.com
→ Show success message
```

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register with valid credentials
- [ ] Register with duplicate email (should show warning)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should show error)
- [ ] Forgot password flow and OTP verification
- [ ] Password reset success

**Projects:**
- [ ] Create new project
- [ ] View all projects
- [ ] Update project details
- [ ] Delete project
- [ ] Verify cascade delete (tasks removed when project deleted)

**Tasks:**
- [ ] Create task in project
- [ ] Update task status/priority
- [ ] Set due date
- [ ] Delete task
- [ ] View task list for project

**Dashboard:**
- [ ] Verify stats load correctly
- [ ] Check "View All Projects" link
- [ ] Test on mobile view

**Contact:**
- [ ] Submit contact form
- [ ] Verify email received at supportprojecthub@gmail.com
- [ ] Check form success message

---

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy `dist/` folder to Vercel/Netlify
```

### Backend Deployment (Heroku/AWS/DigitalOcean)
```bash
# Set environment variables in hosting provider
# Deploy backend folder with `node server.js` as start command
```

### Environment Variables for Production
```env
# Use production-grade MySQL database
DB_HOST=your-production-db.com
DB_USER=prod_user
DB_PASS=strong_password
DB_NAME=projecthub_prod

JWT_SECRET=very-long-random-secret-key-min-32-chars

EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password

PORT=5000
NODE_ENV=production
```

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Support

For issues, feature requests, or questions:
- Email: supportprojecthub@gmail.com
- GitHub Issues: [Create Issue](https://github.com/yourusername/project-management-system/issues)

---

## 🎓 Learning Value

This project demonstrates:
- ✅ Full-stack MERN-like architecture (React + Express + MySQL)
- ✅ JWT authentication & session management
- ✅ RESTful API design best practices
- ✅ Database design & ORM usage (Sequelize)
- ✅ Email integration (Nodemailer)
- ✅ Input validation & security
- ✅ Responsive web design
- ✅ Component-based architecture
- ✅ State management (React hooks)
- ✅ Error handling & user feedback

Perfect for portfolio, interviews, and demonstrating full-stack competency.

---

**Last Updated:** June 19, 2024  
**Version:** 1.0.0
