/**
 * KYC Service - wraps calls to the backend KYC endpoints.
 */

type KycStatusResponse = {
  status: {
    level: number
    status: string
    requestedAt?: string
    verifiedAt?: string
    rejectedAt?: string
    documents?: unknown[]
  }
}

export class KycService {
  static async getStatus(): Promise<KycStatusResponse['status']> {
    const res = await fetch('/api/kyc/status', { method: 'GET' })
    if (!res.ok) throw new Error('Failed to fetch KYC status')
    const data: KycStatusResponse = await res.json()
    return data.status
  }

  static async requestVerification(): Promise<void> {
    const res = await fetch('/api/kyc/request', { method: 'POST' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Failed to request verification')
    }
  }

  static async uploadDocument(docType: string, data: string): Promise<void> {
    const res = await fetch('/api/kyc/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docType, data }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Failed to upload document')
    }
  }
}
