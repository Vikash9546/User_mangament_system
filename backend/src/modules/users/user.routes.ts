import { Router } from 'express';
import { userController } from './user.controller';
import { validate } from '../../middleware/validate.middleware';
import { createUserSchema, updateUserSchema, getUserParamsSchema, getUsersQuerySchema, validateDocumentSchema } from './user.validation';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         primaryMobile:
 *           type: string
 *         pan:
 *           type: string
 *         aadhaar:
 *           type: string
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/', validate(createUserSchema), userController.create);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users with cursor pagination
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', validate(getUsersQuerySchema), userController.getUsers);

router.post('/validate-document', validate(validateDocumentSchema), userController.validateDocuments);

router.get('/:id', validate(getUserParamsSchema), userController.getById);
router.patch('/:id', validate(updateUserSchema), userController.update);
router.delete('/:id', validate(getUserParamsSchema), userController.delete);
router.patch('/:id/restore', validate(getUserParamsSchema), userController.restore);

export const userRoutes = router;
