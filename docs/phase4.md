# Phase 4 — Authentication

Now we'll implement the required authentication endpoints:

    POST /api/auth/register
    POST /api/auth/login

We'll use:

- **FastAPI** — API
- **SQLAlchemy** — Database ORM
- **PostgreSQL** — Database persistence
- **bcrypt / password hashing** — Secure password storage
- **JWT** — Token-based authentication
- **pytest** — Test-Driven Development (TDD)

---

# Phase 4 Workflow

    Phase 4A
    Authentication Dependencies
            ↓
    Phase 4B
    Registration Tests 🔴
            ↓
    Phase 4C
    Registration Implementation 🟢
            ↓
    Phase 4D
    Login Tests 🔴
            ↓
    Phase 4E
    Login Implementation 🟢
            ↓
    Phase 4F
    JWT Authentication
            ↓
    Phase 4G
    Protected Endpoint

---

# Phase 4A — Authentication Dependencies

Before writing authentication code, let's check what is already installed.

## 1. Check Installed Packages

Run:

    pip list

Look specifically for:

    fastapi
    sqlalchemy
    psycopg2
    python-dotenv
    pytest
    alembic

---

## 2. Authentication Packages

The authentication implementation will require packages for:

- Password hashing
- JWT token creation and verification
- Testing

We will install only the packages that are missing from the current environment.

---

# Phase 4B — Registration Tests 🔴

After the dependencies are ready, we will begin TDD by writing tests for:

    POST /api/auth/register

The registration tests will verify:

- A new user can register
- Username is required
- Email is required
- Password is required
- Username must be unique
- Email must be unique
- Password is hashed before storage
- Plain-text passwords are never stored
- Default role is `user`
- Successful registration returns the expected response

The tests should initially fail:

    Test
      ↓
    RED ❌

---

# Phase 4C — Registration Implementation 🟢

Implement the registration endpoint:

    POST /api/auth/register

The implementation will:

    Receive registration data
            ↓
    Validate the input
            ↓
    Check username/email
            ↓
    Hash the password
            ↓
    Create User
            ↓
    Save to PostgreSQL
            ↓
    Return response

After implementation:

    Test
      ↓
    GREEN ✅

---

# Phase 4D — Login Tests 🔴

Write tests for:

    POST /api/auth/login

The tests will verify:

- A registered user can log in
- Invalid username/email is rejected
- Invalid password is rejected
- Correct credentials are accepted
- A JWT token is returned
- The correct token type is returned

The tests should initially fail:

    Test
      ↓
    RED ❌

---

# Phase 4E — Login Implementation 🟢

Implement:

    POST /api/auth/login

The login flow will be:

    Login Request
          ↓
    Find User
          ↓
    Verify Password
          ↓
    Create JWT
          ↓
    Return Access Token

After implementation:

    Test
      ↓
    GREEN ✅

---

# Phase 4F — JWT Authentication

Implement JWT-based authentication.

The JWT will contain information needed to identify the authenticated user.

The authentication flow will be:

    User Login
        ↓
    Verify Credentials
        ↓
    Generate JWT
        ↓
    Return JWT
        ↓
    Client Stores Token
        ↓
    Client Sends Token
        ↓
    FastAPI Verifies JWT
        ↓
    Authenticated User

The token will be sent using the HTTP Authorization header:

    Authorization: Bearer <JWT_TOKEN>

---

# Phase 4G — Protected Endpoint

Create a protected endpoint to verify JWT authentication.

Example:

    GET /api/auth/me

The endpoint should:

- Require a valid JWT
- Identify the current user
- Reject missing tokens
- Reject invalid tokens
- Return authenticated user information

Expected flow:

    Request
       ↓
    Authorization Header
       ↓
    JWT Verification
       ↓
    Current User
       ↓
    Response

---

# Phase 4 Authentication Architecture

    React Frontend
          │
          │ Register / Login
          ▼
       FastAPI
          │
          ├───────────────┐
          ▼               ▼
     Authentication   PostgreSQL
          │
          ▼
        JWT
          │
          ▼
    Protected APIs

---

# Phase 4 Completion Checklist

- [ ] Authentication dependencies checked
- [ ] Required authentication packages installed
- [ ] Registration tests written
- [ ] Registration tests initially fail 🔴
- [ ] Registration endpoint implemented
- [ ] Registration tests pass 🟢
- [ ] Password hashing implemented
- [ ] Login tests written
- [ ] Login tests initially fail 🔴
- [ ] Login endpoint implemented
- [ ] Login tests pass 🟢
- [ ] JWT generation implemented
- [ ] JWT verification implemented
- [ ] Protected endpoint created
- [ ] Protected endpoint tests pass
- [ ] Authentication flow verified through Swagger
- [ ] Changes committed to Git

---

# Start with Phase 4A

Before writing authentication code, check the current environment.

Run:

    pip list

Look specifically for:

    fastapi
    sqlalchemy
    psycopg2
    python-dotenv
    pytest
    alembic

Then install only the authentication packages that are missing.

After the dependencies are ready, begin with the first **RED test for user registration**.