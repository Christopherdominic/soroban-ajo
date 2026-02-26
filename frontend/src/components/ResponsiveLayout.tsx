// Issue #34: Implement mobile-responsive design
// Complexity: High (200 pts)
// Status: Complete
'use client'
import React, { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { TopNav } from './TopNav'

interface ResponsiveLayoutProps {
  children: ReactNode
  currentView?: string
  onNavigate?: (view: string) => void
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  currentView,
  onNavigate,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <TopNav />
      {/* Main Layout with Sidebar */}
      <div className="flex flex-1">
        <Sidebar currentView={currentView} onNavigate={onNavigate} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
