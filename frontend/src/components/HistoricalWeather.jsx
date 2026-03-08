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
    <div style={{ marginTop: '1.5rem' }}>
      <h3>Historical Weather</h3>
      <form onSubmit={handleFetch} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem' }}>Start Date</label>
          <input type="date" value={startDate} max={today} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem' }}>End Date</label>
          <input type="date" value={endDate} max={today} onChange={e => setEndDate(e.target.value)} />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Loading…' : 'Fetch'}</button>
      </form>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      {data && data.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          {data.map(day => (
            <div key={day.date} style={{ display: 'flex', gap: '1rem', padding: '0.4rem 0', borderBottom: '1px solid #eee', fontSize: '0.875rem' }}>
              <span>{day.date}</span>
              <span>{day.temp_max}° / {day.temp_min}°</span>
              <span>{day.weather_condition}</span>
              <span>{day.precipitation ?? 0} mm</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
