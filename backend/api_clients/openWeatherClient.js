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
    return { lat: parseFloat(coordMatch[1]), lon: parseFloat(coordMatch[2]), name: location, country: '' };
  }

  const zipMatch = location.match(/^(\d{5})(?:,([A-Z]{2}))?$/);
  if (zipMatch) {
    const zip = zipMatch[1];
    const country = zipMatch[2] || 'US';
    const response = await axios.get(`${GEO_URL}/zip`, {
      params: { zip: `${zip},${country}`, appid: apiKey }
    });
    return { lat: response.data.lat, lon: response.data.lon, name: response.data.name, country: response.data.country };
  }

  const response = await axios.get(`${GEO_URL}/direct`, {
    params: { q: location, limit: 1, appid: apiKey }
  });

  if (!response.data || response.data.length === 0) {
    throw new Error(`Location "${location}" not found`);
  }

  const result = response.data[0];
  return { lat: result.lat, lon: result.lon, name: result.name, country: result.country, state: result.state };
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

async function getUVIndex(lat, lon) {
  try {
    const apiKey = getApiKey();
    const response = await axios.get(`${BASE_URL}/uvi`, {
      params: { lat, lon, appid: apiKey }
    });
    const value = response.data.value;
    let category = 'Low';
    if (value >= 11) category = 'Extreme';
    else if (value >= 8) category = 'Very High';
    else if (value >= 6) category = 'High';
    else if (value >= 3) category = 'Moderate';
    return { value: Math.round(value * 10) / 10, category };
  } catch {
    return null;
  }
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
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyMap[date]) {
      dailyMap[date] = { date, temps: [], conditions: [], humidity: [], wind: [], icons: [] };
    }
    dailyMap[date].temps.push(item.main.temp);
    dailyMap[date].conditions.push(item.weather[0].main);
    dailyMap[date].humidity.push(item.main.humidity);
    dailyMap[date].wind.push(item.wind.speed * 3.6);
    dailyMap[date].icons.push(item.weather[0].icon);
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

module.exports = { geocodeLocation, getCurrentWeather, getForecast, getUVIndex, formatCurrentWeather, formatForecast };
