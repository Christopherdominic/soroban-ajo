import { useState, useCallback } from 'react'

interface UseRetryOptions {
  maxAttempts?: number
  initialDelay?: number
  maxDelay?: number
  backoffFactor?: number
}

interface UseRetryResult {
  attempt: number
  isRetrying: boolean
  error: Error | null
  execute: <T>(fn: () => Promise<T>) => Promise<T | undefined>
  reset: () => void
}

export function useRetry(options: UseRetryOptions = {}): UseRetryResult {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
  } = options

  const [attempt, setAttempt] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const execute = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
      setError(null)
      setIsRetrying(false)

      for (let i = 0; i < maxAttempts; i++) {
        setAttempt(i + 1)
        try {
          const result = await fn()
          setIsRetrying(false)
          return result
        } catch (err) {
          const isLast = i === maxAttempts - 1
          if (isLast) {
            const error = err instanceof Error ? err : new Error(String(err))
            setError(error)
            setIsRetrying(false)
            throw error
          }
          setIsRetrying(true)
          const delay = Math.min(initialDelay * Math.pow(backoffFactor, i), maxDelay)
          await sleep(delay)
        }
      }
    },
    [maxAttempts, initialDelay, maxDelay, backoffFactor]
  )

  const reset = useCallback(() => {
    setAttempt(0)
    setIsRetrying(false)
    setError(null)
  }, [])

  return { attempt, isRetrying, error, execute, reset }
}
