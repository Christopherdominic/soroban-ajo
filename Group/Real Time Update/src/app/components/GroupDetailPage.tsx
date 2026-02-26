import { useState, useEffect } from 'react';
import { useGroupDetail } from '../../hooks/useGroupDetail';
import { useRealTimeUpdates } from '../../hooks/useRealTimeUpdates';
import { useWallet } from '../../hooks/useWallet';
import { walletService } from '../../services/wallet';
import { ROSCA_GROUP_ABI } from '../../config/contracts';
import { ContributionProgress } from './ContributionProgress';
import { CycleCountdown } from './CycleCountdown';
import { ActivityFeed } from './ActivityFeed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Share2, 
  Users, 
  Wallet, 
  Info, 
  RefreshCw, 
  Copy,
  Check,
  ExternalLink,
  Crown,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

interface GroupDetailPageProps {
  groupId: string;
}

export function GroupDetailPage({ groupId }: GroupDetailPageProps) {
  const { groupData, transactions, loading, error, refetch } = useGroupDetail(groupId);
  const { isConnected, address, connect } = useWallet();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Real-time updates every 30 seconds
  useRealTimeUpdates({
    enabled: true,
    interval: 30000,
    onUpdate: refetch,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    toast.success('Group data refreshed');
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: groupData?.name || 'Join my savings group',
        text: groupData?.description || 'Check out this savings group',
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Link copied to clipboard');
    }
  };

  const handleCopyAddress = () => {
    if (groupData?.contractAddress) {
      navigator.clipboard.writeText(groupData.contractAddress);
      toast.success('Contract address copied');
    }
  };

  const handleContribute = async () => {
    if (!isConnected) {
      try {
        await connect();
        toast.info('Please try contributing again after connecting');
      } catch (error) {
        toast.error('Failed to connect wallet');
      }
      return;
    }

    if (!groupData) return;

    // Check if user has already contributed this cycle
    const userMember = groupData.members.find(
      m => m.address.toLowerCase() === address?.toLowerCase()
    );

    if (userMember?.hasContributedThisCycle) {
      toast.warning('You have already contributed this cycle');
      return;
    }

    setIsContributing(true);
    
    try {
      const txHash = await walletService.contribute(
        groupData.contractAddress,
        ROSCA_GROUP_ABI,
        groupData.contributionAmount
      );
      
      toast.success('Contribution submitted!', {
        description: `Transaction: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
        action: {
          label: 'View',
          onClick: () => window.open(`https://etherscan.io/tx/${txHash}`, '_blank'),
        },
      });

      // Wait a bit then refresh data
      setTimeout(() => {
        refetch();
      }, 3000);
    } catch (error) {
      console.error('Contribution error:', error);
      toast.error('Failed to contribute', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setIsContributing(false);
    }
  };

  if (loading) {
    return <GroupDetailPageSkeleton />;
  }

  if (error || !groupData) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error || 'Failed to load group data. Please try again.'}
          </AlertDescription>
        </Alert>
        <Button onClick={refetch} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  const membersContributed = groupData.members.filter(m => m.hasContributedThisCycle).length;
  const shareUrl = window.location.href;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold">{groupData.name}</h1>
            <Badge variant={groupData.status === 'active' ? 'default' : 'secondary'}>
              {groupData.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{groupData.description}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <code className="rounded bg-muted px-2 py-1 text-xs">
              {groupData.contractAddress.slice(0, 10)}...{groupData.contractAddress.slice(-8)}
            </code>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={handleCopyAddress}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <a
              href={`https://etherscan.io/address/${groupData.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              View on Etherscan
            </a>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Group</DialogTitle>
                <DialogDescription>
                  Share this group with others to invite them to join
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-center p-6 bg-white rounded-lg">
                  <QRCode value={shareUrl} size={200} />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                  />
                  <Button onClick={handleShare}>
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={handleContribute} disabled={isContributing}>
            <Wallet className="mr-2 h-4 w-4" />
            Contribute
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Progress & Countdown */}
        <div className="space-y-6 lg:col-span-2">
          <ContributionProgress
            totalContributed={groupData.totalContributed}
            totalRequired={groupData.totalRequired}
            contributionAmount={groupData.contributionAmount}
            currentMembers={groupData.currentMembers}
            totalMembers={groupData.totalMembers}
            membersContributed={membersContributed}
          />

          <CycleCountdown
            nextCycleTime={groupData.nextCycleTime}
            currentCycle={groupData.currentCycle}
            totalCycles={groupData.totalCycles}
          />

          <ActivityFeed transactions={transactions} />
        </div>

        {/* Right Column - Members & Info */}
        <div className="space-y-6">
          {/* Members Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Members ({groupData.currentMembers}/{groupData.totalMembers})
              </CardTitle>
              <CardDescription>
                Group members and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="contributed" className="flex-1">Paid</TabsTrigger>
                  <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-3 mt-4">
                  {groupData.members.map((member, index) => (
                    <MemberCard 
                      key={member.address} 
                      member={member} 
                      isCreator={index === 0}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="contributed" className="space-y-3 mt-4">
                  {groupData.members
                    .filter(m => m.hasContributedThisCycle)
                    .map((member, index) => (
                      <MemberCard 
                        key={member.address} 
                        member={member}
                        isCreator={index === 0}
                      />
                    ))}
                </TabsContent>

                <TabsContent value="pending" className="space-y-3 mt-4">
                  {groupData.members
                    .filter(m => !m.hasContributedThisCycle)
                    .map((member, index) => (
                      <MemberCard 
                        key={member.address} 
                        member={member}
                        isCreator={index === 0}
                      />
                    ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Group Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Group Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contribution Amount</span>
                <span className="font-medium">{groupData.contributionAmount} ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cycle Length</span>
                <span className="font-medium">
                  {Math.floor(groupData.cycleLength / 86400)} days
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Cycles</span>
                <span className="font-medium">{groupData.totalCycles}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Cycle</span>
                <span className="font-medium">{groupData.currentCycle}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Pool</span>
                <span className="font-medium">
                  {(parseFloat(groupData.contributionAmount) * groupData.currentMembers).toFixed(2)} ETH
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MemberCard({ 
  member, 
  isCreator 
}: { 
  member: any; 
  isCreator: boolean;
}) {
  const shortAddress = `${member.address.slice(0, 6)}...${member.address.slice(-4)}`;
  
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <Avatar>
        <AvatarFallback>
          {member.nickname?.[0]?.toUpperCase() || member.address.slice(2, 4).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">
            {member.nickname || shortAddress}
          </p>
          {isCreator && (
            <Crown className="h-3 w-3 text-amber-500" />
          )}
          {member.isRecipientThisCycle && (
            <Badge variant="secondary" className="text-xs">
              Recipient
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {member.totalContributions} ETH contributed
        </p>
      </div>

      {member.hasContributedThisCycle ? (
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      )}
    </div>
  );
}

function GroupDetailPageSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}