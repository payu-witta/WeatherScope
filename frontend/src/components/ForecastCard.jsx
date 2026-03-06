import React from 'react';

function getDayLabel(dateStr) {
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tmrw';
  return date.toLocaleDateString([], { weekday: 'short' });
}

export default function ForecastCard({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3>5-Day Forecast</h3>
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
        {forecast.map(day => (
          <div key={day.date} style={{
            minWidth: '80px',
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontWeight: 'bold' }}>{getDayLabel(day.date)}</p>
            <p>{day.temp_max}° / {day.temp_min}°</p>
            <p style={{ fontSize: '0.75rem' }}>{day.weather_condition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
