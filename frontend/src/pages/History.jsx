import React from 'react';
import WeatherHistory from '../components/WeatherHistory.jsx';

export default function History() {
  return (
    <div className="fade-in">
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
        History
      </h1>
      <p style={{ opacity: 0.45, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Your saved weather records
      </p>
      <WeatherHistory />
    </div>
  );
}
