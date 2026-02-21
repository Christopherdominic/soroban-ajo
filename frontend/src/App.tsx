import { useState } from 'react'
import './App.css'
import { DashboardLayout } from '@/components/DashboardLayout'
import { GroupCreationForm } from '@/components/GroupCreationForm'
import { GroupsList } from '@/components/GroupsList'
import { GroupDetailPage } from '@/components/GroupDetailPage'
import { GroupAnalytics } from '@/components/GroupAnalytics'
import { ResponsiveLayout } from '@/components/ResponsiveLayout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Tutorial } from '@/components/Tutorial'

type ViewType = 'dashboard' | 'create' | 'detail' | 'analytics'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')

  return (
    <>
      <Tutorial />
      <ResponsiveLayout currentView={currentView} onNavigate={(view) => setCurrentView(view as ViewType)}>
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
        </ErrorBoundary>
      </ResponsiveLayout>
    </>
  )
}

export default App
