import React from 'react'

export type ChainOption = {
  id: string
  name: string
  nativeToken: string
  avgTime: string
  avgFee: string
}

const CHAINS: ChainOption[] = [
  { id: 'stellar', name: 'Stellar', nativeToken: 'XLM', avgTime: '30s', avgFee: '0.00001 XLM' },
  { id: 'ethereum', name: 'Ethereum', nativeToken: 'ETH', avgTime: '1-5m', avgFee: 'varies' },
  { id: 'polygon', name: 'Polygon', nativeToken: 'MATIC', avgTime: '30s-2m', avgFee: 'low' },
  { id: 'bsc', name: 'Binance Smart Chain', nativeToken: 'BNB', avgTime: '30s-2m', avgFee: 'low' },
]

export const ChainSelector: React.FC<{
  value?: string
  onChange: (chainId: string) => void
}> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="chain-select">Chain</label>
      <select id="chain-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {CHAINS.map((c) => (
          <option key={c.id} value={c.id}>{c.name} — {c.nativeToken} (fee: {c.avgFee}, time: {c.avgTime})</option>
        ))}
      </select>
    </div>
  )
}

export default ChainSelector
