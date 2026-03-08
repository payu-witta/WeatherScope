/**
 * Diagnostic script — manually smoke-test all API routes.
 * Usage: node test-routes.js [base_url]
 * Example: node test-routes.js http://localhost:5001
 */
require('dotenv').config();
const http = require('http');
const https = require('https');

const BASE = process.argv[2] || 'http://localhost:5001';

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE + path);
    const lib = url.protocol === 'https:' ? https : http;
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };
    const req = lib.request(options, res => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function ok(label, status, expected = 200) {
  const pass = status === expected;
  console.log(`${pass ? '✓' : '✗'} [${status}] ${label}`);
  return pass;
}

async function run() {
  console.log(`\nTesting WeatherScope API at ${BASE}\n`);
  let created;

  try {
    const health = await request('GET', '/api/health');
    ok('GET /api/health', health.status);

    const current = await request('GET', '/api/weather/current?location=London');
    ok('GET /api/weather/current', current.status);

    const historical = await request('GET', '/api/weather/historical?lat=51.5&lon=-0.1&start_date=2024-01-01&end_date=2024-01-03');
    ok('GET /api/weather/historical', historical.status);

    const post = await request('POST', '/api/weather', {
      location: 'Test City',
      start_date: '2024-01-01',
      end_date: '2024-01-01'
    });
    ok('POST /api/weather', post.status, 201);
    created = post.body?.record;

    const all = await request('GET', '/api/weather');
    ok('GET /api/weather', all.status);

    if (created?.id) {
      const one = await request('GET', `/api/weather/${created.id}`);
      ok(`GET /api/weather/${created.id}`, one.status);

      const put = await request('PUT', `/api/weather/${created.id}`, { notes: 'diagnostic test' });
      ok(`PUT /api/weather/${created.id}`, put.status);

      const del = await request('DELETE', `/api/weather/${created.id}`);
      ok(`DELETE /api/weather/${created.id}`, del.status);
    }

    const exportRes = await request('GET', '/api/weather/export?format=json');
    ok('GET /api/weather/export?format=json', exportRes.status);

  } catch (err) {
    console.error('Request failed:', err.message);
    console.error('Is the server running? Start it with: npm run dev');
  }

  console.log('\nDone.\n');
}

run();
