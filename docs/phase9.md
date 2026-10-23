# 🚗 Phase 9 — React Authentication Plan

**Goal:** Build the React authentication layer and connect it to the completed FastAPI authentication APIs.

> Backend authentication is already complete and tested. Phase 9 focuses only on the **React frontend authentication**.

---

## 🎯 Phase 9 Objectives

By the end of Phase 9, the frontend should support:

React Frontend  
↓  
Register → FastAPI `/api/auth/register`  
↓  
Login → FastAPI `/api/auth/login`  
↓  
JWT  
↓  
Store Authentication  
↓  
Protected Routes  
↓  
Current User  
↓  
Logout

---

# 1. React Project Setup

Create or verify the frontend application using **React + Vite**.

### Tasks

- Set up React with Vite
- Configure the development server
- Install required dependencies
- Create the frontend folder structure
- Configure the API base URL

### Suggested Structure

client-side/
│
├── src/
│   ├── components/
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── .gitignore
├── package.json
└── vite.config.js

---

# 2. Configure FastAPI API Connection

Connect the React frontend to the existing FastAPI backend.

Development architecture:

React  
↓  
`http://127.0.0.1:8000`  
↓  
FastAPI  
↓  
PostgreSQL

Create a centralized API service in:

`src/services/api.js`

The API service should handle:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

The backend authentication logic should **not** be duplicated in React.

---

# 3. Registration Page

Create:

`src/pages/Register.jsx`

The registration page should contain:

- Username
- Email
- Password
- Confirm Password

### Registration Flow

User enters details  
↓  
Frontend validation  
↓  
`POST /api/auth/register`  
↓  
FastAPI validates request  
↓  
Registration successful  
↓  
Redirect to Login

### Validation

Handle:

- Empty fields
- Invalid email
- Password mismatch
- Invalid password
- Existing username
- Existing email
- Backend validation errors
- Server errors

The frontend should display user-friendly error messages.

---

# 4. Login Page

Create:

`src/pages/Login.jsx`

Fields:

- Email or username
- Password

### Login Flow

User enters credentials  
↓  
`POST /api/auth/login`  
↓  
FastAPI validates credentials  
↓  
JWT returned  
↓  
Store JWT  
↓  
Fetch current user  
↓  
Update authentication state  
↓  
Redirect to Dashboard

Handle:

- Invalid credentials
- Unknown user
- Empty fields
- Backend validation errors
- Server unavailable

---

# 5. JWT Authentication

The frontend must properly handle the JWT returned by FastAPI.

### Flow

Login  
↓  
Receive JWT  
↓  
Store token  
↓  
Use token for protected requests

Protected requests must contain:

`Authorization: Bearer <JWT>`

Authentication logic should be centralized rather than manually adding the token inside every React component.

A reusable API helper should automatically attach the JWT when required.

---

# 6. Auth Context

Create:

`src/context/AuthContext.jsx`

The authentication context should manage global authentication state.

Example state:

- `user`
- `token`
- `isAuthenticated`
- `loading`

Example methods:

- `login()`
- `register()`
- `logout()`

The context should allow any component to determine:

- Who is currently logged in?
- Is the user authenticated?
- What role does the user have?
- Is authentication currently being checked?

Example:

AuthContext  
│  
├── user  
├── token  
├── isAuthenticated  
├── loading  
├── login()  
├── register()  
└── logout()

---

# 7. Current User

Connect React to:

`GET /api/auth/me`

When the application starts:

Application starts  
↓  
Check for stored JWT  
↓  
JWT exists?

YES → Call `/api/auth/me`  
NO → Remain unauthenticated

If the token is valid:

JWT  
↓  
`/me`  
↓  
Current User  
↓  
Update AuthContext

If the token is invalid or expired:

JWT rejected  
↓  
Clear stored authentication  
↓  
Redirect to Login

This ensures refreshing the browser does not unnecessarily log the user out.

---

# 8. Protected Routes

Create:

`src/routes/ProtectedRoute.jsx`

Public routes:

- `/login`
- `/register`

Protected routes:

- `/dashboard`
- `/vehicles`

Future admin routes:

- `/admin`

### Protected Route Flow

User visits `/dashboard`  
↓  
Check authentication  
↓  
Authenticated?

YES → Render Dashboard

NO → Redirect to `/login`

The protected route should also handle the authentication loading state so that users are not redirected before the stored JWT has been checked.

---

# 9. Logout

Implement logout functionality.

### Logout Flow

Logout button  
↓  
Clear JWT  
↓  
Clear current user  
↓  
Update AuthContext  
↓  
Redirect to Login

After logout:

- JWT should no longer be available to API requests
- `user` should become `null`
- `isAuthenticated` should become `false`
- Protected routes should redirect to Login

