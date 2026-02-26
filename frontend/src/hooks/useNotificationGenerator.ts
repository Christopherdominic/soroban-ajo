import { useNotifications } from '@/hooks/useNotifications';

export function useNotificationGenerator() {
  const { addNotification, preferences } = useNotifications();

  const generateContributionDueNotification = (groupName: string, hours: number, groupId: string) => {
    if (!preferences.inApp || !preferences.contributionDue24h) return;

    addNotification({
      type: 'contribution_due',
      title: 'Contribution Due Soon',
      message: `Your contribution to "${groupName}" is due in ${hours} hour${hours > 1 ? 's' : ''}`,
      groupId,
      actionUrl: `/groups/${groupId}`,
    });
  };

  const generateContributionOverdueNotification = (groupName: string, groupId: string) => {
    if (!preferences.inApp || !preferences.contributionOverdue) return;

    addNotification({
      type: 'contribution_overdue',
      title: 'Contribution Overdue',
      message: `Your contribution to "${groupName}" is overdue. Please contribute as soon as possible.`,
      groupId,
      actionUrl: `/groups/${groupId}`,
    });
  };

  const generatePayoutReceivedNotification = (amount: number, groupName: string, groupId: string) => {
    if (!preferences.inApp || !preferences.payoutReceived) return;

    addNotification({
      type: 'payout_received',
      title: 'Payout Received',
      message: `You received ${amount} XLM from "${groupName}"`,
      groupId,
      actionUrl: `/groups/${groupId}`,
    });
  };

  const generateMemberJoinedNotification = (memberName: string, groupName: string, groupId: string) => {
    if (!preferences.inApp || !preferences.memberJoined) return;

    addNotification({
      type: 'member_joined',
      title: 'New Member Joined',
      message: `${memberName} joined "${groupName}"`,
      groupId,
      actionUrl: `/groups/${groupId}`,
    });
  };

  const generateCycleCompletedNotification = (groupName: string, groupId: string) => {
    if (!preferences.inApp || !preferences.cycleCompleted) return;

    addNotification({
      type: 'cycle_completed',
      title: 'Cycle Completed',
      message: `"${groupName}" has completed a savings cycle`,
      groupId,
      actionUrl: `/groups/${groupId}`,
    });
  };

  const generateAnnouncementNotification = (title: string, message: string, groupId?: string) => {
    if (!preferences.inApp || !preferences.announcements) return;

    addNotification({
      type: 'announcement',
      title,
      message,
      groupId,
      actionUrl: groupId ? `/groups/${groupId}` : undefined,
    });
  };

  return {
    generateContributionDueNotification,
    generateContributionOverdueNotification,
    generatePayoutReceivedNotification,
    generateMemberJoinedNotification,
    generateCycleCompletedNotification,
    generateAnnouncementNotification,
  };
}
