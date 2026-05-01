# Implementation Log - SideProjectAPM

## Session: 2026-05-01

### Task: Setup Next.js 14 + TypeScript + Tailwind

**Status:** ✅ Completed

### What was done

1. **Initialized Next.js 14 with:**
   - TypeScript (strict mode enabled by default)
   - Tailwind CSS v4
   - ESLint
   - App Router
   - `src/` directory structure
   - Import alias `@/*`

2. **Installed additional dependencies:**
   - `lucide-react` - icons
   - `clsx` + `tailwind-merge` - for `cn` utility
   - `zod` + `react-hook-form` + `@hookform/resolvers` - form handling
   - `@tanstack/react-query` - server state management
   - `date-fns` - date utilities
   - `next-themes` - dark mode support

3. **Initialized shadcn/ui:**
   - Created `components.json` config
   - Added `button.tsx` and `utils.ts` components

4. **Configured Design System in `globals.css`:**
   - Primary color: Indigo (#6366F1)
   - Semantic colors: success (green), error (red), warning (amber), info (blue)
   - Light and dark theme variables
   - Typography scale with Inter font
   - Custom utility classes for project status indicators

5. **Created folder structure:**
   ```
   src/
   ├── app/
   │   ├── api/v1/metrics/route.ts
   │   ├── dashboard/
   │   │   ├── page.tsx
   │   │   └── create/page.tsx
   │   ├── globals.css
   │   ├── layout.tsx
   │   └── page.tsx
   ├── components/
   │   ├── layout/
   │   │   └── page-layout.tsx
   │   ├── ui/
   │   │   ├── button.tsx
   │   │   ├── card.tsx
   │   │   └── input.tsx
   │   ├── providers.tsx
   │   └── theme-provider.tsx
   ├── hooks/
   ├── lib/
   │   └── utils.ts
   ├── styles/
   └── types/
       └── index.ts
   ```

6. **Created base utilities in `lib/utils.ts`:**
   - `cn()` - class merge utility
   - `formatDate()`, `formatDateTime()`, `formatRelativeTime()`
   - `formatNumber()`, `formatLatency()`, `formatPercent()`
   - `truncate()`, `maskApiKey()`
   - `getStatusColor()`
   - `sleep()`, `isDefined()`, `generateId()`

7. **Created base types in `types/index.ts`:**
   - `Project`, `ProjectStatus`
   - `TrackedError`
   - `ApiKey`
   - `Metric`
   - `User`, `AuthState`
   - `ApiResponse`, `PaginatedResponse`
   - `ChartDataPoint`, `MetricChartData`

8. **Configured layout with:**
   - Inter font (Google Fonts)
   - JetBrains Mono for code
   - ThemeProvider for dark mode
   - React Query Providers
   - Metadata for SEO

9. **Created demo pages:**
   - Home page with hero section and features
   - Dashboard with project list (demo data)
   - Create project form with API key generation

### Build verification

```bash
npm run build
# ✅ Compiled successfully
# ✅ TypeScript type check passed
# ✅ Static pages generated

npm run dev
# ✅ Ready in ~500ms at http://localhost:3000
```

### Notes

- The project uses Next.js 16.2.4 (latest) which includes Turbopack
- Tailwind CSS v4 is used (new syntax with `@theme inline`)
- TypeScript strict mode is enabled by default
- Dark mode configured with `next-themes` (class strategy)
- NO Vercel for deploy (as per requirements)
- NO git initialized (will be done later)

### Next steps

1. Backend API setup (Fastify + SQLite/Prisma)
2. SDK development (Node.js first)
3. Authentication implementation
4. Real data integration
5. Testing setup

---

*Log created by subagent T1 - 2026-05-01*

---

## Session: 2026-05-02

### Task: T7 - Dashboard: Project Detail Page

**Status:** ✅ Completed

### What was done

1. **Installed Recharts** for chart visualizations:
   - `npm install recharts`
   - Used for uptime timeline and errors timeline charts

2. **Created StatusBadge component** (`src/components/dashboard/status-badge.tsx`):
   - Reusable badge for project status
   - Supports: healthy, degraded, critical, down states
   - Configurable sizes: sm, md, lg
   - Uses design system colors (green/amber/red)
   - Animated pulse for "down" status

3. **Created MetricCard component** (`src/components/dashboard/metric-card.tsx`):
   - Reusable metric display card
   - Shows title, value, subtitle, optional icon
   - Supports trend indicators (up/down/neutral)
   - Variants: default, success, warning, danger
   - Extensible with children for mini-charts

4. **Created Project Detail page** (`src/app/dashboard/[id]/page.tsx`):
   - Dynamic route `[id]` for individual projects
   - Header with project name, URL link, status badge
   - Metrics grid (4 cards):
     - Uptime % (last 24h)
     - Error rate (per hour)
     - Average latency (ms)
     - Total requests
   - Charts section:
     - Uptime timeline (AreaChart, 7 days)
     - Errors timeline (LineChart, 7 days)
   - Recent errors list (last 10, with severity badges)
   - API key section (masked, with copy button)
   - Integration code snippet example

5. **Created API endpoints**:
   - `GET /api/v1/projects` - List all projects
   - `GET /api/v1/projects/[id]` - Get project details with metrics
   - Demo data generation for testing
   - Proper error handling (404 for missing projects)

6. **Updated PageLayout component**:
   - Changed `title` and `description` props to accept `ReactNode`
   - Allows for richer header content (JSX elements)

### Files created

```
src/
├── app/
│   ├── api/v1/projects/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── dashboard/[id]/
│       └── page.tsx
└── components/dashboard/
    ├── status-badge.tsx
    └── metric-card.tsx
```

### Design decisions

- **Recharts over custom charts**: Faster implementation, good documentation, works well with React
- **Demo data in API routes**: Allows frontend development before database is ready
- **StatusBadge as separate component**: Reusable across dashboard list and detail pages
- **MetricCard as generic component**: Can be extended for different metric types
- **Async page component**: To properly await params in Next.js 15+ App Router

### Requirements covered

- **US-001**: Dashboard shows project status ✅
- **US-005**: Latency distribution visible (avg latency shown, P95 in tooltip) ✅
- **US-006**: Uptime monitoring with timeline (7-day chart) ✅

### Next steps

1. Connect to real database (SQLite/Prisma)
2. Implement real-time updates (WebSocket or polling)
3. Add error detail modal/page
4. Implement latency histogram view
5. Add project settings page

---

*Log updated by subagent T7 - 2026-05-02*

---

## Session: 2026-05-02 (Task T3)

### Task: T3 - Database Schema (PostgreSQL/SQLite)

**Status:** ✅ Completed

### What was done

1. **Installed Drizzle ORM with better-sqlite3**:
   - `drizzle-orm` - ORM core
   - `drizzle-kit` - migrations and introspection
   - `better-sqlite3` - SQLite driver
   - `@types/better-sqlite3` - TypeScript types

2. **Created database schema** (`src/lib/db/schema.ts`):
   - `projects` table: id, name, url, api_key, status, created_at, updated_at
   - `metrics` table: id, project_id, type, name, value, tags (JSON), timestamp, received_at
   - `uptime_checks` table: id, project_id, status, latency, checked_at
   - `errors` table: id, project_id, message, stack_trace, fingerprint, count, first_seen, last_seen, resolved

3. **Created database connection** (`src/lib/db/index.ts`):
   - SQLite database initialization with better-sqlite3
   - Auto-creation of data directory if not exists
   - Drizzle ORM instance with schema export

4. **Created migration script** (`src/lib/db/migrate.ts`):
   - Creates all tables with proper constraints
   - Creates indexes for common queries:
     - metrics: project_id, timestamp, name
     - uptime_checks: project_id, checked_at
     - errors: project_id, fingerprint, resolved
   - Environment variable `DATABASE_PATH` for DB location (default: `./data/sideprojectapm.db`)

5. **Updated metrics API** (`src/app/api/v1/metrics/route.ts`):
   - Replaced in-memory store with database storage
   - Project lookup by API key from database
   - Metric insertion using Drizzle ORM
   - Kept rate limiting in-memory (for demo - use Redis in production)

6. **Added npm scripts** to `package.json`:
   - `db:migrate` - Run database initialization
   - `db:generate` - Generate migrations from schema changes
   - `db:push` - Push schema changes directly
   - `db:studio` - Open Drizzle Studio (DB GUI)

7. **Created `.env.example`**:
   - `DATABASE_PATH` - SQLite database file location
   - `MASTER_API_KEY` - Master API key for admin operations

8. **Created Drizzle config** (`drizzle.config.ts`):
   - Schema location
   - Output directory for migrations
   - SQLite dialect configuration

9. **Fixed type errors** (cross-task fixes):
   - Updated `generateId()` to accept optional prefix parameter
   - Fixed node-cron import types in scheduler.ts

### Files created/modified

```
src/lib/db/
├── index.ts         # Database connection
├── schema.ts        # Drizzle schema definitions
└── migrate.ts       # Migration script

drizzle.config.ts    # Drizzle Kit configuration
.env.example          # Environment variables template
package.json          # Added db:* scripts
```

### Database schema details

**projects**
- `id` TEXT PRIMARY KEY
- `name` TEXT NOT NULL
- `url` TEXT (nullable)
- `api_key` TEXT NOT NULL UNIQUE
- `status` TEXT CHECK(status IN ('active', 'paused', 'archived'))
- `created_at`, `updated_at` TEXT DEFAULT CURRENT_TIMESTAMP

**metrics**
- `id` TEXT PRIMARY KEY
- `project_id` TEXT → projects.id (CASCADE)
- `type` TEXT CHECK(type IN ('counter', 'gauge', 'histogram'))
- `name`, `value` (REAL), `tags` (JSON), `timestamp`, `received_at`

**uptime_checks**
- `id` TEXT PRIMARY KEY
- `project_id` TEXT → projects.id (CASCADE)
- `status` TEXT CHECK(status IN ('up', 'down', 'degraded'))
- `latency` INTEGER (milliseconds)
- `checked_at` TEXT

**errors**
- `id` TEXT PRIMARY KEY
- `project_id` TEXT → projects.id (CASCADE)
- `message`, `stack_trace`, `fingerprint` TEXT
- `count` INTEGER DEFAULT 1
- `first_seen`, `last_seen` TEXT
- `resolved` INTEGER (boolean) DEFAULT 0

### Design decisions

- **SQLite over PostgreSQL**: Simpler setup for indie hackers, zero-config, file-based
- **Drizzle over Prisma**: Lighter bundle size, better performance, TypeScript-first
- **better-sqlite3**: Synchronous API, faster than async drivers for SQLite
- **JSON tags**: Flexible metadata storage without separate table
- **Fingerprint on errors**: For grouping similar errors together
- **Cascading deletes**: Clean up related data when project is deleted

### Requirements covered

- **NFR-002**: Data persistence with SQLite database ✅
- **NFR-006**: Simple deployment (single DB file) ✅
- **US-006**: Uptime checks storage ✅
- **US-007**: Error tracking with fingerprinting ✅

### How to use

```bash
# Initialize database
npm run db:migrate

# Development with Drizzle Studio (GUI)
npm run db:studio

# Push schema changes (dev)
npm run db:push
```

### Notes

- SQLite is sufficient for MVP and low-traffic deployments
- Can migrate to PostgreSQL later with minimal code changes (Drizzle supports both)
- Consider adding connection pooling for production
- Rate limiting still in-memory (TODO: Redis)

---

*Log updated by subagent T3 - 2026-05-02*

---

## Session: 2026-05-02 (Task T8)

### Task: T8 - Uptime Checker (Background Job)

**Status:** ✅ Completed

### What was done

1. **Installed node-cron** for scheduled jobs:
   - `node-cron@^4.2.1` - Cron job scheduler
   - `@types/node-cron@^3.0.11` - TypeScript types (partial compatibility, created custom types)
   - Created custom type definitions for node-cron v4 API

2. **Created uptime-checker.ts** (`src/lib/uptime-checker.ts`):
   - `checkUptime(url, options)` - HTTP HEAD/GET request with latency measurement
   - Configurable timeout (default 10s)
   - Returns: `{ status: 'up'|'down'|'degraded', latency, statusCode?, error?, checkedAt }`
   - Latency thresholds for degraded status (>2s)
   - Helper functions: `calculateUptimePercentage()`, `getAverageLatency()`

3. **Created scheduler.ts** (`src/lib/scheduler.ts`):
   - Background job running every 5 minutes (`*/5 * * * *` cron expression)
   - Checks all active projects from database
   - Stores results in `uptime_checks` table
   - Debouncing: minimum 1 minute between checks for same project
   - Exported functions: `startScheduler()`, `stopScheduler()`, `runUptimeChecks()`, `isSchedulerRunning()`, `getSchedulerStatus()`

4. **Created admin endpoint** (`src/app/api/admin/check-uptime/route.ts`):
   - `POST /api/admin/check-uptime` - Trigger manual uptime check
     - Optional `projectId` in body for specific project
     - Returns check results for all active projects
   - `GET /api/admin/check-uptime` - Get scheduler status
     - Returns running state, interval, last check times

5. **Created instrumentation.ts** (`src/instrumentation.ts`):
   - Next.js 15+ instrumentation hook for server startup
   - Initializes uptime scheduler when server starts
   - Only runs on `nodejs` runtime (not edge)

6. **Created custom TypeScript types** (`src/types/node-cron.d.ts`):
   - Custom type definitions for node-cron v4 API
   - Defines `ScheduledTask`, `TaskOptions`, `ScheduleContext`
   - Exports `schedule()`, `validate()`, `getTasks()`

7. **Fixed type errors**:
   - Added `@types/better-sqlite3` for database types
   - Fixed scheduler imports for node-cron v4 API
   - Fixed import paths for `@/lib/db` vs `@/lib/db/index`

### Files created/modified

```
src/
├── instrumentation.ts              # Server startup hook
├── types/
│   └── node-cron.d.ts              # Custom types for node-cron v4
├── lib/
│   ├── uptime-checker.ts           # HTTP uptime checker
│   └── scheduler.ts                # Background job scheduler
└── app/api/admin/
    └── check-uptime/route.ts       # Admin API endpoint
```

### Design decisions

- **node-cron over Agenda/BullMQ**: Simpler setup, no external dependencies (Redis), sufficient for MVP
- **HEAD requests by default**: Minimize bandwidth, faster checks
- **Debouncing**: Prevent duplicate checks within 1 minute window
- **Instrumentation hook**: Next.js 15+ native way to run code on server start
- **SQLite persistence**: All checks stored in `uptime_checks` table
- **Status thresholds**: up (latency < 2s), degraded (latency >= 2s), down (error or unexpected status)

### Requirements covered

- **US-006**: Automatic uptime monitoring ✅
- **US-006**: Background job running every 5 minutes ✅
- **US-006**: Manual trigger via admin endpoint ✅
- **US-006**: Results persisted in database ✅

### Notes

- The project has a pre-existing build error in `/dashboard/[id]/page.tsx` related to Recharts (not related to this task)
- TypeScript compilation passes for all new files
- Scheduler initializes on server start via `instrumentation.ts`
- Rate limiting not implemented in admin endpoint (TODO for production)

---

*Log updated by subagent T8 - 2026-05-02*