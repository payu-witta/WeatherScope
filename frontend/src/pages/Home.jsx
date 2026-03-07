import React, { useState, useEffect } from 'react';
import LocationInput from '../components/LocationInput.jsx';
import WeatherDisplay from '../components/WeatherDisplay.jsx';
import ForecastCard from '../components/ForecastCard.jsx';
import MapEmbed from '../components/MapEmbed.jsx';
import HistoricalWeather from '../components/HistoricalWeather.jsx';
import SavePanel from '../components/SavePanel.jsx';
import YouTubeVideos from '../components/YouTubeVideos.jsx';
import { getCurrentWeather } from '../services/api.js';
import { applyAtmosphere } from '../utils/atmosphere.js';

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (weatherData?.current) {
      const { weather_condition, sunrise, sunset } = weatherData.current;
      applyAtmosphere(weather_condition, sunrise, sunset);
    }
  }, [weatherData]);

  async function fetchWeather(location) {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentWeather(location);
      setWeatherData(data);
      setSearchedLocation(
        data.current.location + (data.current.country ? ', ' + data.current.country : '')
      );
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
          <SavePanel weatherData={weatherData} />
          <MapEmbed
            latitude={weatherData.geo?.lat || weatherData.current?.latitude}
            longitude={weatherData.geo?.lon || weatherData.current?.longitude}
            locationName={weatherData.current?.location}
          />
          <YouTubeVideos location={searchedLocation} />
          {weatherData.current?.latitude && (
            <HistoricalWeather
              lat={weatherData.current.latitude}
              lon={weatherData.current.longitude}
            />
          )}
        </>
      )}
    </div>
  );
}
