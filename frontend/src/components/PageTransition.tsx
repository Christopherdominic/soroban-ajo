'use client'

import React from 'react'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="w-full h-full">
      {children}
    </div>
  )
}
