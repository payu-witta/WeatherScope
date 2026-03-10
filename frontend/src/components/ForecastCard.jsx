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

function ForecastDay({ day }) {
  const iconUrl = day.icon
    ? `https://openweathermap.org/img/wn/${day.icon}@2x.png`
    : null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1.25rem 1rem',
      minWidth: '80px',
      flexShrink: 0,
    }}>
      <span style={{
        fontSize: '0.6875rem',
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--atmo-muted)',
      }}>
        {getDayLabel(day.date)}
      </span>

      {iconUrl ? (
        <img src={iconUrl} alt={day.weather_condition} style={{ width: '2.5rem', height: '2.5rem' }} />
      ) : (
        <div style={{ width: '2.5rem', height: '2.5rem' }} />
      )}

      <p style={{
        fontSize: '0.625rem',
        color: 'var(--atmo-faint)',
        textAlign: 'center',
        textTransform: 'capitalize',
        lineHeight: 1.3,
        maxWidth: '70px',
      }}>
        {day.weather_condition}
      </p>

      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'baseline' }}>
        <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--atmo-text)' }}>
          {day.temp_max}°
        </span>
        <span style={{ fontSize: '0.8125rem', color: 'var(--atmo-muted)' }}>
          {day.temp_min}°
        </span>
      </div>

      {day.humidity != null && (
        <span style={{ fontSize: '0.625rem', color: 'var(--atmo-faint)' }}>
          {day.humidity}% RH
        </span>
      )}
    </div>
  );
}

export default function ForecastCard({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="fade-in">
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.6875rem',
        fontWeight: 500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--atmo-muted)',
        marginBottom: '0.5rem',
      }}>
        5-Day Forecast
      </p>

      <div className="scroll-x" style={{
        display: 'flex',
        borderTop: '1px solid var(--atmo-border)',
        borderBottom: '1px solid var(--atmo-border)',
      }}>
        {forecast.map((day, i) => (
          <React.Fragment key={day.date}>
            {i > 0 && (
              <div style={{ width: '1px', background: 'var(--atmo-border)', flexShrink: 0, alignSelf: 'stretch' }} />
            )}
            <ForecastDay day={day} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
