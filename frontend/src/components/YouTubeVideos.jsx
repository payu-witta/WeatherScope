import React, { useEffect, useState } from 'react';
import api from '../services/api.js';

function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div style={{
      borderRadius: '0.625rem',
      overflow: 'hidden',
      background: 'var(--atmo-surface)',
      border: '1px solid var(--atmo-border)',
      transition: 'border-color 0.15s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--atmo-faint)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--atmo-border)'}
    >
      {playing ? (
        <div style={{ aspectRatio: '16/9' }}>
          <iframe
            src={`${video.embed_url}?autoplay=1`}
            title={video.title}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          style={{
            display: 'block',
            width: '100%',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            position: 'relative',
          }}
          aria-label={`Play ${video.title}`}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.3)',
            transition: 'background 0.15s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
          >
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              background: '#dc2626',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}>
              <svg style={{ width: '1rem', height: '1rem', fill: '#fff', marginLeft: '2px' }} viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}
      <div style={{ padding: '0.75rem' }}>
        <p style={{
          fontSize: '0.8125rem',
          fontWeight: 400,
          color: 'var(--atmo-text)',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {video.title}
        </p>
        <p style={{ fontSize: '0.6875rem', color: 'var(--atmo-faint)', marginTop: '0.25rem' }}>
          {video.channel}
        </p>
      </div>
    </div>
  );
}

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
        Videos · {location}
      </p>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem 0' }}>
          <span className="spin" style={{
            display: 'inline-block',
            width: '1.5rem',
            height: '1.5rem',
            border: '2px solid var(--atmo-border)',
            borderTopColor: 'var(--atmo-accent)',
            borderRadius: '50%',
          }} />
        </div>
      )}

      {videos && videos.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.875rem',
        }}>
          {videos.map(video => (
            <VideoCard key={video.video_id} video={video} />
          ))}
        </div>
      )}

      {videos && videos.length === 0 && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--atmo-faint)' }}>No videos found for this location.</p>
      )}
    </div>
  );
}
