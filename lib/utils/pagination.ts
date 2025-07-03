import { headers } from '../config/tmdb';
import { NetworkUtils } from './network';

export async function getTotalPages(url: string): Promise<number> {
  try {
    const response = await NetworkUtils.fetchWithRetry(url, { headers });
    const data = await response.json();
    return Math.min(data.total_pages || 1, 500);
  } catch (error) {
    console.error('Error fetching total pages:', NetworkUtils.getErrorMessage(error));
    return 1;
  }
}

export async function getRandomPage(baseUrl: string): Promise<number> {
  try {
    const totalPages = await getTotalPages(baseUrl);
    return Math.floor(Math.random() * Math.min(totalPages, 20)) + 1; // Limit to first 20 pages for better performance
  } catch (error) {
    console.error('Error getting random page:', NetworkUtils.getErrorMessage(error));
    return 1;
  }
}

export function getRandomItems<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}