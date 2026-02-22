import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
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
