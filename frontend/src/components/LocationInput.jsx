import React, { useState } from 'react';

export default function LocationInput({ onSearch, loading }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
      <input
        type="text"
        placeholder="Enter a city name..."
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={loading}
        style={{ flex: 1, padding: '0.5rem', fontSize: '1rem' }}
      />
      <button type="submit" disabled={loading || !value.trim()}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}
