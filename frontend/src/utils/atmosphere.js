export function getAtmosphere(condition, sunrise, sunset) {
  const now = Math.floor(Date.now() / 1000);
  const isNight =
    sunrise != null && sunset != null && (now < sunrise || now > sunset);

  if (!condition) return 'default';
  const c = condition.toLowerCase();

  if (isNight) {
    if (c.includes('thunder') || c.includes('storm')) return 'night-storm';
    if (c.includes('rain') || c.includes('shower') || c.includes('drizzle')) return 'night-rain';
    if (c.includes('snow')) return 'night-snow';
    if (c.includes('cloud') || c.includes('overcast')) return 'night-cloudy';
    return 'night-clear';
  }

  if (c.includes('thunder') || c.includes('storm')) return 'storm';
  if (c.includes('snow') || c.includes('blizzard')) return 'snow';
  if (c.includes('rain') || c.includes('shower')) return 'rain';
  if (c.includes('drizzle')) return 'drizzle';
  if (c.includes('mist') || c.includes('fog')) return 'mist';
  if (c.includes('haze') || c.includes('dust') || c.includes('smoke') || c.includes('sand')) return 'haze';
  if (c.includes('cloud') || c.includes('overcast')) return 'cloudy';
  if (c.includes('clear') || c.includes('sun')) return 'clear';

  return 'default';
}

export function applyAtmosphere(condition, sunrise, sunset) {
  const token = getAtmosphere(condition, sunrise, sunset);
  document.documentElement.setAttribute('data-atmosphere', token);
  return token;
}
