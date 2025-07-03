'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, AlertTriangle, HelpCircle } from 'lucide-react';
import { JioDetector } from '@/lib/utils/jio-detector';
import { JioHelpDialog } from './jio-help-dialog';
import { isJioBlockedError } from '@/lib/tmdb';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      return <DefaultErrorFallback error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, retry }: { error?: Error; retry: () => void }) {
  const [showJioHelp, setShowJioHelp] = useState(false);
  
  const isNetworkError = error?.message.includes('fetch') || 
                        error?.message.includes('network') ||
                        error?.message.includes('Failed to fetch') ||
                        isJioBlockedError(error);

  const isJioUser = JioDetector.isJioNetwork();
  const isLikelyJioBlocked = isJioUser && isNetworkError;

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="mb-6">
          {isNetworkError ? (
            <Wifi className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          ) : (
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold mb-4">
          {isLikelyJioBlocked ? 'Jio Network Issue Detected' : 
           isNetworkError ? 'Connection Issue' : 'Something went wrong'}
        </h2>
        
        <p className="text-muted-foreground mb-6 max-w-md">
          {isLikelyJioBlocked 
            ? 'Your Jio connection may be blocking the movie database. We have specific solutions for Jio users.'
            : isNetworkError 
            ? 'Unable to connect to the server. This might be due to your internet connection or ISP restrictions.'
            : 'An unexpected error occurred. Please try refreshing the page.'
          }
        </p>

        {isLikelyJioBlocked && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-6 text-sm max-w-md">
            <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Quick Jio Fix:</h3>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-left">
              <li>• Switch to mobile data instead of WiFi</li>
              <li>• Change DNS to 8.8.8.8 and 8.8.4.4</li>
              <li>• Try using a VPN if needed</li>
            </ul>
          </div>
        )}

        {(isNetworkError && !isLikelyJioBlocked) && (
          <div className="bg-muted p-4 rounded-lg mb-6 text-sm text-left max-w-md">
            <h3 className="font-semibold mb-2">Common Solutions:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Check your internet connection</li>
              <li>• Try switching networks (WiFi ↔ Mobile data)</li>
              <li>• Clear browser cache and cookies</li>
              <li>• Disable ad blockers temporarily</li>
            </ul>
          </div>
        )}
        
        <div className="flex gap-3">
          <Button onClick={retry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          
          {isNetworkError && (
            <Button 
              variant="outline" 
              onClick={() => setShowJioHelp(true)}
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Get Help
            </Button>
          )}
        </div>
      </div>

      <JioHelpDialog 
        open={showJioHelp} 
        onOpenChange={setShowJioHelp} 
      />
    </>
  );
}