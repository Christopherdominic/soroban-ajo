import React from 'react'
import { BrandPatternWrapper, PatternVariants } from './BrandPatternWrapper'

/**
 * PatternShowcase - Demo component showing all available brand patterns
 * Use this component to preview and test different pattern combinations
 */
export const PatternShowcase: React.FC = () => {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Brand Pattern Showcase</h1>

      {/* Waves Pattern */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Waves Pattern</h2>
        <BrandPatternWrapper pattern="waves" className="h-64 rounded-lg flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <p className="text-gray-800 font-medium">Stellar Waves Background</p>
          </div>
        </BrandPatternWrapper>
      </section>

      {/* Mesh Pattern */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Mesh Pattern</h2>
        <BrandPatternWrapper pattern="mesh" className="h-64 rounded-lg flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <p className="text-gray-800 font-medium">Stellar Mesh Background</p>
          </div>
        </BrandPatternWrapper>
      </section>

      {/* Constellation Pattern */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Constellation Pattern</h2>
        <BrandPatternWrapper pattern="constellation" className="h-64 rounded-lg flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <p className="text-gray-800 font-medium">Stellar Constellation</p>
          </div>
        </BrandPatternWrapper>
      </section>

      {/* Grid Pattern */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Grid Pattern</h2>
        <BrandPatternWrapper pattern="grid" className="h-64 rounded-lg flex items-center justify-center bg-white">
          <div className="bg-blue-50 p-6 rounded-lg shadow-lg">
            <p className="text-gray-800 font-medium">Stellar Grid Pattern</p>
          </div>
        </BrandPatternWrapper>
      </section>

      {/* Gradient Pattern */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Gradient Pattern</h2>
        <BrandPatternWrapper pattern="gradient" className="h-64 rounded-lg flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <p className="text-gray-800 font-medium">Stellar Gradient</p>
          </div>
        </BrandPatternWrapper>
      </section>

      {/* Animated Gradient */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Animated Gradient</h2>
        <BrandPatternWrapper pattern="animated-gradient" className="h-64 rounded-lg flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <p className="text-gray-800 font-medium">Animated Stellar Gradient</p>
          </div>
        </BrandPatternWrapper>
      </section>

      {/* Mesh Gradient */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Mesh Gradient</h2>
        <BrandPatternWrapper pattern="mesh-gradient" className="h-64 rounded-lg flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <p className="text-gray-800 font-medium">Mesh Gradient Background</p>
          </div>
        </BrandPatternWrapper>
      </section>

      {/* Pattern Overlays */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Pattern Overlays</h2>
        <div className="grid grid-cols-2 gap-4">
          <BrandPatternWrapper pattern="waves" overlay className="h-48 rounded-lg flex items-center justify-center bg-white">
            <p className="text-gray-800 font-medium relative z-10">Waves Overlay</p>
          </BrandPatternWrapper>
          <BrandPatternWrapper pattern="mesh" overlay className="h-48 rounded-lg flex items-center justify-center bg-white">
            <p className="text-gray-800 font-medium relative z-10">Mesh Overlay</p>
          </BrandPatternWrapper>
          <BrandPatternWrapper pattern="constellation" overlay className="h-48 rounded-lg flex items-center justify-center bg-white">
            <p className="text-gray-800 font-medium relative z-10">Constellation Overlay</p>
          </BrandPatternWrapper>
          <BrandPatternWrapper pattern="grid" overlay className="h-48 rounded-lg flex items-center justify-center bg-white">
            <p className="text-gray-800 font-medium relative z-10">Grid Overlay</p>
          </BrandPatternWrapper>
        </div>
      </section>

      {/* Pre-configured Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Pre-configured Variants</h2>
        <div className="space-y-4">
          <PatternVariants.Hero className="p-8">
            <h3 className="text-2xl font-bold text-white">Hero Variant</h3>
            <p className="text-white/90">Perfect for hero sections</p>
          </PatternVariants.Hero>

          <PatternVariants.Card className="p-6">
            <h3 className="text-xl font-bold text-gray-800">Card Variant</h3>
            <p className="text-gray-600">Subtle pattern for cards</p>
          </PatternVariants.Card>

          <PatternVariants.Section className="p-8">
            <h3 className="text-2xl font-bold text-gray-800">Section Variant</h3>
            <p className="text-gray-600">Great for page sections</p>
          </PatternVariants.Section>

          <PatternVariants.Feature className="shadow-lg">
            <h3 className="text-xl font-bold text-gray-800">Feature Variant</h3>
            <p className="text-gray-600">Animated feature cards</p>
          </PatternVariants.Feature>
        </div>
      </section>

      {/* Utility Classes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Utility Classes</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-6 stellar-glow">
            <p className="font-medium">Stellar Glow Effect</p>
          </div>
          <div className="bg-white rounded-lg p-6 stellar-glow-hover">
            <p className="font-medium">Stellar Glow on Hover</p>
          </div>
          <div className="bg-white rounded-lg p-6 bg-shimmer">
            <p className="font-medium">Shimmer Effect</p>
          </div>
          <div className="bg-white rounded-lg p-6 bg-texture-subtle">
            <p className="font-medium">Subtle Texture</p>
          </div>
        </div>
      </section>
    </div>
  )
}
