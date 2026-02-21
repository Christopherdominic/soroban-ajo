import React from 'react'

interface BrandedSectionProps {
  pattern?: 'mesh' | 'constellation' | 'grid' | 'hexagon' | 'waves' | 'gradient' | 'hero'
  animated?: boolean
  children: React.ReactNode
  className?: string
}

/**
 * BrandedSection Component
 * 
 * A reusable wrapper component that applies brand patterns to sections.
 * Makes it easy to add consistent branded backgrounds throughout the app.
 * 
 * @example
 * <BrandedSection pattern="mesh">
 *   <h1>Welcome</h1>
 * </BrandedSection>
 * 
 * @example
 * <BrandedSection pattern="hero" animated>
 *   <div className="text-center">
 *     <h1>Hero Content</h1>
 *   </div>
 * </BrandedSection>
 */
export const BrandedSection: React.FC<BrandedSectionProps> = ({
  pattern = 'grid',
  animated = false,
  children,
  className = '',
}) => {
  const getPatternClass = () => {
    const patterns = {
      mesh: 'pattern-overlay-mesh',
      constellation: 'pattern-overlay-constellation',
      grid: 'pattern-overlay-grid',
      hexagon: 'pattern-hexagon bg-white',
      waves: 'pattern-waves bg-white',
      gradient: 'gradient-mesh-1 bg-white',
      hero: 'hero-stellar',
    }
    return patterns[pattern] || patterns.grid
  }

  const animationClass = animated ? 'bg-float' : ''

  return (
    <section className={`${getPatternClass()} ${animationClass} ${className}`}>
      {children}
    </section>
  )
}

/**
 * BrandedCard Component
 * 
 * A card component with built-in pattern support.
 */
interface BrandedCardProps {
  variant?: 'pattern' | 'gradient' | 'mesh'
  children: React.ReactNode
  className?: string
}

export const BrandedCard: React.FC<BrandedCardProps> = ({
  variant = 'pattern',
  children,
  className = '',
}) => {
  const getVariantClass = () => {
    const variants = {
      pattern: 'card-pattern',
      gradient: 'gradient-mesh-2',
      mesh: 'pattern-overlay-mesh',
    }
    return variants[variant] || variants.pattern
  }

  return (
    <div className={`${getVariantClass()} bg-white rounded-lg p-6 shadow-lg ${className}`}>
      {children}
    </div>
  )
}

/**
 * BrandedHero Component
 * 
 * A pre-configured hero section with animated background.
 */
interface BrandedHeroProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
}

export const BrandedHero: React.FC<BrandedHeroProps> = ({
  title,
  subtitle,
  children,
  className = '',
}) => {
  return (
    <section className={`hero-stellar min-h-[60vh] flex items-center justify-center ${className}`}>
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}
