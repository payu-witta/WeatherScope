CREATE TABLE IF NOT EXISTS weather_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  location TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  start_date TEXT,
  end_date TEXT,
  temperature REAL,
  weather_condition TEXT,
  humidity INTEGER,
  wind_speed REAL,
  notes TEXT,
  forecast_json TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_weather_location ON weather_requests(location);
CREATE INDEX IF NOT EXISTS idx_weather_created ON weather_requests(created_at);
