import React, { useEffect, useRef } from 'react';

let L = null;

export default function MapEmbed({ latitude, longitude, locationName }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!latitude || !longitude) return;

    async function initMap() {
      if (!L) {
        L = await import('leaflet');
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      }

      if (!mapRef.current) return;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapRef.current, {
        center: [latitude, longitude],
        zoom: 10,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`<strong>${locationName || 'Location'}</strong><br/>${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        .openPopup();

      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, locationName]);

  if (!latitude || !longitude) return null;

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
        Location · OpenStreetMap
      </p>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '280px', borderRadius: '0.75rem', overflow: 'hidden' }}
        aria-label={`Map showing ${locationName}`}
      />
      <p style={{ fontSize: '0.6875rem', color: 'var(--atmo-faint)', marginTop: '0.5rem', textAlign: 'center' }}>
        {latitude.toFixed(4)}°, {longitude.toFixed(4)}° · Scroll to zoom disabled
      </p>
    </div>
  );
}
