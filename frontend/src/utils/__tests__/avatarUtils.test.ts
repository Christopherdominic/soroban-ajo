/**
 * Tests for avatar utility functions
 */

import {
  generateAvatarColor,
  getAddressInitials,
  shortenAddress,
  formatDate,
  getRelativeTime,
} from '../avatarUtils'

describe('avatarUtils', () => {
  describe('generateAvatarColor', () => {
    it('should generate consistent colors for the same address', () => {
      const address = 'GABC123DEFGHIJKLMNOPQRSTUVWXYZ456789ABCDEFGHIJKLMNOP'
      const color1 = generateAvatarColor(address)
      const color2 = generateAvatarColor(address)
      expect(color1).toBe(color2)
    })

    it('should generate different colors for different addresses', () => {
      const address1 = 'GABC123DEFGHIJKLMNOPQRSTUVWXYZ456789ABCDEFGHIJKLMNOP'
      const address2 = 'GDEF456GHIJKLMNOPQRSTUVWXYZ789012ABCDEFGHIJKLMNOPQR'
      const color1 = generateAvatarColor(address1)
      const color2 = generateAvatarColor(address2)
      expect(color1).not.toBe(color2)
    })

    it('should return HSL color format', () => {
      const address = 'GABC123DEFGHIJKLMNOPQRSTUVWXYZ456789ABCDEFGHIJKLMNOP'
      const color = generateAvatarColor(address)
      expect(color).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/)
    })
  })

  describe('getAddressInitials', () => {
    it('should return first 2 characters in uppercase', () => {
      const address = 'gabc123defghijklmnopqrstuvwxyz456789abcdefghijklmnop'
      const initials = getAddressInitials(address)
      expect(initials).toBe('GA')
    })

    it('should handle short addresses', () => {
      const address = 'GA'
      const initials = getAddressInitials(address)
      expect(initials).toBe('GA')
    })
  })

  describe('shortenAddress', () => {
    it('should shorten long addresses', () => {
      const address = 'GABC123DEFGHIJKLMNOPQRSTUVWXYZ456789ABCDEFGHIJKLMNOP'
      const shortened = shortenAddress(address)
      expect(shortened).toBe('GABC12...MNOP')
    })

    it('should not shorten short addresses', () => {
      const address = 'GABC123'
      const shortened = shortenAddress(address)
      expect(shortened).toBe('GABC123')
    })

    it('should respect custom start and end chars', () => {
      const address = 'GABC123DEFGHIJKLMNOPQRSTUVWXYZ456789ABCDEFGHIJKLMNOP'
      const shortened = shortenAddress(address, 4, 4)
      expect(shortened).toBe('GABC...MNOP')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const dateString = '2024-01-15T12:00:00Z'
      const formatted = formatDate(dateString)
      expect(formatted).toMatch(/Jan 15, 2024/)
    })
  })

  describe('getRelativeTime', () => {
    it('should return "Just now" for recent dates', () => {
      const now = new Date().toISOString()
      const relative = getRelativeTime(now)
      expect(relative).toBe('Just now')
    })

    it('should return days ago for older dates', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      const relative = getRelativeTime(twoDaysAgo)
      expect(relative).toBe('2 days ago')
    })

    it('should return formatted date for very old dates', () => {
      const longAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      const relative = getRelativeTime(longAgo)
      expect(relative).toMatch(/\w+ \d+, \d{4}/)
    })
  })
})
