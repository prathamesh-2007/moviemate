'use client';

import { MediaCard } from '@/components/media-card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface MediaGridProps {
  items: any[];
  type: 'movie' | 'tv';
  page: number;
  totalPages: number;
  isLoading: boolean;
  onRefresh: () => void;
  title: string;
}

export function MediaGrid({
  items,
  type,
  page,
  totalPages,
  isLoading,
  onRefresh,
  title,
}: MediaGridProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
        </div>
        <Button 
          onClick={onRefresh} 
          disabled={isLoading} 
          variant="outline"
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Show More</span>
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
          {items.map((item) => (
            <MediaCard
              key={item.id}
              id={item.id}
              title={type === 'movie' ? item.title : item.name}
              overview={item.overview}
              posterPath={item.poster_path}
              releaseDate={type === 'movie' ? item.release_date : item.first_air_date}
              rating={item.vote_average}
              type={type}
            />
          ))}
        </div>
      )}
    </div>
  );
}