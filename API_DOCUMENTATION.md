# API Documentation — ProjectHub

Complete reference for the ProjectHub REST API.

**Production base URL:** `https://project-management-system-4862.onrender.com/api`  
**Local base URL:** `http://localhost:5000/api`  
**Format:** All requests and responses use `application/json`

---

## Contents

1. [Authentication](#1-authentication)
2. [Projects](#2-projects)
3. [Tasks](#3-tasks)
4. [Dashboard](#4-dashboard)
5. [Contact](#5-contact)
6. [Utilities](#6-utilities)
7. [Error Reference](#7-error-reference)
8. [Rate Limiting](#8-rate-limiting)
9. [Authorization Header](#9-authorization-header)
10. [Axios Client](#10-axios-client)
11. [cURL Examples](#11-curl-examples)

---

## 1. Authentication

### POST /auth/register

Create a new user account. Sends a welcome email on success.

**Rate limited:** Yes

**Request**
```json
{
  "full_name": "Deepika S",
  "email": "deepika@example.com",
  "password": "Hello@123"
}
```

**Password rules**
- Minimum 6 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character (`!@#$%^&*` etc.)

**201 Success**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```
A welcome email is sent to the user's address (non-blocking — registration succeeds even if email fails).

**400 Validation errors**
```json
{
  "errors": [
    { "param": "email",    "msg": "Valid email required" },
    { "param": "password", "msg": "Password must contain at least one uppercase letter" }
  ]
}
```

**400 Duplicate email**
```json
{ "message": "Email already in use" }
```

**500**
```json
{ "message": "Server error" }
```

---

### POST /auth/login

Authenticate and receive a JWT token.

**Rate limited:** Yes

**Request**
```json
{
  "email": "deepika@example.com",
  "password": "Hello@123"
}
```

**200 Success**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "full_name": "Deepika S",
    "email": "deepika@example.com"
  }
}
```

Store the `token` in `localStorage`. It expires in **7 days**.

**400 Wrong credentials**
```json
{ "message": "Invalid credentials" }
```

**400 Missing fields**
```json
{ "message": "Email and password required" }
```

---

### POST /auth/logout

Client-side logout. Clears the session on the backend (stateless — the token is simply discarded on the client).

**Request body:** empty

**200 Success**
```json
{ "message": "Logged out" }
```

Frontend implementation:
```javascript
localStorage.removeItem('token');
localStorage.removeItem('rememberMe');
localStorage.removeItem('userEmail');
navigate('/login');
```

---

### POST /auth/forgot-password

Generate a 6-digit OTP and send it to the user's registered email.

**Rate limited:** Yes

**Request**
```json
{ "email": "deepika@example.com" }
```

**200 Success** (returned whether or not the account exists — prevents user enumeration)
```json
{ "message": "If an account exists, an OTP was sent" }
```

**OTP properties**
- 6 digits, e.g. `847312`
- Valid for **10 minutes**
- Single use — cleared after reset or expiry

**500 Email delivery failed**
```json
{ "message": "Could not send OTP email. Please try again in a few minutes." }
```
When this happens the OTP is also cleared so the user can retry cleanly.

**400 Missing email**
```json
{ "message": "Email is required" }
```

---

### POST /auth/reset-password

Set a new password using the OTP received by email.

**Rate limited:** Yes

**Request**
```json
{
  "email": "deepika@example.com",
  "otp": "847312",
  "newPassword": "NewPass@456"
}
```

`newPassword` must meet the same rules as registration.

**200 Success**
```json
{ "message": "Password reset successful" }
```

**400 — various failure cases**
```json
{ "message": "Missing required fields" }
{ "message": "Invalid request" }
{ "message": "No reset request found" }
{ "message": "Invalid OTP" }
{ "message": "OTP expired" }
```

---

## 2. Projects

All project endpoints require a valid JWT in the `Authorization` header.

```
Authorization: Bearer <token>
```

---

### GET /projects

List all projects belonging to the authenticated user.

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Partial match on project name |
| `status` | string | `All` \| `Not Started` \| `In Progress` \| `Completed` |

**200 Success**
```json
[
  {
    "id": 1,
    "project_name": "College Portal",
    "description": "Web portal for college management",
    "status": "In Progress",
    "start_date": "2026-01-01",
    "end_date": "2026-12-31",
    "user_id": 1,
    "createdAt": "2026-06-01T10:00:00.000Z",
    "updatedAt": "2026-06-15T08:30:00.000Z"
  }
]
```

---

### POST /projects

Create a new project.

**Request**
```json
{
  "project_name": "Mobile App",
  "description": "Cross-platform mobile application",
  "status": "Not Started",
  "start_date": "2026-07-01",
  "end_date": "2026-12-31"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `project_name` | string | Yes | Max 255 chars |
| `description` | string | No | |
| `status` | enum | No | Default: `Not Started` |
| `start_date` | date | No | `YYYY-MM-DD` |
| `end_date` | date | No | `YYYY-MM-DD` |

**201 Success** — returns the created project object

```json
{
  "id": 2,
  "project_name": "Mobile App",
  "description": "Cross-platform mobile application",
  "status": "Not Started",
  "start_date": "2026-07-01",
  "end_date": "2026-12-31",
  "user_id": 1,
  "createdAt": "2026-06-19T10:30:00.000Z",
  "updatedAt": "2026-06-19T10:30:00.000Z"
}
```

---

### GET /projects/:id

Get a single project including its tasks.

**200 Success**
```json
{
  "id": 1,
  "project_name": "College Portal",
  "description": "Web portal for college management",
  "status": "In Progress",
  "start_date": "2026-01-01",
  "end_date": "2026-12-31",
  "user_id": 1,
  "Tasks": [
    {
      "id": 1,
      "task_name": "Design database schema",
      "description": "ER diagram and table definitions",
      "priority": "High",
      "status": "Completed",
      "due_date": "2026-02-01",
      "project_id": 1,
      "createdAt": "2026-01-10T09:00:00.000Z",
      "updatedAt": "2026-02-01T17:00:00.000Z"
    }
  ],
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-06-15T08:30:00.000Z"
}
```

**404**
```json
{ "message": "Project not found" }
```

---

### PUT /projects/:id

Update one or more fields of a project. Only include fields you want to change.

**Request**
```json
{
  "status": "Completed",
  "end_date": "2026-11-30"
}
```

**200 Success** — returns the full updated project object

**404**
```json
{ "message": "Project not found" }
```

---

### DELETE /projects/:id

Delete a project. All tasks inside it are automatically deleted (cascade).

**200 Success**
```json
{ "message": "Project deleted successfully" }
```

**404**
```json
{ "message": "Project not found" }
```

---

## 3. Tasks

All task endpoints require JWT authentication.

---

### GET /tasks

List tasks. Filter by project or status.

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| `project_id` | integer | Return tasks for this project only |
| `status` | string | `Pending` \| `In Progress` \| `Completed` |

**200 Success**
```json
[
  {
    "id": 1,
    "task_name": "Design database schema",
    "description": "ER diagram and table definitions",
    "priority": "High",
    "status": "Completed",
    "due_date": "2026-02-01",
    "project_id": 1,
    "createdAt": "2026-01-10T09:00:00.000Z",
    "updatedAt": "2026-02-01T17:00:00.000Z"
  }
]
```

---

### POST /tasks

Create a task inside a project.

**Request**
```json
{
  "task_name": "Build REST API",
  "description": "Implement all CRUD endpoints",
  "priority": "High",
  "status": "Pending",
  "due_date": "2026-08-01",
  "project_id": 1
}
```

| Field | Type | Required | Valid values |
|-------|------|----------|-------------|
| `task_name` | string | Yes | Max 255 chars |
| `description` | string | No | |
| `priority` | enum | No | `Low` \| `Medium` \| `High` (default: `Medium`) |
| `status` | enum | No | `Pending` \| `In Progress` \| `Completed` (default: `Pending`) |
| `due_date` | date | No | `YYYY-MM-DD` |
| `project_id` | integer | Yes | Must be a project owned by the user |

**201 Success** — returns the created task object

---

### PUT /tasks/:id

Update task fields. Only include what you want to change.

**Request**
```json
{
  "status": "In Progress",
  "priority": "Medium"
}
```

**200 Success** — returns the updated task object

**404**
```json
{ "message": "Task not found" }
```

---

### DELETE /tasks/:id

Delete a task.

**200 Success**
```json
{ "message": "Task deleted successfully" }
```

**404**
```json
{ "message": "Task not found" }
```

---

## 4. Dashboard

### GET /dashboard

Returns aggregated statistics for the authenticated user.

**Auth required:** Yes

**200 Success**
```json
{
  "totalProjects": 5,
  "projectsInProgress": 2,
  "totalTasks": 18,
  "completedTasks": 8,
  "pendingTasks": 10
}
```

| Field | Description |
|-------|-------------|
| `totalProjects` | All projects owned by the user |
| `projectsInProgress` | Projects with status `In Progress` |
| `totalTasks` | All tasks across the user's projects |
| `completedTasks` | Tasks with status `Completed` |
| `pendingTasks` | Tasks with status `Pending` |

---

## 5. Contact

### POST /contact

Submit a contact message. Sends an email to the support inbox.

**Auth required:** No

**Request**
```json
{
  "name": "Deepika S",
  "email": "deepika@example.com",
  "subject": "Feature request",
  "message": "Can you add PDF export for projects?"
}
```

All four fields are required.

**200 Success**
```json
{ "message": "Message sent successfully" }
```

**400 Missing fields**
```json
{ "message": "All fields are required." }
```

**500 Email failed**
```json
{ "message": "Unable to send message. Please try again later." }
```

---

## 6. Utilities

### GET /test-email

Diagnose email delivery. Sends a test email and reports the result.  
Remove or protect this route before going to production.

**Query parameters**

| Param | Default | Description |
|-------|---------|-------------|
| `to` | `EMAIL_USER` | Destination address |

**Example**
```
GET /api/test-email?to=deepika@example.com
```

**200 Success**
```json
{
  "success": true,
  "message": "Test email sent to deepika@example.com",
  "env": {
    "EMAIL_USER_set": true,
    "EMAIL_USER_value": "supportprojecthub@gmail.com",
    "EMAIL_PASS_set": true,
    "EMAIL_PASS_length": 16
  }
}
```

**500 Failure**
```json
{
  "success": false,
  "error": "connect ENETUNREACH ...",
  "env": {
    "EMAIL_USER_set": false,
    "EMAIL_USER_value": "(empty)",
    "EMAIL_PASS_set": false,
    "EMAIL_PASS_length": 0
  }
}
```

Use the `env` block to confirm whether Render has the correct environment variables set.

---

## 7. Error Reference

### HTTP status codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad request — validation error or business rule violation |
| 401 | Unauthorized — missing or invalid JWT |
| 404 | Not found |
| 429 | Too many requests — rate limit exceeded |
| 500 | Server error |

### 401 — unauthorized
```json
{ "message": "Access Denied" }
```
The frontend interceptor automatically clears the token and redirects to `/login` on 401.

### 429 — rate limit
```
HTTP/1.1 429 Too Many Requests
```

### Validation error shape
```json
{
  "errors": [
    { "param": "field_name", "msg": "Error description" }
  ]
}
```

---

## 8. Rate Limiting

Applied to: `/auth/register`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`

| Setting | Value |
|---------|-------|
| Window | 15 minutes |
| Max requests per IP | 100 |
| Headers returned | `RateLimit-*` (standard) |

`app.set('trust proxy', 1)` is configured so the correct client IP is read from `X-Forwarded-For` on Render.

---

## 9. Authorization Header

Protected endpoints require:

```
Authorization: Bearer <jwt_token>
```

**Token payload (decoded)**
```json
{
  "id": 1,
  "email": "deepika@example.com",
  "iat": 1750000000,
  "exp": 1750604800
}
```

- `iat` — issued at (Unix timestamp)
- `exp` — expiry, 7 days after issue

---

## 10. Axios Client

The frontend uses a shared Axios instance (`src/services/api.js`):

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://project-management-system-4862.onrender.com/api'
});

// Attach JWT to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on token expiry
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

**Usage**
```javascript
// Register
await api.post('/auth/register', { full_name, email, password });

// Login
const { data } = await api.post('/auth/login', { email, password });
localStorage.setItem('token', data.token);

// Get projects (token attached automatically)
const { data: projects } = await api.get('/projects');

// Create task
await api.post('/tasks', { task_name, priority, due_date, project_id });

// Update project status
await api.put(`/projects/${id}`, { status: 'Completed' });

// Delete task
await api.delete(`/tasks/${id}`);
```

---

## 11. cURL Examples

```bash
BASE=https://project-management-system-4862.onrender.com/api

# Register
curl -X POST $BASE/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Deepika S","email":"deepika@example.com","password":"Hello@123"}'

# Login — copy the token from the response
curl -X POST $BASE/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"deepika@example.com","password":"Hello@123"}'

# Set token variable
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get dashboard stats
curl $BASE/dashboard \
  -H "Authorization: Bearer $TOKEN"

# List projects
curl $BASE/projects \
  -H "Authorization: Bearer $TOKEN"

# Create project
curl -X POST $BASE/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"project_name":"My Project","description":"Demo","status":"Not Started"}'

# Create task
curl -X POST $BASE/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"task_name":"First task","priority":"High","project_id":1}'

# Update task status
curl -X PUT $BASE/tasks/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"Completed"}'

# Delete project
curl -X DELETE $BASE/projects/1 \
  -H "Authorization: Bearer $TOKEN"

# Forgot password
curl -X POST $BASE/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"deepika@example.com"}'

# Reset password
curl -X POST $BASE/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"deepika@example.com","otp":"847312","newPassword":"NewPass@456"}'

# Contact form
curl -X POST $BASE/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Deepika","email":"deepika@example.com","subject":"Hello","message":"Test message"}'

# Test email delivery
curl "$BASE/test-email?to=deepika@example.com"
```

---

**Version:** 1.1.0  
**Last Updated:** June 2026  
**Base URL:** https://project-management-system-4862.onrender.com/api
