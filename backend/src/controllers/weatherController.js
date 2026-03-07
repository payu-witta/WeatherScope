const WeatherRequest = require('../models/WeatherRequest');
const { fetchAndStoreWeather, fetchCurrentOnly, fetchHistoricalWeather } = require('../services/weatherService');
const { searchVideos } = require('../../api_clients/youtubeClient');
const { createWeatherSchema, updateWeatherSchema, queryParamsSchema, validate } = require('../../utils/validation');

async function create(req, res) {
  try {
    const { valid, errors, data } = validate(createWeatherSchema, req.body);
    if (!valid) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const result = await fetchAndStoreWeather(data.location, data.start_date, data.end_date, data.notes);

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
    const { valid, errors, data: params } = validate(queryParamsSchema, req.query);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid query parameters', details: errors });
    }
    const records = WeatherRequest.findAll({ limit: params.limit, offset: params.offset });
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

async function update(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { valid, errors, data } = validate(updateWeatherSchema, req.body);
    if (!valid) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    const updated = WeatherRequest.update(id, data);
    if (!updated) return res.status(404).json({ error: `Record ${id} not found` });
    res.json({ message: 'Record updated successfully', record: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = WeatherRequest.delete(id);
    if (!deleted) return res.status(404).json({ error: `Record ${id} not found` });
    res.json({ message: `Record ${id} deleted successfully` });
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

async function getVideos(req, res) {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ error: 'location query parameter is required' });
    }
    if (!process.env.YOUTUBE_API_KEY) {
      return res.json({ videos: null, message: 'YouTube API key not configured' });
    }
    const videos = await searchVideos(location.trim());
    res.json({ videos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { create, getAll, getById, update, remove, getCurrent, getHistorical, getVideos };
