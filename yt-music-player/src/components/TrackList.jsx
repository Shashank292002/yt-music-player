import { useRef, useEffect } from 'react'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
  if (diff < 2592000) return Math.floor(diff / 86400) + 'd ago'
  if (diff < 31536000) return Math.floor(diff / 2592000) + 'mo ago'
  return Math.floor(diff / 31536000) + 'y ago'
}

function TrackRow({ track, index, isActive, isPlaying, onPlay }) {
  return (
    <div
      className={`tr${isActive ? ' tr-active' : ''}`}
      onClick={() => onPlay(track, index)}
      role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onPlay(track, index)}
    >
      <div className="tr-num">
        {isActive ? (
          <div className={`eq${isPlaying ? '' : ' eq-paused'}`}>
            <span/><span/><span/>
          </div>
        ) : <span>{index + 1}</span>}
      </div>
      <div className="tr-thumb">
        <img src={track.thumbnail} alt="" loading="lazy" />
        <div className="tr-thumb-play">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
      <div className="tr-info">
        <div className="tr-title">{track.title}</div>
        <div className="tr-channel">{track.channel}</div>
      </div>
      <div className="tr-meta">
        <span className="tr-ago">{timeAgo(track.publishedAt)}</span>
      </div>
    </div>
  )
}

export default function TrackList({ tracks, loading, error, currentIdx, isPlaying, onPlay, onLoadMore, hasMore }) {
  const loaderRef = useRef(null)

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) onLoadMore()
    }, { threshold: 0.5 })
    obs.observe(loaderRef.current)
    return () => obs.disconnect()
  }, [hasMore, onLoadMore])

  if (error) return (
    <div className="tl-state tl-error">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" style={{opacity:0.4}}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
      <p>{error}</p>
    </div>
  )

  if (!loading && !tracks.length) return (
    <div className="tl-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style={{opacity:0.15}}><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
      <p>Search for any song or artist above</p>
    </div>
  )

  return (
    <div className="tl">
      <div className="tl-head">
        <span>#</span>
        <span></span>
        <span>Title</span>
        <span>Date</span>
      </div>
      <div className="tl-body">
        {tracks.map((track, i) => (
          <TrackRow
            key={track.id + i}
            track={track} index={i}
            isActive={currentIdx === i}
            isPlaying={currentIdx === i && isPlaying}
            onPlay={onPlay}
          />
        ))}
        {loading && (
          <div className="tl-loading">
            <div className="dots"><span/><span/><span/></div>
          </div>
        )}
        {hasMore && !loading && <div ref={loaderRef} style={{height:40}} />}
      </div>
    </div>
  )
}
