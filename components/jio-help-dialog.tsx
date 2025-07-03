'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, Smartphone, Shield, RotateCcw, Network, X } from 'lucide-react';
import { JioDetector } from '@/lib/utils/jio-detector';

interface JioHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JioHelpDialog({ open, onOpenChange }: JioHelpDialogProps) {
  const [isJioDetected, setIsJioDetected] = useState(false);

  useEffect(() => {
    setIsJioDetected(JioDetector.isJioNetwork());
  }, []);

  const solutions = [
    {
      icon: Network,
      title: 'Change DNS Settings',
      description: 'Set DNS to 8.8.8.8 and 8.8.4.4 in your WiFi settings',
      steps: [
        'Go to WiFi Settings → Advanced → DNS',
        'Set Primary DNS: 8.8.8.8',
        'Set Secondary DNS: 8.8.4.4',
        'Restart your connection'
      ]
    },
    {
      icon: Smartphone,
      title: 'Switch to Mobile Data',
      description: 'Jio mobile data often works better than WiFi',
      steps: [
        'Turn off WiFi',
        'Enable mobile data',
        'Refresh the page',
        'Try accessing the content again'
      ]
    },
    {
      icon: Shield,
      title: 'Use VPN (if needed)',
      description: 'A VPN can bypass ISP restrictions',
      steps: [
        'Download Cloudflare WARP (free)',
        'Enable the VPN connection',
        'Refresh the page',
        'Content should load normally'
      ]
    },
    {
      icon: RotateCcw,
      title: 'Clear Browser Data',
      description: 'Fresh browser data can resolve connection issues',
      steps: [
        'Clear browser cache and cookies',
        'Restart your browser completely',
        'Try accessing the site again',
        'Check if the issue is resolved'
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Connection Issues? We Can Help!
          </DialogTitle>
          <DialogDescription>
            {isJioDetected 
              ? "We've detected you might be using Jio network. Here are specific solutions:"
              : "Having trouble loading content? Try these solutions:"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isJioDetected && (
            <Alert>
              <Wifi className="h-4 w-4" />
              <AlertDescription>
                <strong>Jio Network Detected:</strong> Some Jio connections may have restrictions. 
                The solutions below are specifically tested for Jio users.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            {solutions.map((solution, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <solution.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{solution.title}</h3>
                    <p className="text-sm text-muted-foreground">{solution.description}</p>
                  </div>
                </div>
                <div className="ml-11 space-y-1">
                  {solution.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-2 text-sm">
                      <span className="text-primary font-medium min-w-[20px]">{stepIndex + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Alert>
            <AlertDescription>
              <strong>Still having issues?</strong> These problems are usually related to ISP restrictions. 
              Using a VPN or switching networks typically resolves the issue immediately.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}