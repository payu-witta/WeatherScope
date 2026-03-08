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
      padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600
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
    <div style={{ marginTop: '1.5rem' }}>
      <h2>{current.location}, {current.country}</h2>
      <p style={{ fontSize: '3rem', margin: '0.5rem 0' }}>{current.temperature}°C</p>
      <p style={{ textTransform: 'capitalize' }}>{current.description}</p>
      <p>Feels like {current.feels_like}°C · {current.temp_min}°C / {current.temp_max}°C</p>
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <span>Humidity: {current.humidity}%</span>
        <span>Wind: {current.wind_speed} km/h</span>
        <span>Pressure: {current.pressure} hPa</span>
        {current.visibility != null && <span>Visibility: {current.visibility} km</span>}
        {uv && <span>UV: {uv.value} ({uv.category})</span>}
      </div>
      {aqi && (
        <div style={{ marginTop: '0.75rem' }}>
          <AqiChip airQuality={aqi} />
          {aqi.pm2_5 != null && (
            <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', opacity: 0.8 }}>
              PM2.5: {aqi.pm2_5} · PM10: {aqi.pm10}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
