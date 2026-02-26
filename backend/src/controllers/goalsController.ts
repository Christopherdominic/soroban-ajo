import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../errors/AppError';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schemas for validation
const createGoalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  targetAmount: z.string().or(z.number()).transform((val) => BigInt(val)),
  deadline: z.string().transform((str) => new Date(str)),
  category: z.enum(['EMERGENCY', 'VACATION', 'EDUCATION', 'HOME', 'RETIREMENT', 'CUSTOM']),
  isPublic: z.boolean().optional(),
});

const updateGoalSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  targetAmount: z.string().or(z.number()).optional().transform((val) => val ? BigInt(val) : undefined),
  deadline: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  category: z.enum(['EMERGENCY', 'VACATION', 'EDUCATION', 'HOME', 'RETIREMENT', 'CUSTOM']).optional(),
  isPublic: z.boolean().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
});

const affordabilitySchema = z.object({
  monthlyIncome: z.number(),
  monthlyExpenses: z.number(),
  goalTarget: z.number(),
  goalDeadline: z.string().transform((str) => new Date(str)),
});

// Helper to handle BigInt in JSON
const serializeBigInt = (data: any) => {
  return JSON.parse(JSON.stringify(data, (_, v) => (typeof v === 'bigint' ? v.toString() : v)));
};

export class GoalsController {
  // Create a new goal
  createGoal = asyncHandler(async (req: Request, res: Response) => {
    // Assuming auth middleware populates req.user
    const userId = (req as any).user?.publicKey || req.body.userId; 
    
    if (!userId) {
      throw new AppError('User ID is required', 401);
    }

    const validatedData = createGoalSchema.parse(req.body);

    const goal = await prisma.goal.create({
      data: {
        ...validatedData,
        userId,
        currentAmount: BigInt(0),
      },
    });

    res.status(201).json({
      success: true,
      data: serializeBigInt(goal),
    });
  });

  // Get all goals for the user
  getGoals = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.publicKey || req.query.userId;

    if (!userId) {
      throw new AppError('User ID is required', 401);
    }

    const goals = await prisma.goal.findMany({
      where: { userId: String(userId) },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: serializeBigInt(goals),
    });
  });

  // Get a single goal
  getGoal = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const goal = await prisma.goal.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!goal) {
      throw new AppError('Goal not found', 404);
    }

    res.status(200).json({
      success: true,
      data: serializeBigInt(goal),
    });
  });

  // Update a goal
  updateGoal = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const validatedData = updateGoalSchema.parse(req.body);

    const goal = await prisma.goal.update({
      where: { id },
      data: validatedData,
    });

    res.status(200).json({
      success: true,
      data: serializeBigInt(goal),
    });
  });

  // Delete a goal
  deleteGoal = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.goal.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully',
    });
  });

  // Calculate Affordability
  checkAffordability = asyncHandler(async (req: Request, res: Response) => {
    const { monthlyIncome, monthlyExpenses, goalTarget, goalDeadline } = affordabilitySchema.parse(req.body);

    const today = new Date();
    const monthsUntilDeadline = (goalDeadline.getFullYear() - today.getFullYear()) * 12 + (goalDeadline.getMonth() - today.getMonth());
    
    if (monthsUntilDeadline <= 0) {
      throw new AppError('Deadline must be in the future', 400);
    }

    const requiredMonthlySavings = goalTarget / monthsUntilDeadline;
    const disposableIncome = monthlyIncome - monthlyExpenses;
    
    let status: 'Sustainable' | 'Aggressive' | 'Unattainable';
    
    if (requiredMonthlySavings <= disposableIncome * 0.3) {
      status = 'Sustainable';
    } else if (requiredMonthlySavings <= disposableIncome * 0.6) {
      status = 'Aggressive';
    } else {
      status = 'Unattainable';
    }

    res.status(200).json({
      success: true,
      data: {
        status,
        requiredMonthlySavings,
        disposableIncome,
        monthsUntilDeadline
      }
    });
  });

  // Future Payout Projection (Compound Interest)
  calculateProjection = asyncHandler(async (req: Request, res: Response) => {
    const { principal, monthlyContribution, interestRate, years } = req.body;
    
    // A = P(1 + r/n)^(nt) + PMT * (((1 + r/n)^(nt) - 1) / (r/n))
    // Assuming monthly compounding (n=12)
    
    const P = Number(principal) || 0;
    const PMT = Number(monthlyContribution) || 0;
    const r = (Number(interestRate) || 0) / 100;
    const t = Number(years) || 1;
    const n = 12;

    const compoundInterest = P * Math.pow(1 + r/n, n*t);
    const futureValueContributions = PMT * ((Math.pow(1 + r/n, n*t) - 1) / (r/n));
    
    const totalAmount = compoundInterest + (r > 0 ? futureValueContributions : PMT * n * t);

    res.status(200).json({
      success: true,
      data: {
        totalAmount,
        principal,
        totalContributions: PMT * n * t,
        interestEarned: totalAmount - P - (PMT * n * t)
      }
    });
  });
}

export const goalsController = new GoalsController();
