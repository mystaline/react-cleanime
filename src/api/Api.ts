import axios from 'axios'
import cacheManager from '../utils/cacheManager'

const API_BASE = 'https://api.jikan.moe/v4'

export interface AnimeResponse {
  data: any[]
  pagination?: any
}

const getSFWParam = (allowNSFW: boolean = false): string => {
  return allowNSFW ? '' : '&sfw'
}

// Generate cache key from URL
const getCacheKey = (url: string): string => url

// Fetch with caching layer
const fetchWithCache = async <T,>(url: string, cacheTTL = 60000): Promise<T | undefined> => {
  // Check cache first
  const cached = cacheManager.get<T>(getCacheKey(url))
  if (cached) {
    console.debug(`[Cache HIT] ${url}`)
    return cached
  }

  try {
    const response = await axios.get<T>(url)

    // Cache successful response
    cacheManager.set<T>(getCacheKey(url), response.data, cacheTTL)
    console.debug(`[Cache SET] ${url}`)

    return response.data
  } catch (error) {
    console.error(`[API Error] ${url}:`, error)
    return undefined
  }
}

export const getAllAnime = async (page = 1, allowNSFW = false): Promise<AnimeResponse | undefined> => {
  const url = `${API_BASE}/anime?limit=15${getSFWParam(allowNSFW)}`
  return fetchWithCache<AnimeResponse>(url, 60000)
}

export const getAnimeById = async (id: number | string): Promise<AnimeResponse | undefined> => {
  const url = `${API_BASE}/anime/${id}/full`
  return fetchWithCache<AnimeResponse>(url, 300000) // Cache detail pages longer (5 min)
}

export const getSearch = async (
  searchAnime: string,
  page = 1,
  allowNSFW = false
): Promise<AnimeResponse | undefined> => {
  const url = `${API_BASE}/anime?page=${page}&q=${encodeURIComponent(searchAnime)}${getSFWParam(allowNSFW)}`
  return fetchWithCache<AnimeResponse>(url, 60000)
}

export const getTopAnime = async (page = 1, allowNSFW = false): Promise<AnimeResponse | undefined> => {
  const url = `${API_BASE}/top/anime?page=${page}${getSFWParam(allowNSFW)}`
  return fetchWithCache<AnimeResponse>(url, 60000)
}

export const getSeasonAnime = async (page = 1, allowNSFW = false): Promise<AnimeResponse | undefined> => {
  const url = `${API_BASE}/seasons/now?page=${page}${getSFWParam(allowNSFW)}`
  return fetchWithCache<AnimeResponse>(url, 60000)
}

export const getUpcomingAnime = async (page = 1, allowNSFW = false): Promise<AnimeResponse | undefined> => {
  const url = `${API_BASE}/seasons/upcoming?page=${page}${getSFWParam(allowNSFW)}`
  return fetchWithCache<AnimeResponse>(url, 60000)
}
