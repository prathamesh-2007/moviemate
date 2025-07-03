import { BASE_URL, headers } from '../config/tmdb';

interface TopRatedResponse {
  results: any[];
  total_pages: number;
  page: number;
}

async function fetchTopRatedData(endpoint: string, page: number = 1) {
  try {
    const response = await fetch(
      `${BASE_URL}/${endpoint}?language=en-US&page=${page}`,
      { headers }
    );
    const data: TopRatedResponse = await response.json();
    return {
      results: data.results || [],
      totalPages: Math.min(data.total_pages || 1, 500), // TMDB limits to 500 pages
      page: data.page || 1
    };
  } catch (error) {
    console.error(`Error fetching top rated ${endpoint}:`, error);
    return {
      results: [],
      totalPages: 1,
      page: 1
    };
  }
}

export const fetchTopRatedMovies = (page: number = 1) => 
  fetchTopRatedData('movie/top_rated', page);

export const fetchTopRatedTVShows = (page: number = 1) => 
  fetchTopRatedData('tv/top_rated', page);