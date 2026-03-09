import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home.jsx';
import History from './pages/History.jsx';

export default function App() {
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1rem 4rem' }}>
      <header style={{ padding: '1.25rem 0 1rem', marginBottom: '0.5rem' }}>
        <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.35rem',
            letterSpacing: '0.04em',
            marginRight: '1.25rem',
            color: 'var(--atmo-accent)'
          }}>
            WeatherScope
          </span>
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              padding: '0.3rem 0.8rem',
              borderRadius: '0.35rem',
              fontSize: '0.875rem',
              textDecoration: 'none',
              color: isActive ? 'var(--atmo-accent)' : 'var(--atmo-muted)',
              background: isActive ? 'var(--atmo-surface)' : 'transparent',
              border: isActive ? '1px solid var(--atmo-border)' : '1px solid transparent',
              transition: 'all 0.15s'
            })}
          >
            Search
          </NavLink>
          <NavLink
            to="/history"
            style={({ isActive }) => ({
              padding: '0.3rem 0.8rem',
              borderRadius: '0.35rem',
              fontSize: '0.875rem',
              textDecoration: 'none',
              color: isActive ? 'var(--atmo-accent)' : 'var(--atmo-muted)',
              background: isActive ? 'var(--atmo-surface)' : 'transparent',
              border: isActive ? '1px solid var(--atmo-border)' : '1px solid transparent',
              transition: 'all 0.15s'
            })}
          >
            History
          </NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>

      <footer style={{
        marginTop: '4rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--atmo-border)',
        fontSize: '0.75rem',
        color: 'var(--atmo-muted)',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <span>WeatherScope — powered by OpenWeatherMap &amp; Open-Meteo</span>
        <span>Data is for informational purposes only</span>
      </footer>
    </div>
  );
}
