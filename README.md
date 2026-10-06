# Student Task Management System 🎓📋

A modern, full-stack **Student Task Management System** designed for university coursework, assignment tracking, and deadline management. Built with **React.js (Vite)** on the frontend, **Express.js (Node.js)** on the backend, and **PostgreSQL** for relational data persistence.

---

## 🌟 Key Features

### 1. Authentication & Security
- **Registration & Login**: Secure account creation and authentication using email and password.
- **Password Security**: Passwords hashed securely using `bcryptjs` with salt rounds.
- **JWT Protection**: Stateless authorization with JSON Web Tokens (`Bearer <token>`).
- **User Isolation**: Strict database-level ownership checks ensuring students can only access, view, update, and delete their own tasks.
- **Protected Client Routes**: React Router guards ensuring private pages are only accessible when authenticated.

### 2. Interactive Student Dashboard
- **Metric Cards**: Real-time counter cards for:
  - Total Tasks
  - Pending Tasks
  - Completed Tasks
  - Overdue Tasks (automatically detects past-due uncompleted assignments)
- **Completion Progress Bar**: Visual progress indicator calculating the percentage of finished coursework.
- **Recent Tasks Feed**: Displays the 5 most recently created/updated assignments with direct detail view.
- **Quick Actions**: One-click modal to create tasks from anywhere in the dashboard.

### 3. Task Management (CRUD)
- **Create**: Add tasks with Title, Description, Priority (`Low`, `Medium`, `High`), Status (`Pending`, `In Progress`, `Completed`), and Due Date.
- **Read & Filter**:
  - Live search by title or description.
  - Filter by Status (`Pending`, `In Progress`, `Completed`).
  - Filter by Priority (`Low`, `Medium`, `High`).
  - Sort by Due Date or Creation Date (`ASC` / `DESC`).
- **View Toggle**: Switch seamlessly between **Data Table View** and **Card/Grid View**.
- **Quick Status Toggle**: Mark tasks as Completed or Pending with a single click.
- **Task Details Modal**: View complete metadata including creation date, last updated date, and overdue indicators.
- **Edit**: Pre-populated modal form with client and server validation.
- **Delete with Confirmation**: Safety confirmation modal to prevent accidental deletion.

### 4. Modern User Interface
- **Sidebar Navigation**: Responsive sidebar featuring Dashboard, My Tasks, and Logout with active indicator.
- **Top Navigation Bar**: Displays student's name, email, and mobile hamburger toggle.
- **Clean Theme**: Light palette with clean borders and blue/indigo accent colors.
- **Toast Notifications**: Interactive toast alerts for success, warnings, and errors.
- **Empty States & Spinners**: Polished UX during network requests and when no tasks match filters.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Bootstrap 5, Axios, React Router DOM v7, React Icons |
| **Backend** | Node.js, Express.js, `pg` (node-postgres Pool), `jsonwebtoken`, `bcryptjs`, `dotenv`, `cors` |
| **Database** | PostgreSQL 14+ (tested on PostgreSQL 18) |

---

## 📁 Project Structure

```
project_midterm/
├── backend/
│   ├── config/
│   │   └── db.js                 # PostgreSQL connection pool configuration
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Me endpoints
│   │   └── taskController.js     # Task CRUD, filters, status patch, stats
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & ownership protection
│   │   └── errorHandler.js       # Centralized error and PostgreSQL error handler
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   └── taskRoutes.js         # /api/tasks routes
│   ├── scripts/
│   │   ├── init-db.js            # Automated DB creation, schema & seed script
│   │   └── test-api.js           # Automated API test suite
│   ├── app.js                    # Express application setup & CORS
│   ├── server.js                 # Server entry point
│   ├── .env                      # Backend local environment config (ignored by git)
│   ├── .env.example              # Backend environment template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeleteConfirmModal.jsx # Delete confirmation dialog
│   │   │   ├── Layout.jsx             # Shell layout with sidebar & topbar
│   │   │   ├── Navbar.jsx             # Top navigation bar
│   │   │   ├── ProtectedRoute.jsx     # Route authentication guard
│   │   │   ├── Sidebar.jsx            # Sidebar navigation
│   │   │   ├── TaskDetailModal.jsx    # Complete task details view modal
│   │   │   └── TaskModal.jsx          # Task create/edit modal form
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        # Auth state management
│   │   │   └── ToastContext.jsx       # Global toast notification provider
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # Metric cards, progress, recent tasks
│   │   │   ├── Login.jsx              # Student login page
│   │   │   ├── NotFound.jsx           # 404 fallback page
│   │   │   ├── Register.jsx           # Student registration page
│   │   │   └── TaskList.jsx           # CRUD tasks list (table / card views)
│   │   ├── services/
│   │   │   └── api.js                 # Axios instance with interceptors
│   │   ├── App.jsx                    # Application routes
│   │   ├── index.css                  # Custom styling and design system
│   │   └── main.jsx                   # React root entry point
│   ├── index.html
│   ├── .env                       # Frontend environment config
│   ├── .env.example               # Frontend environment template
│   └── package.json
│
├── database/
│   ├── schema.sql                 # Table definitions, constraints, triggers, indexes
│   └── seed.sql                   # Sample test users and tasks
│
├── package.json                   # Root workspace scripts
└── README.md
```

