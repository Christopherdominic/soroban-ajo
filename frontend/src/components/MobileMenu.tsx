'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navLinks } from '@/config/nav'
import { WalletConnector } from './WalletConnector'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname() || ''

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 bg-black/30">
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <button className="mb-6 text-gray-500 hover:text-gray-800" onClick={onClose}>
            ✕ Close
          </button>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`px-3 py-2 rounded-md font-medium flex gap-2 items-center ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="text-gray-800">
          <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
            Profile
          </Link>
          <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">
            Settings
          </Link>
          <div className="block px-4 py-2 hover:bg-gray-100">
            <WalletConnector />
          </div>
        </div>
      </div>
    </div>
  )
}
