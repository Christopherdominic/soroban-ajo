import { Router, Request, Response } from 'express'
import { AuthService } from '../services/authService'
import { z } from 'zod'

const router = Router()

const authSchema = z.object({
  publicKey: z.string().regex(/^G[A-Z0-9]{55}$/, 'Invalid Stellar public key')
})

// POST /api/auth/token - Generate JWT token
router.post('/token', (req: Request, res: Response) => {
  try {
    const { publicKey } = authSchema.parse(req.body)
    const token = AuthService.generateToken(publicKey)
    res.json({ token })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid public key format' })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

export const authRouter = router
