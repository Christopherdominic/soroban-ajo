import React from 'react'
import { CommunityLinks } from '@/components/CommunityLinks'

export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Hub</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join the conversation, shape the future of Soroban Ajo, and connect with other members.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Governance Forum Card */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start">
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Governance Forum</h2>
          <p className="text-gray-600 mb-6 flex-grow">
            Participate in decision-making processes, propose new features, and vote on protocol upgrades.
          </p>
          <a href="#" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 mt-auto">
            Go to Forum <span className="ml-2">→</span>
          </a>
        </div>

        {/* Discord Community Card */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start">
           <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Discord Server</h2>
          <p className="text-gray-600 mb-6 flex-grow">
            Chat with developers, get support, and hang out with the community in real-time.
          </p>
          <a href="#" className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 mt-auto">
            Join Server <span className="ml-2">→</span>
          </a>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Connect on Social Media</h2>
        <div className="flex justify-center">
          <CommunityLinks />
        </div>
      </div>
    </div>
  )
}
