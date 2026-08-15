# Southern Greenhouse 🌿

A multi-tier irrigation contracting management system — Electron desktop app with a local Express+PostgreSQL backend.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Electron 33 + React 18 + TanStack Query v5 |
| Backend | Node.js + Express 4 + Prisma ORM (ESM) |
| Database | PostgreSQL |
| PDF | `@react-pdf/renderer` v4 (server-side) |
| Build | electron-vite + pnpm workspaces |
| Language | TypeScript throughout |

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9 — `npm install -g pnpm`
- **PostgreSQL** running locally on port 5432

## First-Time Setup

### 1. Install dependencies
```bash
pnpm install
```

### 2. Configure the database

Edit `apps/server/.env`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/southern_greenhouse?schema=public"
JWT_SECRET="change-this-to-a-strong-random-secret"
PORT=3001
```

### 3. Run database migrations
```bash
cd apps/server
.\node_modules\.bin\prisma migrate dev --name init
```

### 4. Seed the admin user
```bash
cd apps/server
.\node_modules\.bin\tsx src/seed/seed.ts
```

Default credentials:
- **Email:** `admin@southerngreehouse.com`
- **Password:** `Admin@1234`

### 5. Start the app (development)
```bash
cd apps/client
pnpm dev
```

Electron will launch, start the Express server in a utility process on port 3001, then open the login window.

---

## Project Structure

```
southern-greenhouse/
├── apps/
│   ├── server/               # Express + Prisma backend
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/
│   │       ├── app.ts         # Express app + routes
│   │       ├── index.ts       # HTTP server entry
│   │       ├── routes/        # One file per domain
│   │       ├── services/      # Business logic
│   │       ├── middleware/    # auth, rateLimiter, errorHandler
│   │       ├── pdf/           # QuotationPDF, InvoicePDF, PaysheetPDF
│   │       └── seed/
│   └── client/               # Electron + React frontend
│       └── src/
│           ├── main/          # Electron main process
│           ├── preload/       # Context bridge
│           └── renderer/src/  # React app
│               ├── api/       # API client + endpoints
│               ├── hooks/     # TanStack Query hooks
│               ├── pages/     # 18 page components
│               ├── components/ # Shared UI components
│               ├── context/   # AuthContext
│               └── styles/    # globals.css design system
└── packages/
    └── types/                 # Shared TypeScript DTOs
```

## Features

### 🏗️ Projects (3-level hierarchy)
- **Project → SubProject → ChildProject**
- Inventory allocated at any level (costed at `soldPrice × qty`)
- Mark-used → auto COMPLETED cascade (child → sub → project)

### 📦 Inventory
- Track quantity, bought/sold price, low-stock threshold
- Multi-row allocation transaction (atomic, decrements quantity, updates project cost)

### 📒 Ledger
- Daily cash book: opening balance, payments, returns
- Worker advances linked to specific projects (for labor costing)
- Log completed projects → triggers cascade
- **Only the most recent entry can be edited or deleted**

### 🧑‍💼 Workers
- Daily or monthly rate types
- Auto-generated sequential IDs (WRK-0001, WRK-0002…)
- Attendance tracking + bulk entry by date
- Salary calculation: days worked × rate + bonuses − deductions − advances

### 📄 PDF Documents (server-side)
- **Quotation PDF** — line items, transport cost, totals, validity
- **Invoice PDF** — amount due, overdue indication
- **Paysheet PDF** — worker pay breakdown with LKR formatting

### 📊 Dashboard
- Active projects, monthly revenue vs cost, outstanding balance
- Low stock count, 6-month revenue/cost chart, recent completions

## API Reference

All endpoints are under `/api/`, protected by JWT Bearer token (except `/api/auth/login`).

| Domain | Base Path |
|--------|-----------|
| Auth | `/api/auth` |
| Clients | `/api/clients` |
| Inventory | `/api/inventory` |
| Projects | `/api/projects` |
| SubProjects | `/api/projects/subprojects` or `/api/subprojects` |
| ChildProjects | `/api/projects/childprojects` or `/api/childprojects` |
| Ledger | `/api/ledger` |
| Quotations | `/api/quotations` |
| Invoices | `/api/invoices` |
| Workers | `/api/workers` |
| Attendance | `/api/attendance` |
| Salary | `/api/salary` |
| Dashboard | `/api/dashboard/stats` |

PDF endpoints: `GET /api/quotations/:id/pdf`, `GET /api/invoices/:id/pdf`, `GET /api/salary/:id/pdf`

## Currency Formatting

All monetary values use Sri Lankan Rupee locale:
```ts
amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
```

## Security

- JWT auth with `jti` blacklist (logout invalidates tokens)
- Rate limiting on login: 5 requests / 15 min per IP
- Express server binds to `127.0.0.1` only (not exposed to network)
- CSP headers in Electron renderer restrict connections to localhost:3001
