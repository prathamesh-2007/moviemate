'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, AlertTriangle } from 'lucide-react';

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
  const isNetworkError = error?.message.includes('fetch') || 
                        error?.message.includes('network') ||
                        error?.message.includes('Failed to fetch');

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="mb-6">
        {isNetworkError ? (
          <Wifi className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        ) : (
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
        )}
      </div>
      
      <h2 className="text-2xl font-bold mb-4">
        {isNetworkError ? 'Connection Issue' : 'Something went wrong'}
      </h2>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        {isNetworkError 
          ? 'Unable to connect to the server. This might be due to your internet connection or ISP restrictions. Please try again or check your network settings.'
          : 'An unexpected error occurred. Please try refreshing the page.'
        }
      </p>

      {isNetworkError && (
        <div className="bg-muted p-4 rounded-lg mb-6 text-sm text-left max-w-md">
          <h3 className="font-semibold mb-2">For Jio users:</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Try switching to mobile data if on WiFi</li>
            <li>• Change DNS to 8.8.8.8 and 8.8.4.4</li>
            <li>• Use a VPN if the issue persists</li>
          </ul>
        </div>
      )}
      
      <Button onClick={retry} className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}