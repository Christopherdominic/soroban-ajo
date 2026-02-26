import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Clock, Calendar } from 'lucide-react';

interface CycleCountdownProps {
  nextCycleTime: number; // Unix timestamp in seconds
  currentCycle: number;
  totalCycles: number;
}

export function CycleCountdown({
  nextCycleTime,
  currentCycle,
  totalCycles,
}: CycleCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Date.now() / 1000; // Current time in seconds
      const diff = nextCycleTime - now;

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (24 * 60 * 60));
      const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((diff % (60 * 60)) / 60);
      const seconds = Math.floor(diff % 60);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [nextCycleTime]);

  const nextCycleDate = new Date(nextCycleTime * 1000);
  const isEndingSoon = timeRemaining.days === 0 && timeRemaining.hours < 24;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Cycle Countdown
        </CardTitle>
        <CardDescription>
          Time remaining until next cycle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center rounded-lg border bg-muted/50 p-3">
            <span className="text-3xl font-bold tabular-nums">
              {String(timeRemaining.days).padStart(2, '0')}
            </span>
            <span className="text-xs text-muted-foreground uppercase">Days</span>
          </div>
          <div className="flex flex-col items-center rounded-lg border bg-muted/50 p-3">
            <span className="text-3xl font-bold tabular-nums">
              {String(timeRemaining.hours).padStart(2, '0')}
            </span>
            <span className="text-xs text-muted-foreground uppercase">Hours</span>
          </div>
          <div className="flex flex-col items-center rounded-lg border bg-muted/50 p-3">
            <span className="text-3xl font-bold tabular-nums">
              {String(timeRemaining.minutes).padStart(2, '0')}
            </span>
            <span className="text-xs text-muted-foreground uppercase">Mins</span>
          </div>
          <div className="flex flex-col items-center rounded-lg border bg-muted/50 p-3">
            <span className="text-3xl font-bold tabular-nums">
              {String(timeRemaining.seconds).padStart(2, '0')}
            </span>
            <span className="text-xs text-muted-foreground uppercase">Secs</span>
          </div>
        </div>

        {/* Next Cycle Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Next Cycle Starts</span>
            </div>
            <span className="font-medium">
              {nextCycleDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm text-muted-foreground">Cycle Progress</span>
            <span className="font-medium">
              Cycle {currentCycle} of {totalCycles}
            </span>
          </div>
        </div>

        {/* Warning for ending soon */}
        {isEndingSoon && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
            ⚠️ Cycle ending soon! Make sure you've contributed before the deadline.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
