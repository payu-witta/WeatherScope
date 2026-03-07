const { stringify } = require('csv-stringify/sync');
const PDFDocument = require('pdfkit');

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

function toPDF(records) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).fillColor('#1e3a5f').text('WeatherScope — Records Export', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor('#666').text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.fontSize(10).text(`Total records: ${records.length}`, { align: 'center' });
    doc.moveDown(1);

    if (records.length === 0) {
      doc.fontSize(12).fillColor('#333').text('No records found.', { align: 'center' });
      doc.end();
      return;
    }

    const cols = [
      { key: 'id', label: 'ID', width: 30 },
      { key: 'location', label: 'Location', width: 130 },
      { key: 'temperature', label: 'Temp (°C)', width: 65 },
      { key: 'weather_condition', label: 'Condition', width: 80 },
      { key: 'humidity', label: 'Humidity', width: 60 },
      { key: 'wind_speed', label: 'Wind km/h', width: 65 },
      { key: 'start_date', label: 'Date From', width: 70 }
    ];
    const tableLeft = 50;
    const rowHeight = 22;

    let x = tableLeft;
    doc.rect(tableLeft, doc.y, cols.reduce((s, c) => s + c.width, 0), rowHeight).fill('#1e3a5f');
    const headerY = doc.y + 6;
    cols.forEach(col => {
      doc.fontSize(8).fillColor('white').text(col.label, x + 3, headerY, { width: col.width - 6, ellipsis: true });
      x += col.width;
    });
    doc.y += rowHeight;

    records.forEach((r, i) => {
      const flat = flattenRecord(r);
      const rowY = doc.y;
      if (i % 2 === 1) {
        doc.rect(tableLeft, rowY, cols.reduce((s, c) => s + c.width, 0), rowHeight).fill('#f0f4f8');
      }
      x = tableLeft;
      cols.forEach(col => {
        const val = flat[col.key] != null ? String(flat[col.key]) : '—';
        doc.fontSize(7).fillColor('#333').text(val, x + 3, rowY + 7, { width: col.width - 6, ellipsis: true });
        x += col.width;
      });
      doc.y = rowY + rowHeight;
      if (doc.y > doc.page.height - 100) doc.addPage();
    });

    doc.moveDown(1);
    doc.fontSize(8).fillColor('#999').text('WeatherScope — Payu Wittawatolarn', { align: 'center' });
    doc.end();
  });
}

function flattenRecord(r) {
  return {
    id: r.id, location: r.location, latitude: r.latitude, longitude: r.longitude,
    start_date: r.start_date, end_date: r.end_date, temperature: r.temperature,
    weather_condition: r.weather_condition, humidity: r.humidity, wind_speed: r.wind_speed,
    notes: r.notes, created_at: r.created_at, updated_at: r.updated_at
  };
}

function escapeXML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

module.exports = { toJSON, toCSV, toXML, toMarkdown, toPDF };
