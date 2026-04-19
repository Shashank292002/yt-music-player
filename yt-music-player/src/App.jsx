import { useState, useRef, useCallback } from 'react'
import { useYouTubePlayer } from './hooks/useYouTubePlayer'
import { useYouTubeSearch } from './hooks/useYouTubeSearch'
import SearchBar from './components/SearchBar'
import TrackList from './components/TrackList'
import PlayerBar from './components/PlayerBar'
import './App.css'

export default function App() {
  const player = useYouTubePlayer()
  const search = useYouTubeSearch()
  const [currentTrack, setCurrentTrack] = useState(null)
  const [currentIdx, setCurrentIdx] = useState(-1)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const shuffleRef = useRef(false)
  const repeatRef = useRef(false)
  const tracksRef = useRef([])
  const currentIdxRef = useRef(-1)

  shuffleRef.current = shuffle
  repeatRef.current = repeat
  tracksRef.current = search.results
  currentIdxRef.current = currentIdx

  const playTrack = useCallback((track, idx) => {
    setCurrentTrack(track)
    setCurrentIdx(idx)
    player.loadVideo(track.id)
  }, [player])

  const handleNext = useCallback(() => {
    const tracks = tracksRef.current
    if (!tracks.length) return
    let next
    if (shuffleRef.current) {
      next = Math.floor(Math.random() * tracks.length)
    } else {
      next = (currentIdxRef.current + 1) % tracks.length
    }
    playTrack(tracks[next], next)
  }, [playTrack])

  const handlePrev = useCallback(() => {
    const tracks = tracksRef.current
    if (!tracks.length) return
    const prev = (currentIdxRef.current - 1 + tracks.length) % tracks.length
    playTrack(tracks[prev], prev)
  }, [playTrack])

  const handleSearch = (q) => {
    search.search(q)
    setCurrentTrack(null)
    setCurrentIdx(-1)
  }

  return (
    <div className="app">
      {/* Hidden YouTube iframe */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <div ref={player.containerRef} />
      </div>

      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          </div>
          <span className="logo-text">ShaazMusic</span>
        </div>
        <SearchBar onSearch={handleSearch} loading={search.loading} />
      </header>

      <main className="main">
        {search.results.length > 0 && (
          <div className="results-label">
            {search.results.length} songs found
          </div>
        )}
        <TrackList
          tracks={search.results}
          loading={search.loading}
          error={search.error}
          currentIdx={currentIdx}
          isPlaying={player.isPlaying}
          onPlay={playTrack}
          onLoadMore={search.loadMore}
          hasMore={!!search.nextPageToken}
        />
      </main>

      <PlayerBar
        track={currentTrack}
        isPlaying={player.isPlaying}
        progress={player.progress}
        currentTime={player.currentTime}
        duration={player.duration}
        volume={player.volume}
        shuffle={shuffle}
        repeat={repeat}
        onTogglePlay={player.togglePlay}
        onNext={handleNext}
        onPrev={handlePrev}
        onSeek={player.seek}
        onVolume={player.setVolume}
        onShuffle={() => setShuffle(s => !s)}
        onRepeat={() => setRepeat(r => !r)}
      />
    </div>
  )
}
