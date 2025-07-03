export const TMDB_API_KEY = '3e96dde95504d1869608527d9979dce8';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZTk2ZGRlOTU1MDRkMTg2OTYwODUyN2Q5OTc5ZGNlOCIsIm5iZiI6MTczMDc3Mjg1MS4zODQsInN1YiI6IjY3Mjk3ZjczMDZkYzg4NTk2MzIzZmEzZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Qec9DYUWXONCmhdoG5zguW14ByLeZjJNYzcWZH5KXbU';

// Enhanced headers with retry logic for better ISP compatibility
export const headers = {
  'Authorization': `Bearer ${BEARER_TOKEN}`,
  'accept': 'application/json',
  'User-Agent': 'MovieMate/1.0',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive'
};

// Fallback API endpoints for better reliability
export const FALLBACK_ENDPOINTS = [
  'https://api.themoviedb.org/3',
  'https://api.tmdb.org/3'
];

export const INDUSTRY_MAPPING: { [key: string]: { region: string; language: string } } = {
  Hollywood: {
    region: 'US',
    language: 'en',
  },
  Bollywood: {
    region: 'IN',
    language: 'hi',
  },
  Korean: {
    region: 'KR',
    language: 'ko',
  },
  Japanese: {
    region: 'JP',
    language: 'ja',
  },
};