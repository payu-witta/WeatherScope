const axios = require('axios');

const ARCHIVE_URL = 'https://historical-forecast-api.open-meteo.com/v1/forecast';

const WMO_CODES = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Depositing rime fog',
  51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
  61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
  71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Slight showers', 81: 'Moderate showers', 82: 'Violent showers',
  85: 'Slight snow showers', 86: 'Heavy snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail'
};

async function getHistoricalWeather(lat, lon, startDate, endDate) {
  const response = await axios.get(ARCHIVE_URL, {
    params: {
      latitude: lat, longitude: lon,
      start_date: startDate, end_date: endDate,
      daily: ['temperature_2m_max', 'temperature_2m_min', 'precipitation_sum', 'wind_speed_10m_max', 'weather_code'].join(','),
      timezone: 'auto'
    }
  });

  const { daily } = response.data;
  return daily.time.map((date, i) => ({
    date,
    temp_max: daily.temperature_2m_max[i],
    temp_min: daily.temperature_2m_min[i],
    precipitation: daily.precipitation_sum[i],
    wind_speed_max: daily.wind_speed_10m_max[i],
    weather_condition: WMO_CODES[daily.weather_code[i]] || 'Unknown'
  }));
}

async function getAirQuality(lat, lon) {
  try {
    const response = await axios.get('https://air-quality-api.open-meteo.com/v1/air-quality', {
      params: { latitude: lat, longitude: lon, current: ['us_aqi', 'pm10', 'pm2_5'].join(',') }
    });

    const current = response.data.current;
    const aqi = current.us_aqi;
    let category = 'Unknown';
    if (aqi <= 50) category = 'Good';
    else if (aqi <= 100) category = 'Moderate';
    else if (aqi <= 150) category = 'Unhealthy for Sensitive Groups';
    else if (aqi <= 200) category = 'Unhealthy';
    else if (aqi <= 300) category = 'Very Unhealthy';
    else category = 'Hazardous';

    return { us_aqi: aqi, pm10: current.pm10, pm2_5: current.pm2_5, category };
  } catch {
    return null;
  }
}

module.exports = { getHistoricalWeather, getAirQuality, WMO_CODES };
