export const TMDB_API_KEY = '3e96dde95504d1869608527d9979dce8';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZTk2ZGRlOTU1MDRkMTg2OTYwODUyN2Q5OTc5ZGNlOCIsIm5iZiI6MTczMDc3Mjg1MS4zODQsInN1YiI6IjY3Mjk3ZjczMDZkYzg4NTk2MzIzZmEzZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Qec9DYUWXONCmhdoG5zguW14ByLeZjJNYzcWZH5KXbU';

export const headers = {
  'Authorization': `Bearer ${BEARER_TOKEN}`,
  'accept': 'application/json'
};

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