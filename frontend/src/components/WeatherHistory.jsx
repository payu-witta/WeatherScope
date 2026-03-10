import React, { useState, useEffect, useCallback } from 'react';
import { getAllRecords, deleteRecord, updateRecord, getExportUrl } from '../services/api.js';
import ErrorMessage from './ErrorMessage.jsx';

function EditModal({ record, onSave, onClose }) {
  const [form, setForm] = useState({
    location: record.location || '',
    start_date: record.start_date || '',
    end_date: record.end_date || '',
    temperature: record.temperature ?? '',
    weather_condition: record.weather_condition || '',
    humidity: record.humidity ?? '',
    wind_speed: record.wind_speed ?? '',
    notes: record.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        location: form.location || undefined,
        start_date: form.start_date || undefined,
        end_date: form.end_date || undefined,
        temperature: form.temperature !== '' ? Number(form.temperature) : undefined,
        weather_condition: form.weather_condition || undefined,
        humidity: form.humidity !== '' ? Number(form.humidity) : undefined,
        wind_speed: form.wind_speed !== '' ? Number(form.wind_speed) : undefined,
        notes: form.notes || undefined,
      };
      await onSave(record.id, payload);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--atmo-bg2)',
        border: '1px solid var(--atmo-border)',
        borderRadius: '1rem',
        padding: '1.5rem',
        width: '100%',
        maxWidth: '480px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--atmo-text)' }}>
            Edit Record #{record.id}
          </p>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--atmo-muted)', fontSize: '1.25rem', lineHeight: 1, padding: 0,
            }}
          >
            ×
          </button>
        </div>

        {error && <div style={{ marginBottom: '1rem' }}><ErrorMessage message={error} onDismiss={() => setError(null)} /></div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div>
            <label style={labelStyle}>Location</label>
            <input name="location" className="input-field" value={form.location} onChange={handleChange} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
            <div>
              <label style={labelStyle}>Start Date</label>
              <input type="date" name="start_date" className="input-field" value={form.start_date} onChange={handleChange} />
            </div>
            <div>
              <label style={labelStyle}>End Date</label>
              <input type="date" name="end_date" className="input-field" value={form.end_date} onChange={handleChange} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
            <div>
              <label style={labelStyle}>Temperature (°C)</label>
              <input type="number" step="0.1" name="temperature" className="input-field" value={form.temperature} onChange={handleChange} />
            </div>
            <div>
              <label style={labelStyle}>Condition</label>
              <input name="weather_condition" className="input-field" value={form.weather_condition} onChange={handleChange} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
            <div>
              <label style={labelStyle}>Humidity (%)</label>
              <input type="number" name="humidity" min="0" max="100" className="input-field" value={form.humidity} onChange={handleChange} />
            </div>
            <div>
              <label style={labelStyle}>Wind Speed (km/h)</label>
              <input type="number" step="0.1" min="0" name="wind_speed" className="input-field" value={form.wind_speed} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              name="notes"
              className="input-field"
              style={{ resize: 'none' }}
              rows={3}
              value={form.notes}
              onChange={handleChange}
              maxLength={500}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.625rem',
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--atmo-muted)',
  marginBottom: '0.3rem',
};

function RecordRow({ record, onEdit, onDelete }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '1rem',
      padding: '1rem 0',
      borderBottom: '1px solid var(--atmo-border)',
      flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 500, color: 'var(--atmo-text)', fontSize: '0.9375rem' }}>
            {record.location}
          </span>
          {record.weather_condition && (
            <span style={{
              fontSize: '0.6875rem',
              color: 'var(--atmo-accent)',
              background: 'var(--atmo-glow)',
              padding: '0.15rem 0.6rem',
              borderRadius: '99px',
            }}>
              {record.weather_condition}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem', fontSize: '0.8125rem', color: 'var(--atmo-faint)', flexWrap: 'wrap' }}>
          {record.temperature != null && <span>{record.temperature}°C</span>}
          {record.humidity != null && <span>{record.humidity}% RH</span>}
          {record.wind_speed != null && <span>{record.wind_speed} km/h</span>}
          {record.start_date && (
            <span>
              {record.start_date}
              {record.end_date && record.end_date !== record.start_date ? ` → ${record.end_date}` : ''}
            </span>
          )}
        </div>
        {record.notes && (
          <p style={{ fontSize: '0.75rem', color: 'var(--atmo-faint)', fontStyle: 'italic', marginTop: '0.3rem' }}>
            "{record.notes}"
          </p>
        )}
        <p style={{ fontSize: '0.6875rem', color: 'var(--atmo-border)', marginTop: '0.25rem' }}>
          #{record.id} · {new Date(record.created_at).toLocaleString()}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <button onClick={() => onEdit(record)} className="btn-secondary" style={{ fontSize: '0.8125rem' }}>Edit</button>
        <button onClick={() => onDelete(record.id)} className="btn-danger" style={{ fontSize: '0.8125rem' }}>Delete</button>
      </div>
    </div>
  );
}

