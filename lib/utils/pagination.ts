import { headers } from '../config/tmdb';

export async function getTotalPages(url: string): Promise<number> {
  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    // TMDb has a maximum of 500 pages
    return Math.min(data.total_pages || 1, 500);
  } catch (error) {
    console.error('Error fetching total pages:', error);
    return 1;
  }
}

export async function getRandomPage(baseUrl: string): Promise<number> {
  const totalPages = await getTotalPages(baseUrl);
  return Math.floor(Math.random() * totalPages) + 1;
}

export function getRandomItems<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}