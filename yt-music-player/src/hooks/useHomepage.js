import { useState, useEffect, useCallback } from 'react'

const API_KEY = 'AIzaSyC5L-OfnFKTe_pP7NcpS5uPEZ7oIXCsoTk'
const BASE = 'https://www.googleapis.com/youtube/v3/search'

const SECTIONS = [
  { id: 'trending',    label: 'Trending Now',         query: 'top hindi songs 2025',            emoji: '🔥' },
  { id: 'telugu',     label: 'Telugu Hits',           query: 'telugu hit songs 2025',           emoji: '🎵' },
  { id: 'arijit',     label: 'Arijit Singh',          query: 'arijit singh best songs',         emoji: '🎤' },
  { id: 'lofi',       label: 'Lo-Fi Chill',           query: 'lofi hindi songs chill beats',    emoji: '🌙' },
  { id: 'tamil',      label: 'Tamil Beats',           query: 'tamil hits 2025',                 emoji: '🥁' },
  { id: 'party',      label: 'Party Anthems',         query: 'bollywood party songs 2024 2025', emoji: '🎉' },
  { id: 'romantic',   label: 'Romantic Vibes',        query: 'romantic hindi songs 2025',       emoji: '❤️'  },
  { id: 'ar',         label: 'A.R. Rahman',           query: 'ar rahman songs hits',            emoji: '🎹' },
  { id: 'indie',      label: 'Indie & Alt',           query: 'indian indie music 2025',         emoji: '🌿' },
  { id: 'retro',      label: '90s Nostalgia',         query: 'best hindi songs 90s classic',    emoji: '📼' },
]

async function fetchSection(query, maxResults = 12) {
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    videoCategoryId: '10',
    key: API_KEY,
    maxResults: String(maxResults),
    order: 'relevance',
  })
  const res = await fetch(`${BASE}?${params}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return (data.items || []).map(item => ({
    id: item.id.videoId,
    title: cleanTitle(item.snippet.title),
    channel: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
    publishedAt: item.snippet.publishedAt,
  }))
}

function cleanTitle(title) {
  return title
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\(Official[^)]*\)/gi, '').replace(/\[Official[^)]*\]/gi, '')
    .replace(/\(Audio[^)]*\)/gi, '').replace(/\[Audio[^)]*\]/gi, '')
    .replace(/\(Lyric[^)]*\)/gi, '').replace(/\[Lyric[^)]*\]/gi, '')
    .replace(/\(Full[^)]*\)/gi, '').replace(/\[Full[^)]*\]/gi, '')
    .replace(/\(HD[^)]*\)/gi, '').replace(/  +/g, ' ').trim()
}

export function useHomepage() {
  const [sections, setSections] = useState(
    SECTIONS.map(s => ({ ...s, tracks: [], loading: true, error: null }))
  )
  const [featured, setFeatured] = useState([])

  const loadSection = useCallback(async (section, idx) => {
    try {
      const tracks = await fetchSection(section.query, idx === 0 ? 16 : 12)
      setSections(prev => prev.map((s, i) => i === idx ? { ...s, tracks, loading: false } : s))
      if (idx === 0 && tracks.length) setFeatured(tracks.slice(0, 5))
    } catch (e) {
      setSections(prev => prev.map((s, i) => i === idx ? { ...s, loading: false, error: e.message } : s))
    }
  }, [])

  useEffect(() => {
    // Load trending first, then stagger the rest
    loadSection(SECTIONS[0], 0)
    SECTIONS.slice(1).forEach((section, i) => {
      setTimeout(() => loadSection(section, i + 1), (i + 1) * 300)
    })
  }, [loadSection])

  return { sections, featured }
}

export { SECTIONS }