---

## 🗄️ Database Architecture

### Users Table (`users`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Unique user identifier |
| `name` | VARCHAR(100) | NOT NULL | Full name of the student |
| `email` | VARCHAR(150) | UNIQUE, NOT NULL | Student's email for login |
| `password` | TEXT | NOT NULL | Encrypted password hash |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account registration timestamp |

### Tasks Table (`tasks`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Unique task identifier |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | Associated student |
| `title` | VARCHAR(200) | NOT NULL | Task title / assignment name |
| `description` | TEXT | NULLABLE | Detailed description / notes |
| `priority` | VARCHAR(20) | CHECK ('Low', 'Medium', 'High') | Priority level (default: Medium) |
| `status` | VARCHAR(20) | CHECK ('Pending', 'In Progress', 'Completed') | Current task status (default: Pending) |
| `due_date` | DATE | NULLABLE | Deadline date |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Task creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Auto-updated via PostgreSQL trigger |

---

## 🚀 Getting Started & Setup Guide

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18 or higher): `node -v`
- **npm** (v9 or higher): `npm -v`
- **PostgreSQL** (v14 or higher) with pgAdmin 4 or `psql` command line tools.

---

### 2. Database Setup

#### Option A: Automated Setup via Node Script (Recommended)
You can automatically create the database, build tables, indexes, triggers, and insert seed data with one simple command:

```powershell
# From the project root:
npm run init-db

# Or from the backend directory:
cd backend
npm run init-db
```

#### Option B: Setup Using pgAdmin 4
1. Open **pgAdmin 4** and connect to your PostgreSQL server.
2. Right-click on **Databases** -> **Create** -> **Database...**
3. Set Database name to: `student_task_db` and click **Save**.
4. Right-click `student_task_db` -> Select **Query Tool**.
5. Open and execute `database/schema.sql` (Click the **Execute / Play** button or press `F5`).
6. Open and execute `database/seed.sql` to populate sample data.

#### Option C: Setup Using PostgreSQL Command Line (`psql`)
```powershell
# 1. Connect to psql
psql -U postgres

# 2. Create database
CREATE DATABASE student_task_db;
\q

# 3. Apply schema & seed data
psql -U postgres -d student_task_db -f database/schema.sql
psql -U postgres -d student_task_db -f database/seed.sql
```

---

### 3. Environment Variables Configuration

#### Backend Configuration (`backend/.env`)
Create or edit `backend/.env` (a `.env.example` file is provided):

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=student_task_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=super_secret_jwt_key_student_tasks_2026
CLIENT_URL=http://localhost:5173
```

#### Frontend Configuration (`frontend/.env`)
Create or edit `frontend/.env` (a `.env.example` file is provided):

```env
VITE_API_URL=http://localhost:5000/api
```

---

### 4. Running the Applications

#### Running Backend
```powershell
cd backend
npm install
npm run dev     # Starts server on http://localhost:5000 with nodemon
# or: npm start
```

#### Running Frontend
In a separate terminal window:
```powershell
cd frontend
npm install
npm run dev     # Starts Vite dev server on http://localhost:5173
```

#### Convenient Root Commands
From the root workspace directory, you can also run:
```powershell
npm run init-db         # Initialize PostgreSQL database
npm run backend         # Start backend dev server
npm run frontend        # Start frontend dev server
npm run frontend:build  # Build production frontend bundle
```

Open your browser at: **`http://localhost:5173`**

