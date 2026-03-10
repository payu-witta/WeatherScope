import React, { useState } from 'react';
import { createWeatherRecord } from '../services/api.js';
import ErrorMessage from './ErrorMessage.jsx';

function TemperatureSummary({ historical }) {
  if (!historical || historical.length === 0) return null;
  const temps = historical.map(d => (d.temp_max + d.temp_min) / 2);
  const avg = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
  const max = Math.max(...historical.map(d => d.temp_max)).toFixed(1);
  const min = Math.min(...historical.map(d => d.temp_min)).toFixed(1);

  return (
    <div className="fade-in" style={{ marginTop: '1.25rem' }}>
      <p style={{
        fontSize: '0.6875rem',
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--atmo-muted)',
        marginBottom: '0.75rem',
      }}>
        Historical temperatures fetched
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
        {[
          { label: 'Avg', value: `${avg}°C` },
          { label: 'High', value: `${max}°C` },
          { label: 'Low', value: `${min}°C` },
        ].map(({ label, value }) => (
          <div key={label}>
            <p style={{ fontSize: '0.625rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--atmo-faint)' }}>
              {label}
            </p>
            <p style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--atmo-text)', marginTop: '0.1rem' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div style={{ maxHeight: '8rem', overflowY: 'auto' }}>
        {historical.map(day => (
          <div key={day.date} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.3rem 0',
            borderBottom: '1px solid var(--atmo-border)',
            fontSize: '0.8125rem',
          }}>
            <span style={{ color: 'var(--atmo-muted)' }}>{day.date}</span>
            <span style={{ color: 'var(--atmo-faint)', fontSize: '0.75rem' }}>{day.weather_condition}</span>
            <span style={{ color: 'var(--atmo-text)' }}>{day.temp_max}° / {day.temp_min}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SavePanel({ weatherData }) {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!weatherData) return null;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 5);
  const isHistorical = startDate && new Date(startDate) <= cutoff;

  const locationName = weatherData.current.location +
    (weatherData.current.country ? ', ' + weatherData.current.country : '');

  async function handleSave(e) {
    e.preventDefault();
    if (startDate && endDate && startDate > endDate) {
      setError('Start date must be on or before end date');
      return;
    }
    setSaving(true);
    setError(null);
    setResult(null);
    try {
      const data = await createWeatherRecord({
        location: locationName,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        notes: notes.trim() || undefined,
      });
      setResult(data);
      setNotes('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (result) {
    return (
      <div className="fade-in" style={{
        padding: '1.25rem 0',
        borderTop: '1px solid var(--atmo-border)',
        borderBottom: '1px solid var(--atmo-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <p style={{ fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--atmo-muted)', marginBottom: '0.25rem' }}>
              Save to History
            </p>
            <p style={{ fontSize: '0.875rem', color: '#86efac' }}>
              {result.records?.length > 1
                ? `✓ ${result.records.length} records saved — ${result.records[0].location} · ${result.records[0].start_date} → ${result.records[result.records.length - 1].end_date}`
                : `✓ Record saved — ${result.record.location} · ${result.record.start_date}${result.record.end_date !== result.record.start_date ? ` → ${result.record.end_date}` : ''}${result.record.temperature != null ? ` · ${result.record.temperature}°C` : ''}`
              }
            </p>
          </div>
          <button onClick={() => setResult(null)} className="btn-secondary" style={{ fontSize: '0.8125rem' }}>
            Save another
          </button>
        </div>
        {result.historical && <TemperatureSummary historical={result.historical} />}
      </div>
    );
  }

  return (
    <div className="fade-in" style={{
      padding: '1.25rem 0',
      borderTop: '1px solid var(--atmo-border)',
      borderBottom: '1px solid var(--atmo-border)',
    }}>
      <p style={{
        fontSize: '0.6875rem',
        fontWeight: 500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--atmo-muted)',
        marginBottom: '0.5rem',
      }}>
        Save to History
      </p>

      <p style={{ fontSize: '0.8125rem', color: 'var(--atmo-faint)', marginBottom: '1rem' }}>
        Saving <span style={{ color: 'var(--atmo-muted)' }}>{locationName}</span>.
        Past dates fetch real historical temperatures from Open-Meteo.
      </p>

      {isHistorical && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.625rem 0.875rem',
          background: 'rgba(251,191,36,0.08)',
          border: '1px solid rgba(251,191,36,0.2)',
          borderRadius: '0.5rem',
          fontSize: '0.8125rem',
          color: 'rgba(253,230,138,0.8)',
        }}>
          Historical range — actual recorded temperatures will be fetched and stored.
        </div>
      )}

      {error && <div style={{ marginBottom: '1rem' }}><ErrorMessage message={error} onDismiss={() => setError(null)} /></div>}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--atmo-muted)', marginBottom: '0.3rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
              Start Date
            </label>
            <input type="date" className="input-field" value={startDate} max={today} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--atmo-muted)', marginBottom: '0.3rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
              End Date
            </label>
            <input type="date" className="input-field" value={endDate} max={today} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--atmo-muted)', marginBottom: '0.3rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
            Notes
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Optional note…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            maxLength={500}
          />
        </div>

        <div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? (
              <>
                <span className="spin" style={{
                  display: 'inline-block',
                  width: '0.875rem',
                  height: '0.875rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                }} />
                {isHistorical ? 'Fetching historical data…' : 'Saving…'}
              </>
            ) : (
              isHistorical ? 'Fetch Historical & Save' : 'Save to History'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
