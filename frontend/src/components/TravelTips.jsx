import React from 'react';

function getTips(current, forecast) {
  const tips = [];
  const c = current;
  const condition = (c.weather_condition || '').toLowerCase();
  const description = (c.description || '').toLowerCase();

  if (c.temperature >= 35) {
    tips.push({ icon: '🌡', text: `Extreme heat at ${c.temperature}°C — stay well hydrated, seek shade, and avoid strenuous activity between 11am–3pm.`, severity: 'high' });
  } else if (c.temperature >= 28) {
    tips.push({ icon: '🌡', text: `Hot at ${c.temperature}°C — light, breathable clothing and regular water intake recommended.`, severity: 'medium' });
  }

  if (c.temperature < 0) {
    tips.push({ icon: '❄', text: `Freezing at ${c.temperature}°C — heavy layers, waterproof outer shell, and watch for icy surfaces.`, severity: 'high' });
  } else if (c.temperature < 8) {
    tips.push({ icon: '❄', text: `Cold at ${c.temperature}°C — a warm coat, scarf, and gloves are recommended.`, severity: 'medium' });
  } else if (c.temperature < 15) {
    tips.push({ icon: '🧥', text: `Cool at ${c.temperature}°C — bring a light jacket or layer up.`, severity: 'low' });
  }

  if (condition.includes('thunder') || condition.includes('storm')) {
    tips.push({ icon: '⛈', text: 'Thunderstorm conditions — avoid open areas, tall trees, and water.', severity: 'high' });
  } else if (condition.includes('snow') || description.includes('snow')) {
    tips.push({ icon: '🌨', text: 'Snow expected — waterproof boots, warm layers, and allow extra travel time on roads.', severity: 'high' });
  } else if (condition.includes('rain') || condition.includes('shower') || description.includes('rain')) {
    tips.push({ icon: '🌧', text: 'Rain in the forecast — pack a compact umbrella or a waterproof jacket.', severity: 'medium' });
  } else if (condition.includes('drizzle')) {
    tips.push({ icon: '🌦', text: 'Light drizzle possible — a packable rain layer is worth having.', severity: 'low' });
  }

  if (c.wind_speed >= 60) {
    tips.push({ icon: '💨', text: `Strong winds at ${c.wind_speed} km/h — secure loose items and be cautious near exposed areas.`, severity: 'high' });
  } else if (c.wind_speed >= 40) {
    tips.push({ icon: '💨', text: `Breezy at ${c.wind_speed} km/h — outdoor activities may be uncomfortable.`, severity: 'medium' });
  }

  if (condition.includes('fog') || condition.includes('mist')) {
    tips.push({ icon: '🌫', text: 'Foggy conditions — reduced visibility on roads; check transport status before travelling.', severity: 'medium' });
  }

  const order = { high: 0, medium: 1, low: 2 };
  tips.sort((a, b) => order[a.severity] - order[b.severity]);
  return tips.slice(0, 5);
}

export default function TravelTips({ data }) {
  if (!data?.current) return null;

  const tips = getTips(data.current, data.forecast);
  if (tips.length === 0) return null;

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '0.75rem' }}>Travel Tips</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {tips.map((tip, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            background: tip.severity === 'high' ? 'rgba(239,68,68,0.1)' : tip.severity === 'medium' ? 'rgba(251,191,36,0.08)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${tip.severity === 'high' ? 'rgba(239,68,68,0.2)' : tip.severity === 'medium' ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.08)'}`,
          }}>
            <span>{tip.icon}</span>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.5 }}>{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
