import { JioDetector } from './jio-detector';
import { PROXY_ENDPOINTS, ALTERNATIVE_TMDB_ENDPOINTS } from '../config/proxy';

export class EnhancedNetworkUtils {
  private static maxRetries = 5;
  private static baseDelay = 1000;

  static async fetchWithJioSupport(
    url: string,
    options: RequestInit = {},
    retries: number = this.maxRetries
  ): Promise<Response> {
    const isJio = JioDetector.isJioNetwork();
    
    // Try direct connection first
    try {
      return await this.attemptDirectFetch(url, options);
    } catch (error) {
      console.warn('Direct fetch failed:', error);
      
      if (isJio || JioDetector.isLikelyBlocked(error)) {
        return await this.attemptJioWorkarounds(url, options, retries);
      }
      
      throw error;
    }
  }

  private static async attemptDirectFetch(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'User-Agent': 'MovieMate/1.0 (Compatible)',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private static async attemptJioWorkarounds(
    url: string,
    options: RequestInit,
    retries: number
  ): Promise<Response> {
    const strategies = [
      () => this.tryAlternativeEndpoints(url, options),
      () => this.tryWithProxy(url, options),
      () => this.tryWithDifferentHeaders(url, options),
      () => this.tryWithDelay(url, options, 2000),
    ];

    for (const strategy of strategies) {
      try {
        console.log('Trying Jio workaround strategy...');
        return await strategy();
      } catch (error) {
        console.warn('Strategy failed:', error);
        continue;
      }
    }

    if (retries > 0) {
      console.log(`Retrying with ${retries} attempts left...`);
      await this.delay(this.baseDelay * (this.maxRetries - retries + 1));
      return this.attemptJioWorkarounds(url, options, retries - 1);
    }

    throw new Error('All Jio workaround strategies failed. Please check your network settings or try using a VPN.');
  }

  private static async tryAlternativeEndpoints(url: string, options: RequestInit): Promise<Response> {
    const urlObj = new URL(url);
    const path = urlObj.pathname + urlObj.search;

    for (const endpoint of ALTERNATIVE_TMDB_ENDPOINTS) {
      try {
        const alternativeUrl = `${endpoint}${path}`;
        return await this.attemptDirectFetch(alternativeUrl, options);
      } catch (error) {
        console.warn(`Alternative endpoint ${endpoint} failed:`, error);
        continue;
      }
    }

    throw new Error('All alternative endpoints failed');
  }

  private static async tryWithProxy(url: string, options: RequestInit): Promise<Response> {
    for (const proxy of PROXY_ENDPOINTS) {
      try {
        const proxiedUrl = `${proxy}${encodeURIComponent(url)}`;
        return await this.attemptDirectFetch(proxiedUrl, {
          ...options,
          headers: {
            ...options.headers,
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
      } catch (error) {
        console.warn(`Proxy ${proxy} failed:`, error);
        continue;
      }
    }

    throw new Error('All proxy attempts failed');
  }

  private static async tryWithDifferentHeaders(url: string, options: RequestInit): Promise<Response> {
    const alternativeHeaders = {
      ...options.headers,
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
    };

    return await this.attemptDirectFetch(url, {
      ...options,
      headers: alternativeHeaders,
    });
  }

  private static async tryWithDelay(url: string, options: RequestInit, delayMs: number): Promise<Response> {
    await this.delay(delayMs);
    return await this.attemptDirectFetch(url, options);
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static getJioHelpMessage(): string {
    return `
For Jio users experiencing connection issues:

1. **Change DNS Settings:**
   - Go to WiFi settings → Advanced → DNS
   - Set DNS 1: 8.8.8.8
   - Set DNS 2: 8.8.4.4

2. **Try Mobile Data:**
   - Switch from WiFi to mobile data
   - Jio mobile data often works better than WiFi

3. **Use VPN (if needed):**
   - Try a free VPN like Cloudflare WARP
   - This can bypass ISP restrictions

4. **Clear Browser Cache:**
   - Clear browser cache and cookies
   - Restart your browser

5. **Alternative Networks:**
   - Try using a different network if available
   - Hotspot from another device might work
    `;
  }
}