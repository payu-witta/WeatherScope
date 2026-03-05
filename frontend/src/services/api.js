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

export default api;
