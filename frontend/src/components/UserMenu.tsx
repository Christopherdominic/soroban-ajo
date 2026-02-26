'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { WalletConnector } from './WalletConnector'

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-full h-8 w-8 bg-gray-800 hover:bg-gray-600 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-person-circle"
          viewBox="0 0 16 16"
        >
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path
            fillRule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 border rounded-lg shadow-lg py-2 z-50">
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
      )}
    </div>
  )
}
