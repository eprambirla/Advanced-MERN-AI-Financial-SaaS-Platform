# Finora - Finance Tracker App

## 📱 Project Overview

**Finora** is a full-stack finance tracking application that helps users manage their personal finances, track income/expenses, set budgets, and monitor savings goals.

---

## 🛠 Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** with Radix UI components
- **TanStack Table** for data tables
- **React Router** for navigation
- **TanStack Query** (React Query) for API calls
- **Sonner** for toasts
- **Lucide React** for icons
- **Recharts** for charts

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Zod** for validation
- **Node-cron** for scheduled jobs (recurring transactions)
- **Resend** for emails

---

## 📊 Data Models

### Transaction
```
- _id
- userId (ref: User)
- title
- description
- amount (number)
- type: INCOME | EXPENSE
- category (string - lowercase)
- date
- paymentMethod: CARD | BANK_TRANSFER | MOBILE_PAYMENT | CASH | AUTO_DEBIT | OTHER
- isRecurring: boolean
- recurringInterval: DAILY | WEEKLY | MONTHLY | YEARLY | null
- nextRecurringDate: Date | null
- receiptUrl: string | null
- createdAt
- updatedAt
```

### User
```
- _id
- name
- email
- password (hashed)
- profilePhoto: string | null
- authProvider: "credentials" | "google"
- createdAt
- updatedAt
```

### Budget
```
- _id
- userId (ref: User)
- category (string - lowercase)
- amount (monthly budget limit)
- period: "monthly" | "yearly"
- startDate
- endDate
- createdAt
- updatedAt
```

### SavingsTarget
```
- _id
- userId (ref: User)
- name
- targetAmount
- currentAmount
- deadline
- createdAt
- updatedAt
```

### ReportSetting
```
- _id
- userId (ref: User)
- schedule: "daily" | "weekly" | "monthly"
- recipients: string[]
- isActive: boolean
- lastSentAt
```

---

## 🔄 Data Flow

### Client → Server Communication

1. **React Query (RTK Query)** calls API functions from `/client/src/features/*`
2. API functions use `apiClient.ts` which adds auth token to headers
3. **Express middleware** validates JWT token
4. Controller receives request, validates with Zod
5. Service performs database operations
6. MongoDB returns data

### Key API Endpoints

**Auth:**
- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out

**Transactions:**
- `GET /api/transactions` - List all (with pagination, filters, search)
- `POST /api/transactions` - Create
- `PATCH /api/transactions/:id` - Update
- `DELETE /api/transactions/:id` - Delete
- `POST /api/transactions/bulk` - Bulk import
- `DELETE /api/transactions/bulk` - Bulk delete
- `POST /api/transactions/:id/duplicate` - Duplicate

**Budgets:**
- `GET /api/budgets` - List
- `POST /api/budgets` - Create
- `PATCH /api/budgets/:id` - Update
- `DELETE /api/budgets/:id` - Delete

**Savings Targets:**
- `GET /api/savings-target` - Get active target
- `POST /api/savings-target` - Create/Update
- `DELETE /api/savings-target` - Delete

**Analytics:**
- `GET /api/analytics/summary` - Dashboard stats
- `GET /api/analytics/income-expense` - Income/expense chart data

**Reports:**
- `GET /api/reports` - Get report settings
- `POST /api/reports` - Create/Update settings

---

## 📋 Key Pages & Components

### Pages (`/client/src/pages/`)

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Dashboard | Overview with stats, charts, recent transactions |
| `/transactions` | Transactions | All transactions, bulk import |
| `/budgets` | Budgets | Budget management |
| `/savings-targets` | Savings | Savings goals |
| `/reports` | Reports | Scheduled reports |
| `/settings` | Settings | User settings (account, appearance, billing) |
| `/auth/signin` | Sign In | Login page |
| `/auth/signup` | Sign Up | Register page |

### Key Components (`/client/src/components/`)

| Component | Purpose |
|----------|---------|
| `page-header.tsx` | Page title, subtitle, actions |
| `sidebar/index.tsx` | Navigation sidebar |
| `navbar/index.tsx` | Top navbar |
| `data-table/index.tsx` | Reusable table with sorting, filtering, pagination |
| `transaction-table/` | Transaction-specific table |
| `ui/` | All UI components (Button, Card, Dialog, etc.) |

---

## 🎨 Design System

### CSS Variables (`/client/src/index.css`)

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
--primary: #3b82f6
...
```

### Semantic Classes

- Text: `text-foreground`, `text-muted-foreground`, `text-primary`
- Background: `bg-background`, `bg-card`, `bg-muted`
- Borders: `border-border`, `border-input`
- Button variants: `default`, `outline`, `ghost`, `link`, `destructive`, `error`, `errorOutline`, `success`, `successOutline`, `warning`, `warningOutline`

---

## ⚙️ Important Files

### Configuration
- `client/tailwind.config.js` - Tailwind with semantic colors
- `client/src/index.css` - CSS variables & design system
- `backend/src/config/env.config.ts` - Environment variables

### API Layer
- `client/src/features/*/transactionAPI.ts` - API functions
- `client/src/services/apiClient.ts` - Axios client with interceptors

### Validation
- `backend/src/validators/transaction.validator.ts` - Transaction Zod schemas
- `backend/src/controllers/transaction.controller.ts` - Request handling

---

## 🔧 Constants

### Transaction Types
- `INCOME`
- `EXPENSE`

### Payment Methods
- `CARD`
- `BANK_TRANSFER`
- `MOBILE_PAYMENT`
- `CASH`
- `AUTO_DEBIT`
- `OTHER`

### Categories (stored lowercase)
- `groceries`, `dining`, `transportation`, `utilities`, `entertainment`, `shopping`, `healthcare`, `travel`, `housing`, `income`, `investments`, `other`

---

## 🧪 Testing

### Sample CSV Format
```csv
title,amount,type,date,category,paymentMethod,description
Salary,3500.00,INCOME,2026-04-15,income,BANK_TRANSFER,Monthly salary
Grocery,45.50,EXPENSE,2026-04-20,groceries,CASH,Weekly groceries
```

**Note:** Values must be exact case (INCOME/EXPENSE, uppercase)

---

## 📝 Common Issues & Fixes

1. **Case sensitivity**: Backend Zod validators are case-sensitive - use UPPERCASE
2. **Categories**: Stored as lowercase for matching between budgets and transactions
3. **Date handling**: Uses date-fns for formatting, stores as Date objects
4. **Responsive table**: DataTable auto-switches to card view on mobile (<768px)

---

## 🚀 Running the App

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

## 📂 Directory Structure

```
/client/src
  /components
    /ui          # Radix UI components
    /data-table # Reusable table
    /transaction # Transaction-specific
    /navbar
    /sidebar
    /page-header.tsx
  /features     # API calls (RTK Query)
    /transaction
    /budget
    /savings-target
    /auth
    /user
  /pages        # Route pages
    /dashboard
    /transactions
    /budgets
    /savings-targets
    /reports
    /settings
    /auth
  /hooks       # Custom hooks
  /lib         # Utilities
  /constant   # App constants
  index.css   # Design system

/backend/src
  /config     # Configurations
  /controllers # Request handlers
  /models     # Mongoose models
  /services   # Business logic
  /validators # Zod schemas
  /routes    # Express routes
  /middlewares
  /utils
  /mailers
  /cron      # Scheduled jobs
```