import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Activity, ArrowUpRight, ArrowDownRight, UserPlus, CheckCircle } from 'lucide-react';
import { Transaction } from '../../types/group';

interface ActivityFeedProps {
  transactions: Transaction[];
  maxItems?: number;
}

export function ActivityFeed({ transactions, maxItems = 10 }: ActivityFeedProps) {
  const recentTransactions = transactions.slice(0, maxItems);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'payout':
        return <ArrowDownRight className="h-4 w-4 text-blue-500" />;
      case 'join':
        return <UserPlus className="h-4 w-4 text-purple-500" />;
      case 'create':
        return <CheckCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityMessage = (tx: Transaction) => {
    const shortAddress = (addr: string) => 
      `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    switch (tx.type) {
      case 'contribution':
        return (
          <>
            <span className="font-medium">{shortAddress(tx.from)}</span>
            {' contributed '}
            <span className="font-medium">{tx.amount} ETH</span>
          </>
        );
      case 'payout':
        return (
          <>
            <span className="font-medium">{shortAddress(tx.to || '')}</span>
            {' received payout of '}
            <span className="font-medium">{tx.amount} ETH</span>
          </>
        );
      case 'join':
        return (
          <>
            <span className="font-medium">{shortAddress(tx.from)}</span>
            {' joined the group'}
          </>
        );
      case 'create':
        return (
          <>
            Group created by{' '}
            <span className="font-medium">{shortAddress(tx.from)}</span>
          </>
        );
      default:
        return 'Unknown activity';
    }
  };

  const getRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Latest transactions and member activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Activity className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No activity yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  {/* Icon */}
                  <div className="mt-1 rounded-full bg-muted p-2">
                    {getActivityIcon(tx.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm leading-relaxed">
                      {getActivityMessage(tx)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{getRelativeTime(tx.timestamp)}</span>
                      <span>•</span>
                      <a
                        href={`https://etherscan.io/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        View tx
                      </a>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0">
                    {getStatusBadge(tx.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
