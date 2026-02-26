import { Router } from 'express';
import { goalsController } from '../controllers/goalsController';
import { authMiddleware as auth } from '../middleware/auth'; 

const router = Router();

// Goal Management
router.post('/', auth, goalsController.createGoal);
router.get('/', auth, goalsController.getGoals);
router.get('/:id', auth, goalsController.getGoal);
router.patch('/:id', auth, goalsController.updateGoal);
router.delete('/:id', auth, goalsController.deleteGoal);

// Financial Intelligence Tools
router.post('/affordability', auth, goalsController.checkAffordability);
router.post('/projection', auth, goalsController.calculateProjection);

export const goalsRouter = router;
