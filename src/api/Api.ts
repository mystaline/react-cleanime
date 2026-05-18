import axios from "axios";
import cacheManager from "../utils/cacheManager";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export interface AnimeResponse {
  data: any[];
  pagination?: any;
}

const getSFWParam = (allowNSFW: boolean = false): string => {
  return allowNSFW ? "" : "&sfw";
};

// Generate cache key from URL
const getCacheKey = (url: string): string => url;

const inFlight = new Map<string, Promise<any>>();

const fetchWithCache = async <T>(
  url: string,
  cacheTTL = 60000,
): Promise<T | undefined> => {
  const cached = cacheManager.get<T>(getCacheKey(url));
  if (cached) return cached;

  const existing = inFlight.get(url);
  if (existing) return existing as Promise<T | undefined>;

  const promise = (async () => {
    try {
      const response = await axios.get<T>(url);
      cacheManager.set<T>(getCacheKey(url), response.data, cacheTTL);
      return response.data as T;
    } catch (error) {
      console.error(`[API Error] ${url}:`, error);
      return undefined;
    } finally {
      inFlight.delete(url);
    }
  })();

  inFlight.set(url, promise);
  return promise;
};

export const getAllAnime = async (
  _page = 1,
  allowNSFW = false,
): Promise<AnimeResponse | undefined> => {
  const url = `${API_BASE}/anime?limit=15${getSFWParam(allowNSFW)}`;
  return fetchWithCache<AnimeResponse>(url, 60000);
};

export const getAnimeById = async (
  id: number | string,
): Promise<AnimeResponse | undefined> => {
  const url = `${API_BASE}/anime/${id}/full`;
  return fetchWithCache<AnimeResponse>(url, 300000); // Cache detail pages longer (5 min)
};

export const getSearch = async (
  searchAnime: string,
  page = 1,
  allowNSFW = false,
): Promise<AnimeResponse | undefined> => {
  const url = `${API_BASE}/anime?page=${page}&q=${encodeURIComponent(searchAnime)}${getSFWParam(allowNSFW)}`;
  return fetchWithCache<AnimeResponse>(url, 60000);
};

export const getTopAnime = async (
  page = 1,
  allowNSFW = false,
): Promise<AnimeResponse | undefined> => {
  const url = `${API_BASE}/top/anime?page=${page}${getSFWParam(allowNSFW)}`;
  return fetchWithCache<AnimeResponse>(url, 60000);
};

export const getSeasonAnime = async (
  page = 1,
  allowNSFW = false,
): Promise<AnimeResponse | undefined> => {
  const url = `${API_BASE}/seasons/now?page=${page}${getSFWParam(allowNSFW)}`;
  return fetchWithCache<AnimeResponse>(url, 60000);
};

export const getUpcomingAnime = async (
  page = 1,
  allowNSFW = false,
): Promise<AnimeResponse | undefined> => {
  const url = `${API_BASE}/seasons/upcoming?page=${page}${getSFWParam(allowNSFW)}`;
  return fetchWithCache<AnimeResponse>(url, 60000);
};
