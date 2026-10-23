# 🚗 Car Dealership Inventory Management System

**Author: Shashank Bhat**



A full-stack web application for managing a car dealership's vehicle inventory. The system allows authenticated dealership users to view, add, update, delete, search, filter, purchase, and restock vehicles through a responsive React-based web interface.

The application is built using **React.js, FastAPI, PostgreSQL, and JWT-based authentication**, with automated testing for backend APIs and frontend functionality.

---

## 📌 Project Status

**✅ Completed — Phase 12**

The Car Dealership Inventory Management System has been developed as a full-stack application with:

- User registration and authentication
- JWT-based authentication
- Protected frontend routes
- PostgreSQL database integration
- FastAPI REST API
- Vehicle CRUD operations
- Vehicle search and filtering
- Vehicle detail pages
- Purchase inventory operation
- Restock inventory operation
- Form validation
- Error handling
- Responsive frontend UI
- Backend API testing
- Frontend component/page testing

---

# 🎯 Project Objective

The objective of this project is to build a complete inventory management system for a car dealership.

The system provides authenticated users with an interface to manage dealership vehicles and their available quantities.

The application follows a full-stack architecture:

    React Frontend
           ↓
       REST API
           ↓
    FastAPI Backend
           ↓
    PostgreSQL Database

---

# ✨ Features

## 🔐 Authentication

- User registration
- User login
- JWT access-token authentication
- Authenticated user information
- Protected application routes
- Automatic redirection to login when authentication is missing or invalid
- Logout functionality

---

## 🚘 Vehicle Management

Authenticated users can:

- View all vehicles
- View individual vehicle details
- Add a new vehicle
- Update vehicle information
- Delete vehicles
- Search vehicles
- Filter vehicles by category
- Filter vehicles by stock availability
- View vehicle quantity
- Purchase vehicles
- Restock vehicles

---

## 📦 Inventory Operations

### Purchase Vehicle

Users can purchase an available vehicle.

The purchase operation decreases the available vehicle quantity.

Example:

    Current Quantity: 5
    Purchase: 1
    New Quantity: 4

The system prevents purchasing vehicles when the available quantity is insufficient.

---

### Restock Vehicle

Users can increase the inventory quantity of an existing vehicle.

Example:

    Current Quantity: 4
    Restock: 3
    New Quantity: 7

Restock validation prevents invalid quantities from being submitted.

---

## 🔎 Search and Filtering

The vehicle catalog supports:

- Vehicle search
- Category filtering
- Stock availability filtering
- Combined filtering
- Dynamic inventory results

Supported vehicle categories include:

- Sedan
- SUV
- Truck
- Hatchback
- Electric
- Coupe

---

## 📝 Form Validation

Vehicle forms include validation for fields such as:

- Vehicle name
- Category
- Price
- Quantity

Authentication forms also validate required user information.

Invalid input is handled before submitting requests to the backend.

---

## ⚠️ Error Handling

The application handles common errors including:

- Invalid authentication
- Missing authentication token
- Invalid vehicle ID
- Vehicle not found
- Invalid vehicle data
- Invalid quantity
- Insufficient inventory
- Backend/API errors
- Database-related errors

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Tailwind CSS

## Backend

- Python
- FastAPI
- Pydantic
- JWT Authentication

## Database

- PostgreSQL

## Testing

### Backend

- pytest
- FastAPI TestClient

### Frontend

- Vitest
- React Testing Library

## Development Tools

- Git
- GitHub
- VS Code
- npm
- Python Virtual Environment
- PostgreSQL

---

# 🏗️ Application Architecture

    ┌─────────────────────┐
    │   React Frontend    │
    │                     │
    │ Login               │
    │ Register            │
    │ Dashboard           │
    │ Vehicle List        │
    │ Vehicle Details     │
    │ Add Vehicle         │
    │ Update Vehicle      │
    └──────────┬──────────┘
               │
               │ HTTP / REST API
               ▼
    ┌─────────────────────┐
    │   FastAPI Backend   │
    │                     │
    │ Authentication      │
    │ Vehicle APIs        │
    │ Validation          │
    │ Business Logic      │
    └──────────┬──────────┘
               │
               │ SQL
               ▼
    ┌─────────────────────┐
    │     PostgreSQL      │
    │                     │
    │ Users               │
    │ Vehicles            │
    └─────────────────────┘

