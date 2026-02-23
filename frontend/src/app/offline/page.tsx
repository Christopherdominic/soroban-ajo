import { WifiOff } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 dark:bg-orange-900 rounded-full mb-6">
          <WifiOff className="w-10 h-10 text-orange-600 dark:text-orange-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          You're Offline
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          It looks like you've lost your internet connection. Some features may not be available until you're back online.
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left">
          <h2 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            What you can still do:
          </h2>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• View previously loaded pages</li>
            <li>• Browse cached content</li>
            <li>• Access your profile</li>
          </ul>
        </div>
        
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
