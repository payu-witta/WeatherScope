import React, { useState, useEffect } from 'react';
import LocationInput from '../components/LocationInput.jsx';
import WeatherDisplay from '../components/WeatherDisplay.jsx';
import ForecastCard from '../components/ForecastCard.jsx';
import MapEmbed from '../components/MapEmbed.jsx';
import HistoricalWeather from '../components/HistoricalWeather.jsx';
import SavePanel from '../components/SavePanel.jsx';
import YouTubeVideos from '../components/YouTubeVideos.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { getCurrentWeather } from '../services/api.js';
import { applyAtmosphere } from '../utils/atmosphere.js';
import TravelTips from '../components/TravelTips.jsx';

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

  useEffect(() => {
    return () => {
      document.documentElement.removeAttribute('data-atmosphere');
    };
  }, []);

  async function fetchWeather(location) {
    setLoading(true);
    setError(null);
    setWeatherData(null);
    setSearchedLocation(null);
    try {
      const data = await getCurrentWeather(location);
      setWeatherData(data);
      setSearchedLocation(
        data.current.location + (data.current.country ? ', ' + data.current.country : '')
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGeolocate(lat, lon) {
    await fetchWeather(`${lat.toFixed(4)},${lon.toFixed(4)}`);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <LocationInput onSearch={fetchWeather} onGeolocate={handleGeolocate} loading={loading} />

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {loading && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          padding: '4rem 0',
        }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            border: '2px solid var(--atmo-border)',
            borderTopColor: 'var(--atmo-accent)',
            borderRadius: '50%',
          }} className="spin" />
          <p style={{ fontSize: '0.875rem', color: 'var(--atmo-muted)' }}>
            Fetching weather data…
          </p>
        </div>
      )}

      {weatherData && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="stagger">
          <WeatherDisplay data={weatherData} />
          <TravelTips data={weatherData} />
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
        </div>
      )}

      {!weatherData && !loading && !error && (
        <div style={{
          padding: '5rem 1rem',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            color: 'var(--atmo-faint)',
            letterSpacing: '0.01em',
            lineHeight: 1.3,
            marginBottom: '0.75rem',
          }}>
            Enter a location to begin
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--atmo-faint)' }}>
            City name, zip code, GPS coordinates, or use your current location
          </p>
        </div>
      )}
    </div>
  );
}
