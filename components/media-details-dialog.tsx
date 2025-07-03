'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { fetchMovieDetails, fetchMovieTrailer, fetchTVShowDetails, fetchMovieCredits } from '@/lib/tmdb';
import Image from 'next/image';
import { Clock, Star, Calendar, DollarSign, TrendingUp, Users, Youtube } from 'lucide-react';

interface MediaDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaId: number;
  type: 'movie' | 'tv';
}

export function MediaDetailsDialog({
  open,
  onOpenChange,
  mediaId,
  type,
}: MediaDetailsDialogProps) {
  const [details, setDetails] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [trailer, setTrailer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && mediaId) {
      const fetchDetails = async () => {
        setIsLoading(true);
        try {
          const [detailsData, trailerData] = await Promise.all([
            type === 'movie' ? fetchMovieDetails(mediaId) : fetchTVShowDetails(mediaId),
            type === 'movie' ? fetchMovieTrailer(mediaId) : null,
          ]);
          setDetails(detailsData);
          setTrailer(trailerData);

          if (type === 'movie') {
            const creditsData = await fetchMovieCredits(mediaId);
            setCredits(creditsData);
          }
        } catch (error) {
          console.error('Error fetching details:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDetails();
    }
  }, [open, mediaId, type]);

  const handleWatchTrailer = () => {
    if (trailer) {
      window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank', 'noopener,noreferrer');
    }
  };

  if (!details && !isLoading) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const posterUrl = details?.poster_path 
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop&crop=center';

  const releaseDate = type === 'movie' ? details?.release_date : details?.first_air_date;
  const title = type === 'movie' ? details?.title : details?.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{title || 'Loading...'}</DialogTitle>
          <DialogDescription>
            {releaseDate ? new Date(releaseDate).getFullYear() : 'Unknown'}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">Loading details...</div>
          </div>
        ) : details ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="relative aspect-[2/3] max-w-sm mx-auto md:mx-0">
              <Image
                src={posterUrl}
                alt={title || 'Media poster'}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>{details.vote_average ? details.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {type === 'movie'
                      ? `${details.runtime || 'N/A'} min`
                      : `${details.episode_run_time?.[0] || 'N/A'} min/ep`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {releaseDate ? new Date(releaseDate).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base">{details.overview || 'No overview available.'}</p>

              {type === 'movie' && details.budget > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4" />
                  <span>Budget: {formatCurrency(details.budget)}</span>
                </div>
              )}

              {type === 'movie' && details.revenue > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>Revenue: {formatCurrency(details.revenue)}</span>
                </div>
              )}

              {credits && credits.cast && credits.cast.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold text-sm sm:text-base">Key Cast</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {credits.cast.slice(0, 6).map((actor: any) => (
                      <div key={actor.id} className="text-xs sm:text-sm">
                        <span className="font-medium">{actor.name}</span>
                        <span className="text-muted-foreground"> as {actor.character}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {details.genres && details.genres.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {details.genres.map((genre: any) => (
                      <span
                        key={genre.id}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs sm:text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {trailer && (
                <Button
                  onClick={handleWatchTrailer}
                  className="w-full flex items-center justify-center gap-2"
                  variant="default"
                >
                  <Youtube className="h-5 w-5" />
                  Watch Trailer on YouTube
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>Failed to load details. Please try again.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}