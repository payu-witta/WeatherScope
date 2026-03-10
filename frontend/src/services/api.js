import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  res => res,
  err => {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      (err.code === 'ECONNABORTED' ? 'Request timed out' : null) ||
      err.message ||
      'An unexpected error occurred';
    const enhanced = new Error(message);
    enhanced.status = err.response?.status;
    enhanced.details = err.response?.data?.details;
    return Promise.reject(enhanced);
  }
);

// Fetch live weather (not stored)
export async function getCurrentWeather(location) {
  const res = await api.get('/weather/current', { params: { location } });
  return res.data;
}

// Fetch historical weather from Open-Meteo
export async function getHistoricalWeather(lat, lon, startDate, endDate) {
  const res = await api.get('/weather/historical', {
    params: { lat, lon, start_date: startDate, end_date: endDate }
  });
  return res.data;
}

// CRUD — Create a stored weather record
export async function createWeatherRecord(payload) {
  const res = await api.post('/weather', payload);
  return res.data;
}

// CRUD — Get all stored records
export async function getAllRecords(params = {}) {
  const res = await api.get('/weather', { params });
  return res.data;
}

// CRUD — Get single record
export async function getRecord(id) {
  const res = await api.get(`/weather/${id}`);
  return res.data;
}

// CRUD — Update record
export async function updateRecord(id, payload) {
  const res = await api.put(`/weather/${id}`, payload);
  return res.data;
}

// CRUD — Delete record
export async function deleteRecord(id) {
  const res = await api.delete(`/weather/${id}`);
  return res.data;
}

// Export data
export function getExportUrl(format = 'json') {
  return `/api/weather/export?format=${format}`;
}

export default api;
