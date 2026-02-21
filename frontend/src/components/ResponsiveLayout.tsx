// Issue #34: Implement mobile-responsive design
// Complexity: High (200 pts)
// Status: Complete

import React, { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { MobileNav } from './MobileNav'

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
      {/* Header with Mobile Nav */}
      <div className="relative">
        <Header currentView={currentView} onNavigate={onNavigate} />
        <div className="absolute top-4 left-4 lg:hidden">
          <MobileNav currentView={currentView} onNavigate={onNavigate} />
        </div>
      </div>

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
