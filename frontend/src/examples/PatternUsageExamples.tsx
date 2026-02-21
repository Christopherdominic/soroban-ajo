import React from 'react'
import { BrandedSection, BrandedCard, BrandedHero } from '@/components/BrandedSection'

/**
 * Pattern Usage Examples
 * 
 * This file demonstrates practical usage of brand patterns in real components.
 * Copy these examples to quickly implement branded designs in your features.
 */

// Example 1: Landing Page Hero
export const LandingPageHero: React.FC = () => {
  return (
    <BrandedHero
      title="Welcome to Soroban Ajo"
      subtitle="Decentralized Rotational Savings on Stellar"
    >
      <div className="flex gap-4 justify-center">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Get Started
        </button>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
          Learn More
        </button>
      </div>
    </BrandedHero>
  )
}

// Example 2: Feature Section with Grid Pattern
export const FeatureSection: React.FC = () => {
  return (
    <BrandedSection pattern="grid" className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BrandedCard variant="pattern">
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure</h3>
              <p className="text-gray-600">
                Built on Stellar blockchain with smart contract security
              </p>
            </div>
          </BrandedCard>
          
          <BrandedCard variant="gradient">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast</h3>
              <p className="text-gray-600">
                Lightning-fast transactions with low fees
              </p>
            </div>
          </BrandedCard>
          
          <BrandedCard variant="mesh">
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Global</h3>
              <p className="text-gray-600">
                Access from anywhere in the world
              </p>
            </div>
          </BrandedCard>
        </div>
      </div>
    </BrandedSection>
  )
}

// Example 3: Stats Section with Mesh Pattern
export const StatsSection: React.FC = () => {
  return (
    <BrandedSection pattern="mesh" className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">1,234</div>
            <div className="text-gray-600">Active Groups</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl font-bold text-purple-600 mb-2">5,678</div>
            <div className="text-gray-600">Total Members</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl font-bold text-cyan-600 mb-2">$2.5M</div>
            <div className="text-gray-600">Total Savings</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>
    </BrandedSection>
  )
}

// Example 4: CTA Section with Animated Gradient
export const CTASection: React.FC = () => {
  return (
    <section className="bg-animated-gradient py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to Start Saving?
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Join thousands of users already saving with Soroban Ajo
        </p>
        <button className="bg-white text-blue-600 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg">
          Create Your First Group
        </button>
      </div>
    </section>
  )
}

// Example 5: Testimonial Section with Constellation Pattern
export const TestimonialSection: React.FC = () => {
  return (
    <BrandedSection pattern="constellation" className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <p className="text-gray-700 mb-4 italic">
              "Soroban Ajo has transformed how our community saves together. 
              The transparency and security of blockchain gives us peace of mind."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3">
                JD
              </div>
              <div>
                <div className="font-semibold text-gray-900">John Doe</div>
                <div className="text-sm text-gray-600">Group Organizer</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <p className="text-gray-700 mb-4 italic">
              "The best rotational savings platform I've used. Simple, secure, 
              and the Stellar integration makes transactions incredibly fast."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold mr-3">
                JS
              </div>
              <div>
                <div className="font-semibold text-gray-900">Jane Smith</div>
                <div className="text-sm text-gray-600">Active Member</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrandedSection>
  )
}

// Example 6: Footer with Wave Pattern
export const BrandedFooter: React.FC = () => {
  return (
    <footer className="pattern-waves bg-gray-50 pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Soroban Ajo</h3>
            <p className="text-gray-600 text-sm">
              Decentralized rotational savings on the Stellar blockchain.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600">Features</a></li>
              <li><a href="#" className="hover:text-blue-600">How It Works</a></li>
              <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-600">API</a></li>
              <li><a href="#" className="hover:text-blue-600">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600">About</a></li>
              <li><a href="#" className="hover:text-blue-600">Blog</a></li>
              <li><a href="#" className="hover:text-blue-600">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 Soroban Ajo. Built on Stellar.</p>
        </div>
      </div>
    </footer>
  )
}

// Example 7: Dashboard with Floating Cards
export const DashboardWithPatterns: React.FC = () => {
  return (
    <div className="min-h-screen pattern-overlay-grid">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="gradient-mesh-1 bg-white rounded-lg p-6 shadow-lg bg-float">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Contributions
            </h3>
            <p className="text-3xl font-bold text-blue-600">$12,450</p>
            <p className="text-sm text-gray-600 mt-2">+12% from last month</p>
          </div>
          
          <div className="gradient-mesh-2 bg-white rounded-lg p-6 shadow-lg bg-float">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Active Groups
            </h3>
            <p className="text-3xl font-bold text-purple-600">8</p>
            <p className="text-sm text-gray-600 mt-2">2 pending payouts</p>
          </div>
          
          <div className="card-pattern bg-white rounded-lg p-6 shadow-lg bg-float">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Next Payout
            </h3>
            <p className="text-3xl font-bold text-cyan-600">5 days</p>
            <p className="text-sm text-gray-600 mt-2">Group Alpha</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Complete Page Example
export const CompletePatternExample: React.FC = () => {
  return (
    <div>
      <LandingPageHero />
      <FeatureSection />
      <StatsSection />
      <TestimonialSection />
      <CTASection />
      <BrandedFooter />
    </div>
  )
}
