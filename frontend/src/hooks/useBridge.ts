import { useState } from 'react'

export function useBridge() {
  const [status, setStatus] = useState<string | null>(null)
  const [history, setHistory] = useState<any[]>([])

  async function initiate(request: any) {
    setStatus('initiating')
    const resp = await fetch('/api/bridge/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    const json = await resp.json()
    if (resp.ok) {
      setStatus('initiated')
      setHistory((h) => [json.record, ...h])
      return json.record
    }
    setStatus('error')
    throw new Error(json.error || 'Bridge initiation failed')
  }

  async function getStatus(id: string) {
    const resp = await fetch(`/api/bridge/status/${id}`)
    const json = await resp.json()
    if (resp.ok) return json
    throw new Error(json.error || 'Failed to retrieve status')
  }

  async function loadHistory() {
    const resp = await fetch('/api/bridge/history')
    const json = await resp.json()
    if (resp.ok) setHistory(json.history)
    return json.history
  }

  return { status, initiate, getStatus, history, loadHistory }
}

export default useBridge
