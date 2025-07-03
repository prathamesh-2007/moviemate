// Proxy configuration for better ISP compatibility
export const PROXY_ENDPOINTS = [
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];

export const ALTERNATIVE_TMDB_ENDPOINTS = [
  'https://api.themoviedb.org/3',
  'https://api.tmdb.org/3',
  'https://tmdb-api.vercel.app/3', // Alternative endpoint
];

// DNS servers that work better with Jio
export const RECOMMENDED_DNS = [
  '8.8.8.8',
  '8.8.4.4',
  '1.1.1.1',
  '1.0.0.1',
  '208.67.222.222',
  '208.67.220.220'
];

export const JIO_WORKAROUND_CONFIG = {
  useProxy: true,
  retryWithDifferentEndpoints: true,
  fallbackToCache: true,
  showJioSpecificHelp: true,
};