---

# 📁 Project Structure

    car-dealership-inventory/
    │
    ├── client-side/
    │   ├── public/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── services/
    │   │   ├── tests/
    │   │   ├── App.jsx
    │   │   ├── App.css
    │   │   └── main.jsx
    │   ├── package.json
    │   ├── package-lock.json
    │   ├── vite.config.js
    │   └── .gitignore
    │
    ├── server-side/
    │   ├── app/
    │   │   ├── models/
    │   │   ├── routers/
    │   │   ├── schemas/
    │   │   ├── services/
    │   │   ├── database.py
    │   │   ├── dependencies.py
    │   │   └── main.py
    │   │
    │   ├── tests/
    │   │   ├── auth/
    │   │   ├── vehicles/
    │   │   └── ...
    │   │
    │   ├── requirements.txt
    │   ├── .env
    │   └── .gitignore
    │
    ├── .gitignore
    ├── README.md
    └── PROMPTS.md

> `.venv/`, `node_modules/`, `.env`, `__pycache__/`, and other local or sensitive files are excluded from version control.

---

# 🚀 Local Setup and Installation

## Prerequisites

Make sure the following software is installed:

- Git
- Node.js
- npm
- Python 3.x
- PostgreSQL
- VS Code or another code editor

Verify the installations:

    git --version
    node --version
    npm --version
    python --version
    psql --version

---

# 1. Clone the Repository

    git clone <YOUR_GITHUB_REPOSITORY_URL>

Navigate into the project:

    cd car-dealership-inventory

---

# 2. Backend Setup

Navigate to the backend:

    cd server-side

---

## Create Virtual Environment

    python -m venv .venv

---

## Activate Virtual Environment

### Windows Command Prompt

    .venv\Scripts\activate

### Windows PowerShell

    .venv\Scripts\Activate.ps1

After activation:

    (.venv)

should appear in the terminal.

---

# 3. Install Backend Dependencies

    pip install -r requirements.txt

---

# 4. Configure Environment Variables

Copy `server-side/.env.example` to `server-side/.env` and set your local values.

Example:

    DATABASE_URL=postgresql://username:password@localhost:5432/car_dealership
    TEST_DATABASE_URL=postgresql://username:password@localhost:5432/car_dealership_test
    JWT_SECRET_KEY=replace_with_a_long_random_secret
    JWT_ALGORITHM=HS256
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

Replace the values with your local configuration.

> **Important:** Never commit `.env` to GitHub.

An `.env.example` file can be used to document required variables without exposing credentials.

Example:

    TEST_DATABASE_URL=postgresql://username:password@localhost:5432/car_dealership_test
    JWT_SECRET_KEY=replace_with_a_long_random_secret
    JWT_ALGORITHM=HS256
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

---

# 5. PostgreSQL Setup

Make sure PostgreSQL is installed and running.

Create the application database and a separate test database:

    CREATE DATABASE car_dealership;
    CREATE DATABASE car_dealership_test;

The database connection should match the `DATABASE_URL` configured in `.env`.

Example:

    DATABASE_URL=postgresql://username:password@localhost:5432/car_dealership

---

# 6. Start the Backend

From the `server-side` directory:

    uvicorn app.main:app --reload

Backend:

    http://127.0.0.1:8000

FastAPI Swagger documentation:

    http://127.0.0.1:8000/docs

---

# 7. Frontend Setup

Open a second terminal.

Navigate to the project:

    cd car-dealership-inventory

Then:

    cd client-side

---

## Install Frontend Dependencies

    npm install

---

## Start Frontend

    npm run dev

The frontend will usually be available at:

    http://localhost:5173

---

# ▶️ Running the Complete Application

The backend and frontend should run simultaneously.

## Terminal 1 — Backend

    cd car-dealership-inventory/server-side

Activate the environment:

    .venv\Scripts\activate

Start FastAPI:

    uvicorn app.main:app --reload

Backend:

    http://127.0.0.1:8000

API documentation:

    http://127.0.0.1:8000/docs

---

## Terminal 2 — Frontend

    cd car-dealership-inventory/client-side

Start Vite:

    npm run dev

