import React from 'react';

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div style={{
      background: 'rgba(239,68,68,0.15)',
      border: '1px solid rgba(239,68,68,0.4)',
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem',
      marginTop: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'inherit'
    }}>
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', opacity: 0.7 }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
