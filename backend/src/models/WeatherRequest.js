const { getDb } = require('../database/db');

class WeatherRequest {
  static findAll() {
    const db = getDb();
    const rows = db.prepare(`SELECT * FROM weather_requests ORDER BY created_at DESC`).all();
    return rows;
  }

  static findById(id) {
    const db = getDb();
    const row = db.prepare(`SELECT * FROM weather_requests WHERE id = ?`).get(id);
    return row || null;
  }

  static create(data) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO weather_requests
        (location, latitude, longitude, temperature, weather_condition, humidity, wind_speed, notes)
      VALUES
        (@location, @latitude, @longitude, @temperature, @weather_condition, @humidity, @wind_speed, @notes)
    `);

    const payload = {
      location: data.location,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      temperature: data.temperature ?? null,
      weather_condition: data.weather_condition ?? null,
      humidity: data.humidity ?? null,
      wind_speed: data.wind_speed ?? null,
      notes: data.notes ?? null
    };

    const result = stmt.run(payload);
    return WeatherRequest.findById(result.lastInsertRowid);
  }
}

module.exports = WeatherRequest;
