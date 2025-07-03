// Utility to detect Jio network and provide specific solutions
export class JioDetector {
  static isJioNetwork(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Check for Jio-specific indicators
    const userAgent = navigator.userAgent.toLowerCase();
    const connection = (navigator as any).connection;
    
    // Check if user is on Jio based on various indicators
    const jioIndicators = [
      'jio',
      'reliance',
      'rjil',
    ];
    
    return jioIndicators.some(indicator => 
      userAgent.includes(indicator) || 
      (connection && connection.effectiveType && connection.effectiveType.includes('jio'))
    );
  }

  static getNetworkInfo() {
    if (typeof window === 'undefined') return null;
    
    const connection = (navigator as any).connection;
    return {
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
    };
  }

  static isLikelyBlocked(error: any): boolean {
    const errorMessage = error.message?.toLowerCase() || '';
    const blockedIndicators = [
      'network error',
      'failed to fetch',
      'cors',
      'blocked',
      'timeout',
      'connection refused',
      'dns',
    ];
    
    return blockedIndicators.some(indicator => errorMessage.includes(indicator));
  }
}