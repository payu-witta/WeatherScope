import React, { useState } from 'react';

export default function LocationInput({ onSearch, onGeolocate, loading }) {
  const [value, setValue] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  }

  function handleGeolocate() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = `${pos.coords.latitude.toFixed(4)},${pos.coords.longitude.toFixed(4)}`;
        setValue(coords);
        setGeoLoading(false);
        onGeolocate(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setGeoLoading(false);
      },
      { timeout: 10000 }
    );
  }

  const busy = loading || geoLoading;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="City, zip code, or coordinates…"
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={busy}
          style={{ flex: 1, padding: '0.5rem', fontSize: '1rem' }}
        />
        <button type="submit" disabled={busy || !value.trim()}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>
      <button
        type="button"
        onClick={handleGeolocate}
        disabled={busy}
        style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}
      >
        {geoLoading ? 'Locating…' : '◎ Use my location'}
      </button>
    </form>
  );
}
