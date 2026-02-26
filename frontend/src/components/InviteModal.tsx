'use client';

import { useState } from 'react';
import { generateInviteLink, copyToClipboard } from '@/utils/shareUtils';
import QRCodeGenerator from './QRCodeGenerator';
import ShareButtons from './ShareButtons';
import toast from 'react-hot-toast';

interface InviteModalProps {
  groupId: string;
  groupName: string;
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export default function InviteModal({
  groupId,
  groupName,
  isOpen,
  onClose,
  userEmail,
}: InviteModalProps) {
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'social'>('link');
  const inviteLink = generateInviteLink(groupId);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(inviteLink);
    if (success) {
      toast.success('Link copied to clipboard!');
    } else {
      toast.error('Failed to copy link');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Invite Members
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Share {groupName} with others
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-500"
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
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('link')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'link'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Link
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'qr'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              QR Code
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'social'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Social
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Invitation Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  >
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
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      How it works
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Share this link with anyone you want to invite. They&apos;ll
                      see a preview of the group and can join with one click.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="flex flex-col items-center py-6">
              <QRCodeGenerator value={inviteLink} size={256} />
              <button
                onClick={handleCopyLink}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Copy Link
              </button>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share this group on your favorite platform
              </p>
              <ShareButtons
                groupName={groupName}
                inviteLink={inviteLink}
                email={userEmail}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>
              Invitation links are secure and can only be used to join this
              group
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
