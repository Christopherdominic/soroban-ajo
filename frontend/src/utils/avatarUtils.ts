/**
 * Avatar generation utilities for wallet addresses
 * Generates deterministic, visually distinct avatars from Stellar addresses
 */

/**
 * Generate a deterministic HSL color from a wallet address
 * Same address always produces the same color
 */
export const generateAvatarColor = (address: string): string => {
  const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const hue = hash % 360
  const saturation = 65 + (hash % 20)
  const lightness = 50 + (hash % 15)
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

/**
 * Get initials from wallet address (first 2 characters)
 */
export const getAddressInitials = (address: string): string => {
  return address.substring(0, 2).toUpperCase()
}

/**
 * Shorten a Stellar address for display
 * Example: GABC...XYZ9
 */
export const shortenAddress = (address: string, startChars = 6, endChars = 4): string => {
  if (address.length <= startChars + endChars) return address
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`
}

/**
 * Format a date string for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * Format a date with time
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Calculate relative time (e.g., "2 days ago")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 30) {
    return formatDate(dateString)
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  } else {
    return 'Just now'
  }
}
