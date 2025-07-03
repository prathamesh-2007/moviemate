export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  budget: number;
  revenue: number;
  genres: { id: number; name: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  episode_run_time: number[];
  genres: { id: number; name: string }[];
  origin_country: string[];
}

export interface IndustryConfig {
  region: string;
  language: string;
}

export interface CertificationConfig {
  region: string;
  ratings: { [key: string]: string };
}