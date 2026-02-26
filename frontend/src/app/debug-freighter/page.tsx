'use client'

import { useState, useEffect } from 'react'

export default function DebugFreighterPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [freighterApi, setFreighterApi] = useState<any>(null)

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
    console.log(message)
  }

  useEffect(() => {
    addLog('Page loaded, starting Freighter detection...')
    
    const detectFreighter = async () => {
      addLog('Checking window object...')
      addLog(`window is defined: ${typeof window !== 'undefined'}`)
      
      if (typeof window === 'undefined') {
        addLog('ERROR: window is undefined')
        return
      }

      addLog('Checking for freighterApi...')
      addLog(`window.freighterApi exists: ${!!(window as any).freighterApi}`)
      
      if ((window as any).freighterApi) {
        addLog('✓ Freighter API found immediately!')
        setFreighterApi((window as any).freighterApi)
        return
      }

      addLog('Freighter not found, waiting...')
      
      for (let i = 0; i < 50; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if ((window as any).freighterApi) {
          addLog(`✓ Freighter API found after ${(i + 1) * 100}ms!`)
          setFreighterApi((window as any).freighterApi)
          return
        }
        
        if (i % 10 === 0) {
          addLog(`Still waiting... (${(i + 1) * 100}ms elapsed)`)
        }
      }
      
      addLog('✗ Freighter API not found after 5 seconds')
      addLog('Checking window properties...')
      
      const windowKeys = Object.keys(window).filter(key => 
        key.toLowerCase().includes('freighter') || 
        key.toLowerCase().includes('stellar') ||
        key.toLowerCase().includes('wallet')
      )
      
      if (windowKeys.length > 0) {
        addLog(`Found related properties: ${windowKeys.join(', ')}`)
      } else {
        addLog('No wallet-related properties found on window object')
      }
    }

    detectFreighter()
  }, [])

  const testFreighterMethods = async () => {
    if (!freighterApi) {
      addLog('ERROR: No Freighter API available')
      return
    }

    try {
      addLog('Testing isAllowed()...')
      const allowed = await freighterApi.isAllowed()
      addLog(`isAllowed() returned: ${allowed}`)

      if (!allowed) {
        addLog('Requesting permission with setAllowed()...')
        await freighterApi.setAllowed()
        addLog('setAllowed() completed')
      }

      addLog('Testing getPublicKey()...')
      const publicKey = await freighterApi.getPublicKey()
      addLog(`✓ Got public key: ${publicKey}`)

      addLog('Testing getNetworkDetails()...')
      const network = await freighterApi.getNetworkDetails()
      addLog(`✓ Network: ${JSON.stringify(network)}`)

    } catch (err) {
      addLog(`ERROR: ${err instanceof Error ? err.message : String(err)}`)
      console.error('Freighter test error:', err)
    }
  }

  const checkExtensions = () => {
    addLog('Checking for other wallet extensions...')
    
    const checks = [
      { name: 'Freighter', key: 'freighterApi' },
      { name: 'Albedo', key: 'albedo' },
      { name: 'xBull', key: 'xBullSDK' },
      { name: 'Rabet', key: 'rabet' },
      { name: 'MetaMask', key: 'ethereum' },
    ]

    checks.forEach(({ name, key }) => {
      const exists = !!(window as any)[key]
      addLog(`${name}: ${exists ? '✓ Found' : '✗ Not found'}`)
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Freighter Debug Console</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${freighterApi ? 'bg-green-900' : 'bg-red-900'}`}>
            <div className="text-sm text-gray-300">Freighter Status</div>
            <div className="text-2xl font-bold">
              {freighterApi ? '✓ Detected' : '✗ Not Found'}
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-blue-900">
            <div className="text-sm text-gray-300">Logs</div>
            <div className="text-2xl font-bold">{logs.length}</div>
          </div>
          
          <div className="p-4 rounded-lg bg-purple-900">
            <div className="text-sm text-gray-300">Browser</div>
            <div className="text-lg font-bold">
              {typeof navigator !== 'undefined' 
                ? navigator.userAgent.includes('Chrome') ? 'Chrome' 
                : navigator.userAgent.includes('Firefox') ? 'Firefox'
                : navigator.userAgent.includes('Safari') ? 'Safari'
                : 'Other'
                : 'Unknown'}
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <button
            onClick={testFreighterMethods}
            disabled={!freighterApi}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            Test Freighter Methods
          </button>
          
          <button
            onClick={checkExtensions}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Check All Wallet Extensions
          </button>
          
          <button
            onClick={() => setLogs([])}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Clear Logs
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Console Output</h2>
            <span className="text-sm text-gray-400">{logs.length} entries</span>
          </div>
          
          <div className="bg-black rounded p-4 font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">Waiting for logs...</div>
            ) : (
              logs.map((log, i) => (
                <div 
                  key={i} 
                  className={
                    log.includes('ERROR') ? 'text-red-400' :
                    log.includes('✓') ? 'text-green-400' :
                    log.includes('✗') ? 'text-red-400' :
                    log.includes('waiting') ? 'text-yellow-400' :
                    'text-gray-300'
                  }
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-bold mb-2">Quick Checks:</h3>
          <ul className="space-y-2 text-sm">
            <li>• Is Freighter icon visible in your browser toolbar?</li>
            <li>• Can you click the Freighter icon and see your wallet?</li>
            <li>• Have you created/imported an account in Freighter?</li>
            <li>• Did you refresh this page after installing Freighter?</li>
            <li>• Are you using Chrome, Firefox, Brave, or Edge?</li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-yellow-900 rounded-lg">
          <h3 className="font-bold mb-2 text-yellow-200">If Freighter is not detected:</h3>
          <ol className="space-y-2 text-sm text-yellow-100 list-decimal list-inside">
            <li>Go to your browser's extension page (chrome://extensions/)</li>
            <li>Find Freighter and make sure it's enabled</li>
            <li>Click the Freighter icon to open it</li>
            <li>Make sure you have an account (create or import one)</li>
            <li>Come back to this page and refresh (F5)</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
