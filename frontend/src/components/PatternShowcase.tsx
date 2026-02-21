import React from 'react'

/**
 * PatternShowcase Component
 * 
 * Demonstrates all available brand patterns and background textures
 * for the Soroban Ajo application.
 */
export const PatternShowcase: React.FC = () => {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Brand Patterns & Textures</h1>
        <p className="text-gray-600">Explore all available background patterns and gradients</p>
      </div>

      {/* SVG Patterns */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">SVG Patterns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 pattern-mesh"></div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-gray-900">Stellar Mesh</h3>
              <p className="text-sm text-gray-600 mt-1">Soft gradient circles</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                className="pattern-mesh"
              </code>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 pattern-constellation bg-white"></div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-gray-900">Constellation</h3>
              <p className="text-sm text-gray-600 mt-1">Connected stars pattern</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                className="pattern-constellation"
              </code>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 pattern-grid bg-white"></div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-gray-900">Dot Grid</h3>
              <p className="text-sm text-gray-600 mt-1">Subtle repeating dots</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                className="pattern-grid"
              </code>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 pattern-hexagon bg-white"></div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-gray-900">Hexagon Grid</h3>
              <p className="text-sm text-gray-600 mt-1">Geometric hexagons</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                className="pattern-hexagon"
              </code>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 pattern-waves bg-white"></div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-gray-900">Wave Pattern</h3>
              <p className="text-sm text-gray-600 mt-1">Flowing wave layers</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                className="pattern-waves"
              </code>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 pattern-overlay-constellation"></div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-gray-900">Overlay Constellation</h3>
              <p className="text-sm text-gray-600 mt-1">With background color</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                className="pattern-overlay-constellation"
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Gradients */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">CSS Gradients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 gradient-stellar"></div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-gray-900">Stellar Gradient</h3>
              <p className="text-sm text-gray-600 mt-1">Bold brand colors</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                className="gradient-stellar"
              </code>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 gradient-stellar-soft"></div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-gray-900">Soft Gradient</h3>
              <p className="text-sm text-gray-600 mt-1">Subtle brand colors</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                className="gradient-stellar-soft"
              </code>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 gradient-radial-stellar bg-white"></div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-gray-900">Radial Gradient</h3>
              <p className="text-sm text-gray-600 mt-1">Center-focused glow</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                className="gradient-radial-stellar"
              </code>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 gradient-mesh-1 bg-white"></div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-gray-900">Mesh Gradient 1</h3>
              <p className="text-sm text-gray-600 mt-1">Corner radial blend</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                className="gradient-mesh-1"
              </code>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 gradient-mesh-2 bg-white"></div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-gray-900">Mesh Gradient 2</h3>
              <p className="text-sm text-gray-600 mt-1">Multi-point radial</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                className="gradient-mesh-2"
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Backgrounds */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Animated Backgrounds</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 bg-animated-gradient"></div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-gray-900">Animated Gradient</h3>
              <p className="text-sm text-gray-600 mt-1">Shifting color gradient</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                className="bg-animated-gradient"
              </code>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 gradient-stellar-soft bg-animated-pulse"></div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-gray-900">Pulse Glow</h3>
              <p className="text-sm text-gray-600 mt-1">Breathing effect</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                className="bg-animated-pulse"
              </code>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 hero-stellar flex items-center justify-center">
              <span className="text-white font-bold text-xl">Hero Section</span>
            </div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-gray-900">Hero Stellar</h3>
              <p className="text-sm text-gray-600 mt-1">Rotating background</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                className="hero-stellar"
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Usage Examples</h2>
        <div className="space-y-6">
          
          {/* Card with pattern */}
          <div className="card-pattern bg-white rounded-lg p-6 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Card with Pattern Background</h3>
            <p className="text-gray-600">
              This card uses the card-pattern class to add a subtle grid overlay.
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              className="card-pattern"
            </code>
          </div>

          {/* Combined pattern + gradient */}
          <div className="pattern-overlay-mesh rounded-lg p-6 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Combined Pattern + Gradient</h3>
            <p className="text-gray-600">
              Mesh pattern with gradient overlay for rich visual depth.
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              className="pattern-overlay-mesh"
            </code>
          </div>

          {/* Floating card */}
          <div className="gradient-mesh-1 rounded-lg p-6 shadow-lg bg-float">
            <h3 className="font-semibold text-gray-900 mb-2">Floating Animation</h3>
            <p className="text-gray-600">
              Subtle floating effect for interactive elements.
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              className="bg-float"
            </code>
          </div>
        </div>
      </section>

      {/* Tailwind Config Usage */}
      <section className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tailwind Config Usage</h2>
        <p className="text-gray-600 mb-4">
          You can also use these patterns directly in Tailwind classes:
        </p>
        <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 rounded">
          <div>bg-pattern-mesh</div>
          <div>bg-pattern-constellation</div>
          <div>bg-pattern-grid</div>
          <div>bg-pattern-hexagon</div>
          <div>bg-pattern-waves</div>
          <div>bg-gradient-stellar</div>
          <div>bg-gradient-stellar-soft</div>
          <div>bg-gradient-radial-stellar</div>
          <div>animate-gradient-shift</div>
          <div>animate-pulse-glow</div>
          <div>animate-float</div>
          <div>animate-rotate-slow</div>
        </div>
      </section>
    </div>
  )
}
