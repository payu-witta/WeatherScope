import React from 'react';

const WIND_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

function getWindDirection(degrees) {
  if (degrees == null) return '—';
  return WIND_DIRECTIONS[Math.round(degrees / 45) % 8];
}

function fmt(val, suffix = '') {
  return val != null ? `${val}${suffix}` : '—';
}

function AQIChip({ aqi }) {
  if (!aqi) return null;
  const palette = {
    'Good': { bg: 'rgba(34,197,94,0.15)', color: '#86efac' },
    'Moderate': { bg: 'rgba(234,179,8,0.15)', color: '#fde047' },
    'Unhealthy for Sensitive Groups': { bg: 'rgba(249,115,22,0.15)', color: '#fdba74' },
    'Unhealthy': { bg: 'rgba(239,68,68,0.15)', color: '#fca5a5' },
    'Very Unhealthy': { bg: 'rgba(168,85,247,0.15)', color: '#d8b4fe' },
    'Hazardous': { bg: 'rgba(244,63,94,0.2)', color: '#fda4af' },
  };
  const p = palette[aqi.category] || { bg: 'var(--atmo-surface)', color: 'var(--atmo-muted)' };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.25rem 0.75rem',
      borderRadius: '99px',
      background: p.bg,
      color: p.color,
      fontSize: '0.75rem',
      fontWeight: 500,
    }}>
      AQI {aqi.us_aqi} · {aqi.category}
    </span>
  );
}

function MetricCell({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      <span style={{
        fontSize: '0.625rem',
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--atmo-muted)',
      }}>
        {label}
      </span>
      <span style={{ fontSize: '0.9375rem', fontWeight: 400, color: 'var(--atmo-text)' }}>
        {value}
      </span>
    </div>
  );
}

export default function WeatherDisplay({ data }) {
  if (!data) return null;
  const { current } = data;

  const iconUrl = current.icon
    ? `https://openweathermap.org/img/wn/${current.icon}@2x.png`
    : null;

  const sunriseTime = current.sunrise
    ? new Date(current.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—';
  const sunsetTime = current.sunset
    ? new Date(current.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      <div style={{ marginBottom: '0.25rem' }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6875rem',
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--atmo-muted)',
          marginBottom: '0.25rem',
        }}>
          Currently
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
          color: 'var(--atmo-text)',
          letterSpacing: '0.01em',
          lineHeight: 1.1,
        }}>
          {current.location}
          {current.country && (
            <span style={{ color: 'var(--atmo-muted)', fontWeight: 300, marginLeft: '0.4rem' }}>
              {current.country}
            </span>
          )}
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--atmo-faint)', marginTop: '0.2rem' }}>
          {current.latitude?.toFixed(4)}, {current.longitude?.toFixed(4)}
        </p>
        {current.air_quality && (
          <div style={{ marginTop: '0.6rem' }}>
            <AQIChip aqi={current.air_quality} />
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '1.25rem',
        padding: '2rem 0 1.5rem',
        borderBottom: '1px solid var(--atmo-border)',
      }}>
        {iconUrl && (
          <img
            src={iconUrl}
            alt={current.description}
            style={{ width: '4rem', height: '4rem', opacity: 0.9, flexShrink: 0 }}
          />
        )}
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', lineHeight: 1 }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontStyle: 'normal',
              fontWeight: 300,
              fontSize: 'clamp(5.5rem, 18vw, 9rem)',
              color: 'var(--atmo-text)',
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
            }}>
              {current.temperature}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: '2rem',
              color: 'var(--atmo-muted)',
              marginTop: '0.75rem',
              marginLeft: '0.25rem',
            }}>
              °C
            </span>
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            fontWeight: 300,
            color: 'var(--atmo-muted)',
            marginTop: '0.5rem',
            textTransform: 'capitalize',
          }}>
            {current.description}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--atmo-faint)', marginTop: '0.2rem' }}>
            Feels like {fmt(current.feels_like, '°')} · {fmt(current.temp_min, '°')} / {fmt(current.temp_max, '°')}
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '1.5rem 1rem',
        padding: '1.75rem 0',
        borderBottom: '1px solid var(--atmo-border)',
      }}>
        <MetricCell label="Humidity" value={fmt(current.humidity, '%')} />
        <MetricCell label="Wind" value={`${fmt(current.wind_speed)} km/h`} />
        <MetricCell label="Direction" value={getWindDirection(current.wind_direction)} />
        <MetricCell label="Pressure" value={fmt(current.pressure, ' hPa')} />
        <MetricCell label="Visibility" value={fmt(current.visibility, ' km')} />
        <MetricCell label="Cloud Cover" value={fmt(current.cloudiness, '%')} />
        {current.uv_index != null && (
          <MetricCell
            label="UV Index"
            value={`${current.uv_index.value} · ${current.uv_index.category}`}
          />
        )}
        <MetricCell label="Sunrise" value={sunriseTime} />
        <MetricCell label="Sunset" value={sunsetTime} />
      </div>
    </div>
  );
}
