# WeatherScope

A full-stack weather application built with React + Vite and Node.js + Express. Search any location to get current conditions, a 5-day forecast, air quality, UV index, historical weather, an interactive map, and optional YouTube travel videos — all saveable to a PostgreSQL database.

**Live demo:** [weatherscope.site](https://weatherscope.site)

## Features

- Current weather (temperature, humidity, wind, pressure, visibility, cloudiness)
- Air Quality Index (US AQI, PM2.5, PM10) via Open-Meteo
- UV Index with category via OpenWeatherMap
- 5-day forecast with daily min/max
- Historical weather archive (Open-Meteo, free — no key required)
- Interactive Leaflet map
- Optional YouTube travel videos for the searched location
- Save, edit, and delete weather records
- Export records as JSON, CSV, XML, Markdown, or PDF
- Dynamic atmosphere theming (background transitions based on weather + time of day)

## Tech Stack

- **Frontend:** React 18, Vite, React Router v6, Leaflet, Axios — deployed on [Vercel](https://vercel.com)
- **Backend:** Node.js ≥22.5, Express, Zod, Helmet, express-rate-limit — deployed on [Render](https://render.com)
- **Database:** PostgreSQL via [Neon](https://neon.tech) (serverless, free tier)
- **APIs:** OpenWeatherMap, Open-Meteo (free), YouTube Data API v3 (optional)

## Getting Started

### Prerequisites

- Node.js **22.5.0 or higher**
- A [Neon](https://neon.tech) account (free) — for the PostgreSQL database
- An [OpenWeatherMap](https://openweathermap.org/api) API key (free tier works)
- *(Optional)* A [YouTube Data API v3](https://console.cloud.google.com/apis/library/youtube.googleapis.com) key

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/WeatherScope.git
cd WeatherScope

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure backend environment variables

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in your values:

```env
PORT=5001
DATABASE_URL=your_neon_postgresql_connection_string_here
OPENWEATHER_API_KEY=your_openweathermap_api_key_here
YOUTUBE_API_KEY=your_youtube_data_api_v3_key_here   # optional
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

> **Never commit your `.env` file.** It is already listed in `.gitignore`.

#### Getting a Neon DATABASE_URL

1. Sign up at [neon.tech](https://neon.tech) and create a new project
2. From your project dashboard, copy the **Connection string** (it looks like `postgresql://user:pass@host.neon.tech/dbname?sslmode=require`)
3. Paste it as `DATABASE_URL` in your `.env`

The schema is applied automatically on first startup — no manual migration needed.

#### Getting an OpenWeatherMap API key

1. Sign up at [openweathermap.org](https://openweathermap.org/api)
2. Go to **My API Keys** in your account dashboard
3. Copy the default key (or generate a new one)
4. Free tier includes: Current Weather, 5-day Forecast, Geocoding, and UV Index

#### Getting a YouTube Data API v3 key (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services → Library** and enable **YouTube Data API v3**
4. Go to **APIs & Services → Credentials** and click **Create Credentials → API key**
5. Copy the key into `YOUTUBE_API_KEY` in your `.env`
6. Free quota: 10,000 units/day (each video search costs ~100 units)

> If `YOUTUBE_API_KEY` is not set, the YouTube section is silently hidden — the rest of the app works normally.

### 3. Configure frontend environment variables

```bash
cd frontend
cp .env.example .env
```

For local development the default value works as-is — no changes needed.

### 4. Run the app

Open two terminals:

```bash
# Terminal 1 — backend
cd backend
npm run dev
# Starts on http://localhost:5001

# Terminal 2 — frontend
cd frontend
npm run dev
# Opens http://localhost:5173
```

### 5. Verify

Visit `http://localhost:5173` and search for any city. To check the backend directly:

```bash
curl http://localhost:5001/api/health
```

## Deployment

The production deployment uses three services:

| Layer | Service | Notes |
|-------|---------|-------|
| Frontend | Vercel | Root dir: `frontend`; auto-deploys on push to `main` |
| Backend | Render | Root dir: `backend`; free tier — kept alive by UptimeRobot |
| Database | Neon | Serverless PostgreSQL; permanent free tier |

`frontend/vercel.json` rewrites `/api/*` requests to the Render backend, so the frontend only ever calls `/api/...` regardless of environment.

### Environment variables to set in Render dashboard

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Neon connection string |
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap key |
| `YOUTUBE_API_KEY` | Your YouTube key (optional) |
| `FRONTEND_URL` | `https://weatherscope.site` |
| `NODE_ENV` | `production` |

## API Overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/weather/current?location=` | Current weather + forecast |
| GET | `/api/weather/historical?lat=&lon=&start_date=&end_date=` | Historical archive |
| GET | `/api/weather/videos?location=` | YouTube travel videos |
| GET | `/api/weather` | List saved records |
| POST | `/api/weather` | Save a record |
| GET | `/api/weather/:id` | Get a record |
| PUT | `/api/weather/:id` | Update a record |
| DELETE | `/api/weather/:id` | Delete a record |
| GET | `/api/weather/export?format=` | Export (json/csv/xml/md/pdf) |

Full API documentation: [`docs/api_documentation.md`](docs/api_documentation.md)

## Security

- `OPENWEATHER_API_KEY` and `YOUTUBE_API_KEY` are stored server-side only and never exposed to the browser
- Helmet sets secure HTTP headers
- Rate limiting: 100 requests per 15 minutes per IP
- CORS is restricted to the configured `FRONTEND_URL` (and `weatherscope.site` in production)

## Project Structure

```
WeatherScope/
├── backend/
│   ├── api_clients/        # OpenWeatherMap, Open-Meteo, YouTube clients
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── database/       # PostgreSQL init + schema
│   │   ├── models/         # WeatherRequest model
│   │   ├── routes/         # Express router
│   │   └── services/       # Business logic
│   ├── utils/              # Zod validation + export formatters
│   └── render.yaml         # Render deployment config
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Home, History
│   │   ├── services/       # Axios API client
│   │   └── utils/          # Atmosphere theming
│   └── vercel.json         # Vercel rewrite config
├── docs/                   # Architecture + API docs
└── shared/types/           # JSDoc type definitions
```

## License

MIT
