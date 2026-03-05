const { geocodeLocation, getCurrentWeather, formatCurrentWeather } = require('../../api_clients/openWeatherClient');
const WeatherRequest = require('../models/WeatherRequest');

async function fetchAndStoreWeather(location, notes) {
  const geoInfo = await geocodeLocation(location);
  const rawCurrent = await getCurrentWeather(geoInfo.lat, geoInfo.lon);
  const current = formatCurrentWeather(rawCurrent, geoInfo);

  const resolvedLocation = `${geoInfo.name}, ${geoInfo.country}`;

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

  return { record, current, geo: geoInfo };
}

module.exports = { fetchAndStoreWeather };
