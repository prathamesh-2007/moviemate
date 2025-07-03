import { BASE_URL, headers, INDUSTRY_MAPPING, FALLBACK_ENDPOINTS } from './config/tmdb';
import { Movie, TVShow } from './types/tmdb';
import { getCertificationQuery } from './utils/certifications';
import { getRandomPage } from './utils/pagination';
import { NetworkUtils } from './utils/network';

// Enhanced cache with better ISP compatibility
class RealTimeCache {
  private capacity: number;
  private cache: Map<string, { data: any; timestamp: number }>;
  private ttl: number;

  constructor(capacity: number, ttlMinutes: number = 2) {
    this.capacity = capacity;
    this.cache = new Map();
    this.ttl = ttlMinutes * 60 * 1000;
  }

  get(key: string): any | undefined {
    const item = this.cache.get(key);
    if (item && Date.now() - item.timestamp < this.ttl) {
      this.cache.delete(key);
      this.cache.set(key, item);
      return item.data;
    }
    if (item) {
      this.cache.delete(key);
    }
    return undefined;
  }

  set(key: string, value: any): void {
    if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, { data: value, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new RealTimeCache(100, 2);

async function fetchWithEnhancedCache(url: string, options: RequestInit, forceRefresh: boolean = false) {
  const cacheKey = url;
  
  if (!forceRefresh) {
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    // Extract path from full URL for fallback
    const urlObj = new URL(url);
    const path = urlObj.pathname + urlObj.search;

    // Try primary endpoint first, then fallbacks
    const response = await NetworkUtils.fetchWithFallback(
      [BASE_URL, ...FALLBACK_ENDPOINTS],
      path,
      options
    );
    
    const data = await response.json();
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Enhanced fetch error:', NetworkUtils.getErrorMessage(error));
    
    // Return cached data if available, even if expired
    const cached = cache.get(cacheKey);
    if (cached) {
      console.warn('Returning stale cached data due to network error');
      return cached;
    }
    
    throw error;
  }
}

export const fetchMovies = async (params: {
  industry?: string;
  year?: string;
  genre?: string;
  contentRating?: string;
}) => {
  const { industry, year, genre, contentRating } = params;
  
  let baseUrl = `${BASE_URL}/discover/movie?include_adult=false&sort_by=release_date.desc`;
  
  if (industry) {
    const industryConfig = INDUSTRY_MAPPING[industry];
    if (industryConfig) {
      baseUrl += `&with_original_language=${industryConfig.language}`;
      baseUrl += `&region=${industryConfig.region}`;
    }
  }
  
  if (year) baseUrl += `&primary_release_year=${year}`;
  if (genre) baseUrl += `&with_genres=${genre}`;
  
  if (industry && contentRating) {
    baseUrl += getCertificationQuery(industry, contentRating);
  }

  try {
    const randomPage = await getRandomPage(baseUrl);
    const url = `${baseUrl}&page=${randomPage}`;
    const data = await fetchWithEnhancedCache(url, { headers });
    
    if (!data.results?.length) {
      const firstPageData = await fetchWithEnhancedCache(`${baseUrl}&page=1`, { headers });
      return (firstPageData.results || []).slice(0, 3);
    }
    
    return data.results.slice(0, 3);
  } catch (error) {
    console.error('Error fetching movies:', NetworkUtils.getErrorMessage(error));
    return [];
  }
};

export const fetchTVShows = async (params: {
  industry?: string;
  year?: string;
  genre?: string;
  contentRating?: string;
}) => {
  const { industry, year, genre } = params;
  
  let baseUrl = `${BASE_URL}/discover/tv?include_adult=false&sort_by=first_air_date.desc`;
  
  if (industry) {
    const industryConfig = INDUSTRY_MAPPING[industry];
    if (industryConfig) {
      baseUrl += `&with_original_language=${industryConfig.language}`;
      baseUrl += `&with_origin_country=${industryConfig.region}`;
    }
  }
  
  if (year) baseUrl += `&first_air_date_year=${year}`;
  if (genre) baseUrl += `&with_genres=${genre}`;

  try {
    const randomPage = await getRandomPage(baseUrl);
    const url = `${baseUrl}&page=${randomPage}`;
    const data = await fetchWithEnhancedCache(url, { headers });
    
    let results = data.results || [];
    
    if (industry) {
      const industryConfig = INDUSTRY_MAPPING[industry];
      if (industryConfig) {
        results = results.filter((show: TVShow) => 
          show.origin_country.includes(industryConfig.region)
        );
      }
    }
    
    if (!results.length) {
      const firstPageData = await fetchWithEnhancedCache(`${baseUrl}&page=1`, { headers });
      results = (firstPageData.results || []).filter((show: TVShow) => {
        if (!industry) return true;
        const industryConfig = INDUSTRY_MAPPING[industry];
        return industryConfig ? show.origin_country.includes(industryConfig.region) : true;
      });
    }
    
    return results.slice(0, 3);
  } catch (error) {
    console.error('Error fetching TV shows:', NetworkUtils.getErrorMessage(error));
    return [];
  }
};

export const fetchMovieDetails = async (id: number): Promise<Movie> => {
  const url = `${BASE_URL}/movie/${id}?language=en-US`;
  return fetchWithEnhancedCache(url, { headers });
};

export const fetchMovieCredits = async (id: number) => {
  const url = `${BASE_URL}/movie/${id}/credits?language=en-US`;
  return fetchWithEnhancedCache(url, { headers });
};

export const fetchTVShowDetails = async (id: number): Promise<TVShow> => {
  const url = `${BASE_URL}/tv/${id}?language=en-US`;
  return fetchWithEnhancedCache(url, { headers });
};

export const fetchTrending = async (forceRefresh: boolean = false) => {
  const url = `${BASE_URL}/trending/movie/day?language=en-US`;
  try {
    const data = await fetchWithEnhancedCache(url, { headers }, forceRefresh);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching trending movies:', NetworkUtils.getErrorMessage(error));
    return [];
  }
};

export const fetchPopular = async (forceRefresh: boolean = false) => {
  const url = `${BASE_URL}/movie/popular?language=en-US`;
  try {
    const data = await fetchWithEnhancedCache(url, { headers }, forceRefresh);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching popular movies:', NetworkUtils.getErrorMessage(error));
    return [];
  }
};

export const fetchNowPlaying = async (forceRefresh: boolean = false) => {
  const url = `${BASE_URL}/movie/now_playing?language=en-US&region=US`;
  try {
    const data = await fetchWithEnhancedCache(url, { headers }, forceRefresh);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching now playing movies:', NetworkUtils.getErrorMessage(error));
    return [];
  }
};

export const fetchTopRatedMovies = async (forceRefresh: boolean = false) => {
  const url = `${BASE_URL}/movie/top_rated?language=en-US`;
  try {
    const data = await fetchWithEnhancedCache(url, { headers }, forceRefresh);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching top rated movies:', NetworkUtils.getErrorMessage(error));
    return [];
  }
};

export const fetchTopRatedTVShows = async (forceRefresh: boolean = false) => {
  const url = `${BASE_URL}/tv/top_rated?language=en-US`;
  try {
    const data = await fetchWithEnhancedCache(url, { headers }, forceRefresh);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching top rated TV shows:', NetworkUtils.getErrorMessage(error));
    return [];
  }
};

export const fetchMovieTrailer = async (id: number) => {
  const url = `${BASE_URL}/movie/${id}/videos?language=en-US`;
  try {
    const data = await fetchWithEnhancedCache(url, { headers });
    return data.results?.find((video: any) => video.type === 'Trailer');
  } catch (error) {
    console.error('Error fetching movie trailer:', NetworkUtils.getErrorMessage(error));
    return null;
  }
};

export const clearCache = () => {
  cache.clear();
};