import React, { useState } from 'react';
import LocationInput from '../components/LocationInput.jsx';
import WeatherDisplay from '../components/WeatherDisplay.jsx';
import ForecastCard from '../components/ForecastCard.jsx';
import MapEmbed from '../components/MapEmbed.jsx';
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

  async function handleGeolocate(lat, lon) {
    await fetchWeather(`${lat.toFixed(4)},${lon.toFixed(4)}`);
  }

  return (
    <div>
      <LocationInput onSearch={fetchWeather} onGeolocate={handleGeolocate} loading={loading} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weatherData && (
        <>
          <WeatherDisplay data={weatherData} />
          <ForecastCard forecast={weatherData.forecast} />
          <MapEmbed
            latitude={weatherData.geo?.lat || weatherData.current?.latitude}
            longitude={weatherData.geo?.lon || weatherData.current?.longitude}
            locationName={weatherData.current?.location}
          />
        </>
      )}
    </div>
  );
}
