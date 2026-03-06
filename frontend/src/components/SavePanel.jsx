import React, { useState } from 'react';
import { createWeatherRecord } from '../services/api.js';

export default function SavePanel({ weatherData }) {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  if (!weatherData) return null;

  const locationName = weatherData.current.location +
    (weatherData.current.country ? ', ' + weatherData.current.country : '');

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createWeatherRecord({
        location: locationName,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        notes: notes.trim() || undefined
      });
      setSaved(true);
      setNotes('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <div style={{ marginTop: '1.5rem' }}>
        <p style={{ color: 'green' }}>✓ Record saved successfully</p>
        <button onClick={() => setSaved(false)}>Save another</button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>Save to History</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem' }}>Start Date</label>
            <input type="date" value={startDate} max={today} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem' }}>End Date</label>
            <input type="date" value={endDate} max={today} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem' }}>Notes</label>
          <input
            type="text"
            placeholder="Optional note…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save to History'}
        </button>
      </form>
    </div>
  );
}
