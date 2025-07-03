'use client';

import { useState, useCallback, useEffect } from 'react';
import { fetchMovies, fetchTVShows, clearCache } from '@/lib/tmdb';

export interface RecommendationValues {
  industry: string;
  year: string;
  genre: string;
  contentRating: string;
}

export function useRecommendations() {
  const [movies, setMovies] = useState<any[]>([]);
  const [tvShows, setTvShows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentValues, setCurrentValues] = useState<RecommendationValues | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const fetchRecommendations = useCallback(async (values: RecommendationValues) => {
    setIsLoading(true);
    setMovies([]);
    setTvShows([]);
    
    try {
      const [movieResults, tvResults] = await Promise.all([
        fetchMovies(values),
        fetchTVShows(values),
      ]);

      if (movieResults?.length > 0 || tvResults?.length > 0) {
        setMovies(movieResults || []);
        setTvShows(tvResults || []);
        setCurrentValues(values);
        setLastFetchTime(Date.now());
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setMovies([]);
      setTvShows([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (currentValues) {
      // Clear cache for fresh data
      clearCache();
      await fetchRecommendations(currentValues);
    }
  }, [currentValues, fetchRecommendations]);

  // Auto-refresh content every 2 minutes for real-time data
  useEffect(() => {
    if (!currentValues) return;

    const interval = setInterval(() => {
      const timeSinceLastFetch = Date.now() - lastFetchTime;
      if (timeSinceLastFetch >= 2 * 60 * 1000) { // 2 minutes
        refresh();
      }
    }, 30 * 1000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [currentValues, lastFetchTime, refresh]);

  return {
    movies,
    tvShows,
    isLoading,
    fetchRecommendations,
    refresh,
    hasValues: !!currentValues,
  };
}