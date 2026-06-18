# API Documentation

Complete API reference for ProjectHub backend. All endpoints use JSON request/response format.

**Base URL:** `http://localhost:5000/api` (Development)

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Project Endpoints](#project-endpoints)
3. [Task Endpoints](#task-endpoints)
4. [Dashboard Endpoints](#dashboard-endpoints)
5. [Contact Endpoints](#contact-endpoints)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Authentication Headers](#authentication-headers)

---

## Authentication Endpoints

### 1. Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Rate Limit:** 5 requests per minute

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Password Requirements:**
- Minimum 6 characters
- At least 1 uppercase letter (A-Z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*(),.?"":{}|<>[]\/\'`~;:_+=-.)

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

**Welcome Email Sent:**
```
From: ProjectHub <supportprojecthub@gmail.com>
Subject: Welcome to ProjectHub
Body: Welcome to ProjectHub, John Doe! Your account has been created.
```

**Error Responses:**

**400 - Validation Failed:**
```json
{
  "errors": [
    {
      "param": "email",
      "msg": "Valid email required"
    },
    {
      "param": "password",
      "msg": "Password must contain at least one uppercase letter"
    }
  ]
}
```

**400 - Duplicate Email:**
```json
{
  "message": "Email already in use"
}
```

**500 - Server Error:**
```json
{
  "message": "Server error"
}
```

---

### 2. Login User

Authenticate user and get JWT token.

**Endpoint:** `POST /auth/login`

**Rate Limit:** 5 requests per minute

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Token Expiration:** 7 days

**Error Responses:**

**400 - Invalid Credentials:**
```json
{
  "message": "Invalid credentials"
}
```

---

### 3. Forgot Password (Request OTP)

Request password reset OTP for email account.

**Endpoint:** `POST /auth/forgot-password`

**Rate Limit:** 5 requests per minute

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "If an account exists, an OTP was sent"
}
```

**Note:** Response is same whether email exists or not (security measure)

**OTP Email Sent:**
```
From: ProjectHub <supportprojecthub@gmail.com>
Subject: Your ProjectHub Password Reset OTP
Body: Your OTP is: 845621. It is valid for 10 minutes.
```

**OTP Details:**
- Format: 6 digits
- Validity: 10 minutes
- Single use (expires after reset or expiry)

**Error Responses:**

**400 - Missing Email:**
```json
{
  "message": "Email is required"
}
```

---

### 4. Reset Password (Using OTP)

Set new password using OTP received via email.

**Endpoint:** `POST /auth/reset-password`

**Rate Limit:** 5 requests per minute

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "845621",
  "newPassword": "NewSecurePass@456"
}
```

**New Password Requirements:** Same as registration (6+ chars, uppercase, number, special char)

**Success Response (200):**
```json
{
  "message": "Password reset successful"
}
```

**Error Responses:**

**400 - Missing Fields:**
```json
{
  "message": "Missing required fields"
}
```

**400 - Invalid OTP:**
```json
{
  "message": "Invalid OTP"
}
```

**400 - OTP Expired:**
```json
{
  "message": "OTP expired"
}
```

**400 - No Reset Request:**
```json
{
  "message": "No reset request found"
}
```

---

### 5. Logout User

Clear user session (client-side primarily).

**Endpoint:** `POST /auth/logout`

**Request Body:** (empty)

**Success Response (200):**
```json
{
  "message": "Logged out"
}
```

**Frontend Implementation:**
```javascript
// Clear token and user data
localStorage.removeItem('token');
localStorage.removeItem('rememberMe');
localStorage.removeItem('userEmail');
// Redirect to login
window.location.href = '/login';
```

---

## Project Endpoints

All project endpoints require authentication. Include JWT token in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 1. Create Project

Create new project for authenticated user.

**Endpoint:** `POST /projects`

**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "project_name": "College Portal",
  "description": "Web portal for college management",
  "start_date": "2024-06-01",
  "end_date": "2024-12-31",
  "status": "Not Started"
}
```

**Field Specifications:**
| Field | Type | Required | Max Length | Valid Values |
|-------|------|----------|-----------|-------------|
| project_name | String | ✅ | 255 | Any text |
| description | Text | ❌ | 65535 | Any text |
| start_date | Date | ❌ | - | YYYY-MM-DD |
| end_date | Date | ❌ | - | YYYY-MM-DD |
| status | Enum | ❌ | - | "Not Started", "In Progress", "Completed" |

**Success Response (201):**
```json
{
  "id": 1,
  "project_name": "College Portal",
  "description": "Web portal for college management",
  "status": "Not Started",
  "start_date": "2024-06-01",
  "end_date": "2024-12-31",
  "user_id": 1,
  "createdAt": "2024-06-19T10:30:45.000Z",
  "updatedAt": "2024-06-19T10:30:45.000Z"
}
```

**Error Response (400):**
```json
{
  "message": "Validation error",
  "details": "project_name is required"
}
```

---

### 2. Get All Projects

Retrieve all projects for logged-in user.

**Endpoint:** `GET /projects`

**Auth Required:** ✅ Yes

**Query Parameters:**
```
?search=Portal&status=In%20Progress
```

| Parameter | Type | Description |
|-----------|------|-------------|
| search | String | Filter by project name (partial match) |
| status | String | Filter by status: "All", "Not Started", "In Progress", "Completed" |

**Success Response (200):**
```json
[
  {
    "id": 1,
    "project_name": "College Portal",
    "description": "Web portal for college management",
    "status": "In Progress",
    "start_date": "2024-06-01",
    "end_date": "2024-12-31",
    "user_id": 1,
    "createdAt": "2024-06-19T10:30:45.000Z",
    "updatedAt": "2024-06-19T10:30:45.000Z"
  },
  {
    "id": 2,
    "project_name": "Mobile App",
    "description": "Cross-platform mobile application",
    "status": "Not Started",
    "start_date": "2024-07-01",
    "end_date": "2025-01-31",
    "user_id": 1,
    "createdAt": "2024-06-19T11:15:22.000Z",
    "updatedAt": "2024-06-19T11:15:22.000Z"
  }
]
```

**Pagination:** Future feature (currently returns all)

---

### 3. Get Project Details

Retrieve specific project with associated tasks.

**Endpoint:** `GET /projects/:id`

**Auth Required:** ✅ Yes

**URL Parameters:**
```
/projects/1
```

**Success Response (200):**
```json
{
  "id": 1,
  "project_name": "College Portal",
  "description": "Web portal for college management",
  "status": "In Progress",
  "start_date": "2024-06-01",
  "end_date": "2024-12-31",
  "user_id": 1,
  "Tasks": [
    {
      "id": 1,
      "task_name": "Design Database Schema",
      "description": "Create ER diagram and database design",
      "priority": "High",
      "status": "Completed",
      "due_date": "2024-06-15",
      "project_id": 1
    },
    {
      "id": 2,
      "task_name": "Backend API Development",
      "description": "Develop REST APIs",
      "priority": "High",
      "status": "In Progress",
      "due_date": "2024-07-15",
      "project_id": 1
    }
  ],
  "createdAt": "2024-06-19T10:30:45.000Z",
  "updatedAt": "2024-06-19T10:30:45.000Z"
}
```

**Error Response (404):**
```json
{
  "message": "Project not found"
}
```

---

### 4. Update Project

Modify existing project details.

**Endpoint:** `PUT /projects/:id`

**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "project_name": "College Portal v2",
  "status": "In Progress",
  "end_date": "2025-01-31"
}
```

**Note:** Only provide fields you want to update

**Success Response (200):**
```json
{
  "id": 1,
  "project_name": "College Portal v2",
  "description": "Web portal for college management",
  "status": "In Progress",
  "start_date": "2024-06-01",
  "end_date": "2025-01-31",
  "user_id": 1,
  "createdAt": "2024-06-19T10:30:45.000Z",
  "updatedAt": "2024-06-19T14:22:10.000Z"
}
```

---

### 5. Delete Project

Remove project and all associated tasks.

**Endpoint:** `DELETE /projects/:id`

**Auth Required:** ✅ Yes

**Request Body:** (empty)

**Success Response (200):**
```json
{
  "message": "Project deleted successfully"
}
```

**Cascade Delete:** All tasks in project are automatically deleted

**Error Response (404):**
```json
{
  "message": "Project not found"
}
```

---

## Task Endpoints

All task endpoints require authentication.

### 1. Create Task

Create new task within a project.

**Endpoint:** `POST /tasks`

**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "task_name": "Design Database Schema",
  "description": "Create ER diagram and define tables",
  "priority": "High",
  "status": "Pending",
  "due_date": "2024-06-25",
  "project_id": 1
}
```

**Field Specifications:**
| Field | Type | Required | Valid Values |
|-------|------|----------|-------------|
| task_name | String | ✅ | Any text (max 255) |
| description | Text | ❌ | Any text |
| priority | Enum | ❌ | "Low", "Medium", "High" |
| status | Enum | ❌ | "Pending", "In Progress", "Completed" |
| due_date | Date | ❌ | YYYY-MM-DD |
| project_id | Integer | ✅ | Valid project ID |

**Success Response (201):**
```json
{
  "id": 1,
  "task_name": "Design Database Schema",
  "description": "Create ER diagram and define tables",
  "priority": "High",
  "status": "Pending",
  "due_date": "2024-06-25",
  "project_id": 1,
  "createdAt": "2024-06-19T10:45:30.000Z",
  "updatedAt": "2024-06-19T10:45:30.000Z"
}
```

---

### 2. Get All Tasks

Retrieve all tasks (optionally filtered by project).

**Endpoint:** `GET /tasks`

**Auth Required:** ✅ Yes

**Query Parameters:**
```
?project_id=1&status=In%20Progress
```

| Parameter | Type | Description |
|-----------|------|-------------|
| project_id | Integer | Filter by project |
| status | String | Filter by status |

**Success Response (200):**
```json
[
  {
    "id": 1,
    "task_name": "Design Database Schema",
    "priority": "High",
    "status": "In Progress",
    "due_date": "2024-06-25",
    "project_id": 1
  }
]
```

---

### 3. Update Task

Modify task details and status.

**Endpoint:** `PUT /tasks/:id`

**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "status": "Completed",
  "priority": "Medium"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "task_name": "Design Database Schema",
  "priority": "Medium",
  "status": "Completed",
  "due_date": "2024-06-25",
  "project_id": 1
}
```

---

### 4. Delete Task

Remove task from project.

**Endpoint:** `DELETE /tasks/:id`

**Auth Required:** ✅ Yes

**Success Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

---

## Dashboard Endpoints

### Get Dashboard Statistics

Retrieve user's dashboard metrics.

**Endpoint:** `GET /dashboard`

**Auth Required:** ✅ Yes

**Success Response (200):**
```json
{
  "totalProjects": 5,
  "projectsInProgress": 2,
  "totalTasks": 18,
  "completedTasks": 8,
  "pendingTasks": 10
}
```

**Metric Definitions:**
- **totalProjects**: Count of all projects owned by user
- **projectsInProgress**: Count of projects with status "In Progress"
- **totalTasks**: Count of all tasks across user's projects
- **completedTasks**: Count of tasks with status "Completed"
- **pendingTasks**: Count of tasks with status "Pending"

---

## Contact Endpoints

### Submit Contact Form

Send message to support team.

**Endpoint:** `POST /contact`

**Auth Required:** ❌ No

**Rate Limit:** 5 requests per minute

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Feature Request",
  "message": "I would like to request the ability to export projects as PDF"
}
```

**Success Response (200):**
```json
{
  "message": "Message sent successfully"
}
```

**Email Sent to Support:**
```
From: John Doe <john@example.com>
To: supportprojecthub@gmail.com
Subject: Contact message: Feature Request

Name: John Doe
Email: john@example.com
Subject: Feature Request
Message: I would like to request the ability to export projects as PDF
```

**Error Response (400):**
```json
{
  "message": "All fields are required."
}
```

**Error Response (500):**
```json
{
  "message": "Unable to send message. Please try again later."
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET/PUT |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input, validation failed |
| 401 | Unauthorized | Missing/invalid JWT token |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

### Error Response Format

```json
{
  "message": "Error description",
  "errors": [
    {
      "param": "field_name",
      "msg": "Specific validation error"
    }
  ]
}
```

### Common Error Scenarios

**Missing Authentication Token:**
```
Status: 401
Response: {"message": "Access Denied"}
```

**Invalid Token:**
```
Status: 401
Response: Redirects to /login
```

**Rate Limit Exceeded:**
```
Status: 429
Response: {"message": "Too many attempts, please try again in a minute"}
```

---

## Rate Limiting

### Global Rate Limiter Configuration

| Endpoint Group | Limit | Window |
|---|---|---|
| Authentication | 5 requests | 1 minute |
| Forgot Password | 5 requests | 1 minute |
| Contact Form | 5 requests | 1 minute |
| Other endpoints | None | - |

### Rate Limit Headers

Responses include rate limit information:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1623062460
```

---

## Authentication Headers

### JWT Token Format

Bearer token format:
```
Authorization: Bearer <token>
```

### Example Request with Authentication

```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

### Token Payload

Decoded JWT token contains:
```json
{
  "id": 1,
  "email": "john@example.com",
  "iat": 1623062460,
  "exp": 1623667260
}
```

- **iat**: Token issued at (Unix timestamp)
- **exp**: Token expiration (7 days after issue)

### Automatic Token Refresh

Frontend automatically handles expired tokens:
1. API call returns 401
2. Frontend clears token from localStorage
3. User redirected to login page

---

## Axios Client Setup (Frontend)

```javascript
import axios from 'axios';

const api = axios.create({ 
  baseURL: 'http://localhost:5000/api' 
});

// Auto-attach JWT token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

### Usage

```javascript
// POST request
const response = await api.post('/auth/login', { email, password });
const { token } = response.data;

// GET request with token
const projects = await api.get('/projects');

// PUT request
await api.put('/projects/1', { status: 'In Progress' });

// DELETE request
await api.delete('/tasks/5');
```

---

## Postman Collection

### Setup Postman Environment

1. Create new Environment: "ProjectHub Dev"
2. Add variables:
   - `base_url`: http://localhost:5000/api
   - `token`: (auto-populated after login)
   - `project_id`: (set after creating project)

3. Import requests from collection JSON (available on GitHub)

### Example Workflow in Postman

```
1. POST /auth/register
   ↓
2. POST /auth/login → Copy token to {{token}}
   ↓
3. POST /projects → Copy id to {{project_id}}
   ↓
4. GET /projects/{{project_id}}
   ↓
5. POST /tasks → Create task
   ↓
6. GET /dashboard → View stats
```

---

## Response Examples by Scenario

### Successful Registration Flow
```
Request: POST /auth/register
Response: 201 Created
Body: { "message": "User registered successfully", "userId": 1 }
Email: Welcome email sent
```

### Successful Login Flow
```
Request: POST /auth/login
Response: 200 OK
Body: { "token": "...", "user": { "id": 1, "full_name": "John", "email": "john@..." } }
Action: Frontend saves token to localStorage
```

### Successful Project Creation Flow
```
Request: POST /projects
Auth: ✅ Valid JWT token
Response: 201 Created
Body: { "id": 1, "project_name": "...", ... }
```

### Failed Authentication Flow
```
Request: GET /projects
Auth: ❌ Missing/Invalid token
Response: 401 Unauthorized
Frontend Action: Clear localStorage, redirect to /login
```

---

## API Testing Commands

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"John","email":"john@test.com","password":"Pass@123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Pass@123"}'

# Get projects (with token)
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create project
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"project_name":"My Project","description":"Test project"}'
```

### Using Node.js (axios)

```javascript
const axios = require('axios');

const api = axios.create({ 
  baseURL: 'http://localhost:5000/api' 
});

// Login and get token
const loginRes = await api.post('/auth/login', {
  email: 'john@test.com',
  password: 'Pass@123'
});

const token = loginRes.data.token;

// Get projects with token
const projects = await api.get('/projects', {
  headers: { Authorization: `Bearer ${token}` }
});

console.log(projects.data);
```

---

**API Version:** 1.0.0  
**Last Updated:** June 19, 2024
