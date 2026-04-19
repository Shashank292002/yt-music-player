const fmt = s => {
  s = Math.floor(s || 0)
  return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`
}

export default function PlayerBar({
  track, isPlaying, progress, currentTime, duration, volume,
  onTogglePlay, onPrev, onNext, onSeek, onVolume, shuffle, repeat, onShuffle, onRepeat
}) {
  if (!track) return null

  const handleBar = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    onSeek(((e.clientX - rect.left) / rect.width) * 100)
  }

  return (
    <div className="pb">
      <div className="pb-progress" onClick={handleBar} role="slider" aria-label="Seek">
        <div className="pb-prog-fill" style={{width:`${progress}%`}} />
        <div className="pb-prog-thumb" style={{left:`${progress}%`}} />
      </div>

      <div className="pb-inner">
        <div className="pb-track">
          <img src={track.thumbnail} alt="" className="pb-thumb" />
          <div className="pb-info">
            <div className="pb-title">{track.title}</div>
            <div className="pb-channel">{track.channel}</div>
          </div>
        </div>

        <div className="pb-center">
          <button
            className={`pb-icon-btn${shuffle ? ' pb-active' : ''}`}
            onClick={onShuffle} title="Shuffle"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
          </button>
          <button className="pb-icon-btn" onClick={onPrev} title="Previous">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
          </button>
          <button className="pb-play" onClick={onTogglePlay}>
            {isPlaying
              ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              : <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            }
          </button>
          <button className="pb-icon-btn" onClick={onNext} title="Next">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/></svg>
          </button>
          <button
            className={`pb-icon-btn${repeat ? ' pb-active' : ''}`}
            onClick={onRepeat} title="Repeat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>
          </button>
        </div>

        <div className="pb-right">
          <span className="pb-time">{fmt(currentTime)} / {fmt(duration)}</span>
          <div className="pb-vol">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{color:'var(--text3)',flexShrink:0}}>
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            <input
              type="range" min={0} max={100} step={1}
              value={volume} className="pb-vol-slider"
              onChange={e => onVolume(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
