import React, { useState } from 'react';

export default function LocationInput({ onSearch, onGeolocate, loading }) {
  const [value, setValue] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  }

  function handleGeolocate() {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = `${pos.coords.latitude.toFixed(4)},${pos.coords.longitude.toFixed(4)}`;
        setValue(coords);
        setGeoLoading(false);
        onGeolocate(pos.coords.latitude, pos.coords.longitude);
      },
      err => {
        setGeoLoading(false);
        if (err.code === 1) setGeoError('Location access denied — please allow access in your browser settings');
        else setGeoError('Unable to retrieve your location');
      },
      { timeout: 10000 }
    );
  }

  const busy = loading || geoLoading;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="City, zip code, or lat,lon…"
            value={value}
            onChange={e => setValue(e.target.value)}
            disabled={busy}
            style={{ flex: 1, fontSize: '1rem' }}
          />
          <button className="btn btn-accent" type="submit" disabled={busy || !value.trim()}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </div>
        <button
          className="btn"
          type="button"
          onClick={handleGeolocate}
          disabled={busy}
          style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}
        >
          {geoLoading ? <span className="spin" style={{ display: 'inline-block' }}>⟳</span> : '◎'} Use my location
        </button>
      </form>
      {geoError && <p style={{ fontSize: '0.8rem', color: '#f87171', marginTop: '0.4rem' }}>{geoError}</p>}
    </div>
  );
}
