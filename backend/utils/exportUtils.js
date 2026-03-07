const { stringify } = require('csv-stringify/sync');

function toJSON(records) {
  return JSON.stringify(records.map(flattenRecord), null, 2);
}

function toCSV(records) {
  if (records.length === 0) return 'No records found';
  const rows = records.map(flattenRecord);
  return stringify(rows, {
    header: true,
    columns: [
      'id', 'location', 'latitude', 'longitude',
      'start_date', 'end_date', 'temperature',
      'weather_condition', 'humidity', 'wind_speed',
      'notes', 'created_at', 'updated_at'
    ]
  });
}

function toXML(records) {
  const items = records.map(r => {
    const flat = flattenRecord(r);
    const fields = Object.entries(flat)
      .map(([k, v]) => `    <${k}>${escapeXML(String(v ?? ''))}</${k}>`)
      .join('\n');
    return `  <record>\n${fields}\n  </record>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<weather_requests>\n${items}\n</weather_requests>`;
}

function toMarkdown(records) {
  if (records.length === 0) return '# Weather Records\n\nNo records found.';
  const headers = ['ID', 'Location', 'Temperature', 'Condition', 'Humidity', 'Wind Speed', 'Date', 'Saved At'];
  const separator = headers.map(() => '---').join(' | ');
  const rows = records.map(r => [
    r.id, r.location,
    r.temperature != null ? `${r.temperature}°C` : 'N/A',
    r.weather_condition || 'N/A',
    r.humidity != null ? `${r.humidity}%` : 'N/A',
    r.wind_speed != null ? `${r.wind_speed} km/h` : 'N/A',
    r.start_date || 'N/A',
    r.created_at
  ].join(' | '));

  return ['# Weather Records Export', '', headers.join(' | '), separator, ...rows].join('\n');
}

function flattenRecord(r) {
  return {
    id: r.id, location: r.location,
    latitude: r.latitude, longitude: r.longitude,
    start_date: r.start_date, end_date: r.end_date,
    temperature: r.temperature, weather_condition: r.weather_condition,
    humidity: r.humidity, wind_speed: r.wind_speed,
    notes: r.notes, created_at: r.created_at, updated_at: r.updated_at
  };
}

function escapeXML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

module.exports = { toJSON, toCSV, toXML, toMarkdown };
