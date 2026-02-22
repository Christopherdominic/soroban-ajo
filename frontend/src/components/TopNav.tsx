'use client'

import { useState } from 'react'
import Link from 'next/link'
import { navLinks } from '@/config/nav'
import { usePathname } from 'next/navigation'
import { UserMenu } from './UserMenu'
import { MobileMenu } from './MobileMenu'
import Image from 'next/image'
import { useTheme } from 'next-themes'

export const TopNav: React.FC = () => {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme } = useTheme()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 flex items-center gap-3">
                <Image
                  src={theme === 'dark' ? '/logo-light.svg' : '/logo.svg'}
                  alt="Soroban Ajo Logo"
                  width={150}
                  height={40}
                  priority
                  className="h-10 w-auto"
                />
              Decentralized Rotational Savings
            </Link>
          </div>

          <div className="flex items-center gap-4">
              
              <div className="hidden sm:block">
              </div>
            </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-2 items-center">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1 px-4 py-2 rounded-md font-medium text-sm transition ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <UserMenu />
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileOpen(true)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}
