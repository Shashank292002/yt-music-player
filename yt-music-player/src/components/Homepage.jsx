import Featured from './Featured'
import SectionRow from './SectionRow'
import './Homepage.css'

export default function Homepage({ sections, featured, currentTrack, isPlaying, onPlay, onSeeAll }) {
  const greet = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="homepage">
      <div className="homepage-greet">
        <h1 className="greet-text">{greet()}</h1>
        <p className="greet-sub">What do you want to listen to?</p>
      </div>

      <Featured
        tracks={featured}
        onPlay={onPlay}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
      />

      <div className="sections-wrap">
        {sections.map(section => (
          <SectionRow
            key={section.id}
            section={section}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlay={onPlay}
            onSeeAll={onSeeAll}
          />
        ))}
        <div style={{ height: 100 }} />
      </div>
    </div>
  )
}
