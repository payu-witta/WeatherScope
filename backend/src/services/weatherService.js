const {
  geocodeLocation,
  getCurrentWeather,
  getForecast,
  getUVIndex,
  formatCurrentWeather,
  formatForecast
} = require('../../api_clients/openWeatherClient');
const { getHistoricalWeather, getAirQuality } = require('../../api_clients/openMeteoClient');
const WeatherRequest = require('../models/WeatherRequest');

function getHistoricalCutoff() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 5);
  cutoff.setHours(0, 0, 0, 0);
  return cutoff;
}

async function fetchAndStoreWeather(location, startDate, endDate, notes) {
  const geoInfo = await geocodeLocation(location);
  const rawCurrent = await getCurrentWeather(geoInfo.lat, geoInfo.lon);
  const current = formatCurrentWeather(rawCurrent, geoInfo);
  const rawForecast = await getForecast(geoInfo.lat, geoInfo.lon);
  const forecast = formatForecast(rawForecast);

  const [airQuality, uvIndex] = await Promise.all([
    getAirQuality(geoInfo.lat, geoInfo.lon),
    getUVIndex(geoInfo.lat, geoInfo.lon)
  ]);

  const resolvedLocation = `${geoInfo.name}${geoInfo.country ? ', ' + geoInfo.country : ''}`;

  const record = WeatherRequest.create({
    location: resolvedLocation,
    latitude: geoInfo.lat,
    longitude: geoInfo.lon,
    start_date: startDate || new Date().toISOString().split('T')[0],
    end_date: endDate || new Date().toISOString().split('T')[0],
    temperature: current.temperature,
    weather_condition: current.weather_condition,
    humidity: current.humidity,
    wind_speed: current.wind_speed,
    notes: notes || null
  });

  return {
    record,
    current: { ...current, air_quality: airQuality, uv_index: uvIndex },
    forecast
  };
}

async function fetchCurrentOnly(location) {
  const geoInfo = await geocodeLocation(location);
  const rawCurrent = await getCurrentWeather(geoInfo.lat, geoInfo.lon);
  const current = formatCurrentWeather(rawCurrent, geoInfo);
  const rawForecast = await getForecast(geoInfo.lat, geoInfo.lon);
  const forecast = formatForecast(rawForecast);
  const [airQuality, uvIndex] = await Promise.all([
    getAirQuality(geoInfo.lat, geoInfo.lon),
    getUVIndex(geoInfo.lat, geoInfo.lon)
  ]);

  return {
    current: { ...current, air_quality: airQuality, uv_index: uvIndex },
    forecast,
    geo: geoInfo
  };
}

async function fetchHistoricalWeather(lat, lon, startDate, endDate) {
  return getHistoricalWeather(lat, lon, startDate, endDate);
}

module.exports = { fetchAndStoreWeather, fetchCurrentOnly, fetchHistoricalWeather };