const EXPORT_FORMATS = [
  { value: 'json', label: 'JSON' },
  { value: 'csv', label: 'CSV' },
  { value: 'xml', label: 'XML' },
  { value: 'markdown', label: 'MD' },
  { value: 'pdf', label: 'PDF' },
];

export default function WeatherHistory() {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [page, setPage] = useState(0);
  const limit = 10;

  const loadRecords = useCallback(async (search = searchLocation, pg = page) => {
    setLoading(true);
    setError(null);
    try {
      const params = { limit, offset: pg * limit };
      if (search.trim()) params.location = search.trim();
      const data = await getAllRecords(params);
      setRecords(data.records);
      setTotal(data.pagination.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchLocation, page]);

  useEffect(() => { loadRecords(); }, [page]);

  async function handleDelete(id) {
    if (!window.confirm(`Delete record #${id}? This cannot be undone.`)) return;
    try {
      await deleteRecord(id);
      loadRecords();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(id, payload) {
    await updateRecord(id, payload);
    loadRecords();
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(0);
    loadRecords(searchLocation, 0);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {editingRecord && (
        <EditModal record={editingRecord} onSave={handleUpdate} onClose={() => setEditingRecord(null)} />
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Filter by location…"
            value={searchLocation}
            onChange={e => setSearchLocation(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
            Filter
          </button>
          {searchLocation && (
            <button
              type="button"
              className="btn-secondary"
              style={{ flexShrink: 0 }}
              onClick={() => { setSearchLocation(''); setPage(0); loadRecords('', 0); }}
            >
              Clear
            </button>
          )}
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.6875rem', color: 'var(--atmo-faint)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Export
          </span>
          {EXPORT_FORMATS.map(fmt => (
            <a
              key={fmt.value}
              href={getExportUrl(fmt.value)}
              download
              style={{
                display: 'inline-block',
                padding: '0.3rem 0.75rem',
                borderRadius: '2rem',
                border: '1px solid var(--atmo-border)',
                background: 'transparent',
                fontSize: '0.75rem',
                color: 'var(--atmo-muted)',
                textDecoration: 'none',
                transition: 'color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--atmo-text)'; e.currentTarget.style.borderColor = 'var(--atmo-faint)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--atmo-muted)'; e.currentTarget.style.borderColor = 'var(--atmo-border)'; }}
            >
              {fmt.label}
            </a>
          ))}
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
          <span className="spin" style={{
            display: 'inline-block',
            width: '1.5rem',
            height: '1.5rem',
            border: '2px solid var(--atmo-border)',
            borderTopColor: 'var(--atmo-accent)',
            borderRadius: '50%',
          }} />
        </div>
      ) : records.length === 0 ? (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '1.75rem',
            color: 'var(--atmo-faint)',
            marginBottom: '0.5rem',
          }}>
            No records yet
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--atmo-faint)' }}>
            Search for a location on the Home page to save records.
          </p>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--atmo-faint)', marginBottom: '0.5rem' }}>
            {total} record{total !== 1 ? 's' : ''}
          </p>
          <div style={{ borderTop: '1px solid var(--atmo-border)' }}>
            {records.map(record => (
              <RecordRow
                key={record.id}
                record={record}
                onEdit={setEditingRecord}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <button onClick={() => setPage(p => p - 1)} disabled={page === 0} className="btn-secondary">
            Previous
          </button>
          <span style={{ fontSize: '0.8125rem', color: 'var(--atmo-muted)' }}>
            {page + 1} / {totalPages}
          </span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} className="btn-secondary">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
