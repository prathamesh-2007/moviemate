'use client';

import { useState, memo } from 'react';
import Image from 'next/image';
import { Calendar, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { MediaDetailsDialog } from './media-details-dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface MediaCardProps {
  id: number;
  title: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  rating: number;
  type: 'movie' | 'tv';
  runtime?: number;
}

function MediaCardComponent({
  id,
  title,
  overview,
  posterPath,
  releaseDate,
  rating,
  type,
  runtime,
}: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [watchlist, setWatchlist] = useLocalStorage<number[]>('watchlist', []);
  const [watched, setWatched] = useLocalStorage<{ id: number; runtime: number }[]>(
    'watched',
    []
  );

  const isInWatchlist = watchlist.includes(id);
  const isWatched = watched.some((item) => item.id === id);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      setWatchlist(watchlist.filter((itemId) => itemId !== id));
    } else {
      setWatchlist([...watchlist, id]);
    }
  };

  const handleWatchedToggle = () => {
    if (isWatched) {
      setWatched(watched.filter((item) => item.id !== id));
    } else if (runtime) {
      setWatched([...watched, { id, runtime }]);
    }
  };

  // Handle missing poster path
  const posterUrl = posterPath 
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop&crop=center';

  // Format release date safely
  const formattedDate = releaseDate 
    ? new Date(releaseDate).toLocaleDateString()
    : 'Unknown';

  return (
    <>
      <Card
        className="relative overflow-hidden transition-all duration-300 hover-card-effect animate-fade-in"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[2/3]">
          {isImageLoading && (
            <div className="absolute inset-0">
              <Skeleton className="h-full w-full" />
            </div>
          )}
          <Image
            src={posterUrl}
            alt={title || 'Movie poster'}
            fill
            className={`object-cover transition-transform duration-300 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            loading="lazy"
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
          {isHovered && (
            <div className="absolute inset-0 bg-black/70 p-4 flex flex-col justify-between text-white animate-fade-in glass-effect">
              <div>
                <h3 className="font-bold mb-2 line-clamp-2">{title}</h3>
                <p className="text-sm line-clamp-3">{overview}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-400" />
                  {rating ? rating.toFixed(1) : 'N/A'}
                </div>
                {runtime && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    {runtime} min
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1 animate-scale-in"
                    onClick={() => setIsDetailsOpen(true)}
                  >
                    More Info
                  </Button>
                  <Button
                    size="sm"
                    variant={isInWatchlist ? 'destructive' : 'default'}
                    className="flex-1 animate-scale-in"
                    onClick={handleWatchlistToggle}
                  >
                    {isInWatchlist ? 'Remove' : 'Watch Later'}
                  </Button>
                </div>
                {type === 'movie' && (
                  <Button
                    size="sm"
                    variant={isWatched ? 'destructive' : 'default'}
                    className="w-full animate-scale-in"
                    onClick={handleWatchedToggle}
                  >
                    {isWatched ? 'Unmark Watched' : 'Mark as Watched'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
      <MediaDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        mediaId={id}
        type={type}
      />
    </>
  );
}

export const MediaCard = memo(MediaCardComponent);