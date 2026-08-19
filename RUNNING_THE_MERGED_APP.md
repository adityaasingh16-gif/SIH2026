# Running the Merged Frontend + Backend

This project is now a single repository containing:

- **`/` (root)** — the React frontend (Vite)
- **`/backend`** — the Express + MongoDB government eVault API

## What Was Fixed to Merge Them

The uploaded project had two problems that stopped the frontend and backend from
actually working together:

1. **The backend could never start.** `backend/src/app.js` only *defined* the
   Express app — nothing ever called `app.listen()` or connected to MongoDB.
   A new file, `backend/src/server.js`, now does both and is the real entry
   point (`npm start` / `npm run dev` inside `backend/`).
2. **There was a second, broken, unused backend** at `/server` that referenced
   files (`./controllers/documentController`, `./services/cryptoService`)
   which didn't exist in the upload, and used different endpoint names than
   the frontend actually calls. It has been removed — `/backend` is the real,
   complete implementation and is what the frontend talks to.

Smaller fixes:
- Added `GET /api/documents` (list) so the dashboard/vault views can eventually
  show real backend data, not just the upload flow.
- Added `GET /api/health`, which `src/services/api.js` was already calling but
  which didn't exist on the backend.
- The frontend now fetches live documents on load and shows a **"Backend
  Live" / "Demo Mode"** badge in the header so it's always clear whether
  you're looking at real API data or the built-in local demo dataset.
- The **Verify** page now checks the real backend first, and only falls back
  to the local demo dataset if the API is unreachable.
- The **Upload** page already had this fallback pattern built in — it now
  actually has a live backend to reach.

## First-Time Setup

You need Node.js and a MongoDB instance (local or Atlas).

```bash
# 1. Install frontend dependencies (from the project root)
npm install

# 2. Install backend dependencies
npm run backend:install

# 3. Configure the backend's database connection
cp backend/.env.example backend/.env
# edit backend/.env if you're not using a local MongoDB on the default port
```

If you don't have MongoDB installed locally, the quickest option is Docker:

```bash
docker run -d -p 27017:27017 --name evault-mongo mongo
```

## Running It

**Option A — one command, both servers:**

```bash
npm run dev:all
```

This starts the Vite dev server (frontend) and the Express API (backend)
together, with color-coded logs so you can tell them apart.

**Option B — two terminals (useful for watching logs separately):**

```bash
# Terminal 1
npm run backend:dev

# Terminal 2
npm run dev
```

Then open the frontend at the URL Vite prints (typically `http://localhost:5173`).
The backend runs on `http://localhost:5000` by default.

## Verifying the Merge Worked

1. Open the app — the header should show a **green "Backend Live"** badge
   within a second or two of load. If it shows amber **"Demo Mode"**, the
   backend isn't reachable (check the backend terminal for a MongoDB
   connection error).
2. Go to **Upload Document**, fill in the form, and submit. Check the backend
   terminal — you should see a `POST /api/documents` log line, meaning the
   record actually went into MongoDB, not just local browser state.
3. Go to **Verify Document** and paste the hash you just got back. It should
   resolve via the real `GET /api/documents/:id/verify` endpoint.

## What's Still Local-Only (by design, not a bug)

Not every view is wired to the backend yet — several (Dashboard drill-downs,
Admin Analytics detail, document deletion) still operate on local React state
seeded with demo data. The backend already exposes the core endpoints these
would need (`/api/admin/analytics`, `/api/admin/anomalies`, court-order and
police-approval routes) — wiring the remaining views is a good next step if
you want the whole app running on live data end to end.
