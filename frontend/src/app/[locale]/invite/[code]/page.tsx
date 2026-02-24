'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseInviteCode } from '@/utils/shareUtils';
import { useInvitations } from '@/hooks/useInvitations';
import { useAuth } from '@/hooks/useAuth';

interface PageProps {
  params: {
    code: string;
  };
}

export default function InvitePage({ params }: PageProps) {
  const router = useRouter();
  const { code } = params;
  const { isAuthenticated } = useAuth();
  const { addInvitation, updateInvitationStatus } = useInvitations();
  const [groupInfo, setGroupInfo] = useState<{
    id: string;
    name: string;
    members: number;
    contributionAmount: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGroupInfo = async () => {
      try {
        const parsed = parseInviteCode(code);
        if (!parsed) {
          setError('Invalid invitation link');
          setLoading(false);
          return;
        }

        // In a real app, fetch group info from API
        // For now, simulate with mock data
        setGroupInfo({
          id: parsed.groupId,
          name: 'Sample Savings Group',
          members: 5,
          contributionAmount: '100 XLM',
        });

        // Track invitation
        addInvitation({
          id: code,
          groupId: parsed.groupId,
          groupName: 'Sample Savings Group',
          invitedBy: 'unknown',
          invitedAt: Date.now(),
          status: 'pending',
          inviteCode: code,
        });

        setLoading(false);
      } catch (err) {
        setError('Failed to load group information');
        setLoading(false);
      }
    };

    loadGroupInfo();
  }, [code, addInvitation]);

  const handleJoinGroup = () => {
    if (!isAuthenticated) {
      // Redirect to connect wallet first
      router.push(`/dashboard?invite=${code}`);
      return;
    }

    if (groupInfo) {
      updateInvitationStatus(code, 'accepted');
      router.push(`/groups/${groupInfo.id}`);
    }
  };

  const handleDecline = () => {
    updateInvitationStatus(code, 'declined');
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !groupInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Invitation
          </h1>
          <p className="text-gray-600 mb-6">
            {error || 'This invitation link is invalid or has expired.'}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">You&apos;re Invited!</h1>
          <p className="text-blue-100">
            Join a savings group on Ajo
          </p>
        </div>

        {/* Group Info */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {groupInfo.name}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span className="text-sm">Members</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {groupInfo.members}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm">Contribution</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {groupInfo.contributionAmount}
                </p>
              </div>
            </div>
          </div>

          {/* What is Ajo */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What is Ajo?</h3>
            <p className="text-sm text-blue-800">
              Ajo is a decentralized savings group platform powered by Stellar
              blockchain. Members contribute a fixed amount each cycle, and one
              member receives the full pool each round until everyone has been
              paid out.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleJoinGroup}
              className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {isAuthenticated ? 'Join Group' : 'Connect Wallet & Join'}
            </button>
            <button
              onClick={handleDecline}
              className="px-6 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Decline
            </button>
          </div>

          {!isAuthenticated && (
            <p className="text-sm text-gray-600 text-center mt-4">
              You&apos;ll need to connect your Freighter wallet to join
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
