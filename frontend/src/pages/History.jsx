import React from 'react';
import WeatherHistory from '../components/WeatherHistory.jsx';

export default function History() {
  return (
    <div>
      <h1>Weather History</h1>
      <p style={{ color: '#666', marginBottom: '1rem' }}>Your saved weather records</p>
      <WeatherHistory />
    </div>
  );
}
