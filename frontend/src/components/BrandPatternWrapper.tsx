import React from 'react'

type PatternType = 
  | 'waves' 
  | 'mesh' 
  | 'constellation' 
  | 'grid' 
  | 'gradient' 
  | 'gradient-subtle'
  | 'animated-gradient'
  | 'mesh-gradient'
  | 'none'

interface BrandPatternWrapperProps {
  children: React.ReactNode
  pattern?: PatternType
  overlay?: boolean
  className?: string
  animate?: boolean
}

/**
 * BrandPatternWrapper - Wraps content with Stellar-themed background patterns
 * 
 * @param pattern - Type of pattern to use (waves, mesh, constellation, grid, gradient, etc.)
 * @param overlay - If true, pattern is applied as an overlay (::before pseudo-element)
 * @param animate - If true, adds floating animation to the wrapper
 * @param className - Additional CSS classes
 */
export const BrandPatternWrapper: React.FC<BrandPatternWrapperProps> = ({
  children,
  pattern = 'none',
  overlay = false,
  className = '',
  animate = false,
}) => {
  const getPatternClass = () => {
    if (pattern === 'none') return ''
    
    if (overlay) {
      switch (pattern) {
        case 'waves':
          return 'pattern-overlay-waves'
        case 'mesh':
          return 'pattern-overlay-mesh'
        case 'constellation':
          return 'pattern-overlay-constellation'
        case 'grid':
          return 'pattern-overlay-grid'
        default:
          return ''
      }
    }
    
    switch (pattern) {
      case 'waves':
        return 'bg-pattern-waves'
      case 'mesh':
        return 'bg-pattern-mesh'
      case 'constellation':
        return 'bg-pattern-constellation'
      case 'grid':
        return 'bg-pattern-grid'
      case 'gradient':
        return 'bg-pattern-gradient'
      case 'gradient-subtle':
        return 'bg-pattern-gradient-subtle'
      case 'animated-gradient':
        return 'bg-animated-gradient'
      case 'mesh-gradient':
        return 'bg-mesh-gradient'
      default:
        return ''
    }
  }

  const animationClass = animate ? 'animate-float' : ''
  const patternClass = getPatternClass()

  return (
    <div className={`${patternClass} ${animationClass} ${className}`.trim()}>
      {children}
    </div>
  )
}

/**
 * Pre-configured pattern variants for common use cases
 */
export const PatternVariants = {
  Hero: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <BrandPatternWrapper pattern="waves" className={`min-h-[400px] ${className}`}>
      {children}
    </BrandPatternWrapper>
  ),

  Card: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <BrandPatternWrapper pattern="grid" overlay className={`bg-white rounded-lg ${className}`}>
      {children}
    </BrandPatternWrapper>
  ),

  Section: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <BrandPatternWrapper pattern="mesh-gradient" className={`py-12 ${className}`}>
      {children}
    </BrandPatternWrapper>
  ),

  Feature: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <BrandPatternWrapper 
      pattern="constellation" 
      overlay 
      animate 
      className={`bg-white rounded-xl p-6 ${className}`}
    >
      {children}
    </BrandPatternWrapper>
  ),

  Background: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <BrandPatternWrapper pattern="animated-gradient" className={`min-h-screen ${className}`}>
      {children}
    </BrandPatternWrapper>
  ),
}
