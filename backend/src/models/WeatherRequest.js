const { getDb } = require('../database/db');

class WeatherRequest {
  static async findAll({ limit = 50, offset = 0, location = null } = {}) {
    const db = getDb();
    const values = [];
    let where = '';

    if (location) {
      values.push(`%${location}%`);
      where = `WHERE location ILIKE $${values.length}`;
    }

    values.push(limit, offset);
    const result = await db.query(
      `SELECT * FROM weather_requests ${where} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );
    return result.rows.map(r => WeatherRequest.parse(r));
  }

  static async findById(id) {
    const db = getDb();
    const result = await db.query('SELECT * FROM weather_requests WHERE id = $1', [id]);
    return result.rows[0] ? WeatherRequest.parse(result.rows[0]) : null;
  }

  static async count(location = null) {
    const db = getDb();
    if (location) {
      const result = await db.query(
        'SELECT COUNT(*) AS n FROM weather_requests WHERE location ILIKE $1',
        [`%${location}%`]
      );
      return parseInt(result.rows[0].n, 10);
    }
    const result = await db.query('SELECT COUNT(*) AS n FROM weather_requests');
    return parseInt(result.rows[0].n, 10);
  }

  static async exportAll() {
    const db = getDb();
    const result = await db.query('SELECT * FROM weather_requests ORDER BY created_at DESC');
    return result.rows.map(r => WeatherRequest.parse(r));
  }

  static async create(data) {
    const db = getDb();
    const result = await db.query(
      `INSERT INTO weather_requests
        (location, latitude, longitude, start_date, end_date, temperature, weather_condition, humidity, wind_speed, notes, forecast_json)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        data.location,
        data.latitude ?? null,
        data.longitude ?? null,
        data.start_date ?? null,
        data.end_date ?? null,
        data.temperature ?? null,
        data.weather_condition ?? null,
        data.humidity ?? null,
        data.wind_speed ?? null,
        data.notes ?? null,
        data.forecast ? JSON.stringify(data.forecast) : null
      ]
    );
    return WeatherRequest.parse(result.rows[0]);
  }

  static async update(id, data) {
    const db = getDb();
    const existing = await WeatherRequest.findById(id);
    if (!existing) return null;

    const merged = {
      location: data.location ?? existing.location,
      latitude: data.latitude ?? existing.latitude,
      longitude: data.longitude ?? existing.longitude,
      start_date: data.start_date ?? existing.start_date,
      end_date: data.end_date ?? existing.end_date,
      temperature: data.temperature ?? existing.temperature,
      weather_condition: data.weather_condition ?? existing.weather_condition,
      humidity: data.humidity ?? existing.humidity,
      wind_speed: data.wind_speed ?? existing.wind_speed,
      notes: data.notes !== undefined ? data.notes : existing.notes
    };

    const result = await db.query(
      `UPDATE weather_requests
       SET location=$1, latitude=$2, longitude=$3,
           start_date=$4, end_date=$5, temperature=$6,
           weather_condition=$7, humidity=$8,
           wind_speed=$9, notes=$10, updated_at=NOW()
       WHERE id=$11
       RETURNING *`,
      [
        merged.location, merged.latitude, merged.longitude,
        merged.start_date, merged.end_date, merged.temperature,
        merged.weather_condition, merged.humidity,
        merged.wind_speed, merged.notes, id
      ]
    );
    return WeatherRequest.parse(result.rows[0]);
  }

  static async delete(id) {
    const db = getDb();
    const result = await db.query('DELETE FROM weather_requests WHERE id = $1', [id]);
    return result.rowCount > 0;
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
      forecast: row.forecast_json ? JSON.parse(row.forecast_json) : null,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null
    };
  }
}

module.exports = WeatherRequest;