---

# 10. Role Handling

The backend already supports:

- `USER`
- `ADMIN`

Phase 9 should make the frontend aware of the user's role.

Example:

USER  
↓  
Normal application pages

ADMIN  
↓  
Normal application pages  
+  
Future administrative functionality

However, **the complete Admin UI belongs to a later phase**.

Phase 9 should only establish the authentication and role foundation.

The frontend must never treat the role as a security boundary by itself. Backend authorization remains the source of truth.

---

# 11. Error and Loading States

Authentication should have clear loading and error states.

### Loading States

Display appropriate messages such as:

- `Logging in...`
- `Registering...`
- `Checking authentication...`
- `Logging out...`

### Error States

Handle:

- Invalid credentials
- User already exists
- Invalid token
- Expired token
- Validation errors
- Server unavailable
- Network errors

Do not expose raw backend implementation details to users.

Instead of displaying technical errors directly, show user-friendly messages.

---

# 12. CORS Configuration

The React frontend and FastAPI backend will run on different development ports.

Typical architecture:

React  
`http://localhost:5173`

↓ HTTP requests

FastAPI  
`http://localhost:8000`

↓  

PostgreSQL

FastAPI must allow the React development origin through CORS.

Verify that requests from:

`http://localhost:5173`

can access the authentication APIs.

Do not use unrestricted CORS such as allowing every origin in production.

---

# 13. Frontend Testing

Phase 9 should include frontend authentication tests.

### Registration Tests

Verify:

- Successful registration
- Duplicate email
- Duplicate username
- Invalid input
- Password mismatch
- Backend validation errors
- Loading state
- Registration redirect

### Login Tests

Verify:

- Successful login
- Wrong password
- Unknown user
- JWT received
- JWT stored
- Current user loaded
- Authentication state updated
- Error state displayed

### Authentication Tests

Verify:

- Current user loaded on application startup
- Valid JWT allows protected routes
- Missing JWT redirects to Login
- Invalid JWT is handled
- Expired JWT is handled
- JWT is attached to protected API requests

### Logout Tests

Verify:

- JWT removed
- User state cleared
- Authentication state cleared
- Protected page becomes inaccessible
- User redirected to Login

---

# 🏁 Phase 9 Completion Criteria

Phase 9 is complete when the following authentication flow works:

Register  
↓  
Login  
↓  
JWT received  
↓  
JWT stored  
↓  
AuthContext updated  
↓  
`/api/auth/me` called  
↓  
Current user loaded  
↓  
Dashboard displayed  
↓  
Protected APIs can be accessed  
↓  
Logout  
↓  
JWT removed  
↓  
User state cleared  
↓  
Redirect to Login

---

# 📁 Final Phase 9 Frontend Structure

client-side/
│
├── src/
│   ├── components/
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── tests/
│   ├── Login.test.jsx
│   ├── Register.test.jsx
│   ├── AuthContext.test.jsx
│   └── ProtectedRoute.test.jsx
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── vite.config.js

---

# 📦 Final Phase 9 Deliverables

- ✅ React + Vite setup
- ✅ API service
- ✅ FastAPI connection
- ✅ Register page
- ✅ Login page
- ✅ JWT handling
- ✅ Centralized authentication
- ✅ AuthContext
- ✅ Current-user handling
- ✅ Protected routes
- ✅ Logout
- ✅ Role awareness
- ✅ Error states
- ✅ Loading states
- ✅ CORS verification
- ✅ Frontend authentication tests

---

# 🔄 Phase 9 Authentication Architecture

React Frontend  
│  
├── Register  
│      ↓  
│   FastAPI `/api/auth/register`  
│      ↓  
│   PostgreSQL  
│  
├── Login  
│      ↓  
│   FastAPI `/api/auth/login`  
│      ↓  
│   JWT  
│      ↓  
│   AuthContext  
│  
├── Application Startup  
│      ↓  
│   Stored JWT  
│      ↓  
│   `/api/auth/me`  
│      ↓  
│   Current User  
│  
├── Protected Routes  
│      ↓  
│   Dashboard / Vehicles  
│  
└── Logout  
       ↓  
   Clear JWT + User  
       ↓  
   Login

---

# 🏆 Phase 9 End Result

By the end of Phase 9:

React Frontend  
↓  
Authentication UI  
↓  
FastAPI Authentication API  
↓  
JWT Authentication  
↓  
Current User  
↓  
Protected React Routes  
↓  
Authenticated Application

The FastAPI authentication backend from the previous phases will be reused. **No authentication logic needs to be rebuilt on the backend.**

**Phase 9 officially starts the frontend development portion of the Car Dealership Inventory System.**