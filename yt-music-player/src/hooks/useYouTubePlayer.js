import { useEffect, useRef, useState, useCallback } from 'react'

export function useYouTubePlayer() {
  const playerRef = useRef(null)
  const containerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(80)
  const [currentVideoId, setCurrentVideoId] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (window.YT && window.YT.Player) { initPlayer(); return }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
    window.onYouTubeIframeAPIReady = initPlayer
    return () => { window.onYouTubeIframeAPIReady = null }
  }, [])

  const initPlayer = () => {
    if (!containerRef.current) return
    playerRef.current = new window.YT.Player(containerRef.current, {
      height: '1', width: '1',
      playerVars: {
        autoplay: 0, controls: 0, disablekb: 1,
        fs: 0, iv_load_policy: 3, modestbranding: 1,
        rel: 0, showinfo: 0,
      },
      events: {
        onReady: (e) => { e.target.setVolume(80); setReady(true) },
        onStateChange: (e) => {
          const S = window.YT.PlayerState
          if (e.data === S.PLAYING) {
            setIsPlaying(true)
            setDuration(playerRef.current.getDuration())
            clearInterval(intervalRef.current)
            intervalRef.current = setInterval(() => {
              const p = playerRef.current
              if (!p) return
              const ct = p.getCurrentTime()
              const dur = p.getDuration()
              setCurrentTime(ct)
              setDuration(dur)
              setProgress(dur ? (ct / dur) * 100 : 0)
            }, 500)
          } else if (e.data === S.PAUSED) {
            setIsPlaying(false)
            clearInterval(intervalRef.current)
          } else if (e.data === S.ENDED) {
            setIsPlaying(false)
            clearInterval(intervalRef.current)
            setProgress(0); setCurrentTime(0)
          }
        },
      },
    })
  }

  const loadVideo = useCallback((videoId) => {
    if (!playerRef.current || !ready) return
    setCurrentVideoId(videoId)
    setProgress(0); setCurrentTime(0); setDuration(0)
    playerRef.current.loadVideoById(videoId)
  }, [ready])

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return
    const state = playerRef.current.getPlayerState()
    if (state === window.YT?.PlayerState?.PLAYING) playerRef.current.pauseVideo()
    else playerRef.current.playVideo()
  }, [])

  const seek = useCallback((pct) => {
    if (!playerRef.current) return
    const dur = playerRef.current.getDuration()
    if (dur) playerRef.current.seekTo((pct / 100) * dur, true)
  }, [])

  const setVolume = useCallback((v) => {
    setVolumeState(v)
    if (playerRef.current) playerRef.current.setVolume(v)
  }, [])

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return { containerRef, ready, isPlaying, progress, currentTime, duration, volume, currentVideoId, loadVideo, togglePlay, seek, setVolume }
}
