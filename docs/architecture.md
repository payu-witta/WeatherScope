# WeatherScope — Architecture

## Overview

WeatherScope is a monorepo containing a React SPA frontend and a Node.js/Express REST API backend. They communicate over HTTP; in development the Vite dev server proxies `/api` requests to the backend, eliminating CORS issues during local development.

```
Browser
  └─► Vite dev server (:5173)
        └─► /api proxy ──► Express (:5001)
                              ├─► OpenWeatherMap API
                              ├─► Open-Meteo API
                              ├─► YouTube Data API v3
                              └─► SQLite (node:sqlite)
```

---

## Backend

### Entry Point

`backend/server.js` bootstraps the Express app:

1. Loads `.env` via `dotenv`
2. Suppresses `node:sqlite` ExperimentalWarning
3. Applies security middleware: Helmet, rate limiter (100 req/15 min), CORS allowlist
4. Parses JSON + URL-encoded bodies
5. Calls `initializeDatabase()` — creates the SQLite file + runs `schema.sql` if needed
6. Mounts `/api/weather` router
7. Global 404 and error handlers

### Layers

```
server.js
  └─► routes/weather.js          # Express router — declares all paths
        └─► controllers/weatherController.js  # Input validation (Zod) + response shaping
              └─► services/weatherService.js  # Orchestrates API calls + DB writes
                    ├─► api_clients/openWeatherClient.js
                    ├─► api_clients/openMeteoClient.js
                    └─► api_clients/youtubeClient.js
              └─► models/WeatherRequest.js    # SQLite CRUD via node:sqlite
```

### Database

- Engine: `node:sqlite` (Node.js 22.5+ built-in — no native compilation)
- File: `backend/data/weather.sqlite` (excluded from git)
- WAL mode enabled for concurrent reads
- Schema applied once at startup via `initializeDatabase()`
- Single table: `weather_requests` — see `src/database/schema.sql`

### Validation

All incoming request data is validated at the controller boundary using **Zod** schemas defined in `backend/utils/validation.js`:

- `createWeatherSchema` — POST body
- `updateWeatherSchema` — PUT body (all fields optional)
- `queryParamsSchema` — GET list query params

Cross-field refinement ensures `end_date >= start_date` when both are provided.

### Export

`backend/utils/exportUtils.js` provides five export formatters:
- **JSON** — raw array
- **CSV** — via `csv-stringify`
- **XML** — hand-built with XML-escaped values
- **Markdown** — GFM table
- **PDF** — `pdfkit` with header, alternating row shading, and page footer

### Security

| Concern | Implementation |
|---------|---------------|
| Secure headers | `helmet` |
| Rate limiting | `express-rate-limit` (100/15 min) |
| CORS | Explicit allowlist (`FRONTEND_URL` + localhost) |
| API keys | Server-side only, never sent to browser |
| Input validation | Zod at controller boundary |
| SQLite injection | Parameterised queries throughout |

---

## Frontend

### Routing

React Router v6 with two routes:

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | `Home` | Search + live weather display |
| `/history` | `History` | Browse, edit, delete, export saved records |

### Data Flow (Home page)

```
LocationInput (user types / uses geolocation)
  └─► Home.fetchWeather()
        └─► api.getCurrentWeather(location)   # GET /api/weather/current
              └─► WeatherDisplay              # temperature, AQI, UV, metrics
              └─► TravelTips                  # generated from live conditions
              └─► ForecastCard                # 5-day strip
              └─► SavePanel                   # save to DB via POST /api/weather
              └─► MapEmbed                    # Leaflet marker
              └─► YouTubeVideos               # GET /api/weather/videos
              └─► HistoricalWeather           # GET /api/weather/historical
```

### Atmosphere Theming

`frontend/src/utils/atmosphere.js` maps weather conditions + time of day to one of 13 named themes (e.g. `clear-day`, `stormy`, `snowy`). Each theme sets 13 CSS custom properties on `:root[data-atmosphere="..."]` via `index.css`, driving background gradients, text colour, and accent colour transitions (1.4s ease).

### API Client

`frontend/src/services/api.js` — Axios instance with:
- `baseURL: '/api'` (resolved by Vite proxy in dev, direct in production)
- 15 s timeout
- Exported named functions: `getCurrentWeather`, `getHistoricalWeather`, `createWeatherRecord`, `getAllRecords`, `getRecord`, `updateRecord`, `deleteRecord`, `getExportUrl`

---

## Development

```bash
# Backend (port 5001, nodemon)
cd backend && npm run dev

# Frontend (port 5173, HMR)
cd frontend && npm run dev

# Smoke-test all API routes (server must be running)
cd backend && node test-routes.js
```
