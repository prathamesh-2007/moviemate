// Network utility functions for better ISP compatibility
export class NetworkUtils {
  private static retryCount = 3;
  private static retryDelay = 1000;

  static async fetchWithRetry(
    url: string, 
    options: RequestInit, 
    retries: number = this.retryCount
  ): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      if (retries > 0) {
        console.warn(`Request failed, retrying... (${retries} attempts left)`);
        await this.delay(this.retryDelay);
        return this.fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  }

  static async fetchWithFallback(
    endpoints: string[],
    path: string,
    options: RequestInit
  ): Promise<Response> {
    let lastError: Error | null = null;

    for (const endpoint of endpoints) {
      try {
        const url = `${endpoint}${path}`;
        return await this.fetchWithRetry(url, options);
      } catch (error) {
        lastError = error as Error;
        console.warn(`Endpoint ${endpoint} failed:`, error);
      }
    }

    throw lastError || new Error('All endpoints failed');
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static isNetworkError(error: any): boolean {
    return error instanceof TypeError && 
           (error.message.includes('fetch') || 
            error.message.includes('network') ||
            error.message.includes('Failed to fetch'));
  }

  static getErrorMessage(error: any): string {
    if (this.isNetworkError(error)) {
      return 'Network connection issue. Please check your internet connection or try again later.';
    }
    return error.message || 'An unexpected error occurred';
  }
}