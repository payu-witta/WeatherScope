import React, { useState, useEffect } from 'react';
import { getAllRecords, deleteRecord, getExportUrl } from '../services/api.js';
import EditModal from './EditModal.jsx';
import ErrorMessage from './ErrorMessage.jsx';

export default function WeatherHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);

  async function loadRecords() {
    setLoading(true);
    try {
      const data = await getAllRecords();
      setRecords(data.records);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadRecords(); }, []);

  async function handleDelete(id) {
    if (!window.confirm(`Delete record #${id}?`)) return;
    try {
      await deleteRecord(id);
      loadRecords();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading records…</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600 }}>Saved Records</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['json', 'csv', 'xml', 'md', 'pdf'].map(fmt => (
            <a
              key={fmt}
              href={getExportUrl(fmt)}
              download
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', border: '1px solid currentColor', borderRadius: '0.25rem', textDecoration: 'none' }}
            >
              {fmt.toUpperCase()}
            </a>
          ))}
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      {records.length === 0
        ? <p>No saved records yet.</p>
        : records.map(record => (
          <div key={record.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{record.location}</strong>
                {record.temperature != null && <span> — {record.temperature}°C</span>}
                {record.weather_condition && <span> · {record.weather_condition}</span>}
                <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: '0.2rem 0 0' }}>
                  {record.start_date}{record.end_date && record.end_date !== record.start_date ? ` → ${record.end_date}` : ''} · saved {new Date(record.created_at).toLocaleString()}
                </p>
                {record.notes && <p style={{ fontSize: '0.8rem', fontStyle: 'italic', margin: '0.2rem 0 0' }}>{record.notes}</p>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setEditingRecord(record)}>Edit</button>
                <button onClick={() => handleDelete(record.id)} style={{ color: '#ef4444' }}>Delete</button>
              </div>
            </div>
          </div>
        ))
      }

      {editingRecord && (
        <EditModal
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
          onSaved={loadRecords}
        />
      )}
    </div>
  );
}
