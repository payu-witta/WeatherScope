import React from 'react';

function AqiChip({ airQuality }) {
  if (!airQuality) return null;
  const colors = {
    'Good': '#22c55e',
    'Moderate': '#eab308',
    'Unhealthy for Sensitive Groups': '#f97316',
    'Unhealthy': '#ef4444',
    'Very Unhealthy': '#a855f7',
    'Hazardous': '#7f1d1d'
  };
  const bg = colors[airQuality.category] || '#6b7280';
  return (
    <span style={{
      background: bg, color: '#fff', borderRadius: '9999px',
      padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600,
      letterSpacing: '0.02em'
    }}>
      AQI {airQuality.us_aqi} · {airQuality.category}
    </span>
  );
}

export default function WeatherDisplay({ data }) {
  if (!data) return null;
  const { current } = data;
  const uv = current.uv_index;
  const aqi = current.air_quality;

  return (
    <div className="card fade-in" style={{ marginTop: '1.5rem' }}>
      <p style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
        Current Conditions
      </p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, marginBottom: '0.25rem' }}>
        {current.location}{current.country ? `, ${current.country}` : ''}
      </h2>
      <p style={{ fontSize: '3.5rem', fontWeight: 300, lineHeight: 1, margin: '0.5rem 0', color: 'var(--atmo-accent)' }}>
        {current.temperature}°<span style={{ fontSize: '1.5rem' }}>C</span>
      </p>
      <p style={{ textTransform: 'capitalize', opacity: 0.75, marginBottom: '0.25rem' }}>{current.description}</p>
      <p style={{ fontSize: '0.85rem', opacity: 0.55 }}>
        Feels like {current.feels_like}°C &nbsp;·&nbsp; {current.temp_min}° / {current.temp_max}°
      </p>

      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
        <span><span style={{ opacity: 0.5 }}>Humidity</span> {current.humidity}%</span>
        <span><span style={{ opacity: 0.5 }}>Wind</span> {current.wind_speed} km/h</span>
        <span><span style={{ opacity: 0.5 }}>Pressure</span> {current.pressure} hPa</span>
        {current.visibility != null && <span><span style={{ opacity: 0.5 }}>Visibility</span> {current.visibility} km</span>}
        {uv && <span><span style={{ opacity: 0.5 }}>UV</span> {uv.value} ({uv.category})</span>}
      </div>

      {aqi && (
        <div style={{ marginTop: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <AqiChip airQuality={aqi} />
          {aqi.pm2_5 != null && (
            <span style={{ fontSize: '0.78rem', opacity: 0.55 }}>
              PM2.5: {aqi.pm2_5} · PM10: {aqi.pm10}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
