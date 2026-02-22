import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/authService'

export interface AuthRequest extends Request {
  user?: { publicKey: string }
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  const token = authHeader.substring(7)

  try {
    const payload = AuthService.verifyToken(token)
    req.user = { publicKey: payload.publicKey }
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
