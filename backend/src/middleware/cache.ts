import { Request, Response, NextFunction } from 'express'
import { cacheGet, cacheSet } from '../services/cacheService'

/**
 * Simple caching middleware using Redis.
 *
 * For GET requests only, look for a cached response keyed by method+url.
 * If found, return it immediately. Otherwise, wrap `res.json` so that the
 * response body is cached before being sent.
 */
export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== 'GET') {
    return next()
  }

  const key = `${req.method}:${req.originalUrl}`
  try {
    const cached = await cacheGet(key)
    if (cached) {
      // cache hit, send parsed body
      res.setHeader('X-Cache', 'HIT')
      return res.json(JSON.parse(cached))
    }
  } catch (err) {
    // log but don't break the request
    console.error('Cache lookup error', err)
  }

  // monkeypatch res.json to capture the body for caching
  const originalJson = res.json.bind(res)
  res.json = (body: unknown) => {
    try {
      cacheSet(key, JSON.stringify(body), 60 * 5) // default 5 min
      res.setHeader('X-Cache', 'MISS')
    } catch (err) {
      console.error('Cache set error', err)
    }
    return originalJson(body)
  }

  next()
}
