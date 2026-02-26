// User-friendly error message mapper — no technical jargon

export type ErrorCategory =
  | 'wallet'
  | 'transaction'
  | 'network'
  | 'contract'
  | 'auth'
  | 'unknown'

export interface UserFriendlyError {
  title: string
  message: string
  category: ErrorCategory
  retryable: boolean
}

const ERROR_MAP: Record<string, UserFriendlyError> = {
  // Wallet errors
  'wallet_not_connected': {
    title: 'Wallet Not Connected',
    message: 'Please connect your wallet to continue.',
    category: 'wallet',
    retryable: true,
  },
  'user_rejected': {
    title: 'Request Rejected',
    message: 'You rejected the request. Please try again if this was a mistake.',
    category: 'wallet',
    retryable: true,
  },
  'wallet_not_found': {
    title: 'Wallet Not Found',
    message: 'No compatible wallet found. Please install Freighter or another Stellar wallet.',
    category: 'wallet',
    retryable: false,
  },

  // Transaction errors
  'insufficient_funds': {
    title: 'Insufficient Funds',
    message: 'You don\'t have enough funds to complete this transaction.',
    category: 'transaction',
    retryable: false,
  },
  'transaction_timeout': {
    title: 'Transaction Timed Out',
    message: 'The transaction took too long. Please try again.',
    category: 'transaction',
    retryable: true,
  },
  'transaction_failed': {
    title: 'Transaction Failed',
    message: 'Your transaction could not be completed. Please try again.',
    category: 'transaction',
    retryable: true,
  },

  // Network errors
  'network_error': {
    title: 'Connection Problem',
    message: 'We\'re having trouble connecting. Please check your internet connection.',
    category: 'network',
    retryable: true,
  },
  'network_timeout': {
    title: 'Request Timed Out',
    message: 'The server took too long to respond. Please try again.',
    category: 'network',
    retryable: true,
  },
  'server_error': {
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
    category: 'network',
    retryable: true,
  },

  // Contract errors
  'contract_error': {
    title: 'Contract Error',
    message: 'The smart contract encountered an error. Please try again.',
    category: 'contract',
    retryable: true,
  },
  'contract_not_found': {
    title: 'Contract Not Found',
    message: 'The requested contract could not be found on the network.',
    category: 'contract',
    retryable: false,
  },
}

export function getErrorMessage(error: unknown): UserFriendlyError {
  if (typeof error === 'string') {
    return ERROR_MAP[error] ?? getDefaultError(error)
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase()

    if (msg.includes('rejected') || msg.includes('user denied')) {
      return ERROR_MAP['user_rejected']
    }
    if (msg.includes('insufficient') || msg.includes('balance')) {
      return ERROR_MAP['insufficient_funds']
    }
    if (msg.includes('timeout')) {
      return ERROR_MAP['transaction_timeout']
    }
    if (msg.includes('network') || msg.includes('fetch')) {
      return ERROR_MAP['network_error']
    }
    if (msg.includes('wallet') || msg.includes('freighter')) {
      return ERROR_MAP['wallet_not_connected']
    }
    if (msg.includes('contract')) {
      return ERROR_MAP['contract_error']
    }
    if (msg.includes('500') || msg.includes('server')) {
      return ERROR_MAP['server_error']
    }

    return getDefaultError(error.message)
  }

  return getDefaultError('unknown')
}

function getDefaultError(_raw: string): UserFriendlyError {
  return {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
    category: 'unknown',
    retryable: true,
  }
}
