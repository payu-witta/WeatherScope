import React, { useState } from 'react';

const EXAMPLES = ['New York', 'London, GB', '10001', '48.8566,2.3522', 'Tokyo, JP'];

export default function LocationInput({ onSearch, onGeolocate, loading }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) { setError('Enter a location to search'); return; }
    if (value.trim().length > 200) { setError('Location is too long'); return; }
    setError(null);
    onSearch(value.trim());
  }

  function handleGeolocate() {
    if (!navigator.geolocation) { setError('Geolocation not supported'); return; }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = `${pos.coords.latitude.toFixed(4)},${pos.coords.longitude.toFixed(4)}`;
        setValue(coords);
        setGeoLoading(false);
        setError(null);
        onGeolocate(pos.coords.latitude, pos.coords.longitude);
      },
      err => {
        setGeoLoading(false);
        const msgs = { 1: 'Location access denied.', 2: 'Unable to determine location.', 3: 'Location request timed out.' };
        setError(msgs[err.code] || 'Geolocation failed');
      },
      { timeout: 10000 }
    );
  }

  const busy = loading || geoLoading;

  return (
    <div className="fade-in">
      <form onSubmit={handleSubmit} noValidate>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'stretch',
        }}>
          <input
            type="text"
            className="input-field"
            style={{ borderRadius: '0.625rem' }}
            placeholder="City, zip code, or coordinates…"
            value={value}
            onChange={e => { setValue(e.target.value); if (error) setError(null); }}
            disabled={busy}
            aria-label="Location search"
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={busy}
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {loading ? (
              <>
                <span className="spin" style={{
                  display: 'inline-block',
                  width: '0.875rem',
                  height: '0.875rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                }} />
                Searching
              </>
            ) : 'Search'}
          </button>
        </div>

        {error && (
          <p style={{ fontSize: '0.8125rem', color: '#fca5a5', marginTop: '0.5rem', paddingLeft: '0.25rem' }}>
            {error}
          </p>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginTop: '0.75rem',
        }}>
          <button
            type="button"
            onClick={handleGeolocate}
            disabled={busy}
            className="btn-secondary"
            style={{ fontSize: '0.8125rem' }}
          >
            {geoLoading ? (
              <>
                <span className="spin" style={{
                  display: 'inline-block',
                  width: '0.75rem',
                  height: '0.75rem',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderTopColor: 'var(--atmo-accent)',
                  borderRadius: '50%',
                }} />
                Locating…
              </>
            ) : (
              <>
                <span>◎</span>
                Use my location
              </>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--atmo-faint)', letterSpacing: '0.05em' }}>
              Try
            </span>
            {EXAMPLES.map(ex => (
              <button
                key={ex}
                type="button"
                onClick={() => { setValue(ex); setError(null); }}
                disabled={busy}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.6875rem',
                  color: 'var(--atmo-accent)',
                  opacity: 0.75,
                  padding: '0.1rem 0.2rem',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                  fontFamily: 'var(--font-body)',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => e.target.style.opacity = 1}
                onMouseLeave={e => e.target.style.opacity = 0.75}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
