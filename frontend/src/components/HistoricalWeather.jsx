import React, { useState } from 'react';
import { getHistoricalWeather } from '../services/api.js';
import ErrorMessage from './ErrorMessage.jsx';

const WMO_ICONS = {
  'Clear sky': '☀', 'Mainly clear': '🌤', 'Partly cloudy': '⛅', 'Overcast': '☁',
  'Foggy': '🌫', 'Depositing rime fog': '🌫',
  'Light drizzle': '🌦', 'Moderate drizzle': '🌦', 'Dense drizzle': '🌧',
  'Slight rain': '🌧', 'Moderate rain': '🌧', 'Heavy rain': '🌧',
  'Slight snow': '🌨', 'Moderate snow': '❄', 'Heavy snow': '❄', 'Snow grains': '❄',
  'Slight showers': '🌦', 'Moderate showers': '🌧', 'Violent showers': '⛈',
  'Thunderstorm': '⛈', 'Thunderstorm with hail': '⛈', 'Thunderstorm with heavy hail': '⛈'
};

export default function HistoricalWeather({ lat, lon }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  async function handleFetch(e) {
    e.preventDefault();
    if (!startDate || !endDate) { setError('Please select both dates'); return; }
    if (startDate > endDate) { setError('Start date must be before end date'); return; }

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
    <div style={{ marginTop: '1.5rem' }} className="fade-in">
      <h3 style={{ marginBottom: '0.75rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>
        Historical Weather
      </h3>
      <form onSubmit={handleFetch} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', opacity: 0.6, marginBottom: '0.25rem' }}>Start Date</label>
          <input type="date" value={startDate} max={today} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', opacity: 0.6, marginBottom: '0.25rem' }}>End Date</label>
          <input type="date" value={endDate} max={today} onChange={e => setEndDate(e.target.value)} />
        </div>
        <button className="btn btn-accent" type="submit" disabled={loading}>
          {loading ? 'Loading…' : 'Fetch'}
        </button>
      </form>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      {data && data.length > 0 && (
        <div className="card" style={{ marginTop: '1rem', padding: '0.5rem 0' }}>
          {data.map((day, i) => (
            <div key={day.date} style={{
              display: 'grid',
              gridTemplateColumns: '6.5rem 2rem 5rem 5rem 4rem',
              gap: '0.5rem',
              alignItems: 'center',
              padding: '0.45rem 1rem',
              background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)',
              fontSize: '0.8125rem'
            }}>
              <span style={{ opacity: 0.7 }}>{day.date}</span>
              <span>{WMO_ICONS[day.weather_condition] || '🌡'}</span>
              <span>{day.temp_max}° / {day.temp_min}°</span>
              <span style={{ opacity: 0.65 }}>{day.weather_condition}</span>
              <span style={{ opacity: 0.55 }}>{day.precipitation ?? 0} mm</span>
            </div>
          ))}
        </div>
      )}
      {data && data.length === 0 && (
        <p style={{ opacity: 0.5, fontSize: '0.875rem', marginTop: '0.75rem' }}>No data for the selected range.</p>
      )}
    </div>
  );
}
