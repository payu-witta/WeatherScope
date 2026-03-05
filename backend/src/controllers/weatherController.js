const WeatherRequest = require('../models/WeatherRequest');
const { geocodeLocation, getCurrentWeather, formatCurrentWeather } = require('../../api_clients/openWeatherClient');

async function create(req, res) {
  try {
    const { location, notes } = req.body;
    if (!location) {
      return res.status(400).json({ error: 'location is required' });
    }

    const geoInfo = await geocodeLocation(location);
    const rawCurrent = await getCurrentWeather(geoInfo.lat, geoInfo.lon);
    const current = formatCurrentWeather(rawCurrent, geoInfo);

    const record = WeatherRequest.create({
      location: `${geoInfo.name}, ${geoInfo.country}`,
      latitude: geoInfo.lat,
      longitude: geoInfo.lon,
      temperature: current.temperature,
      weather_condition: current.weather_condition,
      humidity: current.humidity,
      wind_speed: current.wind_speed,
      notes: notes || null
    });

    res.status(201).json({ data: record, current });
  } catch (err) {
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

module.exports = { create, getAll };
