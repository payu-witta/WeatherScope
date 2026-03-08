import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

export async function getCurrentWeather(location) {
  const res = await api.get('/weather/current', { params: { location } });
  return res.data;
}

export async function getHistoricalWeather(lat, lon, startDate, endDate) {
  const res = await api.get('/weather/historical', {
    params: { lat, lon, start_date: startDate, end_date: endDate }
  });
  return res.data;
}

export async function createWeatherRecord(payload) {
  const res = await api.post('/weather', payload);
  return res.data;
}

export async function getAllRecords(params = {}) {
  const res = await api.get('/weather', { params });
  return res.data;
}

export async function deleteRecord(id) {
  const res = await api.delete(`/weather/${id}`);
  return res.data;
}

export async function getRecord(id) {
  const res = await api.get(`/weather/${id}`);
  return res.data;
}

export async function updateRecord(id, payload) {
  const res = await api.put(`/weather/${id}`, payload);
  return res.data;
}

export function getExportUrl(format) {
  return `/api/weather/export?format=${format}`;
}

export default api;
