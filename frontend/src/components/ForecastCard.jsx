import React from 'react';

const OWM_ICON = code => `https://openweathermap.org/img/wn/${code}@2x.png`;

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
    <div style={{ marginTop: '1.5rem' }} className="fade-in stagger-2">
      <h3 style={{ marginBottom: '0.75rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>
        5-Day Forecast
      </h3>
      <div style={{ display: 'flex', gap: '0.625rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {forecast.map((day, i) => (
          <div key={day.date} className={`card stagger-${i + 1}`} style={{
            minWidth: '90px',
            textAlign: 'center',
            flexShrink: 0,
            padding: '0.75rem 0.5rem'
          }}>
            <p style={{ fontWeight: 600, fontSize: '0.8rem' }}>{getDayLabel(day.date)}</p>
            {day.icon && (
              <img
                src={OWM_ICON(day.icon)}
                alt={day.weather_condition}
                width={40}
                height={40}
                style={{ margin: '0.1rem auto', display: 'block' }}
              />
            )}
            <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{day.temp_max}°</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.55 }}>{day.temp_min}°</p>
            <p style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: '0.2rem' }}>{day.weather_condition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
