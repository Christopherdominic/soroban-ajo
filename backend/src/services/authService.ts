import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET not set, using default (not secure for production)')
}

export interface JWTPayload {
  publicKey: string
  iat?: number
  exp?: number
}

export class AuthService {
  static generateToken(publicKey: string): string {
    return jwt.sign({ publicKey }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions)
  }

  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  }
}