---

## 🔑 Demo Login Credentials

The database comes pre-seeded with two demo student accounts to demonstrate features and **strict user data isolation**:

| Name | Email | Password | Role / Data |
| :--- | :--- | :--- | :--- |
| **Sophea Meas** | `sophea@example.com` | `password123` | Has 6 sample assignments (Pending, In Progress, Completed, Overdue) |
| **Dara Chan** | `dara@example.com` | `password123` | Has 2 separate assignments (proves private task isolation) |

> 💡 **Tip:** On the Login page, you can click the **"Fill Demo Credentials"** button to autofill Sophea's credentials instantly!

---

## 📡 REST API Reference

### Authentication Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new account (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Login with credentials (`email`, `password`) |
| `GET` | `/api/auth/me` | Protected | Get profile details of authenticated user |

### Task Endpoints
All task endpoints require the `Authorization: Bearer <token>` header and enforce **user ownership checks**.

| Method | Endpoint | Query / Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | `?search=&status=&priority=&sortBy=&sortOrder=` | Retrieve tasks with search, filtering, and sorting |
| `GET` | `/api/tasks/stats/summary` | None | Get aggregate stats for the dashboard |
| `GET` | `/api/tasks/:id` | `:id` parameter | Retrieve a single task by ID |
| `POST` | `/api/tasks` | `{ title, description, priority, status, due_date }` | Create a new task |
| `PUT` | `/api/tasks/:id` | `{ title, description, priority, status, due_date }` | Update an existing task |
| `DELETE` | `/api/tasks/:id` | `:id` parameter | Delete a task |
| `PATCH` | `/api/tasks/:id/status` | `{ status }` | Quickly toggle status (`Pending`, `In Progress`, `Completed`) |

### Health Check Endpoint
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns server health status and timestamp |

---

## 🧪 Automated Testing

An automated test suite is included in `backend/scripts/test-api.js` verifying all 14 endpoint operations and ownership rules:

```powershell
cd backend
node scripts/test-api.js
```

**Verification Results:**
- ✅ Health check
- ✅ User login with bcrypt password verification
- ✅ Profile inspection via `/api/auth/me`
- ✅ Dynamic student registration
- ✅ Rejection of duplicate email registrations (HTTP 409)
- ✅ Rejection of invalid credentials (HTTP 401)
- ✅ Dashboard metrics aggregation & overdue calculations
- ✅ Search & filtering queries
- ✅ Task creation (HTTP 201)
- ✅ Task retrieval by ID
- ✅ Task updating
- ✅ Task status toggle patch
- ✅ **Strict Ownership Isolation**: Verifies that User B receives HTTP 404 when attempting to access User A's tasks
- ✅ Task deletion

---

## 🔒 Security Practices Implemented
1. **Password Hashing**: Irreversible bcrypt hashing (`saltRounds = 10`). Plain-text passwords are never stored.
2. **SQL Injection Defense**: 100% of queries use PostgreSQL parameterized statements (`$1, $2, ...`).
3. **Data Isolation**: All queries on tasks incorporate `WHERE user_id = $X` to guarantee students can only view and manage their own coursework.
4. **Environment Isolation**: `.env` files are excluded in `.gitignore` to prevent credential exposure.
5. **Input Validation**: All forms and endpoints validate email formatting, minimum password length, and enum constraints.

---

## 🎓 University Presentation Checklist
When demonstrating this project for your evaluation or midterm presentation:
1. Show the **Dashboard**: Highlight the 4 metric cards, completion percentage, and overdue calculation.
2. Navigate to **My Tasks**:
   - Demonstrate the **View Switcher** (Table view vs. Grid cards).
   - Test the live **Search Bar** by typing an assignment title.
   - Filter by **Status** (`Pending`, `In Progress`, `Completed`) and **Priority** (`High`, `Medium`, `Low`).
   - Click the **Done Checkbox** to toggle completion status in real time.
3. Click **Create Task**: Show modal validation and add a new assignment.
4. Click **View Details**: Inspect full creation timestamp and overdue indicators.
5. Click **Edit Task**: Modify title or deadline.
6. Click **Delete Task**: Demonstrate the safety confirmation dialog.
7. Log out and log in as `dara@example.com` to demonstrate that Dara has a completely isolated task list from Sophea.
