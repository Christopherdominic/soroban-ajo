import { Router } from 'express'
import { GroupsController } from '../controllers/groupsController'
import { webhookMiddleware } from '../middleware/webhook'
import { authMiddleware } from '../middleware/auth'

const router = Router()
const controller = new GroupsController()

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: List all groups
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (1-indexed)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of groups
 */
router.get('/', controller.listGroups.bind(controller))

/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Get group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Group details
 *       404:
 *         description: Group not found
 */
router.get('/:id', controller.getGroup.bind(controller))

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create new group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - duration
 *               - max_members
 *             properties:
 *               amount:
 *                 type: number
 *               duration:
 *                 type: number
 *               max_members:
 *                 type: number
 *     responses:
 *       201:
 *         description: Group created
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, controller.createGroup.bind(controller), webhookMiddleware.afterGroupCreated)

/**
 * @swagger
 * /api/groups/{id}/join:
 *   post:
 *     summary: Join a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully joined
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Group not found
 */
router.post('/:id/join', authMiddleware, controller.joinGroup.bind(controller), webhookMiddleware.afterMemberJoined)

/**
 * @swagger
 * /api/groups/{id}/contribute:
 *   post:
 *     summary: Make contribution
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contribution recorded
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/contribute', authMiddleware, controller.contribute.bind(controller), webhookMiddleware.afterContribution)

/**
 * @swagger
 * /api/groups/{id}/members:
 *   get:
 *     summary: Get group members
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of members
 */
router.get('/:id/members', controller.getMembers.bind(controller))

/**
 * @swagger
 * /api/groups/{id}/transactions:
 *   get:
 *     summary: Get group transactions
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/:id/transactions', controller.getTransactions.bind(controller))

export const groupsRouter = router
