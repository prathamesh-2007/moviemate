'use client';

import { useState, useCallback } from 'react';
import { fetchTopRatedMovies, fetchTopRatedTVShows } from '@/lib/api/top-rated';

interface MediaData {
  results: any[];
  totalPages: number;
  page: number;
}

export function useTopRated(type: 'movie' | 'tv') {
  const [data, setData] = useState<MediaData>({ results: [], totalPages: 1, page: 1 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (page?: number) => {
    setIsLoading(true);
    try {
      const fetchFn = type === 'movie' ? fetchTopRatedMovies : fetchTopRatedTVShows;
      const nextPage = page || Math.floor(Math.random() * data.totalPages) + 1;
      const newData = await fetchFn(nextPage);
      setData(newData);
    } catch (error) {
      console.error(`Error fetching top rated ${type}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [type, data.totalPages]);

  return {
    data,
    isLoading,
    fetchData,
  };
}