# Finora - Finance Tracker Application Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Directory Structure](#directory-structure)
5. [Data Models](#data-models)
6. [API Endpoints](#api-endpoints)
7. [Frontend Pages & Routes](#frontend-pages--routes)
8. [Components](#components)
9. [Data Flow](#data-flow)
10. [Authentication](#authentication)
11. [Configuration](#configuration)
12. [Design System](#design-system)
13. [Key Features](#key-features)
14. [Common Issues & Fixes](#common-issues--fixes)

---

## 1. Project Overview

**Finora** is a full-stack personal finance tracking application that helps users:
- Manage personal finances
- Track income and expenses
- Set and monitor budgets
- Track savings goals
- Generate scheduled financial reports
- Visualize financial data with charts

---

## 2. Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Client)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  Pages   │  │Components│  │ Features│  │  Routes/Router   │ │
│  │  (UI)   │──│  (UI)   │──│  (RTK)  │──│   (React)       │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
│                         │                                       │
│                  ┌─────▼─────┐                                 │
│                  │ apiClient │                                 │
│                  │  (Axios)  │                                 │
│                  └─────┬─────┘                                 │
└────────────────────────┼────────────────────────────────────────┘
                       │ HTTP + JWT Token
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND (Server)                        │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    Middleware Layer                       │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │ │
│  │  │   CORS     │  │    JWT      │  │  Error Handler   │  │ │
│  │  │            │  │  Auth       │  │                 │  │ │
│  │  └─────────────┘  └──────────────┘  └──────────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                         │                                      │
│  ┌─────────────────────▼────────────────────────────────────┐ │
│  │                   Controller Layer                        │ │
│  │  Validates request with Zod → Calls Service               │ │
│  └──────────────────────────────────────────────────────────┘ │
│                         │                                      │
│  ┌─────────────────────▼────────────────────────────────────┐ │
│  │                   Service Layer                            │ │
│  │  Business Logic → MongoDB Operations                    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                         │                                      │
│  ┌─────────────────────▼────────────────────────────────────┐ │
│  │                   Model Layer (Mongoose)                 │ │
│  │  Transactions | Users | Budgets | SavingsTargets        │ │
│  └──────────────────────────────────────────────────────────┘ │
│                         │                                      │
│                    ┌────▼────┐                               │
│                    │ MongoDB │                               │
│                    └─────────┘                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 3. Tech Stack

### Frontend
| Technology | Purpose |
|------------|----------|
| React 18 | UI Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Radix UI | UI Components |
| TanStack Query | Data fetching/caching |
| TanStack Table | Data tables |
| React Router | Navigation |
| Recharts | Charts |
| Sonner | Toasts |
| Lucide React | Icons |
| date-fns | Date formatting |
| Zustand | State management |

### Backend
| Technology | Purpose |
|------------|----------|
| Node.js | Runtime |
| Express | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Zod | Validation |
| bcrypt | Password hashing |
| Passport | Auth middleware |
| node-cron | Scheduled jobs |
| Resend | Email service |

---

## 4. Directory Structure

### Frontend Structure (`client/src/`)

```
client/
├── src/
│   ├── app/
│   │   ├── api-client.ts      # Axios with interceptors
│   │   ├── store.ts          # RTK Query store
│   │   └── hook.ts          # Global hooks
│   ├── components/
│   │   ├── data-table/       # Reusable data table
│   │   ├── transaction/     # Transaction components
│   │   ├── navbar/          # Navigation bar
│   │   ├── sidebar/         # Sidebar navigation
│   │   ├── page-header.tsx # Page title component
│   │   └── ui/              # Radix UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
���   │       ├── table.tsx
│   │       └── ... (30+ more)
│   ├── features/            # API services (RTK Query)
│   │   ├── transaction/
│   │   │   ├── transactionAPI.ts
│   │   │   └── transactionType.ts
│   │   ├── auth/
│   │   ├── budget/
│   │   ├── savings-target/
│   │   ├── analytics/
│   │   ├── report/
│   │   └── user/
│   ├── pages/              # Route pages
│   │   ├── auth/
│   │   │   ├── sign-in.tsx
│   │   │   └── sign-up.tsx
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── budgets/
│   │   ├── savings-targets/
│   │   ├── reports/
│   │   └── settings/
│   ├── routes/              # Router configuration
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilities
│   ├── constant/           # App constants
│   ├── context/             # React contexts
│   └── index.css            # Design system
├── tailwind.config.js
└── vite.config.ts
```

### Backend Structure (`backend/src/`)

```
backend/
├── src/
│   ├── config/              # Configuration
│   │   ├── env.config.ts
│   │   ├── database.config.ts
│   │   ├── passport.config.ts
│   │   ├── resend.config.ts
│   │   └── cloudinary.config.ts
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── transaction.controller.ts
│   │   ├── budget.controller.ts
│   │   ├── savings-target.controller.ts
│   │   ├── analytics.controller.ts
│   │   ├── report.controller.ts
│   │   └── user.controller.ts
│   ├── models/              # Mongoose models
│   │   ├── user.model.ts
│   │   ├── transaction.model.ts
│   │   ├── budget.model.ts
│   │   ├── savings-target.model.ts
│   │   └── report-setting.model.ts
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── transaction.service.ts
│   │   ├── budget.service.ts
│   │   ├── savings-target.service.ts
│   │   ├── analytics.service.ts
│   │   ├── report.service.ts
│   │   └── user.service.ts
│   ├── routes/              # Express routes
│   │   ├── auth.route.ts
│   │   ├── transaction.route.ts
│   │   └── ...
│   ├── validators/          # Zod schemas
│   │   ├── auth.validator.ts
│   │   ├── transaction.validator.ts
│   │   └── ...
│   ├── middlewares/        # Custom middleware
│   ├── cron/               # Scheduled jobs
│   ├── mailers/            # Email templates
│   └── utils/              # Utilities
├── package.json
└── tsconfig.json
```

---

## 5. Data Models

### Transaction Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to User
  title: string,
  description?: string,
  amount: number,             // Stored in cents
  type: "INCOME" | "EXPENSE",
  category: string,          // lowercase (e.g., "groceries")
  date: Date,
  paymentMethod: "CARD" | "BANK_TRANSFER" | "MOBILE_PAYMENT" | "CASH" | "AUTO_DEBIT" | "OTHER",
  isRecurring: boolean,
  recurringInterval?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY",
  nextRecurringDate?: Date,
  status: "PENDING" | "COMPLETED" | "FAILED",
  receiptUrl?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### User Model
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,             // Unique, lowercase
  password: string,         // Hashed
  profilePicture?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Budget Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  category: string,          // lowercase
  amount: number,
  period: "WEEKLY" | "MONTHLY" | "YEARLY",
  startDate: Date,
  alertThreshold: number,    // Default 80%
  createdAt: Date,
  updatedAt: Date
}
```

### SavingsTarget Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  name: string,
  targetAmount: number,
  currentAmount: number,
  deadline?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### ReportSetting Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  schedule: "daily" | "weekly" | "monthly",
  recipients: string[],      // Email addresses
  isActive: boolean,
  lastSentAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 6. API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /register | Register new user |
| POST | /login | Login user |
| POST | /logout | Logout user |

### Transactions (`/api/transaction`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | List all (paginated, filtered) |
| POST | / | Create transaction |
| PATCH | /:id | Update transaction |
| DELETE | /:id | Delete transaction |
| POST | /bulk | Bulk import from CSV |
| DELETE | /bulk | Bulk delete |
| POST | /:id/duplicate | Duplicate transaction |

### Budgets (`/api/budget`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | List budgets |
| POST | / | Create budget |
| PATCH | /:id | Update budget |
| DELETE | /:id | Delete budget |

### Savings Targets (`/api/savings-target`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get active target |
| POST | / | Create/update target |
| DELETE | / | Delete target |

### Analytics (`/api/analytics`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /summary | Dashboard stats |
| GET | /income-expense | Chart data |

### User (`/api/user`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /profile | Get profile |
| PATCH | /profile | Update profile |

### Reports (`/api/report`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /settings | Get settings |
| POST | /settings | Update settings |

---

## 7. Frontend Pages & Routes

### Route Structure
| Route | Page | Description |
|-------|------|-------------|
| `/` | Redirect | → /dashboard or /auth/signin |
| `/auth/signin` | Sign In | Login page |
| `/auth/signup` | Sign Up | Registration page |
| `/dashboard` | Dashboard | Stats, charts, recent transactions |
| `/transactions` | Transactions | All transactions, bulk import |
| `/budgets` | Budgets | Budget management |
| `/savings-targets` | Savings | Savings goals |
| `/reports` | Reports | Scheduled reports |
| `/settings` | Settings | Settings hub |
| `/settings/account` | Account | Profile settings |
| `/settings/appearance` | Appearance | Theme toggle |
| `/settings/billing` | Billing | Plan selection |

---

## 8. Components

### Core Layout Components
| Component | File | Purpose |
|-----------|------|-------------|
| PageHeader | page-header.tsx | Page title, subtitle, actions |
| Navbar | navbar/index.tsx | Top navigation with user menu |
| Sidebar | sidebar/index.tsx | Side navigation menu |
| Logo | logo/logo.tsx | App branding |

### UI Components (`components/ui/`)
30+ reusable Radix UI-based components:
- `Button` - Primary, outline, ghost, destructive variants
- `Card` - Container component
- `Dialog` - Modal dialogs
- `Drawer` - Side drawers
- `Input` - Text input
- `Select` - Dropdown selection
- `Table` - Data tables
- `Calendar` - Date picker
- `Chart` - Recharts wrapper
- `Badge` - Status badges
- `Progress` - Progress bars
- And many more...

### Feature Components
| Component | Purpose |
|-----------|-------------|
| AddTransactionDrawer | Create/edit transaction form |
| TransactionTable | Transaction data table |
| ImportTransactionModal | CSV bulk import |

---

## 9. Data Flow

### Create Transaction Flow
```
1. User fills AddTransactionDrawer form
2. useCreateTransaction mutation called
3. API function sends POST to /api/transaction
4. Axios interceptor adds JWT token
5. passportAuthenticateJwt middleware validates token
6. Zod validates request body
7. transactionService.create inserts into MongoDB
8. Response returned to client
9. React Query cache invalidated
10. UI updates to show new transaction
```

### Read Transactions Flow
```
1. User navigates to /transactions page
2. useGetTransactions query called
3. GET /api/transaction?page=1&limit=10&search=...
4. Middleware validates JWT
5. Controller builds query from params
6. transactionService.getAll fetches with pagination
7. Results cached by React Query
8. TransactionTable renders data
```

### Analytics Dashboard Flow
```
1. Dashboard loads
2. useGetSummary query fires → GET /api/analytics/summary
3. useGetIncomeExpense query fires → GET /api/analytics/income-expense
4. Stats returned and displayed in cards
5. Chart data rendered with Recharts
```

---

## 10. Authentication

### Registration Flow
```
1. User fills signup form (name, email, password)
2. POST /api/auth/register
3. Zod validates input
4. Check if email exists → throw error if exists
5. Hash password with bcrypt
6. Create User in MongoDB
7. Generate JWT token
8. Return token + user data
9. Client stores token in localStorage
10. Redirect to dashboard
```

### Login Flow
```
1. User fills signin form (email, password)
2. POST /api/auth/login
3. Validate input with Zod
4. Find user by email
5. Compare password with bcrypt
6. Generate JWT (contains userId)
7. Return token + user data
8. Client stores token
9. Protected routes accessible
```

### Protected Route Flow
```
1. User navigates to protected route
2. ProtectedRoute checks for token
3. If no token → redirect to /auth/signin
4. If token exists → allow access
5. API calls include token in header
6. Middleware extracts userId from JWT
7. Controllers filter data by userId
```

### Token Management
- JWT stored in localStorage
- Token includes `userId` and expiration
- `useAuthExpiration` hook checks token validity
- If expired → redirect to login

---

## 11. Configuration

### Environment Variables

#### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000
```

#### Backend (`.env`)
```
PORT=5000
FRONTEND_ORIGIN=http://localhost:5173
DATABASE_URI=mongodb://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
RESEND_API_KEY=re_...
CLOUDINARY_API_KEY=...
```

### Design System (CSS Variables)

```css
/* Light Mode */
--background: #f8fafc
--foreground: #0f172a
--card: #ffffff
--primary: #3b82f6
--secondary: #475569
--muted: #f1f5f9
--accent: #e2e8f0
--destructive: #ef4444
--success: #22c55e
--error: #ef4444
--warning: #f59e0b

/* Dark Mode (.dark class) */
--background: #0b1220
--foreground: #e2e8f0
--card: #1e293b
...
```

---

## 12. Design System

### Button Variants
- `default` - Primary blue
- `outline` - Border with transparent background
- `ghost` - No border, transparent
- `destructive` - Red for delete actions
- `error` - Error state
- `success` - Success state
- `warning` - Warning state

### Color Semantics
| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `background` | #f8fafc | #0b1220 |
| `foreground` | #0f172a | #e2e8f0 |
| `card` | #ffffff | #1e293b |
| `primary` | #3b82f6 | #3b82f6 |
| `secondary` | #475569 | #94a3b8 |
| `muted` | #f1f5f9 | #1e293b |
| `destructive` | #ef4444 | #ef4444 |
| `success` | #22c55e | #22c55e |
| `warning` | #f59e0b | #f59e0b |

### Categories (lowercase)
```typescript
const CATEGORIES = [
  "groceries",
  "dining",
  "transportation",
  "utilities",
  "entertainment",
  "shopping",
  "healthcare",
  "travel",
  "housing",
  "income",
  "investments",
  "other"
];
```

---

## 13. Key Features

### Transaction Management
- Add income/expense transactions
- Categorize transactions
- Filter by date range, category, type
- Search transactions
- Bulk import from CSV
- Bulk delete
- Duplicate transactions
- Recurring transactions (daily, weekly, monthly, yearly)

### Budget Management
- Set budget limits per category
- Period-based budgets (weekly, monthly, yearly)
- Alert threshold at 80% of budget
- Track spending vs budget

### Savings Goals
- Set target amount
- Track current progress
- Set deadline

### Analytics Dashboard
- Total balance
- Total income
- Total expenses
- Income vs expense chart
- Recent transactions

### Reports
- Scheduled email reports (daily, weekly, monthly)
- Custom recipients

### Settings
- Account (profile, password)
- Appearance (light/dark theme)
- Billing (plan selection)

---

## 14. Common Issues & Fixes

### 1. Case Sensitivity
- **Issue**: Backend Zod validators are case-sensitive
- **Fix**: Use exact uppercase (INCOME/EXPENSE) for type, paymentMethod

### 2. Categories
- **Issue**: Categories not matching between budgets and transactions
- **Fix**: Store both as lowercase for matching

### 3. Date Handling
- **Issue**: Date formatting issues
- **Fix**: Uses date-fns for formatting, stores as Date objects

### 4. Responsive Tables
- **Issue**: Tables not fitting mobile screens
- **Fix**: DataTable auto-switches to card view on mobile (<768px)

### 5. CSV Import
- **Issue**: Import errors
- **Fix**: Follow exact format (headers: title, amount, type, date, category, paymentMethod, description)

### Sample CSV Format
```csv
title,amount,type,date,category,paymentMethod,description
Salary,3500.00,INCOME,2026-04-15,income,BANK_TRANSFER,Monthly salary
Grocery,45.50,EXPENSE,2026-04-20,groceries,CASH,Weekly groceries
```

---

## Running the Application

### Backend
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

---

## License

MIT License

---

*Last Updated: April 2026*