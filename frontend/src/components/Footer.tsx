// Issue #20: Global layout shell - Footer component
// Complexity: Trivial (100 pts)

import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Soroban Ajo</h3>
            <p className="text-sm text-gray-600">
              Decentralized rotational savings on Stellar blockchain
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-600">GitHub</a></li>
              <li><a href="#" className="hover:text-blue-600">Support</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Community</h3>
            <p className="text-sm text-gray-600">
              Built with ❤️ for financial inclusion on Stellar
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
          <p>© 2026 Soroban Ajo. MIT License.</p>
        </div>
      </div>
    </footer>
  )
}
