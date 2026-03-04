CREATE TABLE IF NOT EXISTS weather_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  location TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  temperature REAL,
  weather_condition TEXT,
  humidity INTEGER,
  wind_speed REAL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
