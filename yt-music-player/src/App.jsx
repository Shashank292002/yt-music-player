import { useState, useRef, useCallback, useEffect } from 'react'
import { useYouTubePlayer } from './hooks/useYouTubePlayer'
import { useYouTubeSearch } from './hooks/useYouTubeSearch'
import { useHomepage } from './hooks/useHomepage'
import SearchBar from './components/SearchBar'
import TrackList from './components/TrackList'
import PlayerBar from './components/PlayerBar'
import Homepage from './components/Homepage'
import './App.css'

export default function App() {
  const player = useYouTubePlayer()
  const search = useYouTubeSearch()
  const homepage = useHomepage()

  const [view, setView] = useState('home')       // 'home' | 'search' | 'section'
  const [currentTrack, setCurrentTrack] = useState(null)
  const [currentIdx, setCurrentIdx] = useState(-1)
  const [queue, setQueue] = useState([])          // current playing queue
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [activeSection, setActiveSection] = useState(null)
  const [mobileNav, setMobileNav] = useState('home')

  const shuffleRef = useRef(false)
  const repeatRef = useRef(false)
  const queueRef = useRef([])
  const currentIdxRef = useRef(-1)

  shuffleRef.current = shuffle
  repeatRef.current = repeat
  queueRef.current = queue
  currentIdxRef.current = currentIdx

  const playTrack = useCallback((track, queueTracks, idx) => {
    setCurrentTrack(track)
    setCurrentIdx(idx)
    setQueue(queueTracks)
    player.loadVideo(track.id)
  }, [player])

  // Play from homepage section card
  const handleHomePlay = useCallback((track, section, idx) => {
    playTrack(track, section.tracks, idx)
  }, [playTrack])

  // Play from search results
  const handleSearchPlay = useCallback((track, idx) => {
    playTrack(track, search.results, idx)
  }, [playTrack, search.results])

  // Play from section view
  const handleSectionPlay = useCallback((track, idx) => {
    playTrack(track, activeSection?.tracks || [], idx)
  }, [playTrack, activeSection])

  const handleNext = useCallback(() => {
    const q = queueRef.current
    if (!q.length) return
    let next
    if (shuffleRef.current) {
      next = Math.floor(Math.random() * q.length)
    } else {
      next = (currentIdxRef.current + 1) % q.length
    }
    setCurrentTrack(q[next])
    setCurrentIdx(next)
    player.loadVideo(q[next].id)
  }, [player])

  const handlePrev = useCallback(() => {
    const q = queueRef.current
    if (!q.length) return
    const prev = (currentIdxRef.current - 1 + q.length) % q.length
    setCurrentTrack(q[prev])
    setCurrentIdx(prev)
    player.loadVideo(q[prev].id)
  }, [player])

  const handleSearch = (q) => {
    search.search(q)
    setView('search')
    setMobileNav('search')
  }

  const handleSeeAll = (section) => {
    setActiveSection(section)
    setView('section')
  }

  const goHome = () => {
    setView('home')
    setMobileNav('home')
  }

  const goSearch = () => {
    setView('search')
    setMobileNav('search')
  }

  const sectionForView = view === 'section' && activeSection
    ? { ...activeSection, tracks: activeSection.tracks }
    : null

  return (
    <div className="app">
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <div ref={player.containerRef} />
      </div>

      {/* SIDEBAR NAV - desktop */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          </div>
          <span className="logo-text">YTMusic</span>
        </div>

        <nav className="sidenav">
          <button className={`sidenav-item${view === 'home' ? ' active' : ''}`} onClick={goHome}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            <span>Home</span>
          </button>
          <button className={`sidenav-item${view === 'search' ? ' active' : ''}`} onClick={goSearch}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <span>Search</span>
          </button>
        </nav>

        <div className="sidebar-section-label">Browse</div>
        <nav className="sidenav">
          {homepage.sections.slice(0, 5).map(s => (
            <button
              key={s.id}
              className="sidenav-item sidenav-item-sm"
              onClick={() => handleSeeAll(s)}
            >
              <span className="sidenav-emoji">{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="app-body">
        {/* TOPBAR */}
        <header className="header">
          {(view === 'search' || view === 'section') && (
            <button className="back-btn" onClick={goHome} aria-label="Back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            </button>
          )}
          {view !== 'home' && (
            <div className="header-title">
              {view === 'section' && activeSection
                ? <>{activeSection.emoji} {activeSection.label}</>
                : 'Search'}
            </div>
          )}
          <div className="header-search">
            <SearchBar onSearch={handleSearch} loading={search.loading} />
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="main">
          {view === 'home' && (
            <Homepage
              sections={homepage.sections}
              featured={homepage.featured}
              currentTrack={currentTrack}
              isPlaying={player.isPlaying}
              onPlay={handleHomePlay}
              onSeeAll={handleSeeAll}
            />
          )}

          {view === 'search' && (
            <div className="search-view">
              {!search.results.length && !search.loading && !search.error && (
                <div className="search-empty">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" style={{opacity:0.12}}><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                  <p>Search for songs, artists, albums…</p>
                </div>
              )}
              {(search.results.length > 0 || search.loading || search.error) && (
                <>
                  {search.results.length > 0 && (
                    <div className="results-label">{search.results.length} results</div>
                  )}
                  <TrackList
                    tracks={search.results}
                    loading={search.loading}
                    error={search.error}
                    currentIdx={queue === search.results ? currentIdx : -1}
                    isPlaying={player.isPlaying}
                    onPlay={handleSearchPlay}
                    onLoadMore={search.loadMore}
                    hasMore={!!search.nextPageToken}
                  />
                </>
              )}
            </div>
          )}

          {view === 'section' && sectionForView && (
            <div className="section-view">
              <div className="section-view-header">
                <div className="section-view-icon">{sectionForView.emoji}</div>
                <div>
                  <h2 className="section-view-title">{sectionForView.label}</h2>
                  <p className="section-view-count">{sectionForView.tracks.length} songs</p>
                </div>
              </div>
              <TrackList
                tracks={sectionForView.tracks}
                loading={sectionForView.loading}
                error={sectionForView.error}
                currentIdx={currentIdx}
                isPlaying={player.isPlaying}
                onPlay={handleSectionPlay}
                onLoadMore={() => {}}
                hasMore={false}
              />
            </div>
          )}
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

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-nav">
        <button className={`mobile-nav-item${mobileNav === 'home' ? ' active' : ''}`} onClick={goHome}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span>Home</span>
        </button>
        <button className={`mobile-nav-item${mobileNav === 'search' ? ' active' : ''}`} onClick={goSearch}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <span>Search</span>
        </button>
        <button className="mobile-nav-item" onClick={() => {}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          <span>Library</span>
        </button>
      </nav>
    </div>
  )
}
