/**
 * Icon Definitions and Naming Conventions
 * 
 * Naming Pattern: {category}-{action/state}
 * Categories: action, status, payment, navigation, ui, social, chart, validation
 * 
 * All icons are 24px base size, scalable to 16, 20, 32, 48px
 * Stroke weight: 2px (consistent across all icons)
 * Stroke style: round caps and joins for smooth appearance
 */

export const ICON_CATEGORIES = {
  ACTION: 'action',
  STATUS: 'status',
  PAYMENT: 'payment',
  NAVIGATION: 'navigation',
  UI: 'ui',
  SOCIAL: 'social',
  CHART: 'chart',
  VALIDATION: 'validation',
} as const

export type IconCategory = typeof ICON_CATEGORIES[keyof typeof ICON_CATEGORIES]

/**
 * Icon Library - 30+ icons organized by category
 * Each icon includes: name, category, description, use cases
 */
export const ICON_LIBRARY = {
  // ACTION ICONS (8)
  'action-add': {
    category: ICON_CATEGORIES.ACTION,
    description: 'Plus icon for adding items',
    useCases: ['Create group', 'Add member', 'New transaction'],
  },
  'action-delete': {
    category: ICON_CATEGORIES.ACTION,
    description: 'Trash icon for removing items',
    useCases: ['Delete group', 'Remove member', 'Clear data'],
  },
  'action-edit': {
    category: ICON_CATEGORIES.ACTION,
    description: 'Pencil icon for editing',
    useCases: ['Edit group settings', 'Modify profile', 'Update details'],
  },
  'action-save': {
    category: ICON_CATEGORIES.ACTION,
    description: 'Floppy disk icon for saving',
    useCases: ['Save changes', 'Confirm action'],
  },
  'action-download': {
    category: ICON_CATEGORIES.ACTION,
    description: 'Download arrow icon',
    useCases: ['Export data', 'Download report', 'Save file'],
  },
  'action-upload': {
    category: ICON_CATEGORIES.ACTION,
    description: 'Upload arrow icon',
    useCases: ['Import data', 'Upload file', 'Submit document'],
  },
  'action-share': {
    category: ICON_CATEGORIES.ACTION,
    description: 'Share icon for distribution',
    useCases: ['Share group', 'Invite members', 'Share link'],
  },
  'action-refresh': {
    category: ICON_CATEGORIES.ACTION,
    description: 'Refresh/reload icon',
    useCases: ['Reload data', 'Sync', 'Retry'],
  },

  // STATUS ICONS (8)
  'status-active': {
    category: ICON_CATEGORIES.STATUS,
    description: 'Active/online status indicator',
    useCases: ['Active group', 'Online member', 'Running process'],
  },
  'status-inactive': {
    category: ICON_CATEGORIES.STATUS,
    description: 'Inactive/offline status indicator',
    useCases: ['Inactive group', 'Offline member', 'Paused process'],
  },
  'status-pending': {
    category: ICON_CATEGORIES.STATUS,
    description: 'Pending/waiting status',
    useCases: ['Pending transaction', 'Awaiting confirmation', 'In progress'],
  },
  'status-completed': {
    category: ICON_CATEGORIES.STATUS,
    description: 'Completed/finished status',
    useCases: ['Completed group', 'Finished transaction', 'Done'],
  },
  'status-warning': {
    category: ICON_CATEGORIES.STATUS,
    description: 'Warning/alert status',
    useCases: ['Low balance', 'Expiring soon', 'Attention needed'],
  },
  'status-error': {
    category: ICON_CATEGORIES.STATUS,
    description: 'Error/failed status',
    useCases: ['Failed transaction', 'Error state', 'Problem'],
  },
  'status-locked': {
    category: ICON_CATEGORIES.STATUS,
    description: 'Locked/restricted status',
    useCases: ['Locked group', 'Restricted access', 'Disabled'],
  },
  'status-verified': {
    category: ICON_CATEGORIES.STATUS,
    description: 'Verified/confirmed status',
    useCases: ['Verified member', 'Confirmed transaction', 'Approved'],
  },

  // PAYMENT ICONS (8)
  'payment-wallet': {
    category: ICON_CATEGORIES.PAYMENT,
    description: 'Wallet icon',
    useCases: ['Wallet connection', 'Balance display', 'Account'],
  },
  'payment-send': {
    category: ICON_CATEGORIES.PAYMENT,
    description: 'Send/transfer icon',
    useCases: ['Send payment', 'Transfer funds', 'Contribute'],
  },
  'payment-receive': {
    category: ICON_CATEGORIES.PAYMENT,
    description: 'Receive/incoming icon',
    useCases: ['Receive payment', 'Incoming funds', 'Payout'],
  },
  'payment-coin': {
    category: ICON_CATEGORIES.PAYMENT,
    description: 'Coin/currency icon',
    useCases: ['Currency display', 'Amount', 'Balance'],
  },
  'payment-card': {
    category: ICON_CATEGORIES.PAYMENT,
    description: 'Card/payment method icon',
    useCases: ['Payment method', 'Card details', 'Transaction'],
  },
  'payment-invoice': {
    category: ICON_CATEGORIES.PAYMENT,
    description: 'Invoice/receipt icon',
    useCases: ['Invoice', 'Receipt', 'Transaction history'],
  },
  'payment-history': {
    category: ICON_CATEGORIES.PAYMENT,
    description: 'History/timeline icon',
    useCases: ['Transaction history', 'Timeline', 'Activity log'],
  },
  'payment-calculator': {
    category: ICON_CATEGORIES.PAYMENT,
    description: 'Calculator icon',
    useCases: ['Calculate', 'Compute', 'Math operations'],
  },

  // NAVIGATION ICONS (4)
  'nav-home': {
    category: ICON_CATEGORIES.NAVIGATION,
    description: 'Home icon',
    useCases: ['Home page', 'Dashboard', 'Main view'],
  },
  'nav-back': {
    category: ICON_CATEGORIES.NAVIGATION,
    description: 'Back/previous arrow',
    useCases: ['Go back', 'Previous page', 'Navigate back'],
  },
  'nav-forward': {
    category: ICON_CATEGORIES.NAVIGATION,
    description: 'Forward/next arrow',
    useCases: ['Go forward', 'Next page', 'Navigate forward'],
  },
  'nav-menu': {
    category: ICON_CATEGORIES.NAVIGATION,
    description: 'Menu/hamburger icon',
    useCases: ['Toggle menu', 'Navigation menu', 'Options'],
  },

  // UI ICONS (4)
  'ui-search': {
    category: ICON_CATEGORIES.UI,
    description: 'Search/magnifying glass icon',
    useCases: ['Search', 'Find', 'Lookup'],
  },
  'ui-settings': {
    category: ICON_CATEGORIES.UI,
    description: 'Settings/gear icon',
    useCases: ['Settings', 'Configuration', 'Preferences'],
  },
  'ui-help': {
    category: ICON_CATEGORIES.UI,
    description: 'Help/question mark icon',
    useCases: ['Help', 'FAQ', 'Support'],
  },
  'ui-close': {
    category: ICON_CATEGORIES.UI,
    description: 'Close/X icon',
    useCases: ['Close modal', 'Dismiss', 'Cancel'],
  },

  // SOCIAL ICONS (2)
  'social-user': {
    category: ICON_CATEGORIES.SOCIAL,
    description: 'User/profile icon',
    useCases: ['User profile', 'Member', 'Account'],
  },
  'social-users': {
    category: ICON_CATEGORIES.SOCIAL,
    description: 'Multiple users/group icon',
    useCases: ['Group members', 'Team', 'Community'],
  },

  // CHART ICONS (2)
  'chart-bar': {
    category: ICON_CATEGORIES.CHART,
    description: 'Bar chart icon',
    useCases: ['Analytics', 'Statistics', 'Data visualization'],
  },
  'chart-line': {
    category: ICON_CATEGORIES.CHART,
    description: 'Line chart icon',
    useCases: ['Trends', 'Growth', 'Performance'],
  },

  // VALIDATION ICONS (2)
  'validation-check': {
    category: ICON_CATEGORIES.VALIDATION,
    description: 'Checkmark icon',
    useCases: ['Success', 'Confirmed', 'Valid'],
  },
  'validation-cross': {
    category: ICON_CATEGORIES.VALIDATION,
    description: 'Cross/X icon for errors',
    useCases: ['Error', 'Invalid', 'Failed'],
  },
} as const

export type IconName = keyof typeof ICON_LIBRARY

/**
 * Get all icons by category
 */
export const getIconsByCategory = (category: IconCategory): IconName[] => {
  return Object.entries(ICON_LIBRARY)
    .filter(([, icon]) => icon.category === category)
    .map(([name]) => name as IconName)
}

/**
 * Get icon metadata
 */
export const getIconMetadata = (name: IconName) => {
  return ICON_LIBRARY[name]
}

/**
 * Validate icon name
 */
export const isValidIconName = (name: string): name is IconName => {
  return name in ICON_LIBRARY
}
