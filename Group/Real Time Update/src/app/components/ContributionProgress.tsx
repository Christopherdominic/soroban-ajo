import { Progress } from './ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, Users, Coins } from 'lucide-react';

interface ContributionProgressProps {
  totalContributed: string;
  totalRequired: string;
  contributionAmount: string;
  currentMembers: number;
  totalMembers: number;
  membersContributed?: number;
}

export function ContributionProgress({
  totalContributed,
  totalRequired,
  contributionAmount,
  currentMembers,
  totalMembers,
  membersContributed = 0,
}: ContributionProgressProps) {
  const contributed = parseFloat(totalContributed);
  const required = parseFloat(totalRequired);
  const progressPercentage = required > 0 ? Math.min((contributed / required) * 100, 100) : 0;
  const remaining = Math.max(required - contributed, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Contribution Progress
        </CardTitle>
        <CardDescription>
          Current cycle contribution status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {contributed.toFixed(2)} / {required.toFixed(2)} ETH
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progressPercentage.toFixed(1)}% Complete</span>
            <span>{remaining.toFixed(2)} ETH Remaining</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1 rounded-lg border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Members Contributed</span>
            </div>
            <div className="text-2xl font-bold">
              {membersContributed} / {currentMembers}
            </div>
          </div>

          <div className="space-y-1 rounded-lg border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coins className="h-4 w-4" />
              <span>Per Member</span>
            </div>
            <div className="text-2xl font-bold">
              {parseFloat(contributionAmount).toFixed(2)} ETH
            </div>
          </div>
        </div>

        {/* Status Message */}
        {progressPercentage === 100 ? (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
            ✓ Cycle goal reached! Payout will be processed at cycle end.
          </div>
        ) : progressPercentage >= 75 ? (
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            Almost there! {currentMembers - membersContributed} members still need to contribute.
          </div>
        ) : (
          <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
            Waiting for more contributions to reach the cycle goal.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