Frontend:

    http://localhost:5173

---

# 🔐 Authentication Flow

The application uses JWT-based authentication.

    User
      ↓
    Register
      ↓
    Login
      ↓
    FastAPI validates credentials
      ↓
    JWT access token generated
      ↓
    Frontend stores authentication state
      ↓
    Protected API requests include token
      ↓
    FastAPI verifies JWT
      ↓
    Authorized request processed

Users who are not authenticated cannot access protected application functionality.

If authentication is missing or the token becomes invalid, the application redirects the user to the login page.

---

# 👤 User Authentication APIs

The authentication system provides endpoints for:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user and obtain JWT |
| GET | `/api/auth/me` | Get the currently authenticated user |

New registrations receive the `USER` role. To enable the admin-only vehicle forms in a local demo, register and log in once, then promote that account in PostgreSQL:

```sql
UPDATE users
SET role = 'ADMIN'
WHERE email = 'admin@example.com';
```

Sign out and sign back in so the frontend refreshes the account role.

---

# 🚘 Vehicle API

The backend provides REST APIs for vehicle management.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vehicles` | Get all vehicles |
| GET | `/api/vehicles/search` | Search by make, model, category, or price range |
| GET | `/api/vehicles/{id}` | Get a specific vehicle |
| POST | `/api/vehicles` | Add a vehicle |
| PUT | `/api/vehicles/{id}` | Update a vehicle |
| DELETE | `/api/vehicles/{id}` | Delete a vehicle |
| POST | `/api/vehicles/{id}/purchase` | Purchase vehicle quantity |
| POST | `/api/vehicles/{id}/restock` | Restock vehicle quantity |

All vehicle endpoints require a valid JWT. Creating, updating, deleting, and restocking vehicles require an admin account. A regular authenticated user can view, search, and purchase vehicles.

---

# 🔄 Frontend and Backend Communication

    React Application
           │
           │ HTTP Requests
           │
           ▼
    FastAPI REST API
           │
           │ Authentication
           │ Validation
           │ Business Logic
           ▼
    PostgreSQL

The frontend communicates with FastAPI through REST API requests.

JWT authentication is used to authorize protected requests.

---

# 🖥️ Application Pages

The application contains the following major screens:

## Login

Allows existing users to authenticate.

## Register

Allows new users to create an account.

## Dashboard

Displays authenticated user information and provides access to the application.

## Vehicle List

Displays dealership inventory with:

- Vehicle cards
- Categories
- Stock status
- Search
- Filters
- Vehicle count
- Add Vehicle action

## Vehicle Details

Displays detailed information for an individual vehicle.

Users can:

- Purchase inventory
- Restock inventory
- Update vehicle information
- Delete the vehicle
- Return to the vehicle list

## Add Vehicle

Provides a form for creating a new vehicle record.

---

# 🔍 Vehicle Search and Filtering

The vehicle catalog provides filtering functionality for easier inventory management.

Available filters include:

    All
    Sedan
    SUV
    Truck
    Hatchback
    Electric
    Coupe

An **In Stock Only** filter is also available.

The vehicle list dynamically updates based on the selected search and filter criteria.

---

# 📦 Inventory Management

Each vehicle maintains an inventory quantity.

### Purchase

    Quantity = Quantity - Purchase Amount

### Restock

    Quantity = Quantity + Restock Amount

The backend validates inventory operations before updating the database.

---

# 🧪 Testing

Testing was implemented for both the backend and frontend.

## Backend Testing

The backend uses:

- pytest
- FastAPI TestClient

Backend tests cover areas including:

- Authentication
- User registration
- User login
- Authenticated user retrieval
- Vehicle creation
- Vehicle retrieval
- Vehicle update
- Vehicle deletion
- Vehicle inventory operations
- Authentication protection
- Validation and error handling

---

## Frontend Testing

The frontend uses:

- Vitest
- React Testing Library

Frontend tests cover areas including:

- Vehicle listing and display
- Vehicle search
- Vehicle category filtering
- Vehicle stock filtering
- Vehicle price filtering
- Vehicle creation
- Vehicle form validation
- Vehicle details display
- Vehicle purchase
- Vehicle restocking
- Vehicle deletion
- Empty inventory handling
- Invalid vehicle ID handling
- API error handling
- Authentication-related functionality
- Admin authorization
- Normal user restrictions
- Navigation and redirects
- Preservation of vehicle data after failed operations

Latest verified test results:

- **Backend:** 89 passed
- **Frontend:** 54 passed across 5 test files
- **Frontend production build:** passed

See [TEST_REPORT.md](TEST_REPORT.md) for the commands and environment used.

---

# ✅ Verification

After starting the application, verify the following.

## Frontend

Open:

    http://localhost:5173

The React application should load.

## Backend

Open:

    http://127.0.0.1:8000

The FastAPI application should respond.

## Swagger

Open:

    http://127.0.0.1:8000/docs

Swagger UI should display the available API endpoints.

## Database

Verify:

- PostgreSQL is running.
- `car_dealership` database exists.
- Database credentials are correct.
- `DATABASE_URL` is configured correctly.
- FastAPI can connect to PostgreSQL.

---

# 🧪 Manual Functional Verification

The following application flows were verified during development:

### Authentication

- User registration
- User login
- JWT authentication
- `/me` authentication
- Protected routes
- Logout
- Invalid/missing token handling

### Vehicle Management

- View vehicle list
- View vehicle details
- Add vehicle
- Update vehicle
- Delete vehicle
- Search vehicles
- Filter vehicles
- Purchase vehicle
- Restock vehicle

### Inventory

- Quantity updates after purchase
- Quantity updates after restock
- Validation for inventory operations
- Prevention of invalid inventory values

---

# 🛠️ Troubleshooting

## Python Virtual Environment Not Activating

### Command Prompt

    .venv\Scripts\activate

### PowerShell

    .venv\Scripts\Activate.ps1

---

## Backend Dependencies Missing

Activate the virtual environment:

    .venv\Scripts\activate

Then:

    pip install -r requirements.txt

---

## Backend Server Not Starting

Verify the current directory:

    cd server-side

Activate the environment:

    .venv\Scripts\activate

Start FastAPI:

    uvicorn app.main:app --reload

---

## Frontend Dependencies Missing

Navigate to:

    cd client-side

Install dependencies:

    npm install

Start the application:

    npm run dev

---

## Node.js or npm Not Recognized

Check:

    node --version
    npm --version

If either command is unavailable, install Node.js and restart the terminal.

---

## PostgreSQL Connection Error

Check:

- PostgreSQL is running.
- The database exists.
- Username is correct.
- Password is correct.
- Port is correct.
- Database name is correct.
- `.env` exists inside `server-side`.
- `DATABASE_URL` is correct.

Example:

    DATABASE_URL=postgresql://username:password@localhost:5432/car_dealership

---

# 🛑 Stopping the Application

To stop either development server:

    Ctrl + C

Press `Ctrl + C` in the corresponding terminal.

---

# ⚡ Quick Start

After completing the initial setup:

## Backend

    cd car-dealership-inventory/server-side
    .venv\Scripts\activate
    uvicorn app.main:app --reload

## Frontend

Open another terminal:

    cd car-dealership-inventory/client-side
    npm run dev

Then open:

    Frontend:
    http://localhost:5173

    Backend:
    http://127.0.0.1:8000

    API Documentation:
    http://127.0.0.1:8000/docs

---

# 📸 Screenshots

The following screenshots show the current application UI.

## Login

![Login page](outputs/login.jpg)

## Register

![Registration page](outputs/register.jpg)

## Dashboard

![User dashboard](outputs/user/user_dashboard.jpg)

## Vehicle Catalog

![Vehicle inventory](outputs/user/user_searchbar.jpg)

## Vehicle Details

![Purchase flow](outputs/user/user_purchase.jpg)

## Add Vehicle

![Admin vehicle form](outputs/admin/admin_addVehicle.jpg)

---

# 📈 Development Phases

The project was developed incrementally through multiple phases.

    Phase 1
    PostgreSQL Setup
            ↓
    Phase 2
    FastAPI ↔ PostgreSQL Connection
            ↓
    Phase 3
    Database Models
            ↓
    Phase 4
    Authentication
            ↓
    Phase 5
    Vehicle CRUD APIs
            ↓
    Phase 6
    Backend Validation & Error Handling
            ↓
    Phase 7
    Backend Testing
            ↓
    Phase 8
    API & Inventory Functionality
            ↓
    Phase 9
    React Authentication
            ↓
    Phase 10
    React Vehicle Management
            ↓
    Phase 11
    Vehicle Management UI Improvements
            ↓
    Phase 12
    Testing, Integration & Finalization

---

# 📚 Key Concepts Demonstrated

This project demonstrates practical implementation of:

- Full-stack web development
- REST API development
- React component architecture
- FastAPI application development
- PostgreSQL database integration
- CRUD operations
- JWT authentication
- Protected routes
- API authorization
- Form validation
- Error handling
- Inventory management
- Search and filtering
- Automated testing
- Frontend-backend integration
- Git and GitHub workflow

---

# 🔒 Security Considerations

The application follows basic security practices including:

- Password hashing
- JWT-based authentication
- Protected API endpoints
- Authentication validation
- Environment variables for sensitive configuration
- `.env` excluded from version control
- Input validation using backend schemas

Sensitive credentials should never be committed to the repository.

---

# 🌱 Future Improvements

Potential future improvements include:

- Vehicle image uploads
- Advanced inventory reports
- Sales history
- Purchase history
- Sorting
- Advanced analytics
- Deployment using cloud services
- Docker containerization
- CI/CD pipeline
- Production database configuration

---


# 🤖 My AI Usage

- **Amazon Q** — Used for writing the implementation plan and development approach.
- **Gemini** — Used for creating UI prompts based on the implementation plan and generating UI design ideas.


AI assistance from **ChatGPT** was used during the development of this project for:

- Project planning and phase breakdown
- FastAPI project setup guidance
- PostgreSQL connection setup
- Database and API design guidance
- Authentication and JWT implementation guidance
- React frontend development guidance
- API integration guidance
- Debugging frontend and backend issues
- Error diagnosis and troubleshooting
- Test case development guidance
- pytest and frontend testing guidance
- UI improvement suggestions
- README documentation
- Understanding technical concepts
- Reviewing implementation steps

For the current kata-alignment changes, ChatGPT was also used to review the API against the requirements, add backend tests before the route and authorization changes, implement those changes, and update documentation. Suggestions were checked against the code and test results before being kept.

## Reflection

AI helped me find gaps faster and draft focused tests. I reviewed the changes, ran the test suites, and made the final decisions. I will discuss the search endpoint, JWT protection, and test evidence in my own words during the interview.

---

# OUTPUTS

![Login Screenshot](outputs/login.jpg)
![Logout Screenshot](outputs/logout.jpg)
![Out of Stock Screenshot](outputs/out_of_stock.jpg)
![Register Screenshot](outputs/register.jpg)

![Admin Add Vehicle](outputs/admin/admin_addVehicle.jpg)
![Admin Dashboard](outputs/admin/admin_dashboard.jpg)
![Admin Delete Confirmation](outputs/admin/admin_deleteConfirmation.jpg)
![Admin Purchase](outputs/admin/admin_purchase.jpg)
![Admin Restock Delete Vehicle](outputs/admin/admin_restock_deleteVehicle.jpg)
![Admin Search Bar](outputs/admin/admin_searchbar.jpg)

![User Cannot Add Vehicle](outputs/user/user_cannot_addVehiclle.jpg)
![User Cannot Restock/Delete](outputs/user/user_cannot_restock_delete.jpg)
![User Dashboard](outputs/user/user_dashboard.jpg)
![User Purchase](outputs/user/user_purchase.jpg)
![User Search Bar](outputs/user/user_searchbar.jpg)

---


# 📄 License

This project was developed as part of an assessment/project submission.

---

# 👩‍💻 Author

**Shashank Bhat**

---

# ⭐ Project Summary

The **Car Dealership Inventory Management System** is a full-stack inventory application that combines a React frontend, FastAPI backend, and PostgreSQL database.

The completed system provides authenticated users with the ability to manage dealership vehicle inventory through a responsive web interface, including CRUD operations, search and filtering, purchasing, restocking, authentication, validation, and automated testing.

    React + Vite
          ↓
    FastAPI REST API
          ↓
    JWT Authentication
          ↓
    PostgreSQL

**Status: ✅ Phase 12 Completed**

[def]: outputs/login.png
