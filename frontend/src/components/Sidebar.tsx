// Issue #20: Global layout shell - Sidebar component
// Complexity: Trivial (100 pts)

import React from 'react'

interface SidebarProps {
  currentView?: string
  onNavigate?: (view: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'create', label: 'Create Group', icon: '➕' },
    { id: 'detail', label: 'My Groups', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ]

  return (
    <aside className="hidden lg:block w-64 bg-white shadow-sm h-full">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate?.(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
              currentView === item.id
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
