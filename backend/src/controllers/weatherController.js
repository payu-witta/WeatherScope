const WeatherRequest = require('../models/WeatherRequest');
const { fetchAndStoreWeather, fetchCurrentOnly } = require('../services/weatherService');

async function create(req, res) {
  try {
    const { location, notes } = req.body;
    if (!location) {
      return res.status(400).json({ error: 'location is required' });
    }

    const result = await fetchAndStoreWeather(location, notes);

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

module.exports = { create, getAll, getCurrent };
