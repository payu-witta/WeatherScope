const axios = require('axios');

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

function getApiKey() {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) throw new Error('OPENWEATHER_API_KEY is not configured');
  return key;
}

async function geocodeLocation(location) {
  const apiKey = getApiKey();

  const coordMatch = location.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
  if (coordMatch) {
    return {
      lat: parseFloat(coordMatch[1]),
      lon: parseFloat(coordMatch[2]),
      name: location,
      country: ''
    };
  }

  const response = await axios.get(`${GEO_URL}/direct`, {
    params: { q: location, limit: 1, appid: apiKey }
  });

  if (!response.data || response.data.length === 0) {
    throw new Error(`Location "${location}" not found`);
  }

  const result = response.data[0];
  return {
    lat: result.lat,
    lon: result.lon,
    name: result.name,
    country: result.country,
    state: result.state
  };
}

async function getCurrentWeather(lat, lon) {
  const apiKey = getApiKey();
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: { lat, lon, appid: apiKey, units: 'metric' }
  });
  return response.data;
}

async function getForecast(lat, lon) {
  const apiKey = getApiKey();
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: { lat, lon, appid: apiKey, units: 'metric', cnt: 40 }
  });
  return response.data;
}

function formatCurrentWeather(data, geoInfo) {
  return {
    location: geoInfo.name || data.name,
    country: geoInfo.country || data.sys?.country,
    latitude: data.coord.lat,
    longitude: data.coord.lon,
    temperature: Math.round(data.main.temp * 10) / 10,
    feels_like: Math.round(data.main.feels_like * 10) / 10,
    temp_min: Math.round(data.main.temp_min * 10) / 10,
    temp_max: Math.round(data.main.temp_max * 10) / 10,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    weather_condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    wind_speed: Math.round(data.wind.speed * 3.6 * 10) / 10,
    wind_direction: data.wind.deg,
    visibility: data.visibility ? data.visibility / 1000 : null,
    cloudiness: data.clouds.all,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timestamp: new Date().toISOString()
  };
}

function formatForecast(data) {
  const dailyMap = {};

  for (const item of data.list) {
    const date = new Date(item.dt * 1000);
    const dateStr = date.toISOString().split('T')[0];

    if (!dailyMap[dateStr]) {
      dailyMap[dateStr] = {
        date: dateStr,
        temps: [],
        conditions: [],
        humidity: [],
        wind: [],
        icons: []
      };
    }

    dailyMap[dateStr].temps.push(item.main.temp);
    dailyMap[dateStr].conditions.push(item.weather[0].main);
    dailyMap[dateStr].humidity.push(item.main.humidity);
    dailyMap[dateStr].wind.push(item.wind.speed * 3.6);
    dailyMap[dateStr].icons.push(item.weather[0].icon);
  }

  const today = new Date().toISOString().split('T')[0];
  return Object.entries(dailyMap)
    .filter(([date]) => date >= today)
    .slice(0, 5)
    .map(([date, d]) => ({
      date,
      temp_min: Math.round(Math.min(...d.temps) * 10) / 10,
      temp_max: Math.round(Math.max(...d.temps) * 10) / 10,
      avg_temp: Math.round((d.temps.reduce((a, b) => a + b, 0) / d.temps.length) * 10) / 10,
      weather_condition: d.conditions[0],
      humidity: Math.round(d.humidity.reduce((a, b) => a + b, 0) / d.humidity.length),
      wind_speed: Math.round((d.wind.reduce((a, b) => a + b, 0) / d.wind.length) * 10) / 10,
      icon: d.icons[Math.floor(d.icons.length / 2)]
    }));
}

module.exports = { geocodeLocation, getCurrentWeather, getForecast, formatCurrentWeather, formatForecast };
