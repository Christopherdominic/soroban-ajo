import { useState } from 'react'
import './App.css'
import { WalletConnector } from '@/components/WalletConnector'
import { DashboardLayout } from '@/components/DashboardLayout'
import { GroupCreationForm } from '@/components/GroupCreationForm'
import { GroupsList } from '@/components/GroupsList'
import { GroupDetailPage } from '@/components/GroupDetailPage'
import { GroupAnalytics } from '@/components/GroupAnalytics'
import { ResponsiveLayout } from '@/components/ResponsiveLayout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Tutorial } from '@/components/Tutorial'

type ViewType = 'dashboard' | 'create' | 'detail' | 'analytics' | 'responsive'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')

  return (
    <>
      <Tutorial />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navigation */}
        <header className="bg-white shadow sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-blue-600">Soroban Ajo</h1>
                <p className="text-sm text-gray-600">Decentralized Rotational Savings</p>
              </div>
              <WalletConnector />
            </div>
          </nav>
        </header>

        {/* View Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded font-semibold transition ${
                currentView === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('create')}
              className={`px-4 py-2 rounded font-semibold transition ${
                currentView === 'create'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Create Group
            </button>
            <button
              onClick={() => setCurrentView('detail')}
              className={`px-4 py-2 rounded font-semibold transition ${
                currentView === 'detail'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Group Detail (Demo)
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`px-4 py-2 rounded font-semibold transition ${
                currentView === 'analytics'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setCurrentView('responsive')}
              className={`px-4 py-2 rounded font-semibold transition ${
                currentView === 'responsive'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Responsive Demo
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorBoundary>
            {currentView === 'dashboard' && (
              <div className="space-y-8">
                <DashboardLayout />
                <GroupsList groups={[]} />
              </div>
            )}

            {currentView === 'create' && (
              <div className="flex justify-center">
                <GroupCreationForm />
              </div>
            )}

            {currentView === 'detail' && <GroupDetailPage groupId="group-1" />}

            {currentView === 'analytics' && <GroupAnalytics />}

            {currentView === 'responsive' && <ResponsiveLayout />}
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-gray-600 text-center">
              🚀 Frontend placeholder components created for Wave issues #19-35
            </p>
            <p className="text-sm text-gray-500 text-center mt-2">
              See components in src/components/ for implementation details
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App
