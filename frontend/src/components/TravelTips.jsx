import React from 'react';

function getTips(current, forecast) {
  const tips = [];
  const c = current;
  const condition = (c.weather_condition || '').toLowerCase();
  const description = (c.description || '').toLowerCase();

  if (c.uv_index) {
    if (c.uv_index.value >= 8) {
      tips.push({ icon: '☀', text: `UV index is ${c.uv_index.value} (${c.uv_index.category}) — wear SPF 50+, a hat, and avoid midday sun.`, severity: 'high' });
    } else if (c.uv_index.value >= 6) {
      tips.push({ icon: '☀', text: `UV index is ${c.uv_index.value} (${c.uv_index.category}) — apply broad-spectrum sunscreen before heading out.`, severity: 'medium' });
    } else if (c.uv_index.value >= 3) {
      tips.push({ icon: '☀', text: `UV index is ${c.uv_index.value} (Moderate) — sunscreen recommended for prolonged outdoor time.`, severity: 'low' });
    }
  }

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
    tips.push({ icon: '⛈', text: 'Thunderstorm conditions — avoid open areas, tall trees, and water. Postpone outdoor plans if possible.', severity: 'high' });
  } else if (condition.includes('snow') || description.includes('snow')) {
    tips.push({ icon: '🌨', text: 'Snow expected — waterproof boots, warm layers, and allow extra travel time on roads.', severity: 'high' });
  } else if (condition.includes('rain') || condition.includes('shower') || description.includes('rain')) {
    tips.push({ icon: '🌧', text: 'Rain in the forecast — pack a compact umbrella or a waterproof jacket.', severity: 'medium' });
  } else if (condition.includes('drizzle')) {
    tips.push({ icon: '🌦', text: 'Light drizzle possible — a packable rain layer is worth having.', severity: 'low' });
  }

  if (c.wind_speed >= 60) {
    tips.push({ icon: '💨', text: `Strong winds at ${c.wind_speed} km/h — secure loose items, be cautious near exposed clifftops or elevated areas.`, severity: 'high' });
  } else if (c.wind_speed >= 40) {
    tips.push({ icon: '💨', text: `Breezy at ${c.wind_speed} km/h — outdoor dining and activities may be uncomfortable; secure belongings.`, severity: 'medium' });
  }

  if (c.visibility != null && c.visibility < 1) {
    tips.push({ icon: '🌫', text: `Very low visibility (${c.visibility} km) — drive with headlights on and allow significantly more travel time.`, severity: 'high' });
  } else if (condition.includes('fog') || condition.includes('mist')) {
    tips.push({ icon: '🌫', text: 'Foggy or misty conditions — reduced visibility on roads and at airports; check transport status before travelling.', severity: 'medium' });
  } else if (condition.includes('haze') || condition.includes('dust') || condition.includes('smoke') || condition.includes('sand')) {
    tips.push({ icon: '🌫', text: 'Hazy air — if you have respiratory sensitivities, consider limiting outdoor exposure.', severity: 'medium' });
  }

  if (c.air_quality) {
    const cat = c.air_quality.category;
    if (cat === 'Hazardous' || cat === 'Very Unhealthy') {
      tips.push({ icon: '😷', text: `Air quality is ${cat} (AQI ${c.air_quality.us_aqi}) — wear an N95 mask outdoors and minimise time outside.`, severity: 'high' });
    } else if (cat === 'Unhealthy') {
      tips.push({ icon: '😷', text: `Air quality is Unhealthy (AQI ${c.air_quality.us_aqi}) — sensitive groups should avoid prolonged outdoor exertion.`, severity: 'medium' });
    } else if (cat === 'Unhealthy for Sensitive Groups') {
      tips.push({ icon: '😷', text: `Air quality is moderate (AQI ${c.air_quality.us_aqi}) — those with asthma or heart conditions should limit outdoor activity.`, severity: 'low' });
    }
  }

  if (forecast && forecast.length > 0) {
    const upcomingRain = forecast.slice(1, 3).some(d =>
      d.weather_condition?.toLowerCase().includes('rain') ||
      d.weather_condition?.toLowerCase().includes('storm')
    );
    const currentlyClear = !condition.includes('rain') && !condition.includes('storm');
    if (upcomingRain && currentlyClear) {
      tips.push({ icon: '📅', text: 'Clear today but rain is forecast in the next 1–2 days — plan outdoor activities for today if possible.', severity: 'low' });
    }
  }

  if (c.feels_like != null && c.temperature != null) {
    const diff = c.temperature - c.feels_like;
    if (diff >= 6) {
      tips.push({ icon: '🌬', text: `Feels like ${c.feels_like}°C despite ${c.temperature}°C actual — wind chill is significant; dress warmer than the temperature suggests.`, severity: 'low' });
    } else if (diff <= -4) {
      tips.push({ icon: '💧', text: `Feels like ${c.feels_like}°C — high humidity makes it feel hotter than ${c.temperature}°C actual; hydrate more than usual.`, severity: 'low' });
    }
  }

  if (c.humidity >= 85 && c.temperature >= 25) {
    tips.push({ icon: '💧', text: `High humidity (${c.humidity}%) combined with heat — physical exertion will feel harder; take regular breaks and drink water.`, severity: 'medium' });
  }

  const order = { high: 0, medium: 1, low: 2 };
  tips.sort((a, b) => order[a.severity] - order[b.severity]);
  return tips.slice(0, 5);
}

const severityColor = {
  high: 'rgba(239,68,68,0.12)',
  medium: 'rgba(251,191,36,0.10)',
  low: 'rgba(255,255,255,0.05)',
};
const severityBorder = {
  high: 'rgba(239,68,68,0.22)',
  medium: 'rgba(251,191,36,0.18)',
  low: 'var(--atmo-border)',
};
const severityText = {
  high: '#fca5a5',
  medium: '#fde68a',
  low: 'var(--atmo-muted)',
};

export default function TravelTips({ data }) {
  if (!data?.current) return null;

  const tips = getTips(data.current, data.forecast);
  if (tips.length === 0) return null;

  return (
    <div className="fade-in">
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.6875rem',
        fontWeight: 500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--atmo-muted)',
        marginBottom: '0.75rem',
      }}>
        Travel Tips
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {tips.map((tip, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            background: severityColor[tip.severity],
            border: `1px solid ${severityBorder[tip.severity]}`,
          }}>
            <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '0.05rem' }}>
              {tip.icon}
            </span>
            <p style={{
              fontSize: '0.8125rem',
              color: severityText[tip.severity],
              lineHeight: 1.5,
            }}>
              {tip.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
