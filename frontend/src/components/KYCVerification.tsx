import React, { useEffect, useState } from 'react'
import { KycService } from '../services/kycService'

interface Status {
  level: number
  status: string
  requestedAt?: string
  verifiedAt?: string
  rejectedAt?: string
  documents?: any[]
}

export const KYCVerification: React.FC = () => {
  const [status, setStatus] = useState<Status | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const loadStatus = async () => {
    setLoading(true)
    try {
      const s = await KycService.getStatus()
      setStatus(s)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStatus()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result as string
        await KycService.uploadDocument(file.name, base64)
        await loadStatus()
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Identity Verification</h2>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-500">{error}</p>}
      {status ? (
        <div className="space-y-2">
          <p>KYC Level: {status.level}</p>
          <p>Status: {status.status}</p>
          {status.requestedAt && <p>Requested: {new Date(status.requestedAt).toLocaleString()}</p>}
          {status.verifiedAt && <p>Verified: {new Date(status.verifiedAt).toLocaleString()}</p>}
          {status.rejectedAt && <p>Rejected: {new Date(status.rejectedAt).toLocaleString()}</p>}
          <form onSubmit={handleUpload} className="mt-4">
            <input type="file" onChange={handleFileChange} />
            <button
              disabled={!file || loading}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Upload Document
            </button>
          </form>
        </div>
      ) : (
        <p>No verification data available.</p>
      )}
    </div>
  )
}
