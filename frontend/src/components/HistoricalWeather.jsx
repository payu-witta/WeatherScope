import React, { useState } from 'react';
import { getHistoricalWeather } from '../services/api.js';
import ErrorMessage from './ErrorMessage.jsx';

export default function HistoricalWeather({ lat, lon }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const maxStart = endDate || today;

  async function handleFetch(e) {
    e.preventDefault();
    if (!startDate || !endDate) { setError('Please select both start and end dates'); return; }
    if (startDate > endDate) { setError('Start date must be before end date'); return; }

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 5);
    if (new Date(endDate) > cutoff) {
      setError('End date must be at least 5 days in the past (Open-Meteo archive requirement)');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const result = await getHistoricalWeather(lat, lon, startDate, endDate);
      setData(result.historical);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fade-in">
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.6875rem',
        fontWeight: 500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--atmo-muted)',
        marginBottom: '1rem',
      }}>
        Historical Weather · Open-Meteo
      </p>

      <form onSubmit={handleFetch} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.625rem', color: 'var(--atmo-faint)', marginBottom: '0.3rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Start Date
          </label>
          <input
            type="date"
            className="input-field"
            style={{ width: 'auto' }}
            value={startDate}
            max={maxStart}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.625rem', color: 'var(--atmo-faint)', marginBottom: '0.3rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            End Date
          </label>
          <input
            type="date"
            className="input-field"
            style={{ width: 'auto' }}
            value={endDate}
            max={today}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Loading…' : 'Fetch'}
        </button>
      </form>

      {error && <div style={{ marginTop: '0.75rem' }}><ErrorMessage message={error} onDismiss={() => setError(null)} /></div>}

      {data && data.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 0.75fr 0.75fr',
            gap: '0.5rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--atmo-border)',
            fontSize: '0.625rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--atmo-faint)',
          }}>
            <span>Date</span>
            <span>High / Low</span>
            <span>Condition</span>
            <span>Precip</span>
            <span>Wind</span>
          </div>
          {data.map(day => (
            <div key={day.date} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 0.75fr 0.75fr',
              gap: '0.5rem',
              padding: '0.5rem 0',
              borderBottom: '1px solid var(--atmo-border)',
              fontSize: '0.8125rem',
              color: 'var(--atmo-muted)',
            }}>
              <span>{day.date}</span>
              <span style={{ color: 'var(--atmo-text)' }}>{day.temp_max}° / {day.temp_min}°</span>
              <span style={{ color: 'var(--atmo-faint)' }}>{day.weather_condition}</span>
              <span>{day.precipitation ?? 0} mm</span>
              <span>{day.wind_speed_max} km/h</span>
            </div>
          ))}
        </div>
      )}

      {data && data.length === 0 && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--atmo-faint)', marginTop: '1rem' }}>
          No data available for the selected range.
        </p>
      )}
    </div>
  );
}
