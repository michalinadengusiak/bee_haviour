# 🐝 bee·haviour

> An intelligent hive monitoring system powered by a Raspberry Pi, deep learning, and a React dashboard.

**Live dashboard →** [michalinadengusiak.github.io/bee-haviour](https://michalinadengusiak.github.io/bee-haviour/)

---

## What is bee·haviour?

bee·haviour is a full-stack IoT system for beekeepers that monitors hive health in real time, keeping them informed about what's happening inside their hives.
It reduces the need for constant manual inspections, saving time while also giving beekeepers confidence that they’re not missing critical warning signs of underlying issues.

At the core of the system is a Raspberry Pi installed at the base of the hive, collecting and processing data from:
- **Camera** — paired with a deep learning model to detect and count fallen varroa mites on the backboard, enabling ongoing tracking of the *Varroa destructor*, a primary driver of colony collapse
- **Temperature sensor** — tracks brood zone temperature (target: 34–36°C), a critical indicator of colony health and development
- **Load cell** — monitors hive weight to provide insight into food reserves and seasonal changes

Data is processed locally and surfaced through a clean, intuitive dashboard that highlights hive status and draws attention to anything that might need intervention.
---

## Repository structure

This is a monorepo containing both the frontend and backend of the project.

```
bee-haviour/
├── frontend/          # React dashboard (Vite + Tailwind + React Query)
├── backend/           # Python API + sensor scripts (coming soon)
├── LICENSE
└── README.md
```

---

## Frontend

A responsive React dashboard built with modern best practices.

**Tech stack:** React 18 · Vite · Tailwind CSS · React Query · Zustand · Vitest · ExcelJS

**Features:**
- Live varroa infestation gauge with deep learning confidence scores
- 7-day scatter graphs for temperature and hive weight
- Week / month / year time range selector for weight history
- Multi-hive selector — switch between registered hives instantly
- Colour-coded status system: 🟢 optimal · 🟡 monitor · 🔴 action required
- Alert banner for critical notifications
- Export all hive data to Excel (.xlsx) or CSV with one click
- Auto-refreshes every 60 seconds to stay in sync with the Pi

```bash
cd frontend
npm install
npm run dev        # → http://localhost:3000
npm run test       # run test suite
npm run build      # production build
```

See [`frontend/README.md`](./frontend/README.md) for full documentation on architecture, project structure, connecting to a real Raspberry Pi, and deployment.

---

## Backend

> 🚧 Under construction — coming soon

The backend will be a Python FastAPI application running directly on the Raspberry Pi. It will expose a REST API that the React dashboard polls every 60 seconds.

Planned components:

- **Sensor logging** — hourly cron job reading temperature (DS18B20) and weight (HX711 load cell)
- **Camera inference** — Varroa detection using a fine-tuned YOLO or EfficientDet model on the RPi Camera v3
- **SQLite database** — lightweight local storage of all readings, years of history on a standard SD card
- **FastAPI server** — serves readings to the frontend, handles authentication

```bash
# Coming soon
cd backend
pip install -r requirements.txt
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

---

## How it works together

```
┌─────────────────────────────────┐         ┌──────────────────────┐
│         Raspberry Pi            │         │   React Dashboard    │
│                                 │  HTTP   │                      │
│  Camera → ML model → Varroa %   │ ──────► │  michalinadengusiak  │
│  Temp sensor → °C               │  JSON   │  .github.io/         │
│  Load cell → kg                 │         │  bee-haviour/        │
│  FastAPI server                 │         │                      │
│  SQLite database                │         │  Auto-refreshes      │
│                                 │         │  every 60 seconds    │
└─────────────────────────────────┘         └──────────────────────┘
```

---

## Deployment

The React dashboard is automatically deployed to GitHub Pages on every push to `main` via GitHub Actions. No manual steps required — just push and the live site updates within ~2 minutes.

The backend runs directly on the Raspberry Pi in the apiary. In the future this could be exposed via a secure tunnel (e.g. Cloudflare Tunnel) to allow the dashboard to reach it from anywhere without port forwarding.

---

## Why Varroa monitoring matters

*Varroa destructor* is a parasitic mite that feeds on bees and their brood, weakening colonies and transmitting viruses. It is the single biggest threat to managed honeybee colonies worldwide. Treatment is recommended when infestation rates exceed 2% of the bee population. Traditional monitoring requires the beekeeper to manually count mites — a time-consuming and often infrequent process. bee·haviour automates this with a camera and a deep learning model, making continuous passive monitoring possible for the first time at hobby-beekeeper scale.

---

## License

MIT — see [LICENSE](./LICENSE)
