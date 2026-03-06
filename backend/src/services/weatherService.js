const {
  geocodeLocation,
  getCurrentWeather,
  getForecast,
  formatCurrentWeather,
  formatForecast
} = require('../../api_clients/openWeatherClient');
const WeatherRequest = require('../models/WeatherRequest');

async function fetchAndStoreWeather(location, notes) {
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

module.exports = { fetchAndStoreWeather, fetchCurrentOnly };
