import React, { useState, useEffect } from 'react';
import { getAllRecords, deleteRecord } from '../services/api.js';

export default function WeatherHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (records.length === 0) return <p>No saved records yet.</p>;

  return (
    <div>
      {records.map(record => (
        <div key={record.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{record.location}</strong>
              {record.temperature != null && <span> — {record.temperature}°C</span>}
              {record.weather_condition && <span> · {record.weather_condition}</span>}
              <p style={{ fontSize: '0.75rem', color: '#666', margin: '0.2rem 0 0' }}>
                {record.start_date} · saved {new Date(record.created_at).toLocaleString()}
              </p>
            </div>
            <button onClick={() => handleDelete(record.id)} style={{ color: 'red' }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
