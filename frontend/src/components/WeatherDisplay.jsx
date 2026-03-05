import React from 'react';

export default function WeatherDisplay({ data }) {
  if (!data) return null;
  const { current } = data;

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h2>{current.location}, {current.country}</h2>
      <p style={{ fontSize: '3rem', margin: '0.5rem 0' }}>{current.temperature}°C</p>
      <p style={{ textTransform: 'capitalize' }}>{current.description}</p>
      <p>Feels like {current.feels_like}°C</p>
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
        <span>Humidity: {current.humidity}%</span>
        <span>Wind: {current.wind_speed} km/h</span>
        <span>Pressure: {current.pressure} hPa</span>
      </div>
    </div>
  );
}
