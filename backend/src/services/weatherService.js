const {
  geocodeLocation,
  getCurrentWeather,
  getForecast,
  formatCurrentWeather,
  formatForecast
} = require('../../api_clients/openWeatherClient');
const { getHistoricalWeather } = require('../../api_clients/openMeteoClient');
const WeatherRequest = require('../models/WeatherRequest');

async function fetchAndStoreWeather(location, startDate, endDate, notes) {
  const geoInfo = await geocodeLocation(location);
  const rawCurrent = await getCurrentWeather(geoInfo.lat, geoInfo.lon);
  const current = formatCurrentWeather(rawCurrent, geoInfo);
  const rawForecast = await getForecast(geoInfo.lat, geoInfo.lon);
  const forecast = formatForecast(rawForecast);

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

  return { record, current, forecast, geo: geoInfo };
}

async function fetchCurrentOnly(location) {
  const geoInfo = await geocodeLocation(location);
  const rawCurrent = await getCurrentWeather(geoInfo.lat, geoInfo.lon);
  const current = formatCurrentWeather(rawCurrent, geoInfo);
  const rawForecast = await getForecast(geoInfo.lat, geoInfo.lon);
  const forecast = formatForecast(rawForecast);

  return { current, forecast, geo: geoInfo };
}

async function fetchHistoricalWeather(lat, lon, startDate, endDate) {
  return getHistoricalWeather(lat, lon, startDate, endDate);
}

module.exports = { fetchAndStoreWeather, fetchCurrentOnly, fetchHistoricalWeather };
