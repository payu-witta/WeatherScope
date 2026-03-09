import React, { useState } from 'react';
import { createWeatherRecord } from '../services/api.js';
import ErrorMessage from './ErrorMessage.jsx';

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
      <div className="card fade-in" style={{ marginTop: '1.5rem' }}>
        <p style={{ color: 'var(--atmo-accent)', marginBottom: '0.75rem' }}>✓ Record saved successfully</p>
        <button className="btn" onClick={() => setSaved(false)}>Save another</button>
      </div>
    );
  }

  return (
    <div className="card fade-in" style={{ marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>
        Save to History
      </h3>
      <ErrorMessage message={error} onDismiss={() => setError(null)} />
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: error ? '0.75rem' : 0 }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', opacity: 0.6, marginBottom: '0.25rem' }}>Start Date</label>
            <input type="date" value={startDate} max={today} onChange={e => setStartDate(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', opacity: 0.6, marginBottom: '0.25rem' }}>End Date</label>
            <input type="date" value={endDate} max={today} onChange={e => setEndDate(e.target.value)} style={{ width: '100%' }} />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', opacity: 0.6, marginBottom: '0.25rem' }}>Notes</label>
          <input
            type="text"
            placeholder="Optional note…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <button className="btn btn-accent" type="submit" disabled={saving} style={{ alignSelf: 'flex-start' }}>
          {saving ? 'Saving…' : 'Save to History'}
        </button>
      </form>
    </div>
  );
}
