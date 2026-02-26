import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
  isPolling: boolean;
  lastUpdate?: Date;
}

export function ConnectionStatus({ isPolling, lastUpdate }: ConnectionStatusProps) {
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>('');

  useEffect(() => {
    if (!lastUpdate) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = now - lastUpdate.getTime();
      
      const seconds = Math.floor(diff / 1000);
      
      if (seconds < 60) {
        setTimeSinceUpdate(`${seconds}s ago`);
      } else {
        const minutes = Math.floor(seconds / 60);
        setTimeSinceUpdate(`${minutes}m ago`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  return (
    <Badge 
      variant={isPolling ? "default" : "secondary"}
      className="gap-1.5"
    >
      {isPolling ? (
        <>
          <RefreshCw className="h-3 w-3 animate-spin" />
          <span>Syncing...</span>
        </>
      ) : (
        <>
          <Wifi className="h-3 w-3" />
          <span>Live{timeSinceUpdate ? ` • ${timeSinceUpdate}` : ''}</span>
        </>
      )}
    </Badge>
  );
}
