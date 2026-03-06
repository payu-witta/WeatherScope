import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';

export default function App() {
  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '1rem' }}>
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #ccc', paddingBottom: '0.75rem' }}>
        <Link to="/">Weather</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}
