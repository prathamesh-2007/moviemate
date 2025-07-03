'use client';

import { useEffect, useState } from 'react';
import { MediaCard } from '@/components/media-card';
import { fetchMovieDetails } from '@/lib/tmdb';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function WatchlistPage() {
  const [watchlist] = useLocalStorage<number[]>('watchlist', []);
  const [watched] = useLocalStorage<{ id: number; runtime: number }[]>('watched', []);
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const totalWatchTime = watched.reduce((acc, movie) => acc + (movie.runtime || 0), 0);

  useEffect(() => {
    const loadWatchlist = async () => {
      setIsLoading(true);
      try {
        if (watchlist.length === 0) {
          setMovies([]);
          return;
        }

        const movieDetails = await Promise.all(
          watchlist.map(async (id) => {
            try {
              return await fetchMovieDetails(id);
            } catch (error) {
              console.error(`Error fetching movie ${id}:`, error);
              return null;
            }
          })
        );
        
        // Filter out null values (failed requests)
        setMovies(movieDetails.filter(movie => movie !== null));
      } catch (error) {
        console.error('Error fetching watchlist movies:', error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWatchlist();
  }, [watchlist]);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Your Watchlist</h1>
        <div className="flex items-center gap-2 text-muted-foreground text-sm sm:text-base">
          <Clock className="h-4 w-4" />
          <span>
            Total watch time: {Math.floor(totalWatchTime / 60)} hours{' '}
            {totalWatchTime % 60} minutes
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[2/3] rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : movies.length > 0 ? (
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
              runtime={movie.runtime}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm sm:text-base">
            Your watchlist is empty. Add movies to watch later!
          </p>
        </div>
      )}
    </div>
  );
}