import React from 'react';

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="fade-in-fast" style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      padding: '0.875rem 1rem',
      background: 'rgba(239, 68, 68, 0.08)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '0.625rem',
    }}>
      <span style={{ color: '#f87171', flexShrink: 0, marginTop: '0.05rem', fontSize: '0.875rem' }}>⚠</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#fca5a5' }}>
          Something went wrong
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'rgba(252,165,165,0.75)', marginTop: '0.15rem', wordBreak: 'break-word' }}>
          {message}
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(248, 113, 113, 0.5)',
            fontSize: '1.125rem',
            lineHeight: 1,
            flexShrink: 0,
            padding: 0,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.target.style.color = '#f87171'}
          onMouseLeave={e => e.target.style.color = 'rgba(248, 113, 113, 0.5)'}
        >
          ×
        </button>
      )}
    </div>
  );
}
