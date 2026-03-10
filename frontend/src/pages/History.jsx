import React from 'react';
import WeatherHistory from '../components/WeatherHistory.jsx';

export default function History() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ paddingTop: '1rem' }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6875rem',
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--atmo-muted)',
          marginBottom: '0.35rem',
        }}>
          Records
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(2rem, 6vw, 3rem)',
          color: 'var(--atmo-text)',
          letterSpacing: '0.01em',
          lineHeight: 1.15,
        }}>
          Weather History
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--atmo-muted)', marginTop: '0.4rem' }}>
          View, edit, delete, and export your saved weather records
        </p>
      </div>

      <WeatherHistory />
    </div>
  );
}
