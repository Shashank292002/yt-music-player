import { useRef } from 'react'
import './SectionRow.css'

function CardSkeleton() {
  return (
    <div className="card card-skeleton">
      <div className="card-img-sk" />
      <div className="card-info">
        <div className="card-sk-line" style={{ width: '80%' }} />
        <div className="card-sk-line" style={{ width: '55%' }} />
      </div>
    </div>
  )
}

function TrackCard({ track, isActive, isPlaying, onPlay }) {
  return (
    <div
      className={`card${isActive ? ' card-active' : ''}`}
      onClick={onPlay}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onPlay()}
    >
      <div className="card-img-wrap">
        <img src={track.thumbnail} alt={track.title} loading="lazy" />
        <div className="card-play-overlay">
          {isActive && isPlaying
            ? <div className="card-eq"><span/><span/><span/></div>
            : <div className="card-play-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
          }
        </div>
        {isActive && (
          <div className="card-active-bar" />
        )}
      </div>
      <div className="card-info">
        <div className="card-title">{track.title}</div>
        <div className="card-channel">{track.channel}</div>
      </div>
    </div>
  )
}

export default function SectionRow({ section, currentTrack, isPlaying, onPlay, onSeeAll }) {
  const rowRef = useRef(null)

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 220, behavior: 'smooth' })
    }
  }

  return (
    <div className="section">
      <div className="section-header">
        <div className="section-label">
          <span className="section-emoji">{section.emoji}</span>
          <h2 className="section-title">{section.label}</h2>
        </div>
        <div className="section-controls">
          <button className="section-see-all" onClick={() => onSeeAll(section)}>See all</button>
          <button className="section-arrow" onClick={() => scroll(-1)} aria-label="Scroll left">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          </button>
          <button className="section-arrow" onClick={() => scroll(1)} aria-label="Scroll right">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </button>
        </div>
      </div>

      <div className="section-row" ref={rowRef}>
        {section.loading
          ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          : section.tracks.map((track, idx) => (
            <TrackCard
              key={track.id + idx}
              track={track}
              isActive={currentTrack?.id === track.id}
              isPlaying={currentTrack?.id === track.id && isPlaying}
              onPlay={() => onPlay(track, section, idx)}
            />
          ))
        }
      </div>
    </div>
  )
}
