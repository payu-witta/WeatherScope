import React, { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function YouTubeVideos({ location }) {
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!location) return;
    let cancelled = false;

    async function fetchVideos() {
      setLoading(true);
      setVideos(null);
      setUnavailable(false);
      try {
        const res = await api.get('/weather/videos', { params: { location } });
        if (cancelled) return;
        if (res.data.videos === null) {
          setUnavailable(true);
        } else {
          setVideos(res.data.videos);
        }
      } catch {
        if (!cancelled) setUnavailable(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchVideos();
    return () => { cancelled = true; };
  }, [location]);

  if (unavailable) return null;

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3>Videos · {location}</h3>
      {loading && <p>Loading videos…</p>}
      {videos && videos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.875rem' }}>
          {videos.map(video => (
            <div key={video.video_id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
              <a href={video.url} target="_blank" rel="noreferrer">
                <img src={video.thumbnail} alt={video.title} style={{ width: '100%', display: 'block' }} />
              </a>
              <div style={{ padding: '0.5rem' }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{video.title}</p>
                <p style={{ fontSize: '0.75rem', color: '#666' }}>{video.channel}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
