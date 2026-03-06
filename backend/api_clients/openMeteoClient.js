const axios = require('axios');

const ARCHIVE_URL = 'https://historical-forecast-api.open-meteo.com/v1/forecast';

const WMO_CODES = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Slight showers',
  81: 'Moderate showers',
  82: 'Violent showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail'
};

async function getHistoricalWeather(lat, lon, startDate, endDate) {
  const response = await axios.get(ARCHIVE_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      start_date: startDate,
      end_date: endDate,
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'wind_speed_10m_max',
        'weather_code'
      ].join(','),
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

module.exports = { getHistoricalWeather, WMO_CODES };
