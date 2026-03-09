# WeatherScope API Documentation

Base URL: `http://localhost:5001/api`

All responses are JSON unless the `format` parameter specifies otherwise (export endpoint).

---

## Health

### `GET /health`

Returns server status.

**Response**
```json
{ "status": "ok", "timestamp": "2026-03-09T09:00:00.000Z" }
```

---

## Weather

### `GET /weather/current`

Fetch current weather, 5-day forecast, air quality, and UV index for a location.

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `location` | string | yes | City name, US zip code, or `lat,lon` coordinates |

**Response**
```json
{
  "current": {
    "location": "London",
    "country": "GB",
    "latitude": 51.5074,
    "longitude": -0.1278,
    "temperature": 12.3,
    "feels_like": 10.1,
    "temp_min": 10.0,
    "temp_max": 14.5,
    "humidity": 78,
    "pressure": 1012,
    "weather_condition": "Clouds",
    "description": "overcast clouds",
    "icon": "04d",
    "wind_speed": 18.4,
    "wind_direction": 220,
    "visibility": 10.0,
    "cloudiness": 100,
    "sunrise": 1709967600,
    "sunset": 1710009600,
    "timestamp": "2026-03-09T09:00:00.000Z",
    "air_quality": {
      "us_aqi": 42,
      "pm10": 18.2,
      "pm2_5": 9.1,
      "category": "Good"
    },
    "uv_index": {
      "value": 2.4,
      "category": "Low"
    }
  },
  "forecast": [
    {
      "date": "2026-03-09",
      "temp_min": 10.0,
      "temp_max": 14.5,
      "avg_temp": 12.3,
      "weather_condition": "Clouds",
      "humidity": 78,
      "wind_speed": 18.4,
      "icon": "04d"
    }
  ],
  "geo": { "lat": 51.5074, "lon": -0.1278, "name": "London", "country": "GB" }
}
```

---

### `GET /weather/historical`

Fetch historical daily weather from Open-Meteo archive.

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lat` | number | yes | Latitude |
| `lon` | number | yes | Longitude |
| `start_date` | string | yes | ISO date `YYYY-MM-DD` |
| `end_date` | string | yes | ISO date `YYYY-MM-DD` |

**Response**
```json
{
  "historical": [
    {
      "date": "2024-01-01",
      "temp_max": 9.2,
      "temp_min": 4.1,
      "precipitation": 1.4,
      "wind_speed_max": 22.0,
      "weather_condition": "Slight rain"
    }
  ]
}
```

---

### `GET /weather/videos`

Fetch YouTube travel videos for a location. Returns `null` if `YOUTUBE_API_KEY` is not configured.

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `location` | string | yes | Location name |

**Response**
```json
{
  "videos": [
    {
      "video_id": "abc123",
      "title": "London Travel Guide 2026",
      "channel": "Travel Channel",
      "thumbnail": "https://i.ytimg.com/vi/abc123/mqdefault.jpg",
      "published": "2025-06-01T00:00:00Z",
      "url": "https://www.youtube.com/watch?v=abc123",
      "embed_url": "https://www.youtube.com/embed/abc123"
    }
  ]
}
```

---

### `GET /weather`

List saved weather records with pagination.

**Query Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 50 | Max records to return |
| `offset` | number | 0 | Pagination offset |

**Response**
```json
{
  "records": [ { "id": 1, "location": "London", "temperature": 12.3, ... } ],
  "total": 42,
  "limit": 50,
  "offset": 0
}
```

---

### `POST /weather`

Save a weather record.

**Body**
```json
{
  "location": "London",
  "start_date": "2026-03-09",
  "end_date": "2026-03-09",
  "notes": "Optional note"
}
```

| Field | Type | Required |
|-------|------|----------|
| `location` | string | yes |
| `start_date` | string (YYYY-MM-DD) | no |
| `end_date` | string (YYYY-MM-DD) | no |
| `notes` | string (max 500 chars) | no |

**Response** — `201 Created`
```json
{ "record": { "id": 1, "location": "London", ... } }
```

---

### `GET /weather/:id`

Get a single saved record.

**Response** — `200` or `404`
```json
{ "record": { "id": 1, "location": "London", ... } }
```

---

### `PUT /weather/:id`

Update a saved record (partial update — only supplied fields are changed).

**Body** — any subset of: `location`, `start_date`, `end_date`, `notes`

**Response** — `200` or `404`
```json
{ "record": { "id": 1, "location": "London", "notes": "updated note", ... } }
```

---

### `DELETE /weather/:id`

Delete a saved record.

**Response** — `200` or `404`
```json
{ "message": "Record deleted" }
```

---

### `GET /weather/export`

Export all saved records in the specified format.

**Query Parameters**

| Parameter | Allowed values |
|-----------|---------------|
| `format` | `json`, `csv`, `xml`, `md`, `pdf` |

Content-Type and filename are set automatically per format.

---

## Error Responses

All errors follow this shape:

```json
{ "error": "Human-readable message" }
```

| Status | Meaning |
|--------|---------|
| 400 | Validation error (details in `error`) |
| 404 | Record or route not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
