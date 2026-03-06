const WeatherRequest = require('../models/WeatherRequest');
const { fetchAndStoreWeather, fetchCurrentOnly, fetchHistoricalWeather } = require('../services/weatherService');

async function create(req, res) {
  try {
    const { location, start_date, end_date, notes } = req.body;
    if (!location) {
      return res.status(400).json({ error: 'location is required' });
    }

    const result = await fetchAndStoreWeather(location, start_date, end_date, notes);

    res.status(201).json({
      message: 'Weather data fetched and stored successfully',
      record: result.record,
      current: result.current,
      forecast: result.forecast
    });
  } catch (err) {
    if (err.message?.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
}

async function getAll(req, res) {
  try {
    const records = WeatherRequest.findAll();
    res.json({ records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const record = WeatherRequest.findById(id);
    if (!record) return res.status(404).json({ error: `Record ${id} not found` });
    res.json({ record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getCurrent(req, res) {
  try {
    const location = req.query.location;
    if (!location) {
      return res.status(400).json({ error: 'location query parameter is required' });
    }
    const result = await fetchCurrentOnly(location.trim());
    res.json(result);
  } catch (err) {
    if (err.message?.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
}

async function getHistorical(req, res) {
  try {
    const { lat, lon, start_date, end_date } = req.query;
    if (!lat || !lon || !start_date || !end_date) {
      return res.status(400).json({ error: 'lat, lon, start_date, end_date are required' });
    }
    const data = await fetchHistoricalWeather(parseFloat(lat), parseFloat(lon), start_date, end_date);
    res.json({ historical: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { create, getAll, getById, getCurrent, getHistorical };
