'use client';

import { useEffect, useState } from 'react';
import { MediaCard } from '@/components/media-card';
import { fetchTrending, clearCache } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TrendingPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTrending = async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    try {
      if (forceRefresh) {
        clearCache();
      }
      const data = await fetchTrending(forceRefresh);
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrending();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">Trending Movies</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            See what's trending in movies today - Real-time data
          </p>
        </div>
        <Button 
          onClick={() => loadTrending(true)} 
          disabled={isLoading} 
          variant="outline"
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[2/3] rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MediaCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              overview={movie.overview}
              posterPath={movie.poster_path}
              releaseDate={movie.release_date}
              rating={movie.vote_average}
              type="movie"
            />
          ))}
        </div>
      )}
    </div>
  );
}