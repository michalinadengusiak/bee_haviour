# bee·haviour v2 — Hive Intelligence Dashboard

A production-ready React + Vite dashboard for monitoring beehive health metrics powered by a Raspberry Pi. Refactored to modern best practices.

---

## Quick Start

```bash
npm install
npm run dev          # → http://localhost:3000
```

---

## Scripts

| Command              | Description                        |
|----------------------|------------------------------------|
| `npm run dev`        | Start dev server                   |
| `npm run build`      | Production build                   |
| `npm run preview`    | Preview production build           |
| `npm run lint`       | Run ESLint                         |
| `npm run lint:fix`   | Auto-fix lint issues               |
| `npm run format`     | Format with Prettier               |
| `npm run test`       | Run tests in watch mode            |
| `npm run test:ui`    | Run tests with Vitest UI           |
| `npm run test:coverage` | Generate coverage report        |

---

## Project Structure

```
src/
├── app/
│   └── Providers.jsx           # React Query + future providers
│
├── features/                   # Business logic, grouped by domain
│   ├── hive/
│   │   ├── index.js            # Public API — import from here only
│   │   ├── hive.constants.js   # HIVES, STATUS_CONFIG, thresholds
│   │   ├── hive.service.js     # All API calls (replace mock → real Pi)
│   │   ├── hive.store.js       # Zustand UI state (selected hive, etc.)
│   │   ├── hive.service.test.js
│   │   ├── hooks/
│   │   │   ├── useHiveData.js       # React Query hook for sensor data
│   │   │   └── useHiveData.test.jsx
│   │   └── components/
│   │       ├── MetricCard.jsx       # Top-row summary card
│   │       ├── MetricCard.test.jsx
│   │       ├── VarroaCard.jsx       # Varroa gauge + scan + trend
│   │       ├── TemperatureCard.jsx  # Temperature scatter graph
│   │       ├── WeightCard.jsx       # Weight scatter + time range
│   │       ├── NotificationsCard.jsx
│   │       └── HiveSelector.jsx     # Dropdown hive switcher
│   │
│   └── export/
│       ├── index.js            # Public API
│       ├── export.service.js   # Excel + CSV export logic
│       ├── hooks/
│       │   ├── useExport.js         # Loading/done state for exports
│       │   └── useExport.test.js
│       └── components/
│           └── ExportButton.jsx     # Dropdown export button
│
├── components/                 # Shared, feature-agnostic UI
│   ├── ui/
│   │   ├── index.js
│   │   ├── LogoBee.jsx         # SVG bee logo
│   │   ├── StatusBadge.jsx     # ok / caution / warn pill
│   │   ├── StatusBadge.test.jsx
│   │   └── Card.jsx            # Base card shell
│   └── charts/
│       ├── index.js
│       ├── MiniBarChart.jsx    # 7-day bar chart
│       └── ScatterChart.jsx    # SVG scatter with range picker
│
├── pages/
│   ├── DashboardPage.jsx       # Thin page — composes features
│   └── DashboardPage.test.jsx
│
├── lib/
│   ├── query-client.js         # React Query client config
│   └── test-setup.js           # Vitest + Testing Library setup
│
└── styles/
    └── globals.css             # Tailwind directives + minimal custom CSS
```

---

## Architecture Decisions

### Feature-based structure (Bulletproof React)
Code is grouped by **what it does**, not what type of file it is. The `hive/` feature owns everything hive-related: constants, API calls, state, hooks, and components. Other features import only from `features/hive/index.js` — never from deep internal paths.

### Server state vs client state
- **React Query** (`useHiveData`) manages all server/async state: fetching, caching, loading/error states, and automatic re-fetching every 60 seconds
- **Zustand** (`useHiveStore`) manages UI/client state: selected hive ID, weight chart range, persisted to localStorage

### Service layer
`hive.service.js` and `export.service.js` are the only files that touch external data. To connect to a real Raspberry Pi:

```js
// src/features/hive/hive.service.js
export async function getHiveReadings(hiveId) {
  const res = await fetch(`${import.meta.env.VITE_PI_API_URL}/hives/${hiveId}/readings`)
  if (!res.ok) throw new Error(`Failed to fetch hive ${hiveId}`)
  return res.json()
}
```

Add a `.env.local` file:
```
VITE_PI_API_URL=http://raspberrypi.local:8000/api
```

### Tailwind CSS
All styling uses Tailwind utility classes. The `tailwind.config.js` extends the theme with:
- Custom colour palette (`bg-bg-card`, `text-gold-pale`, `text-status-warn-pale`, etc.)
- Fluid font size scale (`text-fluid-xs` → `text-fluid-hero`) using CSS `clamp()`
- Custom animations (`animate-fade-up`, `animate-pulse-scale`, etc.)
- `max-w-dashboard` = 90rem content cap

The global CSS (`globals.css`) is minimal — only Google Fonts import, scrollbar styles, and the honeycomb background texture pseudo-element.

---

## Connecting to Raspberry Pi

### Pi side — sensor logging (hourly cron)
```bash
# /etc/cron.d/beehaviour
0 * * * * pi python3 /home/pi/beehaviour/log_sensors.py
```

### Pi side — API server
```bash
pip install fastapi uvicorn
uvicorn api:app --host 0.0.0.0 --port 8000
```

```python
# api.py
from fastapi import FastAPI
import sqlite3

app = FastAPI()

@app.get("/api/hives/{hive_id}/readings")
def readings(hive_id: str):
    conn = sqlite3.connect('/home/pi/beehaviour/hive.db')
    # ... return latest sensor readings
```

### React side — polling auto-refreshes every 60s
No user action needed. The `useHiveData` hook re-fetches automatically on a 60-second interval (configurable in `src/lib/query-client.js`).

---

## Testing

Tests are co-located with the code they test (`*.test.jsx` / `*.test.js`).

```bash
npm run test            # watch mode
npm run test:coverage   # coverage report
```

Coverage targets:
- `useHiveData` hook — data fetching, error, disabled states
- `hive.service` — mock data shape, error handling
- `StatusBadge` — all status variants
- `MetricCard` — rendering, props
- `DashboardPage` — loading, data, error states
- `useExport` — loading/done state machine

---

## New Dependencies

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools zustand
npm install -D tailwindcss postcss autoprefixer vitest @vitest/ui @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom eslint eslint-plugin-react eslint-plugin-react-hooks prettier
```
