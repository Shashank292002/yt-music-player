import { useState, useCallback } from 'react'

const API_KEY = 'AIzaSyC5L-OfnFKTe_pP7NcpS5uPEZ7oIXCsoTk'
const BASE = 'https://www.googleapis.com/youtube/v3/search'

export function useYouTubeSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [nextPageToken, setNextPageToken] = useState(null)
  const [lastQuery, setLastQuery] = useState('')

  const search = useCallback(async (query, pageToken = null) => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    if (!pageToken) { setResults([]); setLastQuery(query) }

    const params = new URLSearchParams({
      part: 'snippet',
      q: query + ' song',
      type: 'video',
      videoCategoryId: '10',
      key: API_KEY,
      maxResults: '25',
      ...(pageToken ? { pageToken } : {}),
    })

    try {
      const res = await fetch(`${BASE}?${params}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)

      const items = (data.items || []).map(item => ({
        id: item.id.videoId,
        title: cleanTitle(item.snippet.title),
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
      }))

      setResults(prev => pageToken ? [...prev, ...items] : items)
      setNextPageToken(data.nextPageToken || null)
    } catch (e) {
      setError(e.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMore = useCallback(() => {
    if (nextPageToken && lastQuery) search(lastQuery, nextPageToken)
  }, [nextPageToken, lastQuery, search])

  return { results, loading, error, nextPageToken, search, loadMore }
}

function cleanTitle(title) {
  return title
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\(Official.*?\)/gi, '')
    .replace(/\[Official.*?\]/gi, '')
    .replace(/\(Audio.*?\)/gi, '')
    .replace(/\[Audio.*?\]/gi, '')
    .replace(/\(Lyric.*?\)/gi, '')
    .replace(/\[Lyric.*?\]/gi, '')
    .trim()
}
