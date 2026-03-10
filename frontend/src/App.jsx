import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import History from './pages/History.jsx';

function NavLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.8125rem',
        fontWeight: active ? 500 : 400,
        letterSpacing: '0.04em',
        color: active ? 'var(--atmo-text)' : 'var(--atmo-muted)',
        padding: '0.4rem 0.875rem',
        borderRadius: '2rem',
        background: active ? 'var(--atmo-surface)' : 'transparent',
        border: active ? '1px solid var(--atmo-border)' : '1px solid transparent',
        textDecoration: 'none',
        transition: 'color 0.15s ease, background 0.15s ease',
      }}
    >
      {children}
    </Link>
  );
}

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '0.875rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--atmo-border)',
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '1.25rem',
            color: 'var(--atmo-text)',
            letterSpacing: '0.01em',
          }}>
            WeatherScope
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <NavLink to="/">Weather</NavLink>
          <NavLink to="/history">History</NavLink>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '2rem 1rem 4rem', maxWidth: '820px', margin: '0 auto', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>

      <footer style={{
        padding: '2.5rem 1.5rem',
        borderTop: '1px solid var(--atmo-border)',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '1.1rem',
          color: 'var(--atmo-faint)',
          letterSpacing: '0.02em',
          marginBottom: '0.5rem',
        }}>
          WeatherScope
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--atmo-muted)', marginBottom: '0.25rem' }}>
          Built by <strong style={{ color: 'var(--atmo-text)', fontWeight: 500 }}>Payu Wittawatolarn</strong>
        </p>
        <p style={{ fontSize: '0.6875rem', color: 'var(--atmo-faint)', marginBottom: '0.75rem' }}>
          AI Engineer Intern Technical Assessment — PM Accelerator
        </p>
        <p style={{
          fontSize: '0.6875rem',
          color: 'var(--atmo-faint)',
          maxWidth: '480px',
          margin: '0 auto 0.75rem',
          lineHeight: 1.6,
        }}>
          <span style={{ color: 'var(--atmo-muted)' }}>PM Accelerator: </span>
          By making industry-leading tools and education available to individuals from all backgrounds, we level
          the playing field for future PM leaders. This is the PM Accelerator motto, as we grant aspiring and
          experienced PMs what they need most – Access. We introduce you to industry leaders, surround you with
          the right PM ecosystem, and discover the new world of AI product management skills.
        </p>
        <p style={{ fontSize: '0.625rem', color: 'var(--atmo-border)', letterSpacing: '0.06em' }}>
          OPENWEATHERMAP · OPEN-METEO · OPENSTREETMAP
        </p>
      </footer>
    </div>
  );
}
