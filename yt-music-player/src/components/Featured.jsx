import { useState, useEffect } from 'react'
import './Featured.css'

export default function Featured({ tracks, onPlay, currentTrack, isPlaying }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!tracks.length) return
    const t = setInterval(() => setActive(a => (a + 1) % tracks.length), 5000)
    return () => clearInterval(t)
  }, [tracks.length])

  if (!tracks.length) return (
    <div className="feat-skeleton">
      <div className="feat-sk-img" />
      <div className="feat-sk-text">
        <div className="feat-sk-line" style={{ width: '60%' }} />
        <div className="feat-sk-line" style={{ width: '40%' }} />
      </div>
    </div>
  )

  const track = tracks[active]
  const isThisPlaying = currentTrack?.id === track.id && isPlaying

  return (
    <div className="feat">
      <div className="feat-bg" style={{ backgroundImage: `url(${track.thumbnail})` }} />
      <div className="feat-overlay" />

      <div className="feat-content">
        <div className="feat-label">🔥 Trending</div>
        <h1 className="feat-title">{track.title}</h1>
        <p className="feat-channel">{track.channel}</p>

        <div className="feat-actions">
          <button
            className="feat-play-btn"
            onClick={() => onPlay(track, active)}
          >
            {isThisPlaying
              ? <><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> Pause</>
              : <><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Play Now</>
            }
          </button>
          <button
            className="feat-queue-btn"
            onClick={() => {
              tracks.forEach((t, i) => { if (i > 0) {} })
              onPlay(track, active)
            }}
          >
            + Queue
          </button>
        </div>
      </div>

      <div className="feat-dots">
        {tracks.map((_, i) => (
          <button
            key={i}
            className={`feat-dot${i === active ? ' feat-dot-active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="feat-thumbs">
        {tracks.map((t, i) => (
          <button
            key={t.id}
            className={`feat-mini${i === active ? ' feat-mini-active' : ''}`}
            onClick={() => setActive(i)}
          >
            <img src={t.thumbnail} alt={t.title} />
            <div className="feat-mini-overlay">
              {i === active && isThisPlaying && (
                <div className="feat-mini-eq">
                  <span /><span /><span />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
