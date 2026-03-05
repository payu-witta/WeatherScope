import React, { useState } from 'react';
import LocationInput from '../components/LocationInput.jsx';
import WeatherDisplay from '../components/WeatherDisplay.jsx';
import { getCurrentWeather } from '../services/api.js';

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchWeather(location) {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentWeather(location);
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <LocationInput onSearch={fetchWeather} loading={loading} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weatherData && <WeatherDisplay data={weatherData} />}
    </div>
  );
}
