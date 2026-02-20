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
import { ThemeToggle } from '@/components/ThemeToggle'

type ViewType = 'dashboard' | 'create' | 'detail' | 'analytics' | 'responsive'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')

  return (
    <>
      <Tutorial />
      <div className="min-h-screen app-shell">
        {/* Navigation */}
        <header className="app-header sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold app-title">Soroban Ajo</h1>
                <p className="text-sm app-subtitle">Decentralized Rotational Savings</p>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <WalletConnector />
              </div>
            </div>
          </nav>
        </header>

        {/* View Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`nav-btn ${currentView === 'dashboard' ? 'nav-btn-active' : ''}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('create')}
              className={`nav-btn ${currentView === 'create' ? 'nav-btn-active' : ''}`}
            >
              Create Group
            </button>
            <button
              onClick={() => setCurrentView('detail')}
              className={`nav-btn ${currentView === 'detail' ? 'nav-btn-active' : ''}`}
            >
              Group Detail (Demo)
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`nav-btn ${currentView === 'analytics' ? 'nav-btn-active' : ''}`}
            >
              Analytics
            </button>
            <button
              onClick={() => setCurrentView('responsive')}
              className={`nav-btn ${currentView === 'responsive' ? 'nav-btn-active' : ''}`}
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
        <footer className="app-footer mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center app-subtitle">
              🚀 Frontend placeholder components created for Wave issues #19-35
            </p>
            <p className="text-sm text-center mt-2 app-subtitle">
              See components in src/components/ for implementation details
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App
