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
    <div style={{ marginTop: '1.5rem' }} className="fade-in">
      <h3 style={{ marginBottom: '0.75rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>
        Videos · {location}
      </h3>
      {loading && <p style={{ opacity: 0.5, fontSize: '0.875rem' }}>Loading videos…</p>}
      {videos && videos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.75rem' }}>
          {videos.map(video => (
            <div key={video.video_id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <a href={video.url} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
                />
              </a>
              <div style={{ padding: '0.6rem 0.75rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 500, lineHeight: 1.4 }}>{video.title}</p>
                <p style={{ fontSize: '0.72rem', opacity: 0.5, marginTop: '0.2rem' }}>{video.channel}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
