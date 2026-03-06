const { getDb } = require('../database/db');

class WeatherRequest {
  static findAll({ limit = 50, offset = 0 } = {}) {
    const db = getDb();
    const rows = db.prepare(`SELECT * FROM weather_requests ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(limit, offset);
    return rows.map(r => WeatherRequest.parse(r));
  }

  static findById(id) {
    const db = getDb();
    const row = db.prepare(`SELECT * FROM weather_requests WHERE id = ?`).get(id);
    return row ? WeatherRequest.parse(row) : null;
  }

  static create(data) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO weather_requests
        (location, latitude, longitude, start_date, end_date, temperature, weather_condition, humidity, wind_speed, notes)
      VALUES
        (@location, @latitude, @longitude, @start_date, @end_date, @temperature, @weather_condition, @humidity, @wind_speed, @notes)
    `);

    const payload = {
      location: data.location,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      start_date: data.start_date ?? null,
      end_date: data.end_date ?? null,
      temperature: data.temperature ?? null,
      weather_condition: data.weather_condition ?? null,
      humidity: data.humidity ?? null,
      wind_speed: data.wind_speed ?? null,
      notes: data.notes ?? null
    };

    const result = stmt.run(payload);
    return WeatherRequest.findById(result.lastInsertRowid);
  }

  static parse(row) {
    return {
      id: row.id,
      location: row.location,
      latitude: row.latitude,
      longitude: row.longitude,
      start_date: row.start_date,
      end_date: row.end_date,
      temperature: row.temperature,
      weather_condition: row.weather_condition,
      humidity: row.humidity,
      wind_speed: row.wind_speed,
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }
}

module.exports = WeatherRequest;